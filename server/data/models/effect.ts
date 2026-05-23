import mongoose from "mongoose";

/**
 * Effect Schema - Represents an effect that can be applied to items, characters, or other entities
 * 
 * Effects are instances of handlers from the registry combined with specific parameters
 */

const effectSchema = new mongoose.Schema({
  // Unique identifier for this effect instance
  id: { type: String, required: true, unique: true },
  
  // Reference to the handler type (must exist in registry)
  handlerType: { type: String, required: true, index: true },
  
  // Display information
  name: { type: String, required: true },
  description: { type: String, default: "" },
  
  // Effect lifecycle
  duration: { type: Number, default: -1 }, // -1 = permanent, 0+ = turns remaining
  
  // Stacking behavior
  stacks: { type: Number, default: 1, min: 1 },
  maxStacks: { type: Number, default: Infinity },
  stackable: { type: Boolean, default: true },
  
  // Handler-specific parameters (varies by effect type)
  // Stored as Mixed type since different handlers have different parameter schemas
  parameters: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Metadata
  source: { type: String, default: null }, // Item ID or Character ID that applied this
  appliedAt: { type: Date, default: Date.now },
  
  // Mod/Version tracking
  modId: { type: String, required: true }, // Which mod this effect belongs to
  version: { type: Number, default: 1 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for common queries
effectSchema.index({ handlerType: 1, modId: 1 });
effectSchema.index({ source: 1 });

mongoose.model('Effect', effectSchema);
export default mongoose.model('Effect');
