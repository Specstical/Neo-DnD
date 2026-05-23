"use client ";

import { sendmessage } from "@/app/_serverInteraction/socket"
import { getSessionId } from "@/app/_serverInteraction/socket"
import { useState } from "react"

export default function UsernamePick({hasUsername,setHasUsername}: {hasUsername: boolean, setHasUsername: (has: boolean) => void}) {   

    const [username, setUsername] = useState("");


    return(
        <div className="flex flex-col items-center justify-center h-screen absolute top-0 left-0 w-full bg-background/10  backdrop-blur-md z-50">
            <h1 className="text-2xl font-bold mb-4">Choose a username</h1>
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Enter your username"
                className="border border-gray-300 rounded px-4 py-2 mb-4 w-64 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
            onClick={async () => {
                if (!username.trim()) {
                    alert("Username cannot be empty");
                    return;
                }
                try {
                    const response = await sendmessage<{ success: boolean; message: string }>("account_setUsername", { sessionID: getSessionId() || "", username });
                    if (!response.success) {
                        alert(`Failed to set username: ${response.message}`);
                    } else {
                        setHasUsername(true);
                    }
                } catch (error) {
                    console.error("Error setting username:", error);
                    alert("An error occurred while setting username. Please try again.");
                }
            }}
            >
                Join Session
            </button>
        </div>
    )

}