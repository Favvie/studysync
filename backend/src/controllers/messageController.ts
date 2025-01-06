import { Request, Response } from 'express';
import { messageModel } from '../models/messageModel.js';

export const getMessage = async (req: Request, res: Response) => {
  try {
    const userId = await messageModel.findById(req.params.user);
    const messages = await messageModel.findById({_id: userId});
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ success: false, message: error instanceof Error ? error.message : error });
  }
};

export const postMessage = async (req: Request, res: Response) => {
  try {
    const { user, message } = req.body;
    const newMessage = new messageModel({ user, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ success: false, message: error instanceof Error ? error.message : error });
  }
};
