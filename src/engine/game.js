/**
 * Main Game class that initializes and manages the game loop
 */
class Game {
    constructor(canvasId, width = 800, height = 600) {
        this.canvas = document.getElementById(canvasId);
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');
        
        // Game properties
        this.width = width;
        this.height = height;
        this.isRunning = false;
        this.lastTime = 0;
        this.accumulator = 0;
        this.timestep = 1000 / 60; // 60 FPS
        
        // Game systems
        this.renderer = new Renderer(this.ctx, width, height);
        this.input = new Input();
        this.audio = new AudioManager();
        this.stateManager = new StateManager();
        
        // Game scenes
        this.scenes = {
            world: null,
            battle: null,
            dialog: null,
            menu: null
        };
        
        // Bind methods
        this.gameLoop = this.gameLoop.bind(this);
    }
      /**
     * Initialize game systems and load initial assets
     */
    init() {
        console.log('Initializing game...');
        
        // Initialize input system
        this.input.init();
        
        // Create scenes
        this.scenes.world = new WorldScene(this);
        this.scenes.battle = new BattleScene(this);
        this.scenes.dialog = new DialogScene(this);
        this.scenes.menu = new MenuScene(this);
        
        // Initialize each scene
        this.scenes.world.init();
        this.scenes.battle.init();
        this.scenes.dialog.init();
        this.scenes.menu.init();
        
        // Set initial state
        this.stateManager.push('world');
        
        console.log('Game initialized successfully');
    }
    
    /**
     * Start the game loop
     */
    start() {
        if (!this.isRunning) {
            console.log('Starting game...');
            this.isRunning = true;
            this.lastTime = performance.now();
            requestAnimationFrame(this.gameLoop);
        }
    }
    
    /**
     * Stop the game loop
     */
    stop() {
        console.log('Stopping game...');
        this.isRunning = false;
    }
    
    /**
     * Main game loop
     */
    gameLoop(currentTime) {
        if (!this.isRunning) return;
        
        // Calculate delta time
        let deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Prevent spiral of death
        if (deltaTime > 1000) {
            deltaTime = this.timestep;
        }
        
        // Accumulate time
        this.accumulator += deltaTime;
        
        // Update game state in fixed timesteps
        while (this.accumulator >= this.timestep) {
            this.update(this.timestep / 1000);
            this.accumulator -= this.timestep;
        }
        
        // Render the game
        this.render();
        
        // Continue the loop
        requestAnimationFrame(this.gameLoop);
    }
      /**
     * Update game state
     */
    update(deltaTime) {
        // Update input state for this frame
        this.input.update();
        
        const currentState = this.stateManager.getCurrentState();
        if (currentState && this.scenes[currentState]) {
            this.scenes[currentState].update(deltaTime);
        }
    }
    
    /**
     * Render game state
     */
    render() {
        // Clear the canvas
        this.renderer.clear();
        
        // Render the current scene
        const currentState = this.stateManager.getCurrentState();
        if (currentState && this.scenes[currentState]) {
            this.scenes[currentState].render(this.renderer);
        }
    }
}
