// Import required dependencies
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./router/users.js";
import groupRoutes from './router/groups.js';
import mesageRoutes from './router/message.js';
import taskRoutes from './router/task.js';
import morgan from "morgan";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Middlewares
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan("dev")); // HTTP request logger
app.use(cors()); // Enable CORS

// Routes
app.use('/api/v1/', userRoutes );
app.use('/api/v1/groups', groupRoutes);
app.use('/api/v1/messages', mesageRoutes);
app.use('/api/v1/tasks', taskRoutes);

// Database connection
const db = process.env.MONGODB_URI as string;
mongoose.connect(db).then(() => {
    console.log("Connected to Local MongoDB database server...");
}).catch((err) => { console.log(err); });

// Server configuration
const port = process.env.PORT;
const host = process.env.HOST;

// Start the server
app.listen(port, () => {
    console.log(`Connected to server on http://${host}:${port}`);
});
