import { Document } from "mongoose";

/**
 * Represents a group with various properties and metadata.
 *
 * @interface IGroup
 * @extends {Document}
 *
 * @property {string} name - The name of the group.
 * @property {string} [description] - An optional description of the group.
 * @property {string[]} usersId - An array of user IDs who are members of the group.
 * @property {string} ownerId - The ID of the user who owns the group.
 * @property {string[]} admins - An array of user IDs who are administrators of the group.
 * @property {"public" | "private"} visibility - The visibility status of the group, either "public" or "private".
 * @property {Object} [metadata] - Optional metadata related to the group.
 * @property {number} [metadata.memberCount] - The number of members in the group.
 * @property {string} [metadata.invitationCode] - An optional invitation code for the group.
 * @property {number} [metadata.maxMembers] - The maximum number of members allowed in the group.
 * @property {string} [metadata.groupAvatar] - An optional URL to the group's avatar image.
 * @property {string} [metadata.rules] - Optional rules for the group.
 * @property {string[]} [metadata.pinnedMessages] - An array of IDs for messages pinned in the group.
 */
export interface IGroup extends Document {
    name: string;
    description?: string;
    usersId: string[];
    ownerId: string;
    admins: string[];
    visibility: "public" | "private";
    metadata?: {
        memberCount?: number;
        invitationCode?: string;
        maxMembers?: number;
        groupAvatar?: string;
        rules?: string;
        pinnedMessages?: string[];
    };
}
