import "express";

/**
 * Extends the Express Request interface to include an optional `customData` property.
 *
 * @module express
 * @interface Request
 * @property {Object.<string, unknown>} [customData] - An optional object to store custom data.
 */
declare module "express" {
    export interface Request {
        customData?: {
            [key: string]: unknown;
        };
    }
}
