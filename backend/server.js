const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join("../frontend")));
const rooms = new Map(); // Map to store the rooms and their respective sockets
const chatHistory = new Map(); // Map to store the chat history of each room
const users = {};

io.on("connection", function (socket) {
  let roomId;

  socket.on("newuser", function (data) {
    const { username, room } = data;
    socket.join(room);
    roomId = room;

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Map());
    }
    rooms.get(roomId).set(socket.id, username);

    // Send chat history to the newly joined user
    if (chatHistory.has(roomId)) {
      const history = chatHistory.get(roomId);
      socket.emit("chatHistory", history);
    }

    socket.broadcast
      .to(roomId)
      .emit("update", username + " joined the conversation");
    socket.emit("update", "You joined the conversation");
  });

  socket.on("exituser", function () {
    const username = rooms.get(roomId).get(socket.id);
    rooms.get(roomId).delete(socket.id);
    socket.leave(roomId);
    socket.broadcast
      .to(roomId)
      .emit("update", username + " left the conversation");
  });

  socket.on("chat", function (message) {
    const username = rooms.get(roomId).get(socket.id);

    // Add message to chat history
    if (!chatHistory.has(roomId)) {
      chatHistory.set(roomId, []);
    }
    chatHistory.get(roomId).push({ username, text: message });

    socket.broadcast.to(roomId).emit("chat", {
      username: username,
      text: message,
    });
  });
});

server.listen(8000, console.log("port listening"));
