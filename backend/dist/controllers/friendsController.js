var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { friendsModel } from "../models/friendsModel.js";
export const getFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.customData || !req.customData.userId) {
            return res
                .status(401)
                .json({ success: false, msg: "Token is not available!" });
        }
        const userId = req.customData.userId;
        const friends = yield friendsModel.find({ userId });
        res.status(200).json({ success: true, msg: friends });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
});
export const getFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.customData || !req.customData.userId) {
            return res
                .status(401)
                .json({ success: false, msg: "Token is not available!" });
        }
        const userId = req.customData.userId;
        const friendId = req.params.friendId;
        const friend = yield friendsModel.findOne({ userId, friendId });
        res.status(200).json({ success: true, msg: friend });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
});
export const addFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.customData || !req.customData.userId) {
            return res
                .status(401)
                .json({ success: false, msg: "Token is not available!" });
        }
        const userId = req.customData.userId;
        const friendId = req.body.friendId;
        const friend = yield friendsModel.create({ userId, friendId });
        res.status(200).json({ success: true, msg: friend });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
});
export const changeFriendStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.customData || !req.customData.userId) {
            return res
                .status(401)
                .json({ success: false, msg: "Token is not available!" });
        }
        const userId = req.customData.userId;
        const friendId = req.params.friendId;
        const status = req.body.status;
        const userToFriend = yield friendsModel.findOneAndUpdate({ userId, friendId }, { userId, friendId, status }, { upsert: true, new: true });
        const friendToUser = yield friendsModel.findOneAndUpdate({ userId: friendId, friendId: userId }, { userId: friendId, friendId: userId, status }, { upsert: true, new: true });
        res.status(200).json({
            success: true,
            msg: "Friend status changed for both users!",
            userToFriend,
            friendToUser,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
});
export const deleteFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.customData || !req.customData.userId) {
            return res
                .status(401)
                .json({ success: false, msg: "Token is not available!" });
        }
        const userId = req.customData.userId;
        const friendId = req.params.friendId;
        yield friendsModel.deleteOne({ userId, friendId });
        res.status(200).json({ success: true, msg: "Friend deleted!" });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
});
