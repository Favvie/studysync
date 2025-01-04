import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { compare } from 'bcrypt';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
dotenv.config();

export const signInAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body;
        const privateKey = process.env.PRIVATE_KEY as string;
        if(!email || !password) {
            res.status(400).json({success: false, error: 'Please provide email and password'});
            return;
        }


        const user = await User.findOne({email});
        if(user === null) {
            res.status(404).json({success: false, error: 'User not found'});
            return;
        }

        const isMatch = await compare(password, user.password);
        if(isMatch === false) {
            res.status(401).json({success: false, error: 'Invalid credentials'});
            return;
        }

        const token = jwt.sign({id: user._id}, privateKey, {expiresIn: '1h'});

        res.status(200)
           .setHeader('Authorization', `Bearer ${token}`)
           .setHeader('Access-Control-Expose-Headers', 'Authorization')
           .json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
           });

        next();
    } catch (error){
        res.status(400).json({success: false, error: error instanceof Error? error.message: 'An error occured'})
    }
}
