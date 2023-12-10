// Importing required modules
const express = require("express"); // Express is a web framework for Node.js
const app = express(); // Creating an Express application
const http = require("http"); // HTTP module for creating an HTTP server
const cors = require("cors"); // CORS middleware for handling Cross-Origin Resource Sharing
const { Server } = require("socket.io"); // Importing the Server class from socket.io

// Adding CORS middleware to the Express app
app.use(cors());

// Creating an HTTP server using the Express app
const server = http.createServer(app);

// Creating a new instance of the Socket.IO server and configuring CORS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Handling socket connections
io.on("connection", (socket) => {
  // Logging when a user connects
  console.log(`User Connected: ${socket.id}`);

  // Handling "join_room" event
  socket.on("join_room", (data) => {
    // Joining a specific room and logging the event
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  // Handling "send_message" event
  socket.on("send_message", (data) => {
    // Logging the received message and emitting "receive_message" event to the room
    console.log("Received message:", data);
    socket.to(data.room).emit("receive_message", data);
  });

  // Handling disconnection
  socket.on("disconnect", () => {
    // Logging when a user disconnects
    console.log("User Disconnected", socket.id);
  });
});

// Starting the server on port 3001 and logging a message when it starts
server.listen(3001, () => {
  console.log("Server Started");
});
