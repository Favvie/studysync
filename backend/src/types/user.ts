import { Document } from "mongoose";

/**
 * Interface representing a User.
 *
 * @extends Document
 *
 * @property {string} [name] - The name of the user (optional).
 * @property {string} email - The email address of the user.
 * @property {string} password - The password of the user.
 */
export interface IUser extends Document {
    name?: string;
    email: string;
    password: string;
}

export type Payload = {
    sub: string;
    role?: string;
};

export type JWTPayload = {
    sub: string;
    iat?: number;
    exp?: number;
};
