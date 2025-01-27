import { Document } from "mongoose";
import { IUser } from "./user";
import { IGroup } from "./group";

/**
 * Interface representing a message document.
 *
 * @interface IMessage
 * @extends {Document}
 *
 * @property {string} message - The content of the message.
 * @property {IUser['_id']} userId - The ID of the user who sent the message.
 * @property {IGroup['_id']} groupId - The ID of the group to which the message belongs.
 */
export interface IMessage extends Document {
    message: string;
    userId: IUser["_id"];
    groupId: IGroup["_id"];
}
