// Import required dependencies
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./router/userRoutes.js";
import morgan from "morgan";
// Load environment variables from .env file
dotenv.config();
// Initialize Express application
const app = express();
// Middlewares
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan("dev")); // HTTP request logger
// Routes
app.use('/api/v1/', [userRoutes]); // Mount user routes under /api/v1/
// Database connection
const db = process.env.MONGODB_URI;
mongoose.connect(db).then(() => {
    console.log("Connected to MongoDB database...");
}).catch((err) => { console.log(err); });
// Server configuration
const port = process.env.PORT;
const host = process.env.HOST;
// Start the server
app.listen(port, () => {
    console.log(`Connected to server on http://${host}:${port}`);
});
