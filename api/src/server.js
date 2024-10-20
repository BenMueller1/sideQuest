const express = require("express");
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');

const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
require("./cron/jobs");
require('dotenv').config();

const app = express();

// Create the HTTP server
const server = http.createServer(app); 

// create the socket server on the HTTP server
const io = new Server(server, {
  cors: {
    origin: "*",  // You can specify the allowed origins here
    methods: ["GET", "POST"]
  }
});
require('./sockets/socketHandler')(io);  // This file will handle all socket logic


const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());
app.use("/events", eventRoutes);
app.use("/user", userRoutes);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
