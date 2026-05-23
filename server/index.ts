import { Server } from "socket.io";
import {callAPI} from "./handlers/APIHandler";
import connectDB from "./db";
import {loadModels} from "./handlers/modelHandler";

const io = new Server(3001, {
    cors: {
        origin: "*",
    },
});


(async () => {
  await connectDB();
    await loadModels(); 
    
  
    
io.on("connection", (socket) => {
  const clientSessionId = socket.handshake.query.sessionId as string | undefined;
  console.log(`Client connected: socket.id=${socket.id}, sessionId=${clientSessionId || "unknown"}`);
  
  socket.on("api", async (apiName: string, data: any, requestId: string) => {
    try {
      const result = await callAPI(apiName, data);
      socket.emit("api-response", { requestId, success: true, data: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      socket.emit("api-response", { requestId, success: false, error: message });
    }
  });
});



console.log("Server is running on port 3001");
})();


