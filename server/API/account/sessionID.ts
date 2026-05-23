import mongoose from "mongoose";


export const handler = async (data: { sessionID: string; userId: string }) => {
    const { sessionID, userId } = data;
    const User = mongoose.model("User");
    const user = await User.findById(userId);
    if (!user) {
        return { success: false, message: "User not found" };
    }
    user.sessionID = sessionID;
    user.online = true;
    user.lastOnline = new Date();
    await user.save();
    return { success: true, message: "Session ID updated successfully" };
}