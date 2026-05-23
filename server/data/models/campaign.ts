import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  dm: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

mongoose.model('Campaign', campaignSchema);
export default mongoose.model('Campaign');