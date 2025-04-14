/**
 * Main entry point for the JRPG game
 */

// Map data is loaded from src/data/maps.js

// Initialize the game when the window loads
window.addEventListener('load', () => {
    // Create a placeholder for missing assets
    const createPlaceholderAsset = (canvas, color, text) => {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        return canvas;
    };

    // Create placeholders for required assets (in a real game, you'd load actual assets)
    const game = new Game('game-canvas');
    
    // Create placeholder for tileset
    const tilesetCanvas = document.createElement('canvas');
    tilesetCanvas.width = 128;
    tilesetCanvas.height = 128;
    const tilesetCtx = tilesetCanvas.getContext('2d');
    
    // Draw placeholder tiles (different colors for different tile types)
    const tileSize = 32;
    const tileColors = [
        '#000000', // Empty (0)
        '#66AA66', // Grass (1)
        '#88CC88', // Tall grass (2)
        '#8B4513', // Wall/tree (3)
        '#A52A2A', // Rock (4)
        '#0000FF', // Water (5)
        '#FFFF00', // Sand (6)
        '#CCCCCC', // Path (7)
        '#666666', // Mountain (8)
        '#880000', // House wall (9)
        '#AA5555', // House roof (10)
        '#DDDDDD', // Floor (11)
        '#DDA0DD', // Flowers (12)
        '#FF0000', // Special (13)
        '#000088', // Door (14)
        '#008800'  // Special tree (15)
    ];
      // Draw creative placeholder tiles with pixel art patterns
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            const index = y * 4 + x;
            const tileX = x * tileSize;
            const tileY = y * tileSize;
            
            // Base color fill
            tilesetCtx.fillStyle = tileColors[index] || '#FF00FF';
            tilesetCtx.fillRect(tileX, tileY, tileSize, tileSize);
            
            // Add creative patterns based on tile type
            switch(index) {
                case 0: // Empty
                    // Add a subtle void pattern
                    tilesetCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                    for (let i = 0; i < 8; i++) {
                        for (let j = 0; j < 8; j++) {
                            if ((i + j) % 2 === 0) {
                                tilesetCtx.fillRect(tileX + i * 4, tileY + j * 4, 2, 2);
                            }
                        }
                    }
                    break;
                    
                case 1: // Grass
                    // Add grass blades
                    tilesetCtx.fillStyle = '#88CC88';
                    for (let i = 0; i < 8; i++) {
                        const grassX = tileX + Math.random() * tileSize;
                        const grassWidth = 2 + Math.random() * 3;
                        const grassHeight = 4 + Math.random() * 8;
                        tilesetCtx.fillRect(grassX, tileY + tileSize - grassHeight, grassWidth, grassHeight);
                    }
                    break;
                    
                case 2: // Tall grass
                    // Add taller grass blades
                    tilesetCtx.fillStyle = '#99DD99';
                    for (let i = 0; i < 12; i++) {
                        const grassX = tileX + Math.random() * tileSize;
                        const grassWidth = 2 + Math.random() * 3;
                        const grassHeight = 8 + Math.random() * 12;
                        tilesetCtx.fillRect(grassX, tileY + tileSize - grassHeight, grassWidth, grassHeight);
                    }
                    break;
                    
                case 3: // Wall/tree
                    // Add brick pattern
                    tilesetCtx.fillStyle = '#6B3100';
                    for (let i = 0; i < 4; i++) {
                        for (let j = 0; j < 4; j++) {
                            // Alternate brick pattern
                            const offsetX = (j % 2) * 4;
                            tilesetCtx.fillRect(tileX + i * 8 + offsetX, tileY + j * 8, 7, 7);
                        }
                    }
                    break;
                      case 4: // Rock
                    // Add rock texture
                    for (let i = 0; i < 10; i++) {
                        tilesetCtx.fillStyle = `rgba(120, 120, 120, ${0.1 + Math.random() * 0.3})`;
                        const rockX = tileX + Math.random() * tileSize;
                        const rockY = tileY + Math.random() * tileSize;
                        const size = 3 + Math.random() * 6;
                        tilesetCtx.fillRect(rockX, rockY, size, size);
                    }
                    break;
                    
                case 5: // Water
                    // Add water waves
                    tilesetCtx.fillStyle = '#0055AA';
                    for (let i = 0; i < 4; i++) {
                        tilesetCtx.fillRect(tileX, tileY + 8 * i + 4, tileSize, 4);
                    }
                    break;
                      case 6: // Sand
                    // Add sand texture
                    for (let i = 0; i < 32; i++) {
                        tilesetCtx.fillStyle = `rgba(220, 200, 100, ${0.2 + Math.random() * 0.3})`;
                        const dotX = tileX + Math.random() * tileSize;
                        const dotY = tileY + Math.random() * tileSize;
                        tilesetCtx.fillRect(dotX, dotY, 2, 2);
                    }
                    break;
                    
                case 7: // Path
                    // Add path texture
                    tilesetCtx.fillStyle = '#AA9977';
                    for (let i = 0; i < 5; i++) {
                        for (let j = 0; j < 5; j++) {
                            if ((i + j) % 2 === 0) {
                                tilesetCtx.fillRect(tileX + i * 6 + 2, tileY + j * 6 + 2, 4, 4);
                            }
                        }
                    }
                    break;
                    
                case 8: // Mountain
                    // Create mountain peak
                    tilesetCtx.fillStyle = '#555555';
                    tilesetCtx.beginPath();
                    tilesetCtx.moveTo(tileX, tileY + tileSize);
                    tilesetCtx.lineTo(tileX + tileSize/2, tileY + 4);
                    tilesetCtx.lineTo(tileX + tileSize, tileY + tileSize);
                    tilesetCtx.fill();
                    
                    // Add snow cap
                    tilesetCtx.fillStyle = '#FFFFFF';
                    tilesetCtx.beginPath();
                    tilesetCtx.moveTo(tileX + tileSize/2, tileY + 4);
                    tilesetCtx.lineTo(tileX + tileSize/2 - 5, tileY + 8);
                    tilesetCtx.lineTo(tileX + tileSize/2 + 5, tileY + 8);
                    tilesetCtx.fill();
                    break;
                    
                case 9: // House wall
                    // Add window
                    tilesetCtx.fillStyle = '#FFFF99';
                    tilesetCtx.fillRect(tileX + 8, tileY + 12, 16, 12);
                    tilesetCtx.strokeStyle = '#440000';
                    tilesetCtx.lineWidth = 2;
                    tilesetCtx.strokeRect(tileX + 8, tileY + 12, 16, 12);
                    tilesetCtx.strokeRect(tileX + 16, tileY + 12, 0, 12);
                    tilesetCtx.strokeRect(tileX + 8, tileY + 18, 16, 0);
                    break;
                    
                case 10: // House roof
                    // Add roof tiles
                    tilesetCtx.fillStyle = '#772200';
                    for (let i = 0; i < 8; i++) {
                        for (let j = 0; j < 4; j++) {
                            if ((i + j) % 2 === 0) {
                                tilesetCtx.fillRect(tileX + i * 4, tileY + j * 8, 4, 6);
                            }
                        }
                    }
                    break;
                    
                case 11: // Floor
                    // Add floor tiles
                    for (let i = 0; i < 4; i++) {
                        for (let j = 0; j < 4; j++) {
                            tilesetCtx.fillStyle = (i + j) % 2 === 0 ? '#EEEEEE' : '#CCCCCC';
                            tilesetCtx.fillRect(tileX + i * 8, tileY + j * 8, 8, 8);
                        }
                    }
                    break;
                      case 12: // Lush garden patch
                    // Base grass
                    tilesetCtx.fillStyle = '#338855';
                    tilesetCtx.fillRect(tileX, tileY, tileSize, tileSize);
                    
                    // Add decorative patterns
                    tilesetCtx.fillStyle = '#339966';
                    
                    // Diagonal pattern
                    for (let i = 0; i < 8; i++) {
                        const offset = (i % 2) * 4;
                        tilesetCtx.fillRect(tileX + i * 4 + offset, tileY + i * 4, 3, 3);
                    }
                    
                    // Add small flowers (more subtle than before)
                    const flowerColors = ['#FFAACC', '#EEEEFF', '#FFFFAA'];
                    for (let i = 0; i < 5; i++) {
                        const flowerX = tileX + 4 + Math.random() * 24;
                        const flowerY = tileY + 4 + Math.random() * 24;
                        const flowerSize = 1 + Math.random() * 2;
                        
                        tilesetCtx.fillStyle = flowerColors[Math.floor(Math.random() * flowerColors.length)];
                        tilesetCtx.beginPath();
                        tilesetCtx.arc(flowerX, flowerY, flowerSize, 0, Math.PI * 2);
                        tilesetCtx.fill();
                    }
                    break;
                    
                case 13: // Special
                    // Add a special glowing effect
                    const gradient = tilesetCtx.createRadialGradient(
                        tileX + tileSize/2, tileY + tileSize/2, 2,
                        tileX + tileSize/2, tileY + tileSize/2, 16
                    );
                    gradient.addColorStop(0, '#FFFFFF');
                    gradient.addColorStop(1, '#FF0000');
                    tilesetCtx.fillStyle = gradient;
                    tilesetCtx.beginPath();
                    tilesetCtx.arc(tileX + tileSize/2, tileY + tileSize/2, 16, 0, Math.PI * 2);
                    tilesetCtx.fill();
                    break;
                      case 14: // Gate
                    // Draw gate fence posts
                    tilesetCtx.fillStyle = '#553300';
                    tilesetCtx.fillRect(tileX + 4, tileY + 2, 4, 30); // Left post
                    tilesetCtx.fillRect(tileX + 24, tileY + 2, 4, 30); // Right post
                    
                    // Draw horizontal bars
                    tilesetCtx.fillRect(tileX + 4, tileY + 5, 24, 3);  // Top bar
                    tilesetCtx.fillRect(tileX + 4, tileY + 15, 24, 3); // Middle bar
                    tilesetCtx.fillRect(tileX + 4, tileY + 25, 24, 3); // Bottom bar
                    
                    // Draw vertical bars
                    for (let i = 0; i < 5; i++) {
                        tilesetCtx.fillRect(tileX + 8 + i * 4, tileY + 5, 2, 23);
                    }
                    
                    // Draw gate latch
                    tilesetCtx.fillStyle = '#999999';
                    tilesetCtx.fillRect(tileX + 17, tileY + 13, 6, 7);
                    break;
                    
                case 15: // Special tree
                    // Draw trunk
                    tilesetCtx.fillStyle = '#663300';
                    tilesetCtx.fillRect(tileX + 12, tileY + 16, 8, 16);
                    
                    // Draw leaves
                    tilesetCtx.fillStyle = '#005500';
                    tilesetCtx.beginPath();
                    tilesetCtx.arc(tileX + 16, tileY + 12, 12, 0, Math.PI * 2);
                    tilesetCtx.fill();
                    
                    // Add leaf highlights
                    tilesetCtx.fillStyle = '#008800';
                    tilesetCtx.beginPath();
                    tilesetCtx.arc(tileX + 20, tileY + 8, 6, 0, Math.PI * 2);
                    tilesetCtx.fill();
                    break;
            }
              // Add tile outline
            tilesetCtx.strokeStyle = '#000';
            tilesetCtx.lineWidth = 1;
            tilesetCtx.strokeRect(tileX, tileY, tileSize, tileSize);
        }
    }
      // Create placeholder for player sprite
    const playerCanvas = document.createElement('canvas');
    playerCanvas.width = 64; // 2 frames
    playerCanvas.height = 128; // 4 directions
    
    // Draw a more character-like player sprite
    const playerCtx = playerCanvas.getContext('2d');
    
    // Draw player frames for each direction (down, left, right, up)
    for (let direction = 0; direction < 4; direction++) {
        for (let frame = 0; frame < 2; frame++) {
            const frameX = frame * 32;
            const frameY = direction * 32;
            
            // Base color (body)
            playerCtx.fillStyle = '#4488FF';
            
            // Draw head
            playerCtx.beginPath();
            playerCtx.arc(frameX + 16, frameY + 10, 8, 0, Math.PI * 2);
            playerCtx.fill();
            
            // Draw body (slightly smaller than tile size)
            playerCtx.fillRect(frameX + 10, frameY + 16, 12, 14);
            
            // Draw legs
            const legOffset = frame === 0 ? 0 : 2; // walking animation
            playerCtx.fillStyle = '#3366CC';
            
            // Left leg with animation
            playerCtx.fillRect(
                frameX + 10, 
                frameY + 26, 
                5, 
                6 - (direction === 0 ? legOffset : 0)
            );
            
            // Right leg with animation
            playerCtx.fillRect(
                frameX + 17, 
                frameY + 26, 
                5, 
                6 - (direction === 0 ? 0 : legOffset)
            );
            
            // Draw arms based on direction
            playerCtx.fillStyle = '#5599FF';
            
            if (direction === 1) { // Left facing
                // Arms on left side
                playerCtx.fillRect(frameX + 8, frameY + 16, 3, 10);
            } else if (direction === 2) { // Right facing
                // Arms on right side
                playerCtx.fillRect(frameX + 21, frameY + 16, 3, 10);
            } else {
                // Arms on both sides
                playerCtx.fillRect(frameX + 6, frameY + 16 + (frame * 2), 4, 8);
                playerCtx.fillRect(frameX + 22, frameY + 16 + (frame === 0 ? 2 : 0), 4, 8);
            }
            
            // Add eyes based on direction
            playerCtx.fillStyle = '#000';
            if (direction === 0) { // Down
                playerCtx.fillRect(frameX + 13, frameY + 9, 2, 2);
                playerCtx.fillRect(frameX + 19, frameY + 9, 2, 2);
            } else if (direction === 3) { // Up
                playerCtx.fillRect(frameX + 13, frameY + 11, 2, 2);
                playerCtx.fillRect(frameX + 19, frameY + 11, 2, 2);
            } else if (direction === 1) { // Left
                playerCtx.fillRect(frameX + 12, frameY + 10, 2, 2);
            } else if (direction === 2) { // Right
                playerCtx.fillRect(frameX + 20, frameY + 10, 2, 2);
            }
        }
    }
      // Create character-like NPC sprites
    // Village Elder (NPC 1)
    const npc1Canvas = document.createElement('canvas');
    npc1Canvas.width = 64;
    npc1Canvas.height = 128;
    const npc1Ctx = npc1Canvas.getContext('2d');
    
    // Draw Village Elder for each direction (down, left, right, up)
    for (let direction = 0; direction < 4; direction++) {
        for (let frame = 0; frame < 2; frame++) {
            const frameX = frame * 32;
            const frameY = direction * 32;
            
            // Base color (elder - gray/purple robe)
            npc1Ctx.fillStyle = '#8866AA';
            
            // Draw elder head (slightly larger than player)
            npc1Ctx.beginPath();
            npc1Ctx.arc(frameX + 16, frameY + 9, 9, 0, Math.PI * 2);
            npc1Ctx.fill();
            
            // Draw elder body/robe (wider than player)
            npc1Ctx.fillRect(frameX + 8, frameY + 16, 16, 15);
            
            // Draw beard
            npc1Ctx.fillStyle = '#DDDDDD';
            npc1Ctx.beginPath();
            npc1Ctx.arc(frameX + 16, frameY + 15, 7, 0, Math.PI);
            npc1Ctx.fill();
            
            // Draw elder staff (when visible based on direction)
            npc1Ctx.fillStyle = '#AA8855';
            if (direction === 1) { // Left facing
                npc1Ctx.fillRect(frameX + 6, frameY + 16, 2, 14);
            } else if (direction === 2) { // Right facing
                npc1Ctx.fillRect(frameX + 24, frameY + 16, 2, 14);
            } else if (direction === 0) { // Down facing
                // Staff showing on left side
                npc1Ctx.fillRect(frameX + 6, frameY + 16, 2, 14);
            }
            
            // Add eyes based on direction
            npc1Ctx.fillStyle = '#000';
            if (direction === 0) { // Down
                npc1Ctx.fillRect(frameX + 12, frameY + 8, 2, 2);
                npc1Ctx.fillRect(frameX + 18, frameY + 8, 2, 2);
            } else if (direction === 3) { // Up
                npc1Ctx.fillRect(frameX + 12, frameY + 10, 2, 2);
                npc1Ctx.fillRect(frameX + 18, frameY + 10, 2, 2);
            } else if (direction === 1) { // Left
                npc1Ctx.fillRect(frameX + 12, frameY + 9, 2, 2);
            } else if (direction === 2) { // Right
                npc1Ctx.fillRect(frameX + 20, frameY + 9, 2, 2);
            }
        }
    }
    
    // Shopkeeper (NPC 2)
    const npc2Canvas = document.createElement('canvas');
    npc2Canvas.width = 64;
    npc2Canvas.height = 128;
    const npc2Ctx = npc2Canvas.getContext('2d');
    
    // Draw Shopkeeper for each direction (down, left, right, up)
    for (let direction = 0; direction < 4; direction++) {
        for (let frame = 0; frame < 2; frame++) {
            const frameX = frame * 32;
            const frameY = direction * 32;
            
            // Base color (shopkeeper - green outfit)
            npc2Ctx.fillStyle = '#22AA55';
            
            // Draw shopkeeper head
            npc2Ctx.beginPath();
            npc2Ctx.arc(frameX + 16, frameY + 10, 8, 0, Math.PI * 2);
            npc2Ctx.fill();
            
            // Draw shopkeeper body/apron
            npc2Ctx.fillRect(frameX + 9, frameY + 16, 14, 14);
            
            // Draw arms
            npc2Ctx.fillStyle = '#33BB66';
            if (direction === 1) { // Left facing
                npc2Ctx.fillRect(frameX + 7, frameY + 16, 3, 10);
            } else if (direction === 2) { // Right facing
                npc2Ctx.fillRect(frameX + 22, frameY + 16, 3, 10);
            } else {
                // Arms on both sides
                npc2Ctx.fillRect(frameX + 5, frameY + 16 + (frame * 2), 4, 8);
                npc2Ctx.fillRect(frameX + 23, frameY + 16 + (frame === 0 ? 2 : 0), 4, 8);
            }
            
            // Draw legs
            npc2Ctx.fillStyle = '#115533';
            npc2Ctx.fillRect(frameX + 10, frameY + 26, 5, 6);
            npc2Ctx.fillRect(frameX + 17, frameY + 26, 5, 6);
            
            // Add shopkeeper hat
            npc2Ctx.fillStyle = '#EE9933';
            npc2Ctx.fillRect(frameX + 11, frameY + 3, 10, 3);
            npc2Ctx.fillRect(frameX + 13, frameY + 0, 6, 3);
            
            // Add eyes based on direction
            npc2Ctx.fillStyle = '#000';
            if (direction === 0) { // Down
                npc2Ctx.fillRect(frameX + 13, frameY + 10, 2, 2);
                npc2Ctx.fillRect(frameX + 19, frameY + 10, 2, 2);
            } else if (direction === 3) { // Up
                npc2Ctx.fillRect(frameX + 13, frameY + 12, 2, 2);
                npc2Ctx.fillRect(frameX + 19, frameY + 12, 2, 2);
            } else if (direction === 1) { // Left
                npc2Ctx.fillRect(frameX + 12, frameY + 11, 2, 2);
            } else if (direction === 2) { // Right
                npc2Ctx.fillRect(frameX + 20, frameY + 11, 2, 2);
            }
        }
    }    // Create placeholders for enemy sprites
    const enemySlimeCanvas = document.createElement('canvas');
    enemySlimeCanvas.width = 80;
    enemySlimeCanvas.height = 80;
    
    // Draw classic JRPG slime
    const slimeCtx = enemySlimeCanvas.getContext('2d');
    
    // Create a bounce animation effect
    const bounceHeight = 4;
    const bounceOffset = Math.sin(Date.now() / 200) * bounceHeight;
    
    // Draw slime shadow (oval shape)
    slimeCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    slimeCtx.beginPath();
    slimeCtx.ellipse(40, 65, 22, 6, 0, 0, Math.PI * 2);
    slimeCtx.fill();
    
    // Draw slime body with gradient for classic look
    const gradient = slimeCtx.createRadialGradient(40, 35, 5, 40, 45, 30);
    gradient.addColorStop(0, '#44AAFF'); // Light blue highlight (center)
    gradient.addColorStop(0.5, '#2277DD'); // Medium blue
    gradient.addColorStop(1, '#0055AA'); // Dark blue edge
    
    // Draw the classic rounded semi-circle slime shape
    slimeCtx.fillStyle = gradient;
    slimeCtx.beginPath();
    
    // Bottom rounded edge
    slimeCtx.ellipse(40, 55 - bounceOffset/2, 25, 15 + bounceOffset/2, 0, 0, Math.PI * 2);
    slimeCtx.fill();
    
    // More rounded top
    slimeCtx.beginPath();
    slimeCtx.ellipse(40, 40 - bounceOffset, 22, 20, 0, 0, Math.PI * 2);
    slimeCtx.fill();
    
    // Highlights (classic pixel art style)
    slimeCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    slimeCtx.beginPath();
    slimeCtx.ellipse(30, 35 - bounceOffset, 7, 5, Math.PI/4, 0, Math.PI * 2);
    slimeCtx.fill();
    
    slimeCtx.beginPath();
    slimeCtx.ellipse(48, 30 - bounceOffset, 4, 3, Math.PI/4, 0, Math.PI * 2);
    slimeCtx.fill();
    
    // Add classic slime face
    slimeCtx.fillStyle = '#000';
    
    // Classic dot eyes
    slimeCtx.beginPath();
    slimeCtx.arc(32, 42 - bounceOffset, 3, 0, Math.PI * 2); // Left eye
    slimeCtx.fill();
    
    slimeCtx.beginPath();
    slimeCtx.arc(48, 42 - bounceOffset, 3, 0, Math.PI * 2); // Right eye
    slimeCtx.fill();
    
    // Small mouth
    slimeCtx.beginPath();
    slimeCtx.arc(40, 50 - bounceOffset, 6, 0.1 * Math.PI, 0.9 * Math.PI);
    slimeCtx.stroke();
    
    // Create forest fairy enemy (common in JRPGs)
    const enemySpriteCanvas = document.createElement('canvas');
    enemySpriteCanvas.width = 80;
    enemySpriteCanvas.height = 80;
    
    // Draw fairy sprite in pixel art style
    const spriteCtx = enemySpriteCanvas.getContext('2d');
    
    // Add floating animation
    const floatHeight = 3;
    const floatOffset = Math.sin(Date.now() / 300) * floatHeight;
    
    // Fairy glow effect
    const fairyGlow = spriteCtx.createRadialGradient(40, 40 - floatOffset, 5, 40, 40 - floatOffset, 30);
    fairyGlow.addColorStop(0, 'rgba(200, 255, 200, 0.6)');
    fairyGlow.addColorStop(1, 'rgba(100, 255, 100, 0)');
    
    spriteCtx.fillStyle = fairyGlow;
    spriteCtx.beginPath();
    spriteCtx.arc(40, 40 - floatOffset, 30, 0, Math.PI * 2);
    spriteCtx.fill();
    
    // Fairy body (small humanoid)
    spriteCtx.fillStyle = '#F8E8FF'; // Light skin
    spriteCtx.beginPath();
    spriteCtx.ellipse(40, 42 - floatOffset, 6, 10, 0, 0, Math.PI * 2); // Body
    spriteCtx.fill();
    
    // Head
    spriteCtx.beginPath();
    spriteCtx.arc(40, 30 - floatOffset, 8, 0, Math.PI * 2);
    spriteCtx.fill();
    
    // Hair
    spriteCtx.fillStyle = '#55DD88'; // Green hair (forest fairy)
    spriteCtx.beginPath();
    spriteCtx.ellipse(40, 28 - floatOffset, 9, 10, 0, Math.PI, 0, true);
    spriteCtx.fill();
    
    // Wings (translucent, pixel-art style)
    spriteCtx.fillStyle = 'rgba(200, 255, 255, 0.7)';
    
    // Left wing (pixelated butterfly style)
    spriteCtx.beginPath();
    spriteCtx.moveTo(34, 38 - floatOffset);
    spriteCtx.lineTo(20, 30 - floatOffset + Math.sin(Date.now() / 150) * 2);
    spriteCtx.lineTo(25, 20 - floatOffset);
    spriteCtx.lineTo(34, 35 - floatOffset);
    spriteCtx.closePath();
    spriteCtx.fill();
    
    // Right wing
    spriteCtx.beginPath();
    spriteCtx.moveTo(46, 38 - floatOffset);
    spriteCtx.lineTo(60, 30 - floatOffset + Math.sin(Date.now() / 150 + Math.PI) * 2);
    spriteCtx.lineTo(55, 20 - floatOffset);
    spriteCtx.lineTo(46, 35 - floatOffset);
    spriteCtx.closePath();
    spriteCtx.fill();
    
    // Fairy face
    spriteCtx.fillStyle = '#000000';
    spriteCtx.beginPath();
    spriteCtx.arc(37, 29 - floatOffset, 1.5, 0, Math.PI * 2); // Left eye
    spriteCtx.fill();
    spriteCtx.beginPath();
    spriteCtx.arc(43, 29 - floatOffset, 1.5, 0, Math.PI * 2); // Right eye
    spriteCtx.fill();
    
    // Small fairy dust particles
    for (let i = 0; i < 8; i++) {
        const angle = (Date.now() / 1000 + i * 0.5) % (Math.PI * 2);
        const distance = 15 + Math.sin(Date.now() / 500 + i) * 5;
        const x = 40 + Math.cos(angle) * distance;
        const y = 40 - floatOffset + Math.sin(angle) * distance;
        
        spriteCtx.fillStyle = `rgba(255, 255, 150, ${0.5 + Math.random() * 0.5})`;
        spriteCtx.beginPath();
        spriteCtx.arc(x, y, 1 + Math.random(), 0, Math.PI * 2);
        spriteCtx.fill();
    }
      // Create forest battle background
    const battleForestCanvas = document.createElement('canvas');
    battleForestCanvas.width = 800;
    battleForestCanvas.height = 600;
    const forestCtx = battleForestCanvas.getContext('2d');
      // Draw a forest background (brighter green gradient base)
    const forestGradient = forestCtx.createLinearGradient(0, 0, 0, battleForestCanvas.height);
    forestGradient.addColorStop(0, '#0E3E0E'); // Brighter forest green at top (30% brighter)
    forestGradient.addColorStop(1, '#082A08'); // Brighter dark green at bottom (30% brighter)
    forestCtx.fillStyle = forestGradient;
    forestCtx.fillRect(0, 0, battleForestCanvas.width, battleForestCanvas.height);
      // Add forest trees silhouettes in the background
    forestCtx.fillStyle = '#082A08'; // Brighter dark green for distant trees (30% brighter)
    
    // Draw distant tree silhouettes
    for (let i = 0; i < 20; i++) {
        const treeX = i * 40 + Math.random() * 10;
        const treeHeight = 150 + Math.random() * 100;
        const treeWidth = 30 + Math.random() * 20;
        
        // Draw tree trunk
        forestCtx.fillRect(treeX, battleForestCanvas.height - treeHeight, treeWidth/3, treeHeight);
        
        // Draw tree crown (triangle)
        forestCtx.beginPath();
        forestCtx.moveTo(treeX - treeWidth/2, battleForestCanvas.height - treeHeight + 40);
        forestCtx.lineTo(treeX + treeWidth/2, battleForestCanvas.height - treeHeight + 40);
        forestCtx.lineTo(treeX, battleForestCanvas.height - treeHeight - 20);
        forestCtx.fill();
        
        forestCtx.beginPath();
        forestCtx.moveTo(treeX - treeWidth/2, battleForestCanvas.height - treeHeight + 80);
        forestCtx.lineTo(treeX + treeWidth/2, battleForestCanvas.height - treeHeight + 80);
        forestCtx.lineTo(treeX, battleForestCanvas.height - treeHeight + 20);
        forestCtx.fill();
    }
      // Add some foreground elements (closer trees)
    forestCtx.fillStyle = '#0A3A0A'; // Brighter green for foreground trees (30% brighter)
    
    // Draw closer trees on the sides
    for (let i = 0; i < 8; i++) {
        const side = i % 2 === 0 ? 0 : battleForestCanvas.width - 60;
        const treeX = side + (i % 2 === 0 ? 1 : -1) * Math.random() * 30;
        const treeY = 100 + i * 60 + Math.random() * 40;
        const treeHeight = 300 + Math.random() * 150;
        const treeWidth = 50 + Math.random() * 30;
        
        // Tree trunk
        forestCtx.fillRect(treeX, treeY, treeWidth/3, treeHeight);
        
        // Tree branches
        forestCtx.beginPath();
        forestCtx.moveTo(treeX - treeWidth/2, treeY + 100);
        forestCtx.lineTo(treeX + treeWidth/2, treeY + 100);
        forestCtx.lineTo(treeX, treeY);
        forestCtx.fill();
        
        forestCtx.beginPath();
        forestCtx.moveTo(treeX - treeWidth/2, treeY + 150);
        forestCtx.lineTo(treeX + treeWidth/2, treeY + 150);
        forestCtx.lineTo(treeX, treeY + 50);
        forestCtx.fill();
    }
      // Add subtle fog effect
    forestCtx.fillStyle = 'rgba(20, 50, 20, 0.35)'; // Brighter fog effect
    for (let i = 0; i < 5; i++) {
        const fogY = 100 + i * 100;
        const fogHeight = 60 + Math.random() * 30;
        forestCtx.fillRect(0, fogY, battleForestCanvas.width, fogHeight);
    }
      // Add some subtle light rays through the trees (brighter)
    forestCtx.fillStyle = 'rgba(100, 160, 100, 0.06)'; // Brighter light rays
    for (let i = 0; i < 10; i++) {
        const rayX = Math.random() * battleForestCanvas.width;
        const rayWidth = 30 + Math.random() * 50;
        forestCtx.beginPath();
        forestCtx.moveTo(rayX, 0);
        forestCtx.lineTo(rayX + rayWidth, battleForestCanvas.height);
        forestCtx.lineTo(rayX - rayWidth, battleForestCanvas.height);
        forestCtx.fill();
    }
      // Add a less dark overlay to ensure UI elements remain visible but forest details show through
    forestCtx.fillStyle = 'rgba(0, 0, 0, 0.4)'; // Reduced from 0.6 to 0.4 opacity
    forestCtx.fillRect(0, 0, battleForestCanvas.width, battleForestCanvas.height);

    // Add enemy images to the renderer
    game.renderer.images['enemy_slime'] = enemySlimeCanvas;
    game.renderer.images['enemy_sprite'] = enemySpriteCanvas;
    game.renderer.images['battle_forest'] = battleForestCanvas;
    
    // Add placeholder images to the renderer
    game.renderer.images['tileset'] = tilesetCanvas;
    game.renderer.images['player'] = playerCanvas;
    game.renderer.images['npc1'] = npc1Canvas;
    game.renderer.images['npc2'] = npc2Canvas;
    
    // Initialize and start the game
    game.init();
    game.start();
    
    console.log('Game started successfully!');
});
