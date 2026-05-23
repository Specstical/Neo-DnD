import mongoose from "mongoose";

const characterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, default: 1 },
  class: { type: String, required: true },
  race: { type: String, required: true },
  experience: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  inventory: {
    gold: { type: Number, default: 0 },
    items: [
      {
        id: { type: String, required: true, unique: true },
        baseItem: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
        name: { type: String, required: true },
        isModified: { type: Boolean, default: false },
        quantity: { type: Number, default: 1 },
        durability: { type: Number, default: null },

        modificationCount: { type: Number, default: 0 },
        modificationHistory: [
          {
            date: { type: Date, default: Date.now },
            type: { type: String, required: true },
            description: { type: String, required: true },
            changes: { type: Object, default: {} },
          }
        ],
        modificationDetails: {
          addedProperties: { type: Array, default: [] },
          removedProperties: { type: Array, default: [] },
          modifiedProperties: { type: Array, default: [] },
        },
        lastModified: { type: Date, default: null },
        lore: { type: String, default: "" },
      },
    ]
  },
  
  // Active effects applied to character
  activeEffects: [
    {
      id: { type: String, required: true },
      handlerType: { type: String, required: true },
      name: { type: String, required: true },
      duration: { type: Number, default: -1 },
      stacks: { type: Number, default: 1 },
      maxStacks: { type: Number, default: Infinity },
      stackable: { type: Boolean, default: true },
      parameters: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      },
      source: { type: String, default: null },
      appliedAt: { type: Date, default: Date.now }
    }
  ],
  
  updatedAt: { type: Date, default: Date.now }
});

mongoose.model('Character', characterSchema);
export default mongoose.model('Character');