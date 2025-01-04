import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userForm from "./router/userForm.js";
import morgan from "morgan";
dotenv.config();
const app = express();
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
//router uses
app.use('/api/auth/', [userForm]);
//connect to process.env.MONGO_URI:
const db = process.env.MONGODB_URI;
mongoose.connect(db).then(() => {
    console.log("Connected to MongoDB database...");
}).catch((err) => { console.log(err); });
const port = process.env.PORT;
const host = process.env.HOST;
app.listen(port, () => {
    console.log(`Connected to server on http://${host}:${port}`);
});
