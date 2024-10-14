// api.js
const express = require('express');
const { Server } = require('socket.io');

const app = express();

const server = new Server(app, {
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
      const socketIoHandler = require('./socket-io-handler'); // Adjust the path as needed
      
      socketIoHandler.handleRequest(request, context, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve({ statusCode: 200, body: response });
        }
      });
    } else {
      resolve({ statusCode: 404, body: 'Not found' });
    }
  });
};
