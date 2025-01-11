import mongoose from 'mongoose';
import { ITask } from '../types/task.js';

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true }
}, { timestamps: true });

export const taskModel = mongoose.model<ITask>('Task', taskSchema);
