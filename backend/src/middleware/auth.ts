import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'; //jwt exports default commonjs module, avoid named exports
import { JWTPayload } from '../types/user';

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
        //how do I check if the right person is accessing their information:
        if ((id !== idFromParam) && (id !== idFromBody)) {
            res.status(401).json({success: false, msg: "You are not Authorized!"});
            return;
        }
        next();
    } catch (error) {
        return res.status(401).json({success: false, msg: (error instanceof Error) ? error.message : 'An error occurred' });
    }
}
