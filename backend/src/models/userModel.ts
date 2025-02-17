import mongoose from "mongoose";
import { IUser } from "../types/user";

/**
 * Mongoose schema definition for User model
 */

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const userModel = mongoose.model<IUser>("User", UserSchema);
