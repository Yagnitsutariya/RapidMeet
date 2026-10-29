import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import { connectToSocket } from "./src/controller/socketManager.js";
import userRoutes from "./src/routes/users.routes.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();

// Create HTTP server (required for socket.io)
const server = createServer(app);

// Initialize Socket.IO by passing the HTTP server
const io = connectToSocket(server);

// ----------------------------
// Express Configuration
// ----------------------------

// Set the port for the application
app.set("port", process.env.PORT || 8000);

// Enable CORS so frontend can access backend API
app.use(cors());

// Parse incoming JSON data with a maximum size of 50KB
app.use(express.json({ limit: "50kb" }));

// Parse URL-encoded form data (POST forms) with 50KB limit
app.use(express.urlencoded({ limit: "50kb", extended: true }));


app.use("/api/v1/users", userRoutes);



// ----------------------------
// Start Server + Connect Database
// ----------------------------
const start = async () => {
  try {
    // Connect to MongoDB database
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected to host:", connection.connection.host);

    // Start Express server after successful DB connection
    server.listen(app.get("port"), () => {
      console.log(`App is listening on port ${app.get("port")}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error.message);
  }
};

start();
