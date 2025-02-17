import { Request, Response } from "express";
import { friendsModel } from "../models/friendsModel.js";
import { redisClient } from "../app.js";

/**
 * Retrieves the list of friends for the authenticated user.
 *
 * @param req - The request object, which should contain customData with the userId.
 * @param res - The response object used to send back the appropriate HTTP response.
 *
 * @returns A JSON response containing the list of friends or an error message.
 *
 * @throws 401 - If the token is not available in the request.
 * @throws 404 - If no friends are found for the user.
 * @throws 500 - If an internal server error occurs.
 */
export const getFriends = async (req: Request, res: Response) => {
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
        } else {
            const friends = await friendsModel.find({ userId });
            if (friends.length === 0) {
                res.status(404).json({
                    success: false,
                    msg: "No friends found!",
                });
                return;
            }
            await redisClient.set(
                `Friends:${userId}`,
                JSON.stringify(friends),
                {
                    EX: 3600,
                }
            );
            res.status(200).json({ success: true, msg: friends });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};

export const getFriend = async (req: Request, res: Response) => {
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
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};

export const addFriend = async (req: Request, res: Response) => {
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
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};

//the below function is when the user accepts a friend request, what controller will i use for if the other user(user) wants to accept a friend request from me:

export const changeFriendStatus = async (req: Request, res: Response) => {
    try {
        if (!req.customData || !req.customData.userId) {
            return res
                .status(401)
                .json({ success: false, msg: "Token is not available!" });
        }

        const userId = req.customData.userId;
        const friendId = req.params.friendId;
        const status = req.body.status;

        // Update the record for user -> friend
        const userToFriend = await friendsModel.findOneAndUpdate(
            { userId, friendId },
            { userId, friendId, status },
            { upsert: true, new: true } // Create if it doesn't exist
        );

        // Update the record for friend -> user
        const friendToUser = await friendsModel.findOneAndUpdate(
            { userId: friendId, friendId: userId },
            { userId: friendId, friendId: userId, status },
            { upsert: true, new: true } // Create if it doesn't exist
        );

        res.status(200).json({
            success: true,
            msg: "Friend status changed for both users!",
            userToFriend,
            friendToUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};

export const deleteFriend = async (req: Request, res: Response) => {
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
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};
