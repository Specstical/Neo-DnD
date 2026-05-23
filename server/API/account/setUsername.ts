import mongoose from "mongoose";


export const handler = async (data: { sessionID: string; username: string }) => {
    const { sessionID, username } = data;
      const User = mongoose.model("User");
    const user = await User.findOne({ sessionID });
    if (!user) {
        throw new Error("User not found");
    }
    user.username = username;
    await user.save();
    return { success: true, message: "Username updated successfully" };
}