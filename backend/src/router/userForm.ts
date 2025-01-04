import express from "express";
import { signUp } from "../controllers/signUpController.js";
import { signIn } from "../controllers/signInController.js";

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

export default router;