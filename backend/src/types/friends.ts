import { Document } from 'mongoose';

export interface IFriend extends Document {
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'blocked';
}
