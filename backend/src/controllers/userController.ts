// Import necessary dependencies from express and other modules
import { Request, Response, NextFunction } from 'express';
import { userModel } from '../models/userModel.js';
import { hashPassword } from '../utils/hashPassword.js';
import { tokenModel } from '../models/tokenModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Handle user registration
 * @param req Request object containing email and password in body
 * @param res Response object
 */
export const signUp = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        // Validate required fields
        if (!email || !password) {
            res.status(400).json({ success: false, msg: "Email and password are required!" });
            return;
        }
        // Check if email already exists
        const emailIsPresent = await userModel.findOne({ email });
        if (emailIsPresent !== null) {
            res.status(400).json({ success: false, msg: "Email is already used!" });
            return;
        }
        // Hash password and create new user
        const hashedPassword = await hashPassword(password);
        const newUser = new userModel({
            email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ success: true, error: error instanceof Error ? error.message : 'An error occurred' });
    }
}

/**
 * Handle user sign in
 * @param req Request object with customData from middleware
 * @param res Response object
 */
export const signIn = (req: Request, res: Response) => {
    if (!req.customData) {
        return res.status(400).json({ success: false, message: 'Custom data is missing' });
    }
    const { headers, success, message, token } = req.customData as { headers: { RefreshToken: string, 'Access-Control-Expose-Headers': string }, success: boolean, message: string, token: string };
    res.cookie('refreshToken', headers.RefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json({
        success,
        message,
        token
    })
}

/**
 * Handle token refresh
 * @param req Request object containing refresh token in header
 * @param res Response object
 * @param next NextFunction
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.header('RefreshToken');
        const privateKey = process.env.PRIVATE_KEY as string;
        const privateRefreshKey = process.env.PRIVATE_REFRESH_KEY as string;
        
        // Validate refresh token
        if (!refreshToken) {
            res.status(401).json({ success: false, error: 'Access denied' });
            return;
        }

        // Verify and decode token
        const decoded = jwt.verify(refreshToken, privateRefreshKey) as { id: string };
        const userFound = await userModel.findById(decoded.id);
        if (userFound === null) {
            res.status(404).json({ success: false, error: 'userModel not found' });
            return;
        }

        // Generate new tokens
        const token = jwt.sign({ id: userFound._id }, privateKey, { expiresIn: '1h' });
        const newRefreshToken = jwt.sign({ id: userFound._id }, privateRefreshKey, { expiresIn: '7d' });

        // Save refresh token and send response
        await tokenModel.create({ userId: userFound._id, token: newRefreshToken });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).json({ newAccessToken: token });

        next();
    } catch (error) {
        res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'An error occured' })
    }
}

/**
 * Update user information
 * @param req Request object containing user data to update
 * @param res Response object
 */
export const patchUserController = async (req: Request, res: Response) => {
    const { password } = req.body;
    // Hash new password if provided
    if (password) {
        const hashedPassword = await hashPassword(password);
        req.body.password = hashedPassword;
    }
    try {
        const userUpdated = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(userUpdated);
    } catch (error) {
        res.status(500).json({ success: false, msg: error instanceof Error ? error.message : error });
    }
}

/**
 * Get all users
 * @param req Request object
 * @param res Response object
 */
export const getUserController = async (req: Request, res: Response) => {
    const users = await userModel.find();
    res.json({ sucess: true, msg: users });
}

/**
 * Get user by ID
 * @param req Request object containing user ID
 * @param res Response object
 */
export const getUserByIdController = async (req: Request, res: Response) => {
    const userFound = await userModel.findById(req.params.id);
    res.json({ sucess: true, msg: userFound });
}

/**
 * Delete user by ID
 * @param req Request object containing user ID
 * @param res Response object
 */
export const deleteUserController = async (req: Request, res: Response) => {
    try {
        const userDeleted = await userModel.findByIdAndDelete(req.params.id);
        if (!userDeleted) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }
        res.status(200).json({ success: true, msg: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : error });
    }
}
