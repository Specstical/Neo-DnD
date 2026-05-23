import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const handler = async (data: { email: string; password: string }) => {
    const { email, password } = data;
    const User = mongoose.model("User");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return { success: false, message: "Email already in use" };
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ email, passwordHash });
    await newUser.save();
    return { success: true, message: "Signup successful", userId: newUser._id };
}