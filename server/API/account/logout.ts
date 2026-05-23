import mongoose from "mongoose";


export const handler = async (data: { sessionID: string }) => {
    const { sessionID } = data;
    const User = mongoose.model("User");
    const user = await User.findOne({ sessionID });
    if (!user) {
        return { success: false, message: "User not found" };
    }
    user.sessionID = null;
    user.online = false;
    user.lastOnline = new Date();
    await user.save();
    return { success: true, message: "Logout successful" };

}