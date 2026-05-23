import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  type: { type: String, enum: ["weapon", "armor", "accessory", "consumable", "quest", "misc"], required: true },
  rarity: { type: String, enum: ["common", "uncommon", "rare", "veryRare", "legendary", "artifact"], default: "common" },
  weight: { type: Number, default: 0 },

  // D&D Combat Stats
  damage: {
    dice: { type: String, default: null }, // "1d8", "2d6+2", etc
    damageType: { type: String, enum: ["bludgeoning", "piercing", "slashing", "fire", "cold", "lightning", "poison", "acid", "psychic", "radiant", "necrotic", "force"], default: null }
  },
  armor: {
    acBonus: { type: Number, default: null },
    baseAc: { type: Number, default: null } // For items that set AC instead of bonus
  },
  magicBonus: { type: Number, default: 0 }, // +1, +2, +3 enchantments
  
  // Effects - Array of effect references with handler types and parameters
  effects: [
    {
      id: { type: String, required: true }, // Unique within this item
      handlerType: { type: String, required: true }, // Must exist in effect registry
      name: { type: String, required: true },
      description: { type: String, default: "" },
      
      // Handler-specific parameters
      parameters: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      },
      
      // Effect conditions
      conditions: {
        requiresAttunement: { type: Boolean, default: false },
        requiresEquipped: { type: Boolean, default: false },
        activationType: { type: String, enum: ["passive", "action", "bonus_action", "reaction", "onHit", "onEquip"], default: "passive" }
      }
    }
  ],
  
  // Mechanics
  equippable: { type: Boolean, default: false },
  requiresAttunement: { type: Boolean, default: false },
  attunementRequirements: { type: String, default: "" }, // "by a spellcaster", etc
  isCursed: { type: Boolean, default: false },
  cursedEffect: { type: String, default: "" }, // Description of curse
  
  // Inventory
  stackable: { type: Boolean, default: true },
  maxStackSize: { type: Number, default: 64 },
  
  // Economy
  value: { type: Number, default: 0 }, // Gold value
  
  // Mod/Version Tracking
  modId: { type: String, required: true }, // Which mod this item belongs to
  version: { type: Number, default: 1 },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for common queries
itemSchema.index({ modId: 1 });
itemSchema.index({ type: 1 });
itemSchema.index({ rarity: 1 });

mongoose.model('Item', itemSchema);
export default mongoose.model('Item');
