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
app.use("/api/v1/users", userRoutes); //TODO: Implement Logout functionality
app.use("/api/v1/groups", groupRoutes);
app.use("/api/v1/messages", mesageRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/files", fileRoutes);
// Database connection
const db = process.env.MONGODB_URI;
mongoose
    .connect(db)
    .then(() => {
    console.log("Connected to Local MongoDB database server...");
})
    .catch((err) => {
    console.log(err);
});
// Server configuration
const port = process.env.PORT;
const host = process.env.HOST;
// Start the server
app.listen(port, () => {
    console.log(`Connected to server on http://${host}:${port}`);
});
