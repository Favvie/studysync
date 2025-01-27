import { Document, Schema } from "mongoose";

/**
 * Interface representing a Task document.
 *
 * @interface ITask
 * @extends {Document}
 *
 * @property {Schema.Types.ObjectId} userId - The ID of the user associated with the task.
 * @property {string} title - The title of the task.
 * @property {string} description - A detailed description of the task.
 * @property {"done" | "in progress" | "not started"} status - The current status of the task.
 */
export interface ITask extends Document {
    userId: Schema.Types.ObjectId;
    title: string;
    description: string;
    status: "done" | "in progress" | "not started";
}
