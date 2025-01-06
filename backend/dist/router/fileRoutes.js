import { Router } from 'express';
import { uploadFile } from '../controllers/fileController.js';
import { upload } from '../middleware/multer.js';
import { authorizationMiddleware } from '../middleware/auth.js';
const router = Router();
router.post('/upload', authorizationMiddleware, upload.single('file'), uploadFile);
export default router;
