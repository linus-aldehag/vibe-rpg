/**
 * State management system for the game
 */
class StateManager {
    constructor() {
        this.states = [];
    }
    
    /**
     * Get the current state
     */
    getCurrentState() {
        return this.states.length > 0 ? this.states[this.states.length - 1] : null;
    }
    
    /**
     * Push a new state onto the stack
     */
    push(state) {
        this.states.push(state);
        console.log(`State pushed: ${state}`);
        return state;
    }
    
    /**
     * Pop the current state off the stack
     */
    pop() {
        if (this.states.length === 0) {
            console.warn('Cannot pop state: state stack is empty');
            return null;
        }
        
        const state = this.states.pop();
        console.log(`State popped: ${state}`);
        return state;
    }
    
    /**
     * Replace the current state with a new one
     */
    replace(state) {
        if (this.states.length === 0) {
            return this.push(state);
        }
        
        const oldState = this.states.pop();
        this.states.push(state);
        console.log(`State replaced: ${oldState} -> ${state}`);
        return state;
    }
    
    /**
     * Clear all states
     */
    clear() {
        const oldStates = [...this.states];
        this.states = [];
        console.log('State stack cleared');
        return oldStates;
    }
}
