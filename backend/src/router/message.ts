import { Router, RequestHandler } from "express";
import { getMessages, postMessages } from "../controllers/messageController.js";
import { authorizationMiddleware } from "../middleware/auth.js";

const router = Router();

router.use(authorizationMiddleware as RequestHandler);

router.get("/", getMessages as RequestHandler);

router.post("/", postMessages as RequestHandler);

export default router;
