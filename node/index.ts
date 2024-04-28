import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

type Chat = {
  userId: string;
  text: string;
};

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

const Chats: Chat[] = [];

io.on("connection", (socket) => {
  console.log(`node- connected: ${socket.id}`);
  // previous chat history
  io.emit("history", Chats);

  socket.on("send", (data: Chat) => {
    Chats.push(data);
    console.log(Chats);
    // emit to all
    io.emit("receive", data);
  });
});

httpServer.listen(3001);
