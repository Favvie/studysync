import { Router } from 'express';
import { getFilesForGroup, 
// getFileById,
addNewFile,
// deleteFileById
 } from '../controllers/fileController.js';
import { fileUploadMiddlware } from '../middleware/fileUpload.js';
const router = Router();
router.get('/:groupId', getFilesForGroup);
// router.get('/:fileId', getFileById as RequestHandler);
router.post('/:groupId', fileUploadMiddlware(), addNewFile); //This route store files locally for now.
// router.delete('/:fileId', deleteFileById as RequestHandler);
export default router;
