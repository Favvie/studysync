import mongoose from "mongoose";
const friendsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    friendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "blocked"],
        default: "pending",
    },
}, { timestamps: true });
friendsSchema.index({ userId: 1, friendId: 1 }, { unique: true });
export const friendsModel = mongoose.model("Friends", friendsSchema);
