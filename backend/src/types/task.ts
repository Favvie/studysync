import { Document, Schema } from "mongoose";

export interface ITask extends Document {
    userId: Schema.Types.ObjectId;
    title: string;
    description: string;
    status: "done" | "in progress" | "not started";
}
