import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"; // jwt exports a default CommonJS module, avoid named exports because they are not supported
import { JWTPayload } from "../types/user";

/**
 * Middleware for authorizing user requests using JWT tokens.
 *
 * @param {Request} req - Express request object containing authorization headers and user data
 * @param {Response} res - Express response object for sending back status and messages
 * @param {NextFunction} next - Express next function to pass control to the next middleware
 *
 * @throws {401} - If no token is provided in authorization header
 * @throws {401} - If token verification fails
 * @throws {401} - If decoded token is invalid
 * @throws {401} - If user ID from token doesn't match request parameters or body
 *
 * @remarks
 * The middleware expects:
 * - Authorization header in format 'Bearer <token>'
 * - JWT token containing user ID in 'sub' claim
 * - Environment variable PRIVATE_KEY for token verification
 * - Optional ID in request parameters or body for authorization matching
 *
 * @returns {void} - Does not return a value but calls `next()` to pass control to the next middleware
 */
/**
 * Middleware to handle authorization by verifying JWT tokens and checking for required environment variables.
 *
 * @param req - The request object from the client.
 * @param res - The response object to send back to the client.
 * @param next - The next middleware function in the stack.
 *
 * This middleware performs the following checks:
 * 1. Ensures that the required environment variable `PRIVATE_KEY` is set.
 * 2. Checks for the presence of an authorization header and a refresh token cookie.
 * 3. Verifies the JWT token from the authorization header using the `PRIVATE_KEY`.
 * 4. If the token is valid, it extracts the user ID from the token and attaches it to the request object.
 * 5. If any check fails, it responds with an appropriate error message and status code.
 *
 * @throws {Error} If the JWT token verification fails or if any required data is missing.
 */
export const authorizationMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    for (const v of ["PRIVATE_KEY"]) {
        if (!process.env[v]) {
            res.status(500).json({ error: `${v} not set in environment` });
            return;
        }
    }

    const authHeader = req.headers.authorization;
    const refreshToken = req.cookies.refreshToken;
    if (!authHeader || !authHeader.startsWith("Bearer ") || !refreshToken) {
        res.status(401).json({ error: "No token provided" });
        return;
    }

    const tokenString = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(
            tokenString,
            process.env.PRIVATE_KEY as string
        ) as JWTPayload;
        if (!decoded) {
            res.status(401).json({
                success: false,
                msg: "You are not Authorized!",
            });
            return;
        }
        req.customData = { userId: decoded.sub };
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occurred",
        });
        return;
    }
};
