
import mongoose from "mongoose";

export const handler = async (data: { sessionID: string }) => {
    const { sessionID } = data;
    const User = mongoose.model("User");
    const user = await User.findOne({ sessionID });
    
    if (!user) {
        return { success: false, message: "Auto-login failed: Invalid session ID" };
    }
    user.online = true;
    user.lastOnline = new Date();
    await user.save();
    return { success: true, message: "Auto-login successful", userId: user._id };
}