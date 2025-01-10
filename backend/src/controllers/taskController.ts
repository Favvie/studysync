import { Request, Response } from 'express';
import { taskModel } from '../models/taskModel.js';

export const getTasks = async (req: Request, res: Response) => {
    try {
        const userId = req.customData?.userId as string;
        if(!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const tasks = await taskModel.find({userId });
        res.status(200).json({success: true, msg: tasks});
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : error });
    }
}
export const getTaskById = async(req: Request, res: Response) => {
    try {
        const userId = req.customData?.userId as string;
        if (!userId ) {
            return res.status(401).json({ success: false, msg: "Unauthorized!"});
        }
        const taskId = req.params.taskId;
        if (!taskId ) {
            return res.status(400).json({ success: false, msg: "Task ID missing"});
        }
        const task = await taskModel.findOne({ _id: taskId, userId: userId });
        if (!task) {
            return res.status(404).json({ success: false, msg: "Task not found" });
        }
        res.status(200).json({success: true, msg: task});
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : error });
    }
}

export const createTask = async (req: Request, res: Response) => {
    try {
        const userId = req.customData?.userId as string;
        if (!userId) {
            return res.status(401).json({ success: false, msg: "Unauthorized!"});
        }
        const { title, description, status } = req.body;
        if (!title || !description || !status) {
            return res.status(400).json({ success: false, msg: "Missing required fields"});
        }
        const newTask = new taskModel({ userId, title, description, status });
        const savedTask = await newTask.save();
        res.status(201).json({ success: true, msg: savedTask});
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : error });
    }
}

// export const updateTask = async(req: Request, res: Response) => {
//     try {
        
//     } catch (error) {
        
//     }
// }