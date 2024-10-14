// api.js
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = express().createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("sendMessage", (msg) => {
    io.emit("newMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

module.exports = server;

// Export the handler for Netlify Functions
module.exports.handler = serverless(server);
