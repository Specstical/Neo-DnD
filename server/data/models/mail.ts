
import mongoose from "mongoose";

const mail = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    system: { type: Boolean, default: false }, // For system-generated messages
});


mongoose.model('Mail', mail);
export default mongoose.model('Mail'); 