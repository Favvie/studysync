var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { taskModel } from '../models/taskModel.js';
export const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.customData) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const tasks = yield taskModel.find({ userId });
        res.status(200).json({ success: true, msg: tasks });
    }
    catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : error });
    }
});
export const getTaskById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.customData) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ success: false, msg: "Unauthorized!" });
        }
        const taskId = req.params.taskId;
        if (!taskId) {
            return res.status(400).json({ success: false, msg: "Task ID missing" });
        }
        const task = yield taskModel.findOne({ _id: taskId, userId: userId });
        if (!task) {
            return res.status(404).json({ success: false, msg: "Task not found" });
        }
        res.status(200).json({ success: true, msg: task });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : error });
    }
});
export const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.customData) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ success: false, msg: "Unauthorized!" });
        }
        const { title, description, status } = req.body;
        if (!title || !description || !status) {
            return res.status(400).json({ success: false, msg: "Missing required fields" });
        }
        const newTask = new taskModel({ userId, title, description, status });
        const savedTask = yield newTask.save();
        res.status(201).json({ success: true, msg: savedTask });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : error });
    }
});
// export const updateTask = async(req: Request, res: Response) => {
//     try {
//     } catch (error) {
//     }
// }
