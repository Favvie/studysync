import {  Schema, model } from 'mongoose';

const tokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'userModel' },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

export const tokenModel = model('Token', tokenSchema);
