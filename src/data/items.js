/**
 * Item data for the game
 */
const ITEMS = {
    // Weapons
    "Bronze Sword": {
        type: "weapon",
        description: "A basic sword made of bronze.",
        attack: 5,
        value: 100
    },
    "Iron Sword": {
        type: "weapon",
        description: "A stronger sword made of iron.",
        attack: 10,
        value: 300
    },
    
    // Armor
    "Leather Armor": {
        type: "armor",
        description: "Basic armor made of leather.",
        defense: 3,
        value: 80
    },
    "Chain Mail": {
        type: "armor",
        description: "Stronger armor made of linked metal rings.",
        defense: 8,
        value: 250
    },
    
    // Consumables
    "Potion": {
        type: "consumable",
        description: "Restores 50 HP.",
        effect: { hp: 50 },
        value: 30
    },
    "Ether": {
        type: "consumable",
        description: "Restores 25 MP.",
        effect: { mp: 25 },
        value: 50
    }
};
