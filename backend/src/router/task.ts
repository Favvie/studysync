import { Router, RequestHandler } from "express";
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
} from "../controllers/taskController.js";
import { authorizationMiddleware } from "../middleware/auth.js";

const router = Router();

router.use(authorizationMiddleware);

//routes for tasks:
router.get("/", getTasks as RequestHandler);
router.get("/:taskId", getTaskById as RequestHandler); //fix me later
router.patch("/:taskId", updateTask as RequestHandler);
router.post("/", createTask as RequestHandler);
router.delete("/:taskId", deleteTask as RequestHandler);

export default router;
