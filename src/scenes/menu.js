/**
 * Menu scene for game menus
 */
class MenuScene extends Scene {
    constructor(game) {
        super(game);
        
        this.menuItems = [];
        this.selectedIndex = 0;
        this.title = '';
        this.width = 200;
        this.height = 200;
        this.x = 20;
        this.y = 20;
        
        // Menu input delay to prevent rapid selection
        this.inputDelay = 0.2;
        this.inputTimer = 0;
    }
    
    /**
     * Set menu options
     */
    setMenu(title, items, x = 20, y = 20, width = 200) {
        this.title = title;
        this.menuItems = items;
        this.selectedIndex = 0;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = items.length * 30 + 50; // Height based on number of items
    }
    
    /**
     * Initialize with default menu
     */
    init() {
        // Set up the main menu
        this.setMenu('Menu', [
            { label: 'Status', action: () => this.showStatus() },
            { label: 'Items', action: () => this.showItems() },
            { label: 'Equipment', action: () => this.showEquipment() },
            { label: 'Save', action: () => this.saveGame() },
            { label: 'Close', action: () => this.closeMenu() }
        ]);
    }
    
    /**
     * Update menu logic
     */
    update(deltaTime) {
        // Update input timer
        if (this.inputTimer > 0) {
            this.inputTimer -= deltaTime;
        }
        
        // Skip input handling if timer is active
        if (this.inputTimer <= 0) {
            // Handle menu navigation
            if (this.game.input.isUpPressed()) {
                this.selectedIndex = (this.selectedIndex - 1 + this.menuItems.length) % this.menuItems.length;
                this.inputTimer = this.inputDelay;
                
                // Play selection sound effect
                if (this.game.audio.sounds['menuSelect']) {
                    this.game.audio.playSound('menuSelect', 0.5);
                }
            } else if (this.game.input.isDownPressed()) {
                this.selectedIndex = (this.selectedIndex + 1) % this.menuItems.length;
                this.inputTimer = this.inputDelay;
                
                // Play selection sound effect
                if (this.game.audio.sounds['menuSelect']) {
                    this.game.audio.playSound('menuSelect', 0.5);
                }
            }
            
            // Handle menu selection
            if (this.game.input.isActionPressed()) {
                const selectedItem = this.menuItems[this.selectedIndex];
                if (selectedItem && selectedItem.action) {
                    selectedItem.action();
                    this.inputTimer = this.inputDelay;
                    
                    // Play confirmation sound effect
                    if (this.game.audio.sounds['menuConfirm']) {
                        this.game.audio.playSound('menuConfirm', 0.5);
                    }
                }
            }
            
            // Handle menu closing
            if (this.game.input.isMenuPressed() || this.game.input.isCancelPressed()) {
                this.closeMenu();
                this.inputTimer = this.inputDelay;
                
                // Play cancel sound effect
                if (this.game.audio.sounds['menuCancel']) {
                    this.game.audio.playSound('menuCancel', 0.5);
                }
            }
        }
    }
    
    /**
     * Render menu
     */
    render(renderer) {
        // First, render the world scene in the background
        const worldScene = this.game.scenes.world;
        if (worldScene) {
            worldScene.render(renderer);
        }
        
        // Draw semi-transparent overlay to darken the background
        renderer.fillRect(0, 0, this.game.width, this.game.height, 'rgba(0, 0, 0, 0.5)');
        
        // Draw menu background
        renderer.fillRect(this.x, this.y, this.width, this.height, 'rgba(0, 0, 30, 0.8)');
        renderer.strokeRect(this.x, this.y, this.width, this.height, '#fff', 2);
        
        // Draw menu title
        if (this.title) {
            renderer.drawText(this.title, this.x + 10, this.y + 25, {
                color: '#fff',
                font: 'bold 18px Arial'
            });
            
            // Draw divider line
            renderer.fillRect(this.x + 10, this.y + 35, this.width - 20, 1, '#fff');
        }
        
        // Draw menu items
        const startY = this.y + 50;
        for (let i = 0; i < this.menuItems.length; i++) {
            const itemY = startY + i * 30;
            const isSelected = i === this.selectedIndex;
            
            // Draw selection highlight
            if (isSelected) {
                renderer.fillRect(this.x + 5, itemY - 5, this.width - 10, 30, 'rgba(255, 255, 255, 0.2)');
            }
            
            // Draw item text
            renderer.drawText(this.menuItems[i].label, this.x + 20, itemY + 5, {
                color: isSelected ? '#ffff00' : '#fff',
                font: isSelected ? 'bold 16px Arial' : '16px Arial'
            });
        }
    }
    
    // Menu action methods
    showStatus() {
        console.log('Show player status');
        // In a full game, this would open a sub-menu with character stats
    }
    
    showItems() {
        console.log('Show items');
        // In a full game, this would open the inventory menu
    }
    
    showEquipment() {
        console.log('Show equipment');
        // In a full game, this would open the equipment menu
    }
    
    saveGame() {
        console.log('Save game');
        // In a full game, this would save the game state
    }
    
    closeMenu() {
        this.game.stateManager.pop();
    }
}
