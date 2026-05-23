import mongoose from "mongoose";

export const handler = async (data: { sessionID: string; mailID: string }) => {
  const { sessionID, mailID } = data;
  const User = mongoose.model("User");
  const user = await User.findOne({ sessionID });
  if (!user) {
    throw new Error("User not found");
  }

  const Mail = mongoose.model("Mail");
  const mail = await Mail.findByIdAndUpdate(mailID, { read: true }, { new: true });
  
  if (!mail) {
    throw new Error("Mail not found");
  }


  return { success: true, mail };
};
