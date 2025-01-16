import { Router } from "express";
import { getTasks, createTask, updateTask, deleteTask, getTaskById, } from "../controllers/taskController.js";
const router = Router();
//routes for tasks:
router.get("/", getTasks);
router.get("/:taskId", getTaskById); //fix me later
router.post("/", createTask);
router.patch("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);
export default router;
