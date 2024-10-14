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
  try {
    // Check if event.Records exists and has at least one element
    if (!Array.isArray(event.Records)) {
      return { statusCode: 400, body: 'Invalid request format' };
    }

    const record = event.Records[0];
    
    // Try to access properties in order of preference
    let request;
    if (record.cf && record.cf.request) {
      request = record.cf.request;
    } else if (record.body && JSON.parse(record.body).cf && JSON.parse(record.body).cf.request) {
      request = JSON.parse(record.body).cf.request;
    } else {
      return { statusCode: 400, body: 'Invalid request format' };
    }

    const uri = decodeURIComponent(request.uri.path);

    if (uri.startsWith('/socket.io')) {
      // Handle Socket.IO requests here
      return { statusCode: 200, body: 'Socket.IO request handled' };
    } else {
      return { statusCode: 404, body: 'Not found' };
    }
  } catch (error) {
    console.error('Error handling function:', error);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
