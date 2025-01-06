import { Document } from 'mongoose';
import { IUser } from './user';

export interface IMessage extends Document {
    message: string;
    user: IUser['_id'];
    }
