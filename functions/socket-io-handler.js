// socket-io-handler.js
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = new Server(app, {
  cors: {
    origin: "*",
  },
});

server.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("sendMessage", (msg) => {
    server.emit("newMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

module.exports.handleRequest = (request, context, callback) => {
  const uri = decodeURIComponent(request.uri.path);
  
  if (uri.startsWith('/socket.io')) {
    server.handleRequest(request, context, (err, response) => {
      if (err) {
        callback(err);
      } else {
        callback(null, response);
      }
    });
  } else {
    callback(null, null);
  }
};
