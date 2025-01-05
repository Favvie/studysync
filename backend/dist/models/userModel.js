import mongoose from "mongoose";
/**
 * Mongoose schema definition for User model
 */
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true });
export const userModel = mongoose.model('User', UserSchema);
