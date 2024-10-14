// api.js
const express = require('express');
const { Server } = require('socket.io');

const app = express();

// Create an HTTP server using Express
const server = app.listen(3000, () => {
  console.log('Server running on port 3000');
});

// Initialize Socket.IO with the HTTP server
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
module.exports.handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    const request = event.Records[0].cf.request;
    const uri = decodeURIComponent(request.uri.path);
    
    if (uri.startsWith('/socket.io')) {
      // Handle Socket.IO requests here
      resolve({ statusCode: 200, body: 'Socket.IO request handled' });
    } else {
      resolve({ statusCode: 404, body: 'Not found' });
    }
  });
};
