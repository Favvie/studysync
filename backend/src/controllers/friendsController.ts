import { Request, Response } from "express";
import { friendsModel } from "../models/friendsModel.js";

export const getFriends = async (req: Request, res: Response) => {
  try {
    if (!req.customData || !req.customData.userId) {
      return res
        .status(401)
        .json({ success: false, msg: "Token is not available!" });
    }
    const userId = req.customData.userId;
    const friends = await friendsModel.find({ userId });
    res.status(200).json({ success: true, msg: friends });
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
