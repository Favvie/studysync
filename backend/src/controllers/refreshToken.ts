import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/userModel.js';
import dotenv from 'dotenv';
import { Token } from '../models/token.js';
dotenv.config();

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.header('RefreshToken');
        const privateKey = process.env.PRIVATE_KEY as string;
        const privateRefreshKey = process.env.PRIVATE_REFRESH_KEY as string;
        if(!refreshToken) {
            res.status(401).json({success: false, error: 'Access denied'});
            return;
        }

        const decoded = jwt.verify(refreshToken, privateRefreshKey) as {id: string};
        const userFound = await userModel.findById(decoded.id);
        if(userFound === null) {
            res.status(404).json({success: false, error: 'userModel not found'});
            return;
        }
        // No roles implemented yet
        const token = jwt.sign({id: userFound._id}, privateKey, {expiresIn: '1h'});
        const newRefreshToken = jwt.sign({id: userFound._id}, privateRefreshKey, {expiresIn: '7d'});

        await Token.create({userId: userFound._id, token: newRefreshToken});

        res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
        }).json({  newAccessToken: token });

        next();
    } catch (error){
        res.status(400).json({success: false, error: error instanceof Error? error.message: 'An error occured'})
    }
}