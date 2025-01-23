import mongoose from "mongoose";
import { IMessage } from "../types/message";

const messageSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true,
        },
    },
    { timestamps: true }
);

export const messageModel = mongoose.model<IMessage>("Message", messageSchema);
