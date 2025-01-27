import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";
import { compare } from "bcrypt";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../types/user.js";
import { Payload } from "../types/user.js";
dotenv.config();

/**
 * Middleware for user authentication during sign-in process.
 * Validates user credentials and generates access and refresh tokens.
 *
 * @param {Request} req - Express request object containing email and password in body
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 *
 * @throws {Error} If environment variables are not set
 * @throws {Error} If email or password is missing
 * @throws {Error} If user is not found
 * @throws {Error} If password doesn't match
 *
 * @returns Calls next() with customData containing:
 *  - headers: Object with RefreshToken and CORS headers
 *  - success: boolean indicating successful login
 *  - message: success message
 *  - token: JWT access token
 *
 * @example
 * app.post('/signin', signInAuth, (req, res) => {
 *   // Handle successful authentication
 * });
 */
/**
 * Middleware to authenticate user sign-in.
 *
 * @param req - The request object containing user credentials.
 * @param res - The response object to send the response.
 * @param next - The next middleware function in the stack.
 *
 * @returns A JSON response with the authentication result or calls the next middleware.
 *
 * @throws Will return a 500 status if environment variables are not set.
 * @throws Will return a 404 status if the user is not found.
 * @throws Will return a 401 status if the password does not match.
 * @throws Will return a 400 status if an error occurs during the process.
 */
export const signInAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;
        const privateKey = process.env.PRIVATE_KEY as string;
        const refreshkey = process.env.PRIVATE_REFRESH_KEY as string;
        if (!privateKey || !refreshkey) {
            res.status(500).json({
                success: false,
                error: "Please check your environment variables",
            });
            return;
        }
        const userFound: IUser | null = await userModel.findOne({ email });
        if (userFound === null) {
            res.status(404).json({
                success: false,
                error: "userModel not found",
            });
            return;
        }

        const isMatch = await compare(password, userFound.password);
        if (isMatch === false) {
            res.status(401).json({
                success: false,
                error: "Invalid credentials",
            });
            return;
        }
        // No roles implemented yet
        const payload: Payload = {
            sub: userFound._id as string,
        };
        const token = jwt.sign(payload, privateKey, { expiresIn: "1h" });
        const refreshToken = jwt.sign(payload, refreshkey, { expiresIn: "7d" });

        req.customData = {
            payload,
            headers: {
                RefreshToken: `Bearer ${refreshToken}`,
                "Access-Control-Expose-Headers": "RefreshToken",
            },
            success: true,
            message: "Login successful",
            token,
        };
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error instanceof Error ? error.message : "An error occured",
        });
    }
};
