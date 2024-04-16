const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

const CHAT_BOT = "ChatBot"; // Add this

io.on("connection", (socket) => {
  console.log(`a user connected ${socket.id}`);

  // Add a user to a room
  socket.on("join_room", (data) => {
    const { name, room } = data; // Data sent from client when join_room event emitted

    console.log("Line 21", name, room);
    socket.join(room); // Join the user to a socket room

    // Add this
    let __createdtime__ = Date.now(); // Current timestamp
    // Send message to all users currently in the room, apart from the user that just joined
    socket.to(room).emit("receive_message", {
      message: `${name} has joined the chat room`,
      username: CHAT_BOT,
      socket: socket.id,
      __createdtime__,
    });

    // Add this
    // Send welcome msg to user that just joined chat only
    socket.emit("receive_message", {
      message: `Welcome ${name}`,
      username: CHAT_BOT,
      socket: socket.id,
      __createdtime__,
    });
  });
});

server.listen(4000, () => {
  console.log("listening on *:4000");
});
