import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  sessionID: { type: String, unique: true },
  passwordHash: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  online: { type: Boolean, default: false },
  lastOnline: { type: Date, default: Date.now },

  charaters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Character" }],
  campaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Campaign" }],
});

mongoose.model('User', userSchema);
export default mongoose.model('User');