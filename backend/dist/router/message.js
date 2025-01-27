import { Router } from "express";
import { getMessages, postMessages } from "../controllers/messageController.js";
import { authorizationMiddleware } from "../middleware/auth.js";
const router = Router();
router.use(authorizationMiddleware);
router.get("/", getMessages);
router.post("/", postMessages);
export default router;
