/**
 * Base Scene class that all game scenes will extend
 */
class Scene {
    constructor(game) {
        this.game = game;
    }
    
    /**
     * Initialize the scene
     */
    init() {
        // Override in child classes
    }
    
    /**
     * Update scene logic
     */
    update(deltaTime) {
        // Override in child classes
    }
    
    /**
     * Render the scene
     */
    render(renderer) {
        // Override in child classes
    }
    
    /**
     * Handle scene entering
     */
    enter(prevScene) {
        console.log(`Entering scene: ${this.constructor.name}`);
    }
    
    /**
     * Handle scene exiting
     */
    exit(nextScene) {
        console.log(`Exiting scene: ${this.constructor.name}`);
    }
}
