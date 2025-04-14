/**
 * Dialog scene for character conversations
 */
class DialogScene extends Scene {
    constructor(game) {
        super(game);
        
        this.dialog = [];
        this.currentLine = 0;
        this.speakerName = '';
        this.isTyping = false;
        this.textProgress = 0;
        this.typeSpeed = 30; // Characters per second
        this.inputCooldown = 0; // Cooldown timer for input
        this.advanceDelay = 0.5; // Delay in seconds between dialog advances
    }
    
    /**
     * Set dialog to be displayed
     */
    setDialog(dialog, speakerName = '') {
        this.dialog = dialog;
        this.speakerName = speakerName;
        this.currentLine = 0;
        this.textProgress = 0;
        this.isTyping = true;
    }    /**
     * Update dialog logic
     */
    update(deltaTime) {
        // Update input cooldown timer
        if (this.inputCooldown > 0) {
            this.inputCooldown -= deltaTime;
        }        // If no dialog or all lines have been shown, return to previous state
        if (!this.dialog || this.dialog.length === 0 || this.currentLine >= this.dialog.length) {
            // Set a longer cooldown in the world scene to prevent immediate dialog restart
            if (this.game.scenes.world) {
                this.game.scenes.world.dialogCooldown = 2.0; // 2 second cooldown
                
                // Turn the player around to face away from the NPC when dialog ends
                if (this.game.scenes.world.player) {
                    const player = this.game.scenes.world.player;
                    
                    // Reverse player direction
                    switch (player.direction) {
                        case 'up': 
                            player.direction = 'down'; 
                            break;
                        case 'down': 
                            player.direction = 'up'; 
                            break;
                        case 'left': 
                            player.direction = 'right'; 
                            break;
                        case 'right': 
                            player.direction = 'left'; 
                            break;
                    }
                }
            }
              // Return to the world scene
            this.game.stateManager.pop();
            return;
        }
        
        // Handle text typing effect
        if (this.isTyping) {
            const currentLineText = this.dialog[this.currentLine];
            this.textProgress += deltaTime * this.typeSpeed;
            
            if (this.textProgress >= currentLineText.length) {
                this.textProgress = currentLineText.length;
                this.isTyping = false;
                // Set cooldown after text finishes typing
                this.inputCooldown = 0.2;
            }
        }
        
        // Handle input for advancing dialog only if cooldown is finished
        if (this.game.input.isActionPressed() && this.inputCooldown <= 0) {
            if (this.isTyping) {
                // Complete the current line immediately
                this.textProgress = this.dialog[this.currentLine].length;
                this.isTyping = false;
                // Set a short cooldown after completing text
                this.inputCooldown = 0.2;
            } else {                // Check if we're at the last line
                if (this.currentLine >= this.dialog.length - 1) {
                    // This is the last line, so exit dialog
                    
                    // Set a longer cooldown in the world scene to prevent immediate dialog restart
                    if (this.game.scenes.world) {
                        this.game.scenes.world.dialogCooldown = 2.0; // 2 second cooldown
                        
                        // Turn the player around to face away from the NPC when dialog ends
                        if (this.game.scenes.world.player) {
                            const player = this.game.scenes.world.player;
                            
                            // Reverse player direction
                            switch (player.direction) {
                                case 'up': 
                                    player.direction = 'down'; 
                                    break;
                                case 'down': 
                                    player.direction = 'up'; 
                                    break;
                                case 'left': 
                                    player.direction = 'right'; 
                                    break;
                                case 'right': 
                                    player.direction = 'left'; 
                                    break;
                            }
                        }
                    }
                    
                    this.game.stateManager.pop();
                    
                    // Set cooldown to prevent immediate interaction
                    this.inputCooldown = this.advanceDelay;
                } else {
                    // Advance to the next line
                    this.currentLine++;
                    this.textProgress = 0;
                    this.isTyping = true;
                    
                    // Set cooldown to prevent immediate advancement
                    this.inputCooldown = this.advanceDelay;
                    
                    // Play a sound effect for dialog advance
                    if (this.game.audio.sounds['dialogAdvance']) {
                        this.game.audio.playSound('dialogAdvance', 0.5);
                    }
                }
            }
        }
    }
    
    /**
     * Render dialog
     */
    render(renderer) {
        // First, render the world scene in the background
        const worldScene = this.game.scenes.world;
        if (worldScene) {
            worldScene.render(renderer);
        }
        
        // Get the current line of dialog
        const currentLineText = this.dialog[this.currentLine] || '';
        const displayText = currentLineText.substring(0, Math.floor(this.textProgress));
        
        // Draw dialog box
        const boxWidth = this.game.width * 0.8;
        const boxHeight = 120;
        const boxX = (this.game.width - boxWidth) / 2;
        const boxY = this.game.height - boxHeight - 20;
        
        renderer.drawDialogBox(
            displayText,
            boxX,
            boxY,
            boxWidth,
            boxHeight,
            {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#fff',
                textColor: '#fff',
                font: '18px Arial'
            }
        );
        
        // Draw speaker name if provided
        if (this.speakerName) {
            const nameBoxWidth = renderer.ctx.measureText(this.speakerName).width + 20;
            const nameBoxHeight = 30;
            const nameBoxX = boxX + 10;
            const nameBoxY = boxY - nameBoxHeight + 10;
            
            // Draw name background
            renderer.fillRect(nameBoxX, nameBoxY, nameBoxWidth, nameBoxHeight, 'rgba(0, 0, 100, 0.8)');
            renderer.strokeRect(nameBoxX, nameBoxY, nameBoxWidth, nameBoxHeight, '#fff');
            
            // Draw name text
            renderer.drawText(this.speakerName, nameBoxX + 10, nameBoxY + 8, {
                color: '#fff',
                font: '16px Arial'
            });
        }
        
        // Draw continue indicator when text is fully displayed
        if (!this.isTyping) {
            const indicatorX = boxX + boxWidth - 30;
            const indicatorY = boxY + boxHeight - 30;
            
            // Animate the indicator with a bounce effect
            const bounceOffset = Math.sin(Date.now() / 200) * 3;
            
            renderer.drawText('▼', indicatorX, indicatorY + bounceOffset, {
                color: '#fff',
                font: '16px Arial'
            });
        }
    }
}
