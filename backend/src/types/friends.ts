import { Document } from "mongoose";

/**
 * Interface representing a Friend relationship in the system.
 * Extends the Document interface.
 */
export interface IFriend extends Document {
    userId: string;
    friendId: string;
    status: "pending" | "accepted" | "blocked";
}
