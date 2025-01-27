import { Request, Response } from "express";
import { redisClient } from "../app.js";
import { messageModel } from "../models/messageModel.js";

/**
 * Retrieves messages for a specific group.
 *
 * @param req - The request object containing the query parameters.
 * @param res - The response object used to send the response.
 *
 * @returns A JSON response containing the messages or an error message.
 *
 * @remarks
 * - If `groupId` is not provided in the query parameters, a 400 status code is returned.
 * - If messages are found in the cache, they are returned with a 200 status code.
 * - If no messages are found in the database, a 404 status code is returned.
 * - If an error occurs during the process, a 500 status code is returned.
 *
 * @example
 * // Example request
 * GET /messages?groupId=123
 *
 * // Example response
 * {
 *   "success": true,
 *   "msg": [
 *     { "id": "1", "text": "Hello", "groupId": "123" },
 *     { "id": "2", "text": "Hi", "groupId": "123" }
 *   ]
 * }
 */
export const getMessages = async (req: Request, res: Response) => {
    try {
        const groupId = req.query.groupId as string;
        if (!groupId) {
            return res
                .status(400)
                .json({ success: false, msg: "No groupId provided" });
        }
        const cachedMessages = await redisClient.get(`Messages:${groupId}`);
        if (cachedMessages) {
            res.status(200).json({
                success: true,
                msg: JSON.parse(cachedMessages),
            });
        } else {
            const messages = await messageModel.find({ groupId });
            if (messages.length === 0) {
                return res
                    .status(404)
                    .json({ success: false, msg: "No messages found" });
            }
            await redisClient.set(
                `Messages:${groupId}`,
                JSON.stringify(messages),
                {
                    EX: 3600,
                }
            );
            res.status(200).json({ success: true, msg: messages });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};

export const postMessages = async (req: Request, res: Response) => {
    try {
        const userId = req.customData?.userId as string;
        const { message, groupId } = req.body;
        const newMessage = new messageModel({ message, userId, groupId });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};
