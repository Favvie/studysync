import { Router } from 'express';
import { getTasks, createTask, 
// updateTask,
// deleteTask,
getTaskById } from '../controllers/taskController.js';
const router = Router();
//routes for tasks:
router.get('/', getTasks);
router.get('/:taskId', getTaskById); //fixMe later
router.post('/', createTask);
// router.patch('/:taskId', updateTask as RequestHandler);
// router.delete('/:taskId', deleteTask as RequestHandler);
export default router;
