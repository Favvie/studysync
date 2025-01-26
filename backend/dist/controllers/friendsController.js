import { friendsModel } from "../models/friendsModel.js";
import { redisClient } from "../app.js";
export const getFriends = async (req, res) => {
    try {
        if (!req.customData || !req.customData.userId) {
            return res
                .status(401)
                .json({ success: false, msg: "Token is not available!" });
        }
        const userId = req.customData.userId;
        const cachedFriends = await redisClient.get(`Friends:${userId}`);
        if (cachedFriends) {
            res.status(200).json({
                success: true,
                msg: JSON.parse(cachedFriends),
            });
        }
        else {
            const friends = await friendsModel.find({ userId });
            if (friends.length === 0) {
                res.status(404).json({
                    success: false,
                    msg: "No friends found!",
                });
                return;
            }
            await redisClient.set(`Friends:${userId}`, JSON.stringify(friends), {
                EX: 3600,
            });
            res.status(200).json({ success: true, msg: friends });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};
export const getFriend = async (req, res) => {
    try {
        if (!req.customData || !req.customData.userId) {
            return res
                .status(401)
                .json({ success: false, msg: "Token is not available!" });
        }
        const userId = req.customData.userId;
        const friendId = req.params.friendId;
        const friend = await friendsModel.findOne({ userId, friendId });
        res.status(200).json({ success: true, msg: friend });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};
export const addFriend = async (req, res) => {
    try {
        if (!req.customData || !req.customData.userId) {
            return res
                .status(401)
                .json({ success: false, msg: "Token is not available!" });
        }
        const userId = req.customData.userId;
        const friendId = req.body.friendId;
        const friend = await friendsModel.create({ userId, friendId });
        res.status(200).json({ success: true, msg: friend });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};
export const changeFriendStatus = async (req, res) => {
    try {
        if (!req.customData || !req.customData.userId) {
            return res
                .status(401)
                .json({ success: false, msg: "Token is not available!" });
        }
        const userId = req.customData.userId;
        const friendId = req.params.friendId;
        const status = req.body.status;
        const userToFriend = await friendsModel.findOneAndUpdate({ userId, friendId }, { userId, friendId, status }, { upsert: true, new: true });
        const friendToUser = await friendsModel.findOneAndUpdate({ userId: friendId, friendId: userId }, { userId: friendId, friendId: userId, status }, { upsert: true, new: true });
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
};
export const deleteFriend = async (req, res) => {
    try {
        if (!req.customData || !req.customData.userId) {
            return res
                .status(401)
                .json({ success: false, msg: "Token is not available!" });
        }
        const userId = req.customData.userId;
        const friendId = req.params.friendId;
        await friendsModel.deleteOne({ userId, friendId });
        res.status(200).json({ success: true, msg: "Friend deleted!" });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};
