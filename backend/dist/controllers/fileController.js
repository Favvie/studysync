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
export const getFilesForGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.customData) === null || _a === void 0 ? void 0 : _a.userId;
        const groupId = req.params.groupId;
        if (!userId || !groupId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const files = yield fileModel.find();
        res.status(200).json({ success: true, msg: files });
    }
    catch (error) {
        res.status(500).json({ success: false, msg: error instanceof Error ? error.message : "An error occurred" });
    }
});
export const addNewFile = (req, res) => {
    var _a;
    try {
        const userId = (_a = req.customData) === null || _a === void 0 ? void 0 : _a.userId;
        const groupId = req.params.groupId;
        if (!userId || !groupId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const file = req.file;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { filename, filesize, mimetype, destination } = file; //fix-me: disable with eslint till fix is found for type error
        const newFile = new fileModel({
            fileName: filename,
            fileType: mimetype,
            fileSize: filesize,
            fileUrl: destination,
            userId,
            groupId
        });
        res.status(201).json({ success: true, msg: newFile });
    }
    catch (error) {
        res.status(500).json({ success: false, msg: error instanceof Error ? error.message : "An error occurred" });
    }
};
