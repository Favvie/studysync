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
export const getMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = yield messageModel.findById(req.params.user);
        const messages = yield messageModel.findById({ _id: userId });
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : error });
    }
});
export const postMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, message } = req.body;
        const newMessage = new messageModel({ user, message });
        yield newMessage.save();
        res.status(201).json(newMessage);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : error });
    }
});
