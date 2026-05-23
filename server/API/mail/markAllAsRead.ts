import mongoose from "mongoose";

export const handler = async (data: { sessionID: string }) => {
  const { sessionID } = data;
  const User = mongoose.model("User");
  const user = await User.findOne({ sessionID });
  if (!user) {
    throw new Error("User not found");
  }

  const Mail = mongoose.model("Mail");
  const result = await Mail.updateMany({ recipient: user._id, read: false }, { read: true });

  return { success: true, modifiedCount: result.modifiedCount };
};
