import { Router } from "express";
import { getMessages, postMessages } from "../controllers/messageController.js";
const router = Router();
router.get("/", getMessages);
router.post("/", postMessages);
export default router;
