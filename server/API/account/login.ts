import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const handler = async (data: { email: string; password: string }) => {
    const { email, password } = data;
    const User = mongoose.model("User");
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        return { success: false, message: "Invalid email or password" };
    }
    return { success: true, message: "Login successful", userId: user._id };
}