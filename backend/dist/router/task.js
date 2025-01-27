import { Router } from "express";
import { getTasks, createTask, updateTask, deleteTask, getTaskById, } from "../controllers/taskController.js";
import { authorizationMiddleware } from "../middleware/auth.js";
const router = Router();
router.use(authorizationMiddleware);
router.get("/", getTasks);
router.get("/:taskId", getTaskById);
router.patch("/:taskId", updateTask);
router.post("/", createTask);
router.delete("/:taskId", deleteTask);
export default router;
