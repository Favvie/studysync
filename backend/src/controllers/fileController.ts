import { Request, Response } from "express";
import { fileModel } from "../models/fileModel.js";

export const getFilesForGroup = async (req: Request, res: Response) => {
    try {
        const userId = req.customData?.userId as string;
        const groupId = req.params.groupId as string;
        if (!userId || !groupId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const files = await fileModel.find();
        res.status(200).json({success: true, msg: files});
    } catch (error) {
        res.status(500).json({ success: false, msg: error instanceof Error? error.message: "An error occurred" });
    }
}

export const addNewFile = (req: Request, res: Response) => {
    try {
        const userId = req.customData?.userId as string;
        const groupId = req.params.groupId as string;
        if (!userId || !groupId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const file = req.file;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { filename, filesize, mimetype, destination } = file as any; //fix-me: disable with eslint till fix is found for type error
        const newFile = new fileModel({
            fileName: filename,
            fileType: mimetype,
            fileSize: filesize,
            fileUrl: destination,
            userId,
            groupId
        })
        res.status(201).json({ success: true, msg: newFile });
    } catch(error) {
        res.status(500).json({ success: false, msg: error instanceof Error? error.message: "An error occurred" });
    }
}