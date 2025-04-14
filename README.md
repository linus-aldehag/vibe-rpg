# VibeRpg - A Simple JRPG-style Game

A lightweight JavaScript-based JRPG-style game engine that runs in the browser. This project demonstrates core JRPG mechanics including map exploration, NPC dialogue, menus, and turn-based battles.

## Getting Started

To run the game:

1. Open the `index.html` file in a modern web browser
2. The game will automatically start

No installation or build process is required as this is a pure HTML/JavaScript game.

## Game Controls

- **Arrow Keys** or **WASD**: Move the player character
- **Space/Enter/Z**: Interact with NPCs, confirm selections
- **Escape/X**: Cancel, back out of menus
- **M/Tab**: Open the game menu

## Features

- **Map Exploration**: Walk around the game world and interact with the environment
- **NPCs**: Talk to characters in the game world
- **Dialog System**: Animated text display with character portraits
- **Menu System**: Access game functions like inventory and status
- **Battle System**: Turn-based combat with enemies

## Project Structure

- **index.html**: Entry point that loads all game scripts
- **src/**: Contains all game source code
  - **main.js**: Main entry point and initialization
  - **engine/**: Core game engine components
    - **game.js**: Main game loop and scene management
    - **input.js**: Keyboard and touch input handling
    - **renderer.js**: Drawing and animation
    - **audio.js**: Sound effect and music playback
    - **state.js**: Game state management
  - **scenes/**: Different game screens and modes
    - **world.js**: Map exploration
    - **battle.js**: Combat system
    - **dialog.js**: Character conversations
    - **menu.js**: Game menus
  - **entities/**: Game objects like player and NPCs
  - **data/**: Game data (maps, items, etc.)
- **assets/**: Game assets (images, audio)
  - **images/**: Sprites, backgrounds, UI elements
  - **audio/**: Music and sound effects
  - **maps/**: Tilemap data files

## Extending the Game

To extend this basic JRPG framework:

1. Add real assets to replace the placeholders
2. Create more maps and expand the game world
3. Add more characters with unique dialog and quests
4. Implement a full inventory and equipment system
5. Create more enemies and a progression system

## License

This project is open source and available for personal and educational use.

## Acknowledgments

Created as a demonstration of JRPG game mechanics using JavaScript and HTML5 Canvas.
