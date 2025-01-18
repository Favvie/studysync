import mongoose from "mongoose";
import { IBlacklistToken } from "../types/blacklistTokens.js";

const blacklistTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const blacklistTokenModel = mongoose.model<IBlacklistToken>(
    "BlacklistToken",
    blacklistTokenSchema
);
