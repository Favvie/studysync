var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { userModel } from '../models/userModel.js';
import { groupModel } from '../models/groupModel.js';
export const getGroups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groups = yield groupModel.find();
        res.status(200).json({ success: true, msg: groups });
    }
    catch (error) {
        res.status(500).json({ success: false, msg: error instanceof Error ? error.message : 'An error occured' });
    }
});
export const getGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupId } = req.params;
        const group = yield groupModel.findById({ groupId });
        res.status(200).json({ success: true, msg: group });
    }
    catch (error) {
        res.status(500).json({ success: false, msg: error instanceof Error ? error.message : 'An error occured' });
    }
});
export const createGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, visibility } = req.body;
        const group = yield groupModel.create({ name, visibility });
        res.status(201).json({ success: true, msg: group });
    }
    catch (error) {
        res.status(500).json({ success: false, msg: error instanceof Error ? error.message : 'An error occured' });
    }
});
export const updateGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupId } = req.params;
        const group = yield groupModel.findByIdAndUpdate({ _id: groupId }, req.body, { new: true });
        res.status(200).json({ success: true, msg: group });
    }
    catch (error) {
        res.status(500).json({ success: false, msg: error instanceof Error ? error.message : 'An error occured' });
    }
});
export const deleteGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupId } = req.params;
        yield groupModel.findByIdAndDelete({ _id: groupId });
        res.status(200).json({ success: true, msg: 'Group deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, msg: error instanceof Error ? error.message : 'An error occured' });
    }
});
export const joinGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.customData) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(400).json({ success: false, msg: 'User ID not found' });
        }
        const { groupId } = req.params;
        const group = yield groupModel.findById({ _id: groupId });
        const user = yield userModel.findById({ _id: userId });
        if (!group || !user) {
            return res.status(404).json({ success: false, msg: 'Group or User not found' });
        }
        group.usersId.push(userId);
        yield group.save();
        res.status(200).json({ success: true, msg: group });
    }
    catch (error) {
        res.status(500).json({ success: false, msg: error instanceof Error ? error.message : 'An error occured' });
    }
});
export const removeUserFromGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupId, userId } = req.params;
        const group = yield groupModel.findById({ _id: groupId });
        if (!group) {
            return res.status(404).json({ success: false, msg: 'Group not found' });
        }
        group.usersId = group.usersId.filter((id) => id !== userId);
        yield group.save();
        res.status(200).json({ success: true, msg: group });
    }
    catch (error) {
        res.status(500).json({ success: false, msg: error instanceof Error ? error.message : 'An error occured' });
    }
});
