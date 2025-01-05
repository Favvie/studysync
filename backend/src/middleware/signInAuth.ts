import jwt from 'jsonwebtoken';
import { userModel } from '../models/userModel.js';
import { compare } from 'bcrypt';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../types/user.js';
dotenv.config();

export const signInAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body;
        const privateKey = process.env.PRIVATE_KEY as string;
        const refreshkey = process.env.PRIVATE_REFRESH_KEY as string;
        if (!privateKey || !refreshkey) {
            res.status(500).json({success: false, error: 'Please check your environment variables'});
            return;
        }
    
        if(!email || !password) {
            res.status(400).json({success: false, error: 'Please provide email and password'});
            return;
        }


        const userFound: IUser | null = await userModel.findOne({email});
        if(userFound === null) {
            res.status(404).json({success: false, error: 'userModel not found'});
            return;
        }

        const isMatch = await compare(password, userFound.password);
        if(isMatch === false) {
            res.status(401).json({success: false, error: 'Invalid credentials'});
            return;
        }
        // No roles implemented yet
        const token = jwt.sign({id: userFound._id}, privateKey, {expiresIn: '1h'});
        const refreshToken = jwt.sign({id: userFound._id}, refreshkey, {expiresIn: '7d'});

        res.status(200)
           .setHeader('RefreshToken', `Bearer ${refreshToken}`)
           .setHeader('Access-Control-Expose-Headers', 'RefreshToken')
           .json({
            success: true,
            message: 'Login successful',
            token
        });

        next();
    } catch (error){
        res.status(400).json({success: false, error: error instanceof Error? error.message: 'An error occured'})
    }
}
