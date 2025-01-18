import { Document } from "mongoose";

export interface IBlacklistToken extends Document {
    token: string;
}
