/**
 * NPC (Non-Player Character) entity class
 */
class NPC {
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.width = config.width || 32;
        this.height = config.height || 32;
        this.direction = config.direction || 'down';
        this.spritesheet = config.spritesheet || 'npc';
        this.name = config.name || 'NPC';
        this.dialog = config.dialog || [];
        
        // Movement pattern (optional)
        this.movementPattern = config.movementPattern || null;
        this.movementTimer = 0;
        this.movementIndex = 0;
        
        // Whether this NPC can move
        this.canMove = config.canMove || false;
    }
    
    /**
     * Update NPC state
     */
    update(deltaTime, map) {
        // If NPC has a movement pattern, follow it
        if (this.canMove && this.movementPattern && this.movementPattern.length > 0) {
            this.movementTimer -= deltaTime;
            
            if (this.movementTimer <= 0) {
                // Get next movement instruction
                const movement = this.movementPattern[this.movementIndex];
                
                // Apply movement
                if (movement.type === 'move') {
                    this.direction = movement.direction;
                    
                    let newX = this.x;
                    let newY = this.y;
                    
                    switch (movement.direction) {
                        case 'up':
                            newY -= this.height;
                            break;
                        case 'down':
                            newY += this.height;
                            break;
                        case 'left':
                            newX -= this.width;
                            break;
                        case 'right':
                            newX += this.width;
                            break;
                    }
                    
                    // Check if new position is valid
                    if (!map.checkCollision(newX, newY)) {
                        this.x = newX;
                        this.y = newY;
                    }
                } else if (movement.type === 'wait') {
                    // Just wait, no movement
                }
                
                // Move to next step in pattern
                this.movementIndex = (this.movementIndex + 1) % this.movementPattern.length;
                
                // Reset timer
                this.movementTimer = movement.duration || 1;
            }
        }
    }
    
    /**
     * Get dialog from NPC
     */
    getDialog() {
        return this.dialog;
    }
}
