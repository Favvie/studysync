import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'; //jwt exports default commonjs module, avoid named exports
import { JWTPayload } from '../types/user';

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
 * @returns {void}
 */
export const authorizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const privateKey = process.env.PRIVATE_KEY as string;
    const idFromParam = req.params.id;
    const idFromBody = req.body.id;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const tokenString = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(tokenString, privateKey) as JWTPayload;
        if(!decoded) {
            res.status(401).json({success: false, msg: "You are not Authorized!"});
            return;
        }
        const id = decoded.sub;
        if ((id !== idFromParam) && (id !== idFromBody)) {
            res.status(401).json({success: false, msg: "You are not Authorized!"});
            return;
        }
        next();
    } catch (error) {
        return res.status(401).json({success: false, msg: (error instanceof Error) ? error.message : 'An error occurred' });
    }
}
