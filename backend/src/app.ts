// Import required dependencies
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./router/users.js";
import groupRoutes from "./router/groups.js";
import mesageRoutes from "./router/message.js";
import taskRoutes from "./router/task.js";
import fileRoutes from "./router/file.js";
import morgan from "morgan";
import cors from "cors";
import cookieparser from "cookie-parser";
import { createClient } from "redis";

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use(cookieparser());
app.use(express.static("public"));

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/groups", groupRoutes);
app.use("/api/v1/messages", mesageRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/files", fileRoutes);

// Database connection
/**
 * The MongoDB connection URI.
 *
 * This URI is retrieved from the environment variable `MONGODB_URI`.
 * It is used to establish a connection to the MongoDB database.
 *
 * @constant {string} db - The MongoDB connection URI.
 */
const db = process.env.MONGODB_URI as string;
mongoose
    .connect(db)
    .then(() => {
        console.log("Connected to Local MongoDB database server...");
    })
    .catch((err) => {
        console.log(err);
    });

export const redisClient = createClient();
redisClient.on("connect", () => console.log("Redis connected!"));
redisClient.on("error", (err) => console.error("Redis error:", err));
await redisClient.connect();

// Server configuration
const port = process.env.PORT;
const host = process.env.HOST;

// Start the server
app.listen(port, () => {
    console.log(`Connected to server on http://${host}:${port}`);
});
