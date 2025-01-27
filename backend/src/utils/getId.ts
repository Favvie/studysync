import { Request, Response } from "express";
// Not done yet
//TODO: Not in use yet, fix up and replace repitive fetching of ids
/**
 * Retrieves the user ID from the request object and returns it.
 * If the user ID is not found, sends a 400 response with an "Unauthorized Access" message.
 *
 * @param req - The request object containing custom data with the user ID.
 * @param res - The response object used to send the error message if the user ID is not found.
 * @returns The user ID as a string if found, otherwise sends a 400 response.
 */
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
