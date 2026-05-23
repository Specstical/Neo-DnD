import mongoose from "mongoose";


export const handler = async (data: {sessionID:string, recipientID:string, subject:string, content:string}) => {

    const { sessionID, recipientID, subject, content } = data;
    const User = mongoose.model("User");
    const sender = await User.findOne({ sessionID });
    if (!sender) {
        throw new Error("Sender not found");
    }
    const recipient = await User.findById(recipientID);
    if (!recipient) {
        throw new Error("Recipient not found");
    }
    const Mail = mongoose.model("Mail");
    const mail = new Mail({
        sender: sender._id,
        recipient: recipient._id,
        subject,
        body: content,
    });
    await mail.save();
    return { success: true, message: "Mail sent successfully" };
}