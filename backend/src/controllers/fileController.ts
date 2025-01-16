import { Request, Response } from "express";
import { fileModel } from "../models/fileModel.js";

//TODO: Covert getting userId and checking if it is present into a util fucntion
//TODO: COnvert other repetitive code into utils

export const getFilesForGroup = async (req: Request, res: Response) => {
	try {
		const userId = req.customData?.userId as string;
		const groupId = req.params.groupId as string;
		console.log(userId, groupId);
		if (!userId || !groupId) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const files = await fileModel.find();
		res.status(200).json({ success: true, msg: files });
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
			return res.status(400).json({ success: false, msg : "FileId is missing" });
		}
		const fileMetaData = await fileModel.findById({_id: fileId});
		if (!fileMetaData) {
			return res.status(400).json({ success: false, msg : "No file mathcing this ID" });
		}
		res.status(200).json({ success: true, msg: fileMetaData });
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
