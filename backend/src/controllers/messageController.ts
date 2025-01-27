import { Request, Response } from "express";
import { redisClient } from "../app.js";
import { messageModel } from "../models/messageModel.js";

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
