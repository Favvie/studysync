import { Request, Response } from 'express';
import { userModel } from '../models/userModel.js';
import { groupModel } from '../models/groupModel.js';

export const getGroups = async (req: Request, res: Response) => {
    try {
        const groups = await groupModel.find();
        res.status(200).json({success: true, msg: groups});
    } catch (error) {
        res.status(500).json({ success: false, msg: error instanceof Error ? error.message : 'An error occured'});
    }
};

export const getGroup = async (req: Request, res: Response) => {
    try {
        const { groupId } = req.params;
        const group = await groupModel.findById({ groupId });
        res.status(200).json({success: true, msg: group});
    } catch (error) {
        res.status(500).json({ success: false, msg: error instanceof Error ? error.message : 'An error occured'});
    }
}

export const createGroup = async (req: Request, res: Response) => {
    try {
        const { name, visibility } = req.body;
        const group = await groupModel.create({ name, visibility });
        res.status(201).json({success: true, msg: group});
    } catch (error) {
        res.status(500).json({ success: false, msg: error instanceof Error ? error.message : 'An error occured'});
    }
}

export const updateGroup = async (req: Request, res: Response) => {
    try {
        const { groupId } = req.params;
        const group = await groupModel.findByIdAndUpdate({ _id: groupId }, req.body, { new: true });
        res.status(200).json({success: true, msg: group});
    } catch (error) {
        res.status(500).json({ success: false, msg: error instanceof Error ? error.message : 'An error occured'});
    }
}

export const deleteGroup = async (req: Request, res: Response) => {
    try {
        const { groupId } = req.params;
        await groupModel.findByIdAndDelete({ _id: groupId });
        res.status(200).json({ success: true, msg: 'Group deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, msg: error instanceof Error ? error.message : 'An error occured'});
    }
}

export const joinGroup = async (req: Request, res: Response) => {
    try {
        const userId = req.customData?.userId as string;
        if (!userId) {
            return res.status(400).json({ success: false, msg: 'User ID not found' });
        }
        const { groupId } = req.params;
        const group = await groupModel.findById({ _id: groupId });
        const user = await userModel.findById({ _id: userId });
        if (!group || !user) {
            return res.status(404).json({ success: false, msg: 'Group or User not found' });
        }
        group.usersId.push(userId);
        await group.save();
        res.status(200).json({success: true, msg: group});
    } catch (error) {
        res.status(500).json({ success: false, msg: error instanceof Error ? error.message : 'An error occured'});
    }
}

export const removeUserFromGroup = async (req: Request, res: Response) => {
    try {
        const { groupId, userId } = req.params;
        const group = await groupModel.findById({ _id: groupId });
        if (!group) {
            return res.status(404).json({ success: false, msg: 'Group not found' });
        }
        group.usersId = group.usersId.filter((id) => id !== userId);
        await group.save();
        res.status(200).json({success: true, msg: group});
    } catch (error) {
        res.status(500).json({ success: false, msg: error instanceof Error ? error.message : 'An error occured'});
    }
}
