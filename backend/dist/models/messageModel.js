import mongoose from 'mongoose';
const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});
export const messageModel = mongoose.model('Message', messageSchema);
