import { Request, Response } from "express";

export const getUserId = (req: Request, res: Response) => {
    const userId = req.customData?.userId as string;
    if (!userId) {
        return res
            .status(400)
            .json({ success: false, msg: "Unauthorized Access" });
    }
    return userId;
};

export const getGroupId = (req: Request, res: Response) => {
    const groupId = req.params.groupId as string;
    if (!groupId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    return groupId;
};

export const getFileId = (req: Request, res: Response) => {
    const { fileId } = req.params;
    if (!fileId) {
        return res.status(400).json({
            success: false,
            msg: "FileId is missing",
        });
    }
    return fileId;
};
