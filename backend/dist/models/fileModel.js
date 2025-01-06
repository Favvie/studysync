import mongoose from "mongoose";
const fileMetaDataSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true,
    },
    fileType: {
        type: String,
        required: true,
    },
    fileSize: {
        type: Number,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
        required: true,
    }
}, { timestamps: true });
export const fileModel = mongoose.model("FileMetaData", fileMetaDataSchema);
