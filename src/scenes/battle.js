/**
 * Battle scene for turn-based combat
 */
class BattleScene extends Scene {    constructor(game) {
        super(game);
          this.enemies = [];
        this.playerTurn = true;
        this.selectedAction = 0;
        this.selectedTarget = 0;        this.battleActions = ['Attack', 'Magic', 'Run'];
        this.battleState = 'action'; // 'action', 'target', 'message', 'result', 'victory'
        this.battleMessage = '';
        this.messageTimer = 0;
        this.inputCooldown = 0; // Add input cooldown to prevent too fast scrolling
        
        // Stats for the demo player
        this.playerStats = {
            hp: 100,
            maxHp: 100,
            mp: 50,
            maxMp: 50,
            attack: 15,
            defense: 10,
            magic: 12
        };
    }
    
    /**
     * Start a battle with the given enemies
     */
    startBattle(enemies) {
        this.enemies = enemies || [
            {
                name: 'Slime',
                hp: 30,
                maxHp: 30,
                attack: 8,
                defense: 5,
                exp: 10,
                sprite: 'enemy_slime'
            }
        ];
        
        this.playerTurn = true;
        this.selectedAction = 0;
        this.selectedTarget = 0;
        this.battleState = 'action';
        this.battleMessage = 'A monster appears!';
        
        console.log('Battle started!');
    }
    
    /**
     * Update battle logic
     */    update(deltaTime) {
        const input = this.game.input;
        
        // Update input cooldown
        if (this.inputCooldown > 0) {
            this.inputCooldown -= deltaTime;
            // Return early if input is still on cooldown
            if (this.inputCooldown > 0) {
                return;
            }
        }
          // Handle message display timer
        if (this.battleState === 'message') {
            this.messageTimer -= deltaTime;
            if (this.messageTimer <= 0 || input.isActionPressed()) {
                // After message, proceed to next state
                if (this.playerTurn) {
                    this.battleState = 'action';
                } else {
                    this.processEnemyTurn();
                }
            }
            return;
        }
          // Handle victory state
        if (this.battleState === 'victory') {
            // In victory state, only allow action button to close the battle
            if (input.isActionPressed() && this.inputCooldown <= 0) {
                // End battle immediately without delay
                this.game.stateManager.pop();
                return;
            }
            return; // Block all other inputs in victory state
        }// Handle player input for battle actions
        if (this.playerTurn) {            if (this.battleState === 'action') {
                // Navigate actions list with input checks
                if (input.isUpPressed() && this.inputCooldown <= 0) {
                    this.selectedAction = (this.selectedAction - 1 + this.battleActions.length) % this.battleActions.length;
                    this.inputCooldown = 0.2; // Add cooldown after changing selection
                } else if (input.isDownPressed() && this.inputCooldown <= 0) {
                    this.selectedAction = (this.selectedAction + 1) % this.battleActions.length;
                    this.inputCooldown = 0.2; // Add cooldown after changing selection
                }
                  // Select action with pressed check (not just-pressed)
                if (input.isActionPressed() && this.inputCooldown <= 0) {
                    if (this.selectedAction === 2) { // Run (index 2 in the battleActions array)
                        this.tryToRun();
                        this.inputCooldown = 0.5; // Longer cooldown for action execution
                    } else if (this.enemies.length > 0) {
                        this.battleState = 'target';
                        this.selectedTarget = 0;
                        this.inputCooldown = 0.3; // Cooldown after state change
                    }
                }
            } else if (this.battleState === 'target') {                // Navigate target list with input checks
                if ((input.isLeftPressed() || input.isRightPressed()) && this.inputCooldown <= 0) {
                    this.selectedTarget = (this.selectedTarget + 1) % this.enemies.length;
                    this.inputCooldown = 0.2; // Add cooldown after changing selection
                }
                
                // Select target with pressed check
                if (input.isActionPressed() && this.inputCooldown <= 0) {
                    this.processPlayerAction();
                    this.inputCooldown = 0.5; // Longer cooldown for action execution
                }
                  // Cancel target selection
                if (input.isCancelPressed() && this.inputCooldown <= 0) {
                    this.battleState = 'action';
                    this.inputCooldown = 0.3; // Cooldown after state change
                }
            }
        }
        
        // Check for battle end
        this.checkBattleEnd();
    }
      /**
     * Process player's action
     */
    processPlayerAction() {
        const action = this.battleActions[this.selectedAction];
        const target = this.enemies[this.selectedTarget];
        
        if (action === 'Attack') {
            // Calculate damage based on player attack and enemy defense
            const baseDamage = this.playerStats.attack;
            const defense = target.defense;
            const damage = Math.max(1, Math.floor(baseDamage * (1 - defense / 50)));
            
            // Apply damage to the enemy
            target.hp = Math.max(0, target.hp - damage);
            
            // Set battle message
            this.battleMessage = `You attack the ${target.name} for ${damage} damage!`;
            
            // Check for enemy defeat
            if (target.hp <= 0) {
                this.battleMessage += `\nThe ${target.name} was defeated!`;
                this.enemies.splice(this.selectedTarget, 1);
                
                // Check if all enemies are defeated
                if (this.enemies.length === 0) {
                    this.battleState = 'victory';
                    this.battleMessage += '\nYou won the battle!';
                    this.inputCooldown = 0.5; // Add cooldown to prevent immediate ending
                    return; // Return immediately to prevent further processing
                }
            }
        } else if (action === 'Magic') {
            // Simple fire spell for demo
            if (this.playerStats.mp >= 10) {
                const baseDamage = this.playerStats.magic * 1.5;
                const defense = target.defense * 0.7; // Magic is more effective against defense
                const damage = Math.max(1, Math.floor(baseDamage * (1 - defense / 50)));
                
                // Apply damage and reduce MP
                target.hp = Math.max(0, target.hp - damage);
                this.playerStats.mp -= 10;
                
                // Set battle message
                this.battleMessage = `You cast Fire on the ${target.name} for ${damage} damage!`;
                
                // Check for enemy defeat
                if (target.hp <= 0) {
                    this.battleMessage += `\nThe ${target.name} was defeated!`;
                    this.enemies.splice(this.selectedTarget, 1);
                    
                    // Check if all enemies are defeated
                    if (this.enemies.length === 0) {
                        this.battleState = 'victory';
                        this.battleMessage += '\nYou won the battle!';
                        this.inputCooldown = 0.5; // Add cooldown to prevent immediate ending
                        return; // Return immediately to prevent further processing
                    }
                }
            } else {
                this.battleMessage = 'Not enough MP!';
            }
        }
        
        // Set message state and timer
        this.battleState = 'message';
        this.messageTimer = 2; // Show message for 2 seconds
        
        // After player turn, it's enemy turn
        this.playerTurn = false;
    }
    
    /**
     * Process enemy turn
     */
    processEnemyTurn() {
        if (this.enemies.length === 0) {
            return;
        }
        
        // Each enemy attacks the player
        let totalDamage = 0;
        let attackingEnemies = [];
        
        for (const enemy of this.enemies) {
            // Calculate damage based on enemy attack and player defense
            const baseDamage = enemy.attack;
            const defense = this.playerStats.defense;
            const damage = Math.max(1, Math.floor(baseDamage * (1 - defense / 50)));
            
            // Apply damage to the player
            this.playerStats.hp = Math.max(0, this.playerStats.hp - damage);
            totalDamage += damage;
            attackingEnemies.push(enemy.name);
        }
        
        // Set battle message
        if (this.enemies.length === 1) {
            this.battleMessage = `The ${this.enemies[0].name} attacks you for ${totalDamage} damage!`;
        } else {
            const enemyNames = attackingEnemies.join(' and ');
            this.battleMessage = `The ${enemyNames} attack you for ${totalDamage} damage!`;
        }
        
        // Check if player is defeated
        if (this.playerStats.hp <= 0) {
            this.battleMessage += '\nYou were defeated!';
            this.endBattle(false);
            return;
        }
        
        // Set message state and timer
        this.battleState = 'message';
        this.messageTimer = 2; // Show message for 2 seconds
        
        // After enemy turn, it's player turn
        this.playerTurn = true;
    }
    
    /**
     * Try to run from battle
     */
    tryToRun() {
        // 50% chance to run successfully
        if (Math.random() < 0.5) {
            this.battleMessage = 'You successfully escaped!';
            this.endBattle(true);
        } else {
            this.battleMessage = 'Failed to escape!';
            this.battleState = 'message';
            this.messageTimer = 1.5;
            this.playerTurn = false;
        }
    }
      /**
     * End the battle
     */
    endBattle(success) {
        // Set a flag to prevent multiple state pops
        if (this.isEnding) return;
        this.isEnding = true;
        
        setTimeout(() => {
            // Return to world scene
            this.game.stateManager.pop();
        }, 1500);
    }
      /**
     * Check if the battle has ended
     */
    checkBattleEnd() {
        // Check for player defeat
        if (this.playerStats.hp <= 0) {
            this.battleMessage = "You were defeated...";
            this.messageTimer = 2;
            this.battleState = 'message';
            
            // In a full game, this would trigger a game over screen
            this.playerStats.hp = this.playerStats.maxHp / 2; // Revive with half HP
            
            // End the battle after showing the message
            setTimeout(() => {
                this.endBattle(false);
            }, 2000);
            
            return true;
        }
          // Check for enemy defeat
        if (this.enemies.every(enemy => enemy.hp <= 0)) {
            this.battleMessage = "Victory!";
            this.battleState = 'victory';
            this.inputCooldown = 0.5;
            
            return true;
        }
        
        return false;
    }
      /**
     * Render battle scene
     */
    render(renderer) {
        // Draw forest battle background
        if (renderer.images['battle_forest']) {
            // Draw the forest background image
            renderer.drawImage('battle_forest', 0, 0, this.game.width, this.game.height);
            
            // Add an animated light effect for atmosphere
            const time = Date.now() / 3000;
            const glowOpacity = 0.08 + Math.sin(time) * 0.05;
            renderer.ctx.fillStyle = `rgba(30, 70, 30, ${glowOpacity})`;
            renderer.ctx.fillRect(0, 0, this.game.width, this.game.height);
        } else {
            // Fallback to original color if background not loaded
            renderer.fillRect(0, 0, this.game.width, this.game.height, '#224466');
        }
        
        // Draw enemies
        const enemyWidth = 80;
        const enemyHeight = 80;
        const enemySpacing = 100;
        const enemyY = 150;
        const enemyStartX = (this.game.width - (this.enemies.length * enemySpacing - 20)) / 2;
        
        for (let i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i];
            const enemyX = enemyStartX + i * enemySpacing;
              // Draw actual enemy sprite
            if (enemy.sprite && renderer.images[enemy.sprite]) {
                // Create a bounce effect for slimes
                let offsetY = 0;
                if (enemy.name === 'Slime') {
                    offsetY = Math.sin(Date.now() / 200) * 4;
                }
                
                // Create a float effect for sprites
                if (enemy.name === 'Forest Sprite') {
                    offsetY = Math.sin(Date.now() / 300) * 3;
                }
                
                // Draw the sprite
                renderer.drawImage(enemy.sprite, enemyX, enemyY + offsetY, enemyWidth, enemyHeight);
            } else {
                // Fallback to placeholder if sprite not found
                renderer.fillRect(enemyX, enemyY, enemyWidth, enemyHeight, '#6666AA');
                renderer.strokeRect(enemyX, enemyY, enemyWidth, enemyHeight, '#000');
            }
            
            // Draw enemy name
            renderer.drawText(enemy.name, enemyX + enemyWidth / 2, enemyY - 20, {
                color: '#fff',
                font: '16px Arial',
                align: 'center'
            });
            
            // Draw enemy HP bar
            const hpBarWidth = enemyWidth;
            const hpBarHeight = 10;
            const hpBarX = enemyX;
            const hpBarY = enemyY + enemyHeight + 10;
            
            // Background
            renderer.fillRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight, '#000');
            
            // HP fill
            const hpFillWidth = (enemy.hp / enemy.maxHp) * hpBarWidth;
            renderer.fillRect(hpBarX, hpBarY, hpFillWidth, hpBarHeight, '#ff0000');
            
            // Selection indicator
            if (this.battleState === 'target' && i === this.selectedTarget) {
                renderer.strokeRect(enemyX - 5, enemyY - 5, enemyWidth + 10, enemyHeight + 30, '#ffff00', 2);
            }
        }
        
        // Draw player stats
        const playerStatsX = 20;
        const playerStatsY = this.game.height - 100;
        
        // HP bar
        renderer.drawText('HP', playerStatsX, playerStatsY, { color: '#fff' });
        renderer.fillRect(playerStatsX + 40, playerStatsY, 150, 15, '#000');
        renderer.fillRect(
            playerStatsX + 40,
            playerStatsY,
            (this.playerStats.hp / this.playerStats.maxHp) * 150,
            15,
            '#ff0000'
        );
        renderer.drawText(
            `${this.playerStats.hp}/${this.playerStats.maxHp}`,
            playerStatsX + 200,
            playerStatsY + 2,
            { color: '#fff' }
        );
        
        // MP bar
        renderer.drawText('MP', playerStatsX, playerStatsY + 25, { color: '#fff' });
        renderer.fillRect(playerStatsX + 40, playerStatsY + 25, 150, 15, '#000');
        renderer.fillRect(
            playerStatsX + 40,
            playerStatsY + 25,
            (this.playerStats.mp / this.playerStats.maxMp) * 150,
            15,
            '#0000ff'
        );
        renderer.drawText(
            `${this.playerStats.mp}/${this.playerStats.maxMp}`,
            playerStatsX + 200,
            playerStatsY + 27,
            { color: '#fff' }
        );
          // Draw battle actions menu
        if (this.battleState === 'action') {
            const actionMenuX = this.game.width - 150;
            const actionMenuY = this.game.height - 150;
            
            // Draw menu background
            renderer.fillRect(actionMenuX, actionMenuY, 130, 130, 'rgba(0, 0, 0, 0.7)');
            renderer.strokeRect(actionMenuX, actionMenuY, 130, 130, '#fff');
            
            // Draw menu title
            renderer.drawText(
                'Actions',
                actionMenuX + 65,
                actionMenuY + 10,
                { color: '#ffffff', font: 'bold 16px Arial', align: 'center' }
            );
            
            // Draw menu divider
            renderer.fillRect(actionMenuX + 10, actionMenuY + 25, 110, 1, '#fff');
            
            // Draw action options
            for (let i = 0; i < this.battleActions.length; i++) {
                const action = this.battleActions[i];
                const isSelected = i === this.selectedAction;
                const itemY = actionMenuY + 35 + i * 30;
                
                // Draw selection highlight
                if (isSelected) {
                    renderer.fillRect(actionMenuX + 5, itemY - 5, 120, 25, 'rgba(255, 255, 255, 0.3)');
                }
                
                // Draw action text
                renderer.drawText(
                    action,
                    actionMenuX + 15,
                    itemY + 8,
                    { color: isSelected ? '#ffff00' : '#fff', font: isSelected ? 'bold 16px Arial' : '16px Arial' }
                );
            }
        }
        
        // Draw battle message
        if (this.battleMessage) {
            const messageX = this.game.width / 2;
            const messageY = this.game.height - 50;
            
            renderer.drawText(
                this.battleMessage,
                messageX,
                messageY,
                { color: '#fff', font: '18px Arial', align: 'center' }
            );
        }
    }
}
