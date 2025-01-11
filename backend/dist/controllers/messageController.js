var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { messageModel } from '../models/messageModel.js';
export const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groupId = req.query.groupId;
        const messages = (yield messageModel.find({ groupId }));
        if (messages === null) {
            res.status(404).json({ success: false, msg: 'No messages found!' });
            return;
        }
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ success: false, msg: error instanceof Error ? error.message : error });
    }
});
export const postMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message, userId, groupId } = req.body;
        const newMessage = new messageModel({ message, userId, groupId });
        yield newMessage.save();
        res.status(201).json(newMessage);
    }
    catch (error) {
        res.status(500).json({ success: false, msg: error instanceof Error ? error.message : error });
    }
});
