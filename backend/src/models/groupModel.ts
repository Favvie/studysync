import mongoose from "mongoose";
import { IGroup } from "../types/group";

const groupSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: false },
        usersId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        visibility: { type: String, required: true, default: "public" },
        metadata: {
            memberCount: { type: Number, required: false },
            invitationCode: { type: String, required: false },
            maxMembers: { type: Number, required: false },
            groupAvatar: { type: String, required: false },
            rules: { type: String, required: false },
            pinnedMessages: [
                { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
            ],
        },
    },
    { timestamps: true }
);

groupSchema.index({ name: "text", description: "text" });
groupSchema.index({ ownerId: 1 });

export const groupModel = mongoose.model<IGroup>("Group", groupSchema);
