import { Request, Response } from 'express';
import { messageModel } from '../models/messageModel.js';

export const getMessages = async (req: Request, res: Response) => {
  try {
    const groupId = req.query.groupId;
    const messages = (await messageModel.find({groupId}));
    if (messages === null) {
      res.status(404).json({ success: false, msg: 'No messages found!' });
      return;
    }
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ success: false, msg: error instanceof Error ? error.message : error });
  }
};

export const postMessages = async (req: Request, res: Response) => {
  try {
    const { message, userId, groupId } = req.body;
    const newMessage = new messageModel({ message, userId, groupId });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ success: false, msg: error instanceof Error ? error.message : error });
  }
};
