/**
 * World scene for map exploration
 */
class WorldScene extends Scene {
    constructor(game) {
        super(game);
        
        this.player = null;
        this.npcs = [];
        this.map = null;
        this.camera = {
            x: 0,
            y: 0,
            width: game.width,
            height: game.height
        };
          this.tileSize = 32; // Default tile size
        
        // Animation properties for tile effects
        this.tileAnimations = {
            timer: 0,
            waterOffset: 0,
            grassWave: 0,
            flowerSway: 0,
            doorGlow: 0,
            specialGlow: 0
        };
        
        // Particle effects
        this.particles = [];
          // Portal cooldown to prevent infinite teleporting
        this.portalCooldown = false;
        this.lastPortalUsed = null;
        
        // Dialog cooldown to prevent accidental dialog restarts
        this.dialogCooldown = 0;
    }
    
    /**
     * Initialize the world scene
     */    init() {
        console.log('Initializing world scene...');
        
        // Create player
        this.player = {
            x: 5 * this.tileSize,
            y: 5 * this.tileSize,
            width: 24,  // Smaller width for more human-like proportions
            height: 28, // Slightly taller than wide for human proportions
            speed: 120, // pixels per second
            direction: 'down',
            isMoving: false,
            spritesheet: 'player'
        };
        
        // Load map data
        this.loadMap('town');
    }
    
    /**
     * Load a map by name
     */
    loadMap(mapName) {
        if (MAPS[mapName]) {
            this.map = MAPS[mapName];
            
            // Reset camera
            this.camera.x = 0;
            this.camera.y = 0;
            
            // Position player based on map start position if provided
            if (this.map.startPosition) {
                this.player.x = this.map.startPosition.x * this.tileSize;
                this.player.y = this.map.startPosition.y * this.tileSize;
            }
            
            // Load NPCs for this map
            this.loadNpcs();
            
            console.log(`Map loaded: ${mapName}`);
        } else {
            console.warn(`Map not found: ${mapName}`);
        }
    }
    
    /**
     * Load NPCs for the current map
     */
    loadNpcs() {
        this.npcs = [];
        
        if (this.map && this.map.npcs) {
            this.map.npcs.forEach(npcData => {
                const npc = {
                    x: npcData.x * this.tileSize,
                    y: npcData.y * this.tileSize,
                    width: this.tileSize,
                    height: this.tileSize,
                    direction: npcData.direction || 'down',
                    spritesheet: npcData.spritesheet || 'npc',
                    name: npcData.name,
                    dialog: npcData.dialog || []
                };
                
                this.npcs.push(npc);
            });
        }
    }
      /**
     * Update the world scene
     */    update(deltaTime) {
        // Update dialog cooldown
        if (this.dialogCooldown > 0) {
            this.dialogCooldown -= deltaTime;
        }
        
        // Handle player movement
        this.updatePlayerMovement(deltaTime);
        
        // Update camera position
        this.updateCamera();
        
        // Check for NPC interactions
        this.checkNpcInteractions();
        
        // Check for map portals
        this.checkPortals();
        
        // Check for monster encounters
        this.checkMonsterEncounters();
        
        // Update tile animations
        this.updateTileAnimations(deltaTime);
        
        // Update particles
        this.updateParticles(deltaTime);
    }
    
    /**
     * Update player movement based on input
     */
    updatePlayerMovement(deltaTime) {
        const input = this.game.input;
        let dx = 0;
        let dy = 0;
        
        // Determine movement direction
        if (input.isUpPressed()) {
            dy = -1;
            this.player.direction = 'up';
        } else if (input.isDownPressed()) {
            dy = 1;
            this.player.direction = 'down';
        } else if (input.isLeftPressed()) {
            dx = -1;
            this.player.direction = 'left';
        } else if (input.isRightPressed()) {
            dx = 1;
            this.player.direction = 'right';
        }
        
        // Set moving flag
        this.player.isMoving = dx !== 0 || dy !== 0;
        
        // Calculate new position
        if (this.player.isMoving) {
            const newX = this.player.x + dx * this.player.speed * deltaTime;
            const newY = this.player.y + dy * this.player.speed * deltaTime;
            
            // Check for collisions with map tiles
            if (!this.checkCollision(newX, newY)) {
                this.player.x = newX;
                this.player.y = newY;
            }
        }
        
        // Check for menu button
        if (input.isMenuPressed()) {
            this.game.stateManager.push('menu');
        }
    }
      /**
     * Check if a position collides with a solid map tile or NPC
     */
    checkCollision(x, y) {
        // Skip collision check if no map is loaded
        if (!this.map) return false;
        
        // Check all four corners of the player's hitbox
        // This ensures consistent collision from all directions
        const corners = [
            { x: x, y: y }, // Top-left
            { x: x + this.player.width - 1, y: y }, // Top-right
            { x: x, y: y + this.player.height - 1 }, // Bottom-left
            { x: x + this.player.width - 1, y: y + this.player.height - 1 } // Bottom-right
        ];
        
        for (const corner of corners) {
            // Calculate tile coordinates for this corner
            const tileX = Math.floor(corner.x / this.tileSize);
            const tileY = Math.floor(corner.y / this.tileSize);
            
            // Check map boundaries
            if (tileX < 0 || tileX >= this.map.width || 
                tileY < 0 || tileY >= this.map.height) {
                return true;
            }
            
            // Check collision with solid tiles
            const tileIndex = tileY * this.map.width + tileX;
            const tile = this.map.tiles[tileIndex];
            if (this.map.solidTiles.includes(tile)) {
                return true;
            }
            
            // Check collision with NPCs
            for (const npc of this.npcs) {
                const npcTileX = Math.floor(npc.x / this.tileSize);
                const npcTileY = Math.floor(npc.y / this.tileSize);
                if (tileX === npcTileX && tileY === npcTileY) {
                    return true;
                }
            }
        }
        
        return false;
    }
      /**
     * Update camera position to follow the player
     */
    updateCamera() {
        if (!this.map) return;
        
        // Calculate total map size in pixels
        const mapWidthPx = this.map.width * this.tileSize;
        const mapHeightPx = this.map.height * this.tileSize;
        
        // If map is smaller than the screen, center it
        if (mapWidthPx < this.game.width) {
            // Center map horizontally
            this.camera.x = (mapWidthPx - this.game.width) / 2;
        } else {
            // Center camera on player for large maps
            this.camera.x = this.player.x - this.game.width / 2;
            // Clamp to map boundaries
            const maxX = mapWidthPx - this.game.width;
            this.camera.x = Math.max(0, Math.min(this.camera.x, maxX));
        }
        
        if (mapHeightPx < this.game.height) {
            // Center map vertically
            this.camera.y = (mapHeightPx - this.game.height) / 2;
        } else {
            // Center camera on player for large maps
            this.camera.y = this.player.y - this.game.height / 2;
            // Clamp to map boundaries
            const maxY = mapHeightPx - this.game.height;
            this.camera.y = Math.max(0, Math.min(this.camera.y, maxY));
        }
    }
    
    /**
     * Check for interactions with NPCs
     */
    checkNpcInteractions() {
        if (this.game.input.isActionPressed()) {
            // Get the tile in front of the player
            let facingTileX = Math.floor(this.player.x / this.tileSize);
            let facingTileY = Math.floor(this.player.y / this.tileSize);
            
            // Adjust based on player direction
            switch (this.player.direction) {
                case 'up':
                    facingTileY--;
                    break;
                case 'down':
                    facingTileY++;
                    break;
                case 'left':
                    facingTileX--;
                    break;
                case 'right':
                    facingTileX++;
                    break;
            }
            
            // Check if there's an NPC at this tile
            for (const npc of this.npcs) {
                const npcTileX = Math.floor(npc.x / this.tileSize);
                const npcTileY = Math.floor(npc.y / this.tileSize);
                
                if (facingTileX === npcTileX && facingTileY === npcTileY) {
                    // Face the NPC towards the player
                    switch (this.player.direction) {
                        case 'up':
                            npc.direction = 'down';
                            break;
                        case 'down':
                            npc.direction = 'up';
                            break;
                        case 'left':
                            npc.direction = 'right';
                            break;
                        case 'right':
                            npc.direction = 'left';
                            break;                    }                      // Start dialogue only if not in cooldown
                    if (npc.dialog && npc.dialog.length > 0 && this.dialogCooldown <= 0) {
                        this.game.scenes.dialog.setDialog(npc.dialog, npc.name);
                        this.game.stateManager.push('dialog');
                    }
                    break;
                }
            }
        }
    }
      /**
     * Check for map portals
     */
    checkPortals() {
        if (!this.map || !this.map.portals) return;
        
        // Skip if we're in a portal cooldown period
        if (this.portalCooldown) return;
        
        // Get player tile position
        const playerTileX = Math.floor(this.player.x / this.tileSize);
        const playerTileY = Math.floor(this.player.y / this.tileSize);
        
        // Check all portals on the current map
        for (const portal of this.map.portals) {
            if (playerTileX === portal.x && playerTileY === portal.y) {
                // Skip if this is the portal we just came from
                const portalId = `${portal.targetMap}_${portal.targetX}_${portal.targetY}`;
                if (portalId === this.lastPortalUsed) continue;
                
                // Player is standing on a portal
                console.log(`Portal to ${portal.targetMap} found!`);
                
                // Set cooldown to prevent immediate re-triggering
                this.portalCooldown = true;
                
                // Remember the destination as our "last portal used"
                // Store in format "mapName_x_y" to uniquely identify the destination
                this.lastPortalUsed = `${portal.targetMap}_${portal.targetX}_${portal.targetY}`;
                
                // Change map
                this.loadMap(portal.targetMap);
                
                // Set player position on the new map
                this.player.x = portal.targetX * this.tileSize;
                this.player.y = portal.targetY * this.tileSize;
                
                // Play portal sound if available
                if (this.game.audio.sounds['portal']) {
                    this.game.audio.playSound('portal', 0.7);
                }
                
                // Reset cooldown after a delay
                setTimeout(() => {
                    this.portalCooldown = false;
                    // Keep lastPortalUsed for an additional small time to prevent bounce-back
                    setTimeout(() => {
                        this.lastPortalUsed = null;
                    }, 500);
                }, 500);
                
                // Break after using the first matching portal
                break;
            }
        }
    }
    
    /**
     * Check for random monster encounters
     */
    checkMonsterEncounters() {
        if (!this.map || !this.map.monsterZones || !this.player.isMoving) return;
        
        // Don't check for encounters if we just had one
        if (this.encounterCooldown) return;
        
        // Get player tile position
        const playerTileX = Math.floor(this.player.x / this.tileSize);
        const playerTileY = Math.floor(this.player.y / this.tileSize);
        const tileIndex = playerTileY * this.map.width + playerTileX;
        const currentTile = this.map.tiles[tileIndex];
        
        // Check all monster zones on the current map
        for (const zone of this.map.monsterZones) {
            // Check if player is on a tile that triggers encounters
            if (zone.tiles.includes(currentTile)) {
                // Roll for random encounter based on encounter rate
                if (Math.random() < zone.encounterRate) {
                    console.log('Monster encounter triggered!');
                    
                    // Set cooldown to prevent back-to-back encounters
                    this.encounterCooldown = true;
                    setTimeout(() => {
                        this.encounterCooldown = false;
                    }, 3000);
                    
                    // Get a random monster from this zone
                    const randomIndex = Math.floor(Math.random() * zone.monsters.length);
                    const monsterType = zone.monsters[randomIndex];
                    
                    // Create monster for battle based on type
                    let monster;
                    switch (monsterType) {
                        case 'Slime':
                            monster = {
                                name: 'Slime',
                                hp: 30,
                                maxHp: 30,
                                attack: 8,
                                defense: 5,
                                exp: 10,
                                sprite: 'enemy_slime'
                            };
                            break;
                        case 'ForestSprite':
                            monster = {
                                name: 'Forest Sprite',
                                hp: 25,
                                maxHp: 25,
                                attack: 12,
                                defense: 3,
                                exp: 15,
                                sprite: 'enemy_sprite'
                            };
                            break;
                        default:
                            monster = {
                                name: 'Unknown Monster',
                                hp: 20,
                                maxHp: 20,
                                attack: 10,
                                defense: 4,
                                exp: 8,
                                sprite: 'enemy_slime'
                            };
                    }
                    
                    // Start battle with this monster
                    this.game.scenes.battle.startBattle([monster]);
                    this.game.stateManager.push('battle');
                    
                    break;
                }
            }
        }
    }
      /**
     * Render the world scene
     */
    render(renderer) {
        if (!this.map) {
            // Render an empty background if no map is loaded
            renderer.fillRect(0, 0, this.game.width, this.game.height, '#333');
            renderer.drawText('No map loaded', 10, 10, { color: 'white' });
            return;
        }
        
        // Calculate visible range of tiles
        const startTileX = Math.floor(this.camera.x / this.tileSize);
        const startTileY = Math.floor(this.camera.y / this.tileSize);
        const endTileX = Math.ceil((this.camera.x + this.game.width) / this.tileSize);
        const endTileY = Math.ceil((this.camera.y + this.game.height) / this.tileSize);
        
        // Render map tiles
        for (let y = startTileY; y < endTileY; y++) {
            for (let x = startTileX; x < endTileX; x++) {
                // Skip if outside map boundaries
                if (x < 0 || x >= this.map.width || y < 0 || y >= this.map.height) {
                    continue;
                }
                
                const tileIndex = y * this.map.width + x;
                const tile = this.map.tiles[tileIndex];
                
                // Get position to draw the tile
                let drawX = x * this.tileSize - this.camera.x;
                let drawY = y * this.tileSize - this.camera.y;
                  // Apply animated offsets based on tile type
                if (tile === 5) { // Water
                    // Add gentle wave motion
                    drawY += this.tileAnimations.waterOffset;
                } else if (tile === 2) { // Grass
                    // Add subtle swaying
                    drawX += Math.sin(x + y + this.tileAnimations.timer) * 0.8;
                } else if (tile === 12) { // Lush garden patch
                    // Add more pronounced swaying
                    drawX += Math.sin(x * 0.5 + y * 0.3 + this.tileAnimations.timer * 1.2) * 1.2;
                }
                  // Draw tile
                renderer.drawTile(
                    'tileset',
                    tile,
                    this.map.tileSize,
                    drawX,
                    drawY,
                    this.tileSize,
                    this.tileSize
                );
            }
        }
        
        // Draw all active particles
        for (const particle of this.particles) {
            // Calculate opacity based on age (fade out at end of life)
            const ageRatio = particle.age / particle.lifespan;
            const opacity = 1 - ageRatio;
            
            // Get size (pulse slightly)
            const pulseScale = 0.8 + Math.sin(particle.age * 10) * 0.2;
            const displaySize = particle.size * pulseScale * (1 - ageRatio * 0.3);
            
            // Draw the particle
            renderer.fillCircle(
                particle.x - this.camera.x,
                particle.y - this.camera.y,
                displaySize,
                particle.color.replace(/[\d.]+\)$/, `${opacity})`),
            );
        }
        
        // Sort entities by Y position for proper depth
        const entities = [...this.npcs, this.player].sort((a, b) => a.y - b.y);
        
        // Render entities
        for (const entity of entities) {
            this.renderEntity(renderer, entity);
        }
    }
    
    /**
     * Render an entity (player or NPC)
     */
    renderEntity(renderer, entity) {
        // Calculate sprite position in the spritesheet based on direction
        let spriteX = 0;
        let spriteY = 0;
        
        switch (entity.direction) {
            case 'down':
                spriteY = 0;
                break;
            case 'left':
                spriteY = 1;
                break;
            case 'right':
                spriteY = 2;
                break;
            case 'up':
                spriteY = 3;
                break;
        }
        
        // Add animation frame (simple 2-frame walking animation)
        if (entity.isMoving) {
            spriteX = Math.floor(Date.now() / 200) % 2;
        }
        
        // Draw the entity sprite
        renderer.drawSprite(
            entity.spritesheet,
            spriteX * this.tileSize,
            spriteY * this.tileSize,
            this.tileSize,
            this.tileSize,
            entity.x - this.camera.x,
            entity.y - this.camera.y,
            entity.width,
            entity.height
        );
    }
    
    /**
     * Update tile animation effects
     */
    updateTileAnimations(deltaTime) {
        // Increment animation timer
        this.tileAnimations.timer += deltaTime;
        
        // Water animation (gentle waves)
        this.tileAnimations.waterOffset = Math.sin(this.tileAnimations.timer * 2) * 2;
        
        // Grass and flower swaying in the wind
        this.tileAnimations.grassWave = Math.sin(this.tileAnimations.timer * 1.5) * 1.5;
        this.tileAnimations.flowerSway = Math.cos(this.tileAnimations.timer * 1.2) * 2;
        
        // Door glowing effect (pulsing)
        this.tileAnimations.doorGlow = Math.abs(Math.sin(this.tileAnimations.timer * 1.8)) * 0.6;
        
        // Special tile glow effect
        this.tileAnimations.specialGlow = Math.abs(Math.sin(this.tileAnimations.timer * 1.2)) * 0.8;
        
        // Create particles occasionally for special tiles
        if (Math.random() < 0.05) {
            this.createRandomParticle();
        }
    }
    
    /**
     * Create a random particle effect for a visible special tile
     */
    createRandomParticle() {
        if (!this.map) return;
        
        // Calculate visible range of tiles
        const startTileX = Math.floor(this.camera.x / this.tileSize);
        const startTileY = Math.floor(this.camera.y / this.tileSize);
        const endTileX = Math.ceil((this.camera.x + this.game.width) / this.tileSize);
        const endTileY = Math.ceil((this.camera.y + this.game.height) / this.tileSize);
        
        // Get all special tiles in the visible range
        const specialTiles = [];
        for (let y = startTileY; y < endTileY; y++) {
            for (let x = startTileX; x < endTileX; x++) {
                // Skip if outside map boundaries
                if (x < 0 || x >= this.map.width || y < 0 || y >= this.map.height) {
                    continue;
                }
                
                const tileIndex = y * this.map.width + x;
                const tile = this.map.tiles[tileIndex];
                
                // Check for special tiles (doors, water, flowers, etc.)
                if (tile === 5 || tile === 12 || tile === 13 || tile === 14) {
                    specialTiles.push({ x, y, type: tile });
                }
            }
        }
        
        // If there are any special tiles visible, create a particle for a random one
        if (specialTiles.length > 0) {
            const randomTile = specialTiles[Math.floor(Math.random() * specialTiles.length)];
            
            // Create a particle effect based on the tile type
            let color, size, lifespan, velocity;
            
            switch (randomTile.type) {
                case 5: // Water
                    color = `rgba(100, 200, 255, ${0.5 + Math.random() * 0.5})`;
                    size = 1 + Math.random() * 2;
                    lifespan = 0.5 + Math.random() * 1;
                    velocity = { x: (Math.random() - 0.5) * 10, y: -10 - Math.random() * 10 };
                    break;
                case 12: // Flowers
                    color = `rgba(255, ${100 + Math.random() * 155}, ${150 + Math.random() * 105}, ${0.6 + Math.random() * 0.4})`;
                    size = 1 + Math.random() * 1.5;
                    lifespan = 1 + Math.random() * 2;
                    velocity = { x: (Math.random() - 0.5) * 5, y: -5 - Math.random() * 10 };
                    break;
                case 13: // Special
                    color = `rgba(255, ${100 + Math.random() * 155}, 100, ${0.7 + Math.random() * 0.3})`;
                    size = 2 + Math.random() * 3;
                    lifespan = 0.8 + Math.random() * 1.5;
                    velocity = { x: (Math.random() - 0.5) * 15, y: -5 - Math.random() * 15 };
                    break;
                case 14: // Door
                    color = `rgba(255, ${180 + Math.random() * 75}, 100, ${0.5 + Math.random() * 0.5})`;
                    size = 1 + Math.random() * 2;
                    lifespan = 0.5 + Math.random() * 1;
                    velocity = { x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 8 };
                    break;
            }
            
            // Calculate position (with some randomness within the tile)
            const x = (randomTile.x * this.tileSize) + (Math.random() * this.tileSize);
            const y = (randomTile.y * this.tileSize) + (Math.random() * this.tileSize);
            
            // Add the particle
            this.particles.push({
                x, y, color, size, lifespan, 
                velocity,
                age: 0
            });
        }
    }
    
    /**
     * Update all active particles
     */
    updateParticles(deltaTime) {
        // Update existing particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update age
            particle.age += deltaTime;
            
            // Remove if past lifespan
            if (particle.age >= particle.lifespan) {
                this.particles.splice(i, 1);
                continue;
            }
            
            // Update position
            particle.x += particle.velocity.x * deltaTime;
            particle.y += particle.velocity.y * deltaTime;
            
            // Slow down over time
            particle.velocity.x *= 0.98;
            particle.velocity.y *= 0.98;
            
            // Add gravity to some particles
            particle.velocity.y += 5 * deltaTime;
        }
    }
}
