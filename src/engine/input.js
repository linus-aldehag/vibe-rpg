/**
 * Input handler for keyboard and touch controls
 */
class Input {
    constructor() {
        this.keys = {};
        this.previousKeys = {};
        this.touches = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMouseDown = false;
        
        // Bind event handlers
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
    }
    
    /**
     * Initialize event listeners
     */
    init() {
        // Keyboard events
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        
        // Mouse events
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mousedown', this.onMouseDown);
        window.addEventListener('mouseup', this.onMouseUp);
        
        // Touch events for mobile
        window.addEventListener('touchstart', this.onTouchStart);
        window.addEventListener('touchmove', this.onTouchMove);
        window.addEventListener('touchend', this.onTouchEnd);
        
        console.log('Input system initialized');
    }
    
    /**
     * Clean up event listeners
     */
    destroy() {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mousedown', this.onMouseDown);
        window.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('touchstart', this.onTouchStart);
        window.removeEventListener('touchmove', this.onTouchMove);
        window.removeEventListener('touchend', this.onTouchEnd);
    }
    
    // Keyboard event handlers
    onKeyDown(e) {
        this.keys[e.code] = true;
    }
    
    onKeyUp(e) {
        this.keys[e.code] = false;
    }
    
    // Mouse event handlers
    onMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }
    
    onMouseDown(e) {
        this.isMouseDown = true;
    }
    
    onMouseUp(e) {
        this.isMouseDown = false;
    }
    
    // Touch event handlers for mobile
    onTouchStart(e) {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            this.touches[touch.identifier] = {
                x: touch.clientX,
                y: touch.clientY
            };
        }
    }
    
    onTouchMove(e) {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (this.touches[touch.identifier]) {
                this.touches[touch.identifier].x = touch.clientX;
                this.touches[touch.identifier].y = touch.clientY;
            }
        }
    }
    
    onTouchEnd(e) {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            delete this.touches[touch.identifier];
        }
    }    /**
     * Update input state for the current frame
     * Call this once per frame, at the start of the frame
     */
    update() {
        // Create a proper deep copy of the keys state
        this.previousKeys = {};
        for (const key in this.keys) {
            this.previousKeys[key] = this.keys[key];
        }
    }
    
    /**
     * Check if a key was just pressed this frame
     * This will only return true once per key press
     */
    isKeyJustPressed(code) {
        return this.keys[code] === true && this.previousKeys[code] !== true;
    }
    
    /**
     * Check if a key is currently pressed
     */
    isKeyPressed(code) {
        return this.keys[code] === true;
    }
      /**
     * Utility methods for common JRPG controls
     */
    isUpPressed() {
        return this.isKeyPressed('ArrowUp') || this.isKeyPressed('KeyW');
    }
    
    isDownPressed() {
        return this.isKeyPressed('ArrowDown') || this.isKeyPressed('KeyS');
    }
    
    isLeftPressed() {
        return this.isKeyPressed('ArrowLeft') || this.isKeyPressed('KeyA');
    }
    
    isRightPressed() {
        return this.isKeyPressed('ArrowRight') || this.isKeyPressed('KeyD');
    }
    
    isActionPressed() {
        return this.isKeyPressed('Space') || this.isKeyPressed('Enter') || this.isKeyPressed('KeyZ');
    }
    
    isCancelPressed() {
        return this.isKeyPressed('Escape') || this.isKeyPressed('KeyX');
    }
    
    isMenuPressed() {
        return this.isKeyPressed('KeyM') || this.isKeyPressed('Tab');
    }
    
    // New methods for one-shot button presses
    isUpJustPressed() {
        return this.isKeyJustPressed('ArrowUp') || this.isKeyJustPressed('KeyW');
    }
    
    isDownJustPressed() {
        return this.isKeyJustPressed('ArrowDown') || this.isKeyJustPressed('KeyS');
    }
    
    isLeftJustPressed() {
        return this.isKeyJustPressed('ArrowLeft') || this.isKeyJustPressed('KeyA');
    }
    
    isRightJustPressed() {
        return this.isKeyJustPressed('ArrowRight') || this.isKeyJustPressed('KeyD');
    }
    
    isActionJustPressed() {
        return this.isKeyJustPressed('Space') || this.isKeyJustPressed('Enter') || this.isKeyJustPressed('KeyZ');
    }
    
    isCancelJustPressed() {
        return this.isKeyJustPressed('Escape') || this.isKeyJustPressed('KeyX');
    }
    
    isMenuJustPressed() {
        return this.isKeyJustPressed('KeyM') || this.isKeyJustPressed('Tab');
    }
}
