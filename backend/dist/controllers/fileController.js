var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fileModel } from "../models/fileModel.js";
//TODO: Covert getting userId and checking if it is present into a util fucntion
//TODO: COnvert other repetitive code into utils
export const getFilesForGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groupId = req.params.groupId;
        if (!groupId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const files = yield fileModel.find({ groupId });
        res.status(200).json({ success: true, msg: files });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occurred",
        });
    }
});
export const getFileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileId } = req.params;
        if (!fileId) {
            return res.status(400).json({
                success: false,
                msg: "FileId is missing",
            });
        }
        const fileMetaData = yield fileModel.findById({ _id: fileId });
        if (!fileMetaData) {
            return res.status(400).json({
                success: false,
                msg: "No file mathcing this ID",
            });
        }
        res.status(200).json({
            success: true,
            msg: fileMetaData,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occured",
        });
    }
});
export const addNewFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.customData) === null || _a === void 0 ? void 0 : _a.userId;
        const groupId = req.params.groupId;
        if (!userId || !groupId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const file = req.file;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { filename, size, mimetype, destination } = file; //fix-me: disable with eslint till fix is found for type error
        const newFile = yield fileModel.create({
            fileName: filename,
            fileType: mimetype,
            fileSize: size,
            fileUrl: `${destination}\\${filename}`,
            userId,
            groupId,
        });
        res.status(201).json({ success: true, msg: newFile });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occurred",
        });
    }
});
export const deleteFileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.customData) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                msg: "Unauthorized",
            });
        }
        const { fileId } = req.params;
        if (!fileId) {
            return res.status(400).json({
                success: false,
                msg: "FileId is missing",
            });
        }
        const deletedFile = yield fileModel.findOneAndDelete({
            fileId,
            userId,
        });
        if (!deletedFile) {
            return res.status(400).json({
                success: false,
                msg: "File does not exist!",
            });
        }
        res.status(200).json({
            success: true,
            msg: "File successfully deleted",
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            msg: error instanceof Error ? error.message : "Ann error occurred",
        });
    }
});
export const updateFileMetadata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const fileOwner = (_a = req.customData) === null || _a === void 0 ? void 0 : _a.userId; //TODO: check variable anme and change later
        if (!fileOwner) {
            return res.status(401).json({
                success: false,
                msg: "Unauthorized",
            });
        }
        const { fileId } = req.params;
        if (!fileId) {
            return res.status(400).json({
                success: false,
                msg: "FileId is missing",
            });
        }
        const ifUserIsFileOwner = yield fileModel.findOne({
            _id: fileId,
            userId: fileOwner,
        });
        console.log(ifUserIsFileOwner);
        if (!ifUserIsFileOwner) {
            return res.status(401).json({
                success: false,
                msg: "User is not allowed to perform this action",
            });
        }
        const { fileName, fileType, fileSize, fileUrl, userId, groupId } = req.body;
        const fieldsToUpdate = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (fileName && { fileName })), (fileType && { fileType })), (fileSize && { fileSize })), (fileUrl && { fileUrl })), (userId && { userId })), (groupId && { groupId }));
        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({
                success: false,
                msg: "No valid fields to update",
            });
        }
        const updatedFile = yield fileModel.findOneAndUpdate({
            _id: fileId,
            userId: fileOwner,
        }, fieldsToUpdate, { new: true }); //TODO: The function should should save name in format with (name-date) and update the fileUrl
        if (!updatedFile) {
            return res.status(400).json({
                success: false,
                msg: "No file found",
            });
        }
        res.status(200).json({
            succes: true,
            msg: updatedFile,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occurred",
        });
    }
});
export const downloadFileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileId } = req.params;
        if (!fileId) {
            return res.status(400).json({
                success: false,
                msg: "FileId is missing",
            });
        }
        const file = yield fileModel.findById({ _id: fileId });
        if (!file) {
            return res.status(404).json({
                success: false,
                msg: "File not found",
            });
        }
        if (!file.fileUrl) {
            return res.status(404).json({
                success: false,
                msg: "File URL not found",
            });
        }
        res.download(file.fileUrl, (err) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    msg: "Error downloading file",
                });
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occurred",
        });
    }
});
export const searchFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchquery } = req.query;
        const groupId = req.params.groupId;
        if (!searchquery) {
            return res.status(400).json({
                success: false,
                msg: "Search query is missing",
            });
        }
        const files = yield fileModel.find(Object.assign({ fileName: { $regex: searchquery, $options: "i" } }, (groupId && { groupId })));
        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                msg: "No files found",
            });
        }
        res.status(200).json({
            success: true,
            msg: files,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occurred",
        });
    }
});
