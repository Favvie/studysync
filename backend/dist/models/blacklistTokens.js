import mongoose from "mongoose";
const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
}, { timestamps: true });
export const blacklistTokenModel = mongoose.model("BlacklistToken", blacklistTokenSchema);
