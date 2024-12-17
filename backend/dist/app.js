import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Connected to server on http://127.0.0.1:${port}`);
});
