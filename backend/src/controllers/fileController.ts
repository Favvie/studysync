import { Request, Response } from "express";
import { fileModel } from "../models/fileModel.js";
import { redisClient } from "../app.js";

//TODO: Covert getting userId and checking if it is present into a util fucntion
//TODO: COnvert other repetitive code into utils

export const getFilesForGroup = async (req: Request, res: Response) => {
    try {
        const groupId = req.params.groupId as string;
        if (!groupId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const cachedFiles = await redisClient.get(`files:${groupId}`);
        if (cachedFiles) {
            return res
                .status(200)
                .json({ success: true, msg: JSON.parse(cachedFiles) });
        } else {
            const files = await fileModel.find({ groupId });
            await redisClient.set(`files:${groupId}`, JSON.stringify(files));
            res.status(200).json({ success: true, msg: files });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occurred",
        });
    }
};

export const getFileById = async (req: Request, res: Response) => {
    try {
        const { fileId } = req.params;
        if (!fileId) {
            return res.status(400).json({
                success: false,
                msg: "FileId is missing",
            });
        }
        const fileMetaData = await fileModel.findById({ _id: fileId });
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
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occured",
        });
    }
};

export const addNewFile = async (req: Request, res: Response) => {
    try {
        const userId = req.customData?.userId as string;
        const groupId = req.params.groupId as string;
        if (!userId || !groupId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const file = req.file;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { filename, size, mimetype, destination } = file as any; //fix-me: disable with eslint till fix is found for type error
        const newFile = await fileModel.create({
            fileName: filename,
            fileType: mimetype,
            fileSize: size,
            fileUrl: `${destination}\\${filename}`,
            userId,
            groupId,
        });
        res.status(201).json({ success: true, msg: newFile });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occurred",
        });
    }
};

export const deleteFileById = async (req: Request, res: Response) => {
    try {
        const userId = req.customData?.userId as string;
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
        const deletedFile = await fileModel.findOneAndDelete({
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
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: error instanceof Error ? error.message : "Ann error occurred",
        });
    }
};

export const updateFileMetadata = async (req: Request, res: Response) => {
    try {
        const fileOwner = req.customData?.userId as string; //TODO: check variable anme and change later
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
        const ifUserIsFileOwner = await fileModel.findOne({
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
        const { fileName, fileType, fileSize, fileUrl, userId, groupId } =
            req.body;
        const fieldsToUpdate = {
            ...(fileName && { fileName }),
            ...(fileType && { fileType }),
            ...(fileSize && { fileSize }),
            ...(fileUrl && { fileUrl }),
            ...(userId && { userId }),
            ...(groupId && { groupId }),
        };
        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({
                success: false,
                msg: "No valid fields to update",
            });
        }
        const updatedFile = await fileModel.findOneAndUpdate(
            {
                _id: fileId,
                userId: fileOwner,
            },
            fieldsToUpdate,
            { new: true }
        ); //TODO: The function should should save name in format with (name-date) and update the fileUrl
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
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occurred",
        });
    }
};

export const downloadFileById = async (req: Request, res: Response) => {
    try {
        const { fileId } = req.params;
        if (!fileId) {
            return res.status(400).json({
                success: false,
                msg: "FileId is missing",
            });
        }

        const file = await fileModel.findById({ _id: fileId });
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
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occurred",
        });
    }
};

export const searchFiles = async (req: Request, res: Response) => {
    try {
        const { searchquery } = req.query as { searchquery: string };
        const groupId = req.params.groupId as string;

        if (!searchquery) {
            return res.status(400).json({
                success: false,
                msg: "Search query is missing",
            });
        }

        const files = await fileModel.find({
            fileName: { $regex: searchquery, $options: "i" },
            ...(groupId && { groupId }),
        });

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
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occurred",
        });
    }
};
