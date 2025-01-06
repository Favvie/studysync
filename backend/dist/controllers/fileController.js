var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fileModel } from '../models/fileModel.js';
import { v2 as cloudinaryV2 } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();
cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
export const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Validate Cloudinary env variables
        const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
        for (const v of requiredEnvVars) {
            if (!process.env[v]) {
                return res.status(500).json({ error: `${v} not set in environment` });
            }
        }
        const file = req.file;
        const userId = (_a = req.customData) === null || _a === void 0 ? void 0 : _a.userId;
        if (!file) {
            return res.status(400).send('Please upload a file');
        }
        if (!userId) {
            return res.status(401).json({ success: false, msg: 'Unauthorized' });
        }
        const result = yield cloudinaryV2.uploader.upload(file.path);
        const newFile = new fileModel({
            fileName: result.original_filename,
            fileType: result.format,
            fileSize: result.bytes,
            fileUrl: result.secure_url,
            uploadedBy: userId
        });
        yield newFile.save();
        // Remove local file after upload
        fs.unlinkSync(path.join(__dirname, '../../uploads', file.filename));
        res.status(201).json(newFile);
    }
    catch (error) {
        res.status(400).json({ success: false, msg: (error instanceof Error) ? error.message : 'An error occurred' });
    }
});
