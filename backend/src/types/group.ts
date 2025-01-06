import { Document } from 'mongoose';

export interface IGroup extends Document {
    name: string;
    description?: string;
    usersId: string[];
    ownerId: string;
    admins: string[];
    visibility: 'public' | 'private';
    metadata?: {
        memberCount?: number;
        invitationCode?: string;
        maxMembers?: number;
        groupAvatar?: string;
        rules?: string;
        pinnedMessages?: string[];
    };
}
