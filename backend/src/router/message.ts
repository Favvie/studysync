import { Router } from 'express';
import { getMessage, postMessage } from '../controllers/messageController.js';

const router = Router();

router.get('/', getMessage);

router.post('/', postMessage);

export default router;