"use client";

import { useEffect, useState } from "react";
import ChatContiner from "./ChatContainer";
import { socket } from "./socket";

export default function Page() {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  useEffect(() => {
    console.log(`connection status: ${isConnected}`);

    function onConnect() {
      console.log(`react- connected ${socket.id}`);
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      // prevent duplicate event registration
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <ChatContiner socket={socket} />
    </main>
  );
}
