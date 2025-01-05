import { Router } from 'express';
import { refreshToken } from '../controllers/refreshToken.js';
const router = Router();

router.post('/refresh', refreshToken);

export default router;