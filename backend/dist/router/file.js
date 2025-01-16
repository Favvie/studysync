import { Router } from "express";
import { getFilesForGroup, getFileById, addNewFile, deleteFileById, updateFileMetadata, downloadFileById, searchFiles, } from "../controllers/fileController.js";
import { fileUploadMiddlware } from "../middleware/fileUpload.js";
const router = Router();
router.get("/:groupId/groupfiles", getFilesForGroup);
router.post("/:groupId/upload", fileUploadMiddlware(), addNewFile);
router.get("/search", searchFiles);
router.get("/:fileId", getFileById);
router.get("/:fileId/download", downloadFileById);
router.delete("/:fileId/delete/", deleteFileById);
router.patch("/:fileId/updatefile", updateFileMetadata);
// router.post('/:fileId/share', shareFileById as RequestHandler); // TODO: Implement this if needed
export default router;
