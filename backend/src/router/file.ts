import { Router, RequestHandler } from "express";
import {
    getFilesForGroup,
    getFileById,
    addNewFile,
    deleteFileById,
    updateFileMetadata,
    downloadFileById,
    searchFiles,
} from "../controllers/fileController.js";
import { fileUploadMiddlware } from "../middleware/fileUpload.js";

const router = Router();

router.get("/:groupId/groupfiles", getFilesForGroup as RequestHandler);
router.post(
    "/:groupId/upload",
    fileUploadMiddlware(),
    addNewFile as RequestHandler
);
router.get("/search", searchFiles as RequestHandler);
router.get("/:fileId", getFileById as RequestHandler);
router.get("/:fileId/download", downloadFileById as RequestHandler);
router.delete("/:fileId/delete/", deleteFileById as RequestHandler);
router.patch("/:fileId/updatefile", updateFileMetadata as RequestHandler);
// router.post('/:fileId/share', shareFileById as RequestHandler); // TODO: Implement this if needed

export default router;
