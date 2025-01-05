import { Router } from 'express';
import { getUserController } from '../controllers/getUserController.js';
import { getUserByIdController } from '../controllers/getUserController.js';
const router = Router();
router.get('/users', getUserController);
router.get('/users/:id', getUserByIdController);
export default router;
