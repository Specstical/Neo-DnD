import mongoose from "mongoose";

export const itemEffectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
    // Effect mechanics
    trigger: { type: String, enum: ["onEquip", "onUse", "passive", "onHit", "onDamage"], required: true },
    duration: { type: Number, default: 0 }, // Duration in rounds or seconds 0 for instant effects. -1 for permanent effects.
    cooldown: { type: Number, default: 0 }, // Cooldown in rounds or seconds
    effectType: { type: String, enum: ["buff", "debuff", "damage", "healing", "utility"], required: true },
    magnitude: { type: Number, default: 0 }, // Numerical value representing the strength of the effect



});

mongoose.model('ItemEffect', itemEffectSchema);
export default mongoose.model('ItemEffect');