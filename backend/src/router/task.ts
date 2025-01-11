import { Router, RequestHandler } from 'express';
import { getTasks, createTask, updateTask, deleteTask, getTaskById } from '../controllers/taskController.js';

const router = Router();

//routes for tasks:
router.get('/', getTasks as RequestHandler);
router.get('/:taskId', getTaskById as RequestHandler); //fix me later
router.post('/', createTask as RequestHandler);
router.patch('/:taskId', updateTask as RequestHandler);
router.delete('/:taskId', deleteTask as RequestHandler);

export default router;