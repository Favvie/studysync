import { Document } from 'mongoose';
import { IUser } from './user';
import { IGroup } from './group';

export interface IMessage extends Document {
    message: string;
    userId: IUser['_id'];
    groupId: IGroup['_id'];
    }
