import { Request, Response } from "express";
import { userModel } from "../models/userModel.js";
import { groupModel } from "../models/groupModel.js";
import { redisClient } from "../app.js";

export const getGroups = async (req: Request, res: Response) => {
    try {
        const userId = req.customData?.userId as string;
        if (!userId) {
            return res
                .status(400)
                .json({ success: false, msg: "User ID not found" });
        }
        const cachedGroup = await redisClient.get("Groups");
        if (cachedGroup) {
            res.status(200).json({
                success: true,
                msg: JSON.parse(cachedGroup),
            });
        } else {
            const groups = await groupModel.find({
                $or: [{ usersId: userId }, { admins: userId }],
            });
            if (groups.length === 0) {
                res.status(200).json({
                    success: true,
                    msg: "No groups found!",
                });
                return;
            }
            await redisClient.set("Groups", JSON.stringify(groups), {
                EX: 3600,
            });
            res.status(200).json({ success: true, msg: groups });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occurred",
        });
    }
};

export const getGroup = async (req: Request, res: Response) => {
    try {
        const { groupId } = req.params;
        const userId = req.customData?.userId as string;
        const group = await groupModel.findOne({
            _id: groupId,
            $or: [{ usersId: userId }, { admins: userId }],
        });
        if (!group) {
            return res.status(404).json({
                success: false,
                msg: "Group not found or you do not have access",
            });
        }
        res.status(200).json({ success: true, msg: group });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occured",
        });
    }
};

export const createGroup = async (req: Request, res: Response) => {
    try {
        const userId = req.customData?.userId as string;
        const { name, visibility, description } = req.body;
        const nameAlreadyExists = await groupModel.find({ name });
        if (nameAlreadyExists.length > 0) {
            return res
                .status(400)
                .json({ success: false, msg: "Group name already exists" });
        }
        const group = await groupModel.create({
            name,
            visibility,
            description,
            admins: [userId],
            usersId: [userId],
        });
        res.status(201).json({ success: true, msg: group });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occured",
        });
    }
};

export const updateGroup = async (req: Request, res: Response) => {
    try {
        const { groupId } = req.params;
        const group = await groupModel.findByIdAndUpdate(
            { _id: groupId },
            req.body,
            { new: true }
        );
        res.status(200).json({ success: true, msg: group });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occured",
        });
    }
};

export const deleteGroup = async (req: Request, res: Response) => {
    try {
        const userId = req.customData?.userId as string;
        if (!userId) {
            return res
                .status(400)
                .json({ success: false, msg: "User ID not found" });
        }
        const isGroupOwner = await groupModel.find({ ownerId: userId }); //TODO: Only group owner can delete group for now, fix later
        if (!isGroupOwner) {
            return res
                .status(403)
                .json({ success: false, msg: "You are not the group owner" });
        }
        const { groupId } = req.params;
        await groupModel.findByIdAndDelete({ _id: groupId });
        res.status(200).json({
            success: true,
            msg: "Group deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occured",
        });
    }
};

export const joinGroup = async (req: Request, res: Response) => {
    try {
        const userId = req.customData?.userId as string;
        if (!userId) {
            return res
                .status(400)
                .json({ success: false, msg: "User ID not found" });
        }
        const { groupId } = req.params;
        const group = await groupModel.findById({ _id: groupId });
        const user = await userModel.findById({ _id: userId });
        if (!group || !user) {
            return res
                .status(404)
                .json({ success: false, msg: "Group or User not found" });
        }
        if (group.usersId.includes(userId) || group.admins.includes(userId)) {
            return res
                .status(400)
                .json({ success: false, msg: "User already in group" });
        }
        if (group) {
            group.usersId.push(userId);
            await group.save();
        }
        res.status(200).json({ success: true, msg: group });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occured",
        });
    }
};

export const removeUserFromGroup = async (req: Request, res: Response) => {
    try {
        const { groupId, userId } = req.params;
        const group = await groupModel.findById({ _id: groupId });
        if (!group) {
            return res
                .status(404)
                .json({ success: false, msg: "Group not found" });
        }
        group.usersId = group.usersId.filter((id) => id !== userId);
        await group.save();
        res.status(200).json({ success: true, msg: group });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occured",
        });
    }
};
