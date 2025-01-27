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
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use(cookieparser());
app.use(express.static("public"));
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/groups", groupRoutes);
app.use("/api/v1/messages", mesageRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/files", fileRoutes);
const db = process.env.MONGODB_URI;
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
const port = process.env.PORT;
const host = process.env.HOST;
app.listen(port, () => {
    console.log(`Connected to server on http://${host}:${port}`);
});
