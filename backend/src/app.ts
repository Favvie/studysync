import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./router/userRoutes.js";
import morgan from "morgan";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//User router
app.use('/api/v1/', userRoutes );


//connect to process.env.MONGO_URI:
const db = process.env.MONGODB_URI as string;
mongoose.connect(db).then(() => {
    console.log("Connected to MongoDB database...");
}).catch((err) => { console.log(err); });

const port = process.env.PORT;
const host = process.env.HOST;
app.listen(port, () => {
    console.log(`Connected to server on http://${host}:${port}`);
});
