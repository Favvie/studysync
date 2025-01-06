import { Schema, model } from 'mongoose';
/**
 * Schema definition for authentication tokens
 * @typedef {Object} TokenSchema
 * @property {ObjectId} userId - Reference to the user model
 * @property {string} token - The authentication token string
 * @property {Date} createdAt - Timestamp of token creation, automatically expires after 12 hours (43200 seconds)
 */
const tokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});
export const tokenModel = model('Token', tokenSchema);
