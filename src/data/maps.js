/**
 * Map data for the game
 */
const MAPS = {
    town: {
        name: 'Small Town',
        width: 20,
        height: 15,
        tileSize: 32,
        tileset: 'tileset',
        solidTiles: [3, 4, 5, 8, 9, 10, 15],
        tiles: [
            3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
            3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
            3, 1, 7, 7, 7, 7, 7, 7, 7, 1, 1, 1, 1, 1, 1, 7, 7, 7, 1, 3,
            3, 1, 7, 7, 7, 7, 7, 7, 7, 1, 1, 1, 1, 1, 1, 7, 7, 7, 1, 3,
            3, 1, 7, 7, 3, 3, 3, 7, 7, 1, 1, 1, 1, 1, 1, 7, 7, 7, 1, 3,
            3, 1, 7, 7, 3, 7, 3, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 3,
            3, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 3,
            3, 1, 7, 7, 3, 3, 3, 7, 3, 3, 3, 3, 7, 3, 3, 3, 7, 7, 1, 3,
            3, 1, 7, 7, 3, 3, 3, 7, 3, 3, 3, 3, 7, 3, 3, 3, 7, 7, 1, 3,
            3, 1, 7, 7, 3, 3, 3, 7, 3, 3, 3, 3, 7, 3, 3, 3, 7, 7, 1, 3,
            3, 1, 7, 7, 3, 3, 3, 7, 3, 3, 3, 3, 7, 3, 3, 3, 7, 7, 1, 3,
            3, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 3,
            3, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 3,
            3, 1, 1, 1, 1, 1, 1, 1, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 3,
            3, 3, 3, 3, 3, 3, 3, 3, 3, 14, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3
        ],
        startPosition: { x: 10, y: 5 },
        npcs: [
            {
                name: "Village Elder",
                x: 16,
                y: 3,
                direction: "down",
                spritesheet: "npc1",
                dialog: [
                    "Welcome to our small village, traveler!",
                    "We haven't had visitors in quite some time.",
                    "Feel free to explore and talk to the villagers.",
                    "If you're looking for adventure, I suggest heading south to the forest."
                ]
            },
            {
                name: "Shopkeeper",
                x: 5,
                y: 5,
                direction: "down",
                spritesheet: "npc2",
                dialog: [
                    "Hello there! I run the local shop.",
                    "I'd show you my wares, but this is just a demo.",
                    "In a full game, I'd have all sorts of useful items for your journey!"
                ]
            }
        ],
        // Portal to another map
        portals: [
            {
                x: 9,
                y: 14,
                targetMap: "forest",
                targetX: 9,
                targetY: 1
            }
        ]
    },
      forest: {
        name: 'Mysterious Forest',
        width: 20,
        height: 15,
        tileSize: 32,
        tileset: 'tileset',
        solidTiles: [3, 4, 5, 8, 9, 10, 15, 14],
        tiles: [
            3, 3, 3, 3, 3, 3, 3, 3, 3, 14, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
            3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 15, 15, 15, 15, 3,
            3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 15, 4, 4, 15, 3,
            3, 2, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 15, 4, 4, 15, 3,
            3, 2, 1, 2, 2, 15, 15, 2, 2, 1, 1, 2, 1, 1, 2, 15, 15, 15, 15, 3,
            3, 2, 1, 2, 15, 15, 15, 15, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 3,
            3, 2, 1, 2, 15, 15, 15, 15, 15, 15, 15, 15, 2, 1, 1, 1, 1, 1, 2, 3,
            3, 2, 1, 2, 2, 15, 15, 15, 15, 15, 15, 2, 2, 2, 2, 2, 2, 1, 2, 3,
            3, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 12, 12, 12, 12, 2, 1, 2, 3,
            3, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 12, 12, 12, 2, 1, 2, 3,
            3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 12, 12, 12, 12, 2, 1, 2, 3,
            3, 2, 2, 5, 5, 5, 5, 5, 5, 2, 1, 1, 2, 2, 2, 2, 2, 1, 2, 3,
            3, 2, 5, 5, 5, 5, 5, 5, 5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3,
            3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3,
            3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3
        ],
        startPosition: { x: 9, y: 1 },
        monsterZones: [
            {
                // Area with flowers (tile 12) has monster encounters
                tiles: [12],
                monsters: ["Slime", "ForestSprite"],
                encounterRate: 0.2 // 20% chance per step on these tiles
            }
        ],        // Portal back to town
        portals: [
            {
                x: 9,
                y: 1,
                targetMap: "town",
                targetX: 9,
                targetY: 13
            }
        ]
    }
};
