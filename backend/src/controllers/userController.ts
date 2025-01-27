// Import necessary dependencies from express and other modules
import { Request, Response } from "express";
import { redisClient } from "../app.js";
import { userModel } from "../models/userModel.js";
import { hashPassword } from "../utils/hashPassword.js";
import { tokenModel } from "../models/tokenModel.js";
import { Payload } from "../types/user.js";
import { blacklistTokenModel } from "../models/blacklistTokens.js";
import jwt from "jsonwebtoken";
import { main } from "../utils/sendMailer.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

/**
 * Handle user registration
 * @param req Request object containing email and password in body
 * @param res Response object
 */
export const signUpController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        // Check if email already exists
        const emailIsPresent = await userModel.findOne({ email });
        if (emailIsPresent != null) {
            res.status(400).json({
                success: false,
                msg: "Email is already used!",
            });
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
        res.status(400).json({
            success: false,
            error: error instanceof Error ? error.message : "An error occurred",
        });
    }
};

/**
 * Handle user sign in
 * @param req Request object with customData from middleware
 * @param res Response object
 */
export const signInController = async (req: Request, res: Response) => {
    try {
        if (!req.customData) {
            return res
                .status(400)
                .json({ success: false, msg: "Custom data is missing" });
        }
        const { payload, headers, success, message, token } =
            req.customData as {
                payload: Payload;
                headers: {
                    RefreshToken: string;
                    "Access-Control-Expose-Headers": string;
                };
                success: boolean;
                message: string;
                token: string;
            };
        await tokenModel.create({
            userId: payload.sub,
            token: headers.RefreshToken,
        });

        res.cookie("refreshToken", headers.RefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }).json({
            success,
            message,
            token,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occured",
        });
    }
};

/**
 * Handle token refresh
 * @param req Request object containing refresh token in header
 * @param res Response object
 */
/**
 * Controller to handle refresh token requests.
 *
 * This controller verifies the provided refresh token, generates new access and refresh tokens,
 * and sends them back to the client. It also saves the new refresh token in the database.
 *
 * @param req - The request object, expected to contain the refresh token in cookies.
 * @param res - The response object, used to send back the new tokens or error messages.
 *
 * @returns A JSON response containing the new access token and sets a new refresh token in cookies.
 *
 * @throws Will return a 401 status if the refresh token is not provided.
 * @throws Will return a 404 status if the user associated with the refresh token is not found.
 * @throws Will return a 400 status for any other errors encountered during the process.
 */
export const refreshTokenController = async (req: Request, res: Response) => {
    try {
        let refreshToken = req.cookies.refreshToken;
        refreshToken = refreshToken.toString().split(" ")[1];
        console.log(refreshToken);
        const privateKey = process.env.PRIVATE_KEY as string;
        const privateRefreshKey = process.env.PRIVATE_REFRESH_KEY as string;
        // Validate refresh token
        if (!refreshToken) {
            res.status(401).json({ success: false, msg: "Access denied" });
            return;
        }
        // Verify and decode token
        const decoded = jwt.verify(refreshToken, privateRefreshKey) as {
            sub: string;
        };
        console.log(decoded);
        const userFound = await userModel.findById(decoded.sub);
        if (userFound === null) {
            res.status(404).json({
                success: false,
                msg: "userModel not found",
            });
            return;
        }

        // Generate new tokens
        const token = jwt.sign({ id: userFound._id }, privateKey, {
            expiresIn: "1h",
        });
        const newRefreshToken = jwt.sign(
            { id: userFound._id },
            privateRefreshKey,
            {
                expiresIn: "7d",
            }
        );

        // Save refresh token and send response
        await tokenModel.create({
            userId: userFound._id,
            token: newRefreshToken,
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }).json({ newAccessToken: token });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occured",
        });
    }
};

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
        const { name, email, password } = req.body;
        const paramsToUpdate = {
            ...(name && { name }),
            ...(email && { email }),
            ...(password && { password }),
        };
        if (Object.keys(paramsToUpdate).length === 0) {
            return res.status(400).json({
                success: false,
                msg: "No fields to update",
            });
        }
        console.log(paramsToUpdate);
        const userUpdated = await userModel.findByIdAndUpdate(
            req.params.id,
            paramsToUpdate,
            { new: true }
        );
        res.status(200).send(userUpdated);
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};

/**
 * Get all users
 * @param req Request object
 * @param res Response object
 */
export const getUsersController = async (req: Request, res: Response) => {
    try {
        const cachedData = await redisClient.get("users");
        if (cachedData) {
            res.status(200).json({
                success: true,
                msg: JSON.parse(cachedData),
            });
        } else {
            const users = await userModel.find();
            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    msg: "No users found",
                });
            }
            await redisClient.set("users", JSON.stringify(users), { EX: 3600 });
            res.status(200).json({ success: true, msg: users });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};

/**
 * Get user by ID
 * @param req Request object containing user ID
 * @param res Response object
 */
export const getUserByIdController = async (req: Request, res: Response) => {
    try {
        const userFound = await userModel.findById(req.params.id);
        if (userFound == null) {
            return res
                .status(400)
                .json({ success: false, msg: "No user found by this Id" });
        }
        res.json({ sucess: true, msg: userFound });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};

/**
 * Delete user by ID
 * @param req Request object containing user ID
 * @param res Response object
 */
export const deleteUserController = async (req: Request, res: Response) => {
    try {
        const userToBeDeletedId = req.params.id;
        const userDeleted =
            await userModel.findByIdAndDelete(userToBeDeletedId);
        if (!userDeleted) {
            return res
                .status(404)
                .json({ success: false, msg: "User not found" });
        }
        res.status(200).json({
            success: true,
            msg: "User deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};

/**
 * Handle user logout
 * @param req Request object
 * @param res Response object
 */
export const logoutController = async (req: Request, res: Response) => {
    try {
        let refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(204);
        }
        refreshToken = refreshToken.toString().split(" ")[1];
        await tokenModel.findOneAndDelete({
            token: refreshToken,
        });
        await blacklistTokenModel.create({ token: refreshToken });
        res.clearCookie("refreshToken").json({
            success: true,
            msg: "User logged out successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found",
            });
        }
        let token = await tokenModel.findOne({ userId: user._id }); //edit this line when you implement successful deletion of token after successful use
        if (token == null) {
            token = await tokenModel.create({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            });
        }
        const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/users/auth/reset-password/${token.token}`;
        const message = `Hello,

        We received a request to reset your password. If you did not make this request, please disregard this email. Otherwise, follow this link to reset your password:
        ${resetUrl}

        Best regards,
        Support Team`;
        try {
            await main(user.email, "Password Reset", message);
            res.status(200).json({
                success: true,
                msg: `Reset password link sent to ${user.email}!`,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                msg: `Email could not be sent, ${error instanceof Error ? error.message : error}`,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};

export const resetPasswordController = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const resetToken = await tokenModel.findOne({ token });
        if (!resetToken) {
            return res.status(404).json({
                success: false,
                msg: "Token not found",
            });
        }
        const user = await userModel.findById(resetToken.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found",
            });
        }
        // const passwordExists = await bcrypt.compare(password, user.password);
        // if (!passwordExists) {
        //     return res.status(400).json({
        //         success: false,
        //         msg: "New password cannot be the same as the old password",
        //     });
        // } //TODO: Uncomment this when correct implementation is done
        const hashedPassword = await hashPassword(password);
        await userModel.findByIdAndUpdate(user._id, {
            password: hashedPassword,
        });
        await tokenModel.findOneAndDelete({ token });
        res.status(200).json({
            success: true,
            msg: "Password reset successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};
