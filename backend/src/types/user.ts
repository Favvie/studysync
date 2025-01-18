import { Document } from 'mongoose';

export interface IUser extends Document {
    name?: string;
    email: string;
    password: string;
}

export type Payload = {
    sub: string,
    role?: string
}

export type JWTPayload = {
    sub: string,
    iat?: number,
    exp?: number
}
