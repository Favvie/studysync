import { Router } from "express";
import { getTasks, createTask, updateTask, deleteTask, getTaskById, } from "../controllers/taskController.js";
const router = Router();
router.get("/", getTasks);
router.get("/:taskId", getTaskById);
router.post("/", createTask);
router.patch("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);
export default router;
