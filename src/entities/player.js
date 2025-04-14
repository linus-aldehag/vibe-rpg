/**
 * Player entity class
 */
class Player {    constructor(game, x, y) {
        this.game = game;        this.x = x;
        this.y = y;
        this.width = 24;  // Smaller width for more human-like proportions
        this.height = 28; // Slightly taller than wide for human proportions
        this.speed = 120; // pixels per second
        this.direction = 'down';
        this.isMoving = false;
        this.spritesheet = 'player';
        
        // Stats from character data
        this.stats = CHARACTERS.player.stats;
        this.name = CHARACTERS.player.name;
        this.equipment = CHARACTERS.player.equipment;
        
        // Inventory
        this.inventory = {
            gold: 100,
            items: ['Potion', 'Potion', 'Ether']
        };
    }
    
    /**
     * Update player state
     */
    update(deltaTime) {
        // Movement is handled by the world scene
    }
    
    /**
     * Get item from inventory
     */
    getItem(itemName) {
        const index = this.inventory.items.indexOf(itemName);
        if (index !== -1) {
            return this.inventory.items.splice(index, 1)[0];
        }
        return null;
    }
    
    /**
     * Add item to inventory
     */
    addItem(itemName) {
        this.inventory.items.push(itemName);
    }
    
    /**
     * Use an item
     */
    useItem(itemName) {
        const item = ITEMS[itemName];
        if (!item) return false;
        
        // Get and remove the item from inventory
        const foundItem = this.getItem(itemName);
        if (!foundItem) return false;
        
        // Apply effects
        if (item.type === 'consumable' && item.effect) {
            if (item.effect.hp) {
                this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + item.effect.hp);
            }
            if (item.effect.mp) {
                this.stats.mp = Math.min(this.stats.maxMp, this.stats.mp + item.effect.mp);
            }
            return true;
        }
        
        return false;
    }
}
