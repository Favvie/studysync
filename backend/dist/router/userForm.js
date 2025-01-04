import express from "express";
import { signUp } from "../controllers/signUpController.js";
import { signIn } from "../controllers/signInController.js";
import { signInAuth } from "../middleware/signInAuth.js";
const router = express.Router();
router.post("/signup", signUp);
router.post("/signin", signInAuth, signIn);
export default router;
