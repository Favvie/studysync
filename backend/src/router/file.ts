import { Router, RequestHandler } from 'express';
import {
    getFilesForGroup,
    // getFileById,
    addNewFile,
    // deleteFileById
} from '../controllers/fileController.js';
import { fileUploadMiddlware } from '../middleware/fileUpload.js';

const router = Router();

router.get('/:groupId', getFilesForGroup as RequestHandler);
// router.get('/:fileId', getFileById as RequestHandler);
router.post('/:groupId', fileUploadMiddlware(), addNewFile as RequestHandler); //This route store files locally for now.
// router.delete('/:fileId', deleteFileById as RequestHandler);

export default router;
