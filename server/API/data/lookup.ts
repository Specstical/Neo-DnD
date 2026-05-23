
import mongoose from "mongoose";


export const handler = async (data: {sessionID:string, dataType: string, filter: any}) => {
    const { sessionID, dataType, filter } = data;
    const dataModel = mongoose.model(dataType);
    const User = mongoose.model("User");
    const user = await User.findOne({ sessionID });
    if (!user) {
        throw new Error("User not found");
    }
    const results = await dataModel.find(filter);
    return { success: true, results };
   
}