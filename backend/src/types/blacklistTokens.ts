import { Document } from "mongoose";

/**
 * Interface representing a blacklisted token.
 * Extends the Document interface.
 */
export interface IBlacklistToken extends Document {
    token: string;
}
