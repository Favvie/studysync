import { Router, RequestHandler } from "express";
import { getMessages, postMessages } from "../controllers/messageController.js";

const router = Router();

router.get("/", getMessages as RequestHandler);

router.post("/", postMessages as RequestHandler);

export default router;
