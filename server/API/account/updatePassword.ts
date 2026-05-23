import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const handler = async (data: { sessionID: string; currentPassword: string; newPassword: string }) => {
    const { sessionID, currentPassword, newPassword } = data;
    const User = mongoose.model("User");
    const user = await User.findOne({ sessionID });

    if (!user) {
        throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
        return { success: false, message: "Current password is incorrect" };
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { success: true, message: "Password updated successfully" };
};