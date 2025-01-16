import { Request, Response } from "express";
import { taskModel } from "../models/taskModel.js";

export const getTasks = async (req: Request, res: Response) => {
    try {
        const userId = req.customData?.userId as string;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const tasks = await taskModel.find({ userId });
        res.status(200).json({ success: true, msg: tasks });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : error,
        });
    }
};
export const getTaskById = async (req: Request, res: Response) => {
    try {
        const userId = req.customData?.userId as string;
        if (!userId) {
            return res
                .status(401)
                .json({ success: false, msg: "Unauthorized!" });
        }
        const taskId = req.params.taskId;
        if (!taskId) {
            return res
                .status(400)
                .json({ success: false, msg: "Task ID missing" });
        }
        const task = await taskModel.findOne({ _id: taskId, userId: userId });
        if (!task) {
            return res
                .status(404)
                .json({ success: false, msg: "Task not found" });
        }
        res.status(200).json({ success: true, msg: task });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : error,
        });
    }
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const userId = req.customData?.userId as string;
        if (!userId) {
            return res
                .status(401)
                .json({ success: false, msg: "Unauthorized!" });
        }
        const { title, description, status } = req.body;
        if (!title || !description || !status) {
            return res
                .status(400)
                .json({ success: false, msg: "Missing required fields" });
        }
        const newTask = new taskModel({ userId, title, description, status });
        const savedTask = await newTask.save();
        res.status(201).json({ success: true, msg: savedTask });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : error,
        });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const { title, description, status } = req.body;
        const newTaskUpdate = {
            ...(title && { title }),
            ...(description && { description }),
            ...(status && { status }),
        };
        if (Object.keys(newTaskUpdate).length === 0) {
            return res
                .status(400)
                .json({ success: false, msg: "No valid fields to update" });
        }
        const userId = req.customData?.userId;
        if (!userId) {
            res.status(401).json({ success: false, msg: "Unauthorized!" });
        }
        const taskId = req.params.taskId;
        if (!taskId) {
            res.status(400).json({ success: false, msg: "Task Id is missing" });
        }
        const updatedTask = await taskModel.findOneAndUpdate(
            { userId, _id: taskId },
            newTaskUpdate,
            { new: true }
        );
        res.status(200).json({ success: true, msg: updatedTask });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occured",
        });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const userId = req.customData?.userId;
        if (!userId) {
            res.status(401).json({ success: false, msg: "Unauthorized!" });
        }
        const taskId = req.params.taskId;
        if (!taskId) {
            res.status(400).json({ success: false, msg: "Task Id is missing" });
        }
        const deletedTask = await taskModel.findOneAndDelete({
            userId,
            _id: taskId,
        });
        if (!deletedTask) {
            return res
                .status(400)
                .json({ success: false, msg: "No task found" });
        }
        res.status(200).json({ success: true, msg: deletedTask });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occured",
        });
    }
};
