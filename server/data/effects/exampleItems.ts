/**
 * EXAMPLE: Item with Effects
 * 
 * This demonstrates how to create items with effects using the handler registry system
 */

// Example 1: Simple Weapon (Longsword)
export const longsword = {
  id: "longsword",
  name: "Longsword",
  description: "A well-crafted longsword",
  type: "weapon",
  rarity: "common",
  damage: {
    dice: "1d8",
    damageType: "slashing"
  },
  equippable: true,
  value: 15,
  effects: [], // No special effects
  modId: "base",
  version: 1
};

// Example 2: Magic Item - Ring of Fire Resistance
export const ringOfFireResistance = {
  id: "ringOfFireResistance",
  name: "Ring of Fire Resistance",
  description: "A golden ring that grants resistance to fire",
  type: "accessory",
  rarity: "rare",
  equippable: true,
  requiresAttunement: true,
  attunementRequirements: "",
  value: 2500,
  effects: [
    {
      id: "fireResist",
      handlerType: "damageResistance",
      name: "Fire Resistance",
      description: "You have resistance to fire damage",
      parameters: {
        damageType: "fire",
        percent: 50
      },
      conditions: {
        requiresAttunement: true,
        requiresEquipped: true,
        activationType: "passive"
      }
    }
  ],
  modId: "base",
  version: 1
};

// Example 3: Magic Item - Flaming Greatsword
export const flamingGreatsword = {
  id: "flamingGreatsword",
  name: "Flaming Greatsword +1",
  description: "A greatsword wreathed in magical flames",
  type: "weapon",
  rarity: "rare",
  damage: {
    dice: "2d6",
    damageType: "slashing"
  },
  magicBonus: 1,
  equippable: true,
  value: 5000,
  effects: [
    {
      id: "magicalEnhancement",
      handlerType: "damageBonus",
      name: "Magical Enhancement",
      description: "+1 to damage rolls (included in damage dice above)",
      parameters: {
        amount: 1,
        damageType: "all"
      },
      conditions: {
        requiresEquipped: true,
        activationType: "passive"
      }
    },
    {
      id: "flameDamage",
      handlerType: "damageBonus",
      name: "Flaming",
      description: "Deals an additional 1d6 fire damage on hit",
      parameters: {
        amount: 4, // Average of 1d6
        damageType: "fire"
      },
      conditions: {
        requiresEquipped: true,
        activationType: "onHit"
      }
    }
  ],
  modId: "base",
  version: 1
};

// Example 4: Utility Item - Boots of Speed
export const bootsOfSpeed = {
  id: "bootsOfSpeed",
  name: "Boots of Speed",
  description: "Magical boots that increase movement speed",
  type: "accessory",
  rarity: "uncommon",
  equippable: true,
  requiresAttunement: false,
  value: 1500,
  effects: [
    {
      id: "speedIncrease",
      handlerType: "speedBonus",
      name: "Speed Enhancement",
      description: "Increases movement speed by 30 feet",
      parameters: {
        amount: 30,
        type: "walk"
      },
      conditions: {
        requiresEquipped: true,
        activationType: "passive"
      }
    }
  ],
  modId: "base",
  version: 1
};

// Example 5: Armor - Plate Armor +1
export const plateArmorPlus1 = {
  id: "plateArmorPlus1",
  name: "Plate Armor +1",
  description: "Magical full plate armor",
  type: "armor",
  rarity: "rare",
  armor: {
    baseAc: 19, // Plate is normally 18 AC
    acBonus: 1  // +1 from magic
  },
  equippable: true,
  requiresAttunement: false,
  value: 3000,
  effects: [
    {
      id: "armorEnhancement",
      handlerType: "acBonus",
      name: "Magical Reinforcement",
      description: "Armor is magically reinforced (+1 AC)",
      parameters: {
        amount: 1
      },
      conditions: {
        requiresEquipped: true,
        activationType: "passive"
      }
    }
  ],
  modId: "base",
  version: 1
};

// Example 6: Potion - Potion of Strength
export const potionOfStrength = {
  id: "potionOfStrength",
  name: "Potion of Strength",
  description: "A bubbling red potion that grants incredible strength",
  type: "consumable",
  rarity: "uncommon",
  stackable: true,
  maxStackSize: 10,
  value: 250,
  effects: [
    {
      id: "strengthBoost",
      handlerType: "abilityBonus",
      name: "Strength Enhancement",
      description: "Increases Strength by 4 for 1 hour",
      parameters: {
        ability: "STR",
        amount: 4
      },
      conditions: {
        requiresEquipped: false,
        activationType: "action"
      }
    }
  ],
  modId: "base",
  version: 1
};

// Example 7: Cursed Item - Cursed Amulet
export const cursedAmulet = {
  id: "cursedAmulet",
  name: "Amulet of Misfortune (Cursed)",
  description: "This amulet grants disadvantage to all rolls",
  type: "accessory",
  rarity: "rare",
  equippable: true,
  requiresAttunement: false,
  isCursed: true,
  cursedEffect: "Wearer has disadvantage on all attack rolls, ability checks, and saving throws",
  value: 0,
  effects: [
    {
      id: "curse",
      handlerType: "disadvantage",
      name: "Curse of Misfortune",
      description: "You have disadvantage on all rolls",
      parameters: {
        checkType: "all"
      },
      conditions: {
        requiresEquipped: true,
        activationType: "passive"
      }
    }
  ],
  modId: "base",
  version: 1
};

// Example 8: Legendary Item - Staff of the Magi
export const staffOfTheMagi = {
  id: "staffOfTheMagi",
  name: "Staff of the Magi",
  description: "A legendary magical staff",
  type: "weapon",
  rarity: "legendary",
  damage: {
    dice: "1d6",
    damageType: "force"
  },
  magicBonus: 2,
  equippable: true,
  requiresAttunement: true,
  attunementRequirements: "by a wizard",
  value: 50000,
  effects: [
    {
      id: "magicalBonus",
      handlerType: "damageBonus",
      name: "Magical Enhancement",
      description: "+2 to spell attack rolls and spell save DCs",
      parameters: {
        amount: 2,
        damageType: "all"
      },
      conditions: {
        requiresAttunement: true,
        requiresEquipped: true,
        activationType: "passive"
      }
    },
    {
      id: "armorBonus",
      handlerType: "acBonus",
      name: "Arcane Shield",
      description: "+2 to AC and saving throws",
      parameters: {
        amount: 2
      },
      conditions: {
        requiresAttunement: true,
        requiresEquipped: true,
        activationType: "passive"
      }
    },
    {
      id: "spellPower",
      handlerType: "abilityBonus",
      name: "Enhanced Spellcasting",
      description: "+1 to Intelligence for spell checks",
      parameters: {
        ability: "INT",
        amount: 1
      },
      conditions: {
        requiresAttunement: true,
        requiresEquipped: true,
        activationType: "passive"
      }
    }
  ],
  modId: "base",
  version: 1
};

export const baseItems = [
  longsword,
  ringOfFireResistance,
  flamingGreatsword,
  bootsOfSpeed,
  plateArmorPlus1,
  potionOfStrength,
  cursedAmulet,
  staffOfTheMagi
];

export default baseItems;
