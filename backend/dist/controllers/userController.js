import { redisClient } from "../app.js";
import { userModel } from "../models/userModel.js";
import { hashPassword } from "../utils/hashPassword.js";
import { tokenModel } from "../models/tokenModel.js";
import { blacklistTokenModel } from "../models/blacklistTokens.js";
import jwt from "jsonwebtoken";
import { main } from "../utils/sendMailer.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
export const signUpController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const emailIsPresent = await userModel.findOne({ email });
        if (emailIsPresent != null) {
            res.status(400).json({
                success: false,
                msg: "Email is already used!",
            });
            return;
        }
        const hashedPassword = await hashPassword(password);
        const newUser = new userModel({
            email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error instanceof Error ? error.message : "An error occurred",
        });
    }
};
export const signInController = async (req, res) => {
    try {
        if (!req.customData) {
            return res
                .status(400)
                .json({ success: false, msg: "Custom data is missing" });
        }
        const { payload, headers, success, message, token } = req.customData;
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occured",
        });
    }
};
export const refreshTokenController = async (req, res) => {
    try {
        let refreshToken = req.cookies.refreshToken;
        refreshToken = refreshToken.toString().split(" ")[1];
        console.log(refreshToken);
        const privateKey = process.env.PRIVATE_KEY;
        const privateRefreshKey = process.env.PRIVATE_REFRESH_KEY;
        if (!refreshToken) {
            res.status(401).json({ success: false, msg: "Access denied" });
            return;
        }
        const decoded = jwt.verify(refreshToken, privateRefreshKey);
        console.log(decoded);
        const userFound = await userModel.findById(decoded.sub);
        if (userFound === null) {
            res.status(404).json({
                success: false,
                msg: "userModel not found",
            });
            return;
        }
        const token = jwt.sign({ id: userFound._id }, privateKey, {
            expiresIn: "1h",
        });
        const newRefreshToken = jwt.sign({ id: userFound._id }, privateRefreshKey, {
            expiresIn: "7d",
        });
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occured",
        });
    }
};
export const patchUserController = async (req, res) => {
    const { password } = req.body;
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
        const userUpdated = await userModel.findByIdAndUpdate(req.params.id, paramsToUpdate, { new: true });
        res.status(200).send(userUpdated);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};
export const getUsersController = async (req, res) => {
    try {
        const cachedData = await redisClient.get("users");
        if (cachedData) {
            res.status(200).json({
                success: true,
                msg: JSON.parse(cachedData),
            });
        }
        else {
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};
export const getUserByIdController = async (req, res) => {
    try {
        const userFound = await userModel.findById(req.params.id);
        if (userFound == null) {
            return res
                .status(400)
                .json({ success: false, msg: "No user found by this Id" });
        }
        res.json({ sucess: true, msg: userFound });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};
export const deleteUserController = async (req, res) => {
    try {
        const userToBeDeletedId = req.params.id;
        const userDeleted = await userModel.findByIdAndDelete(userToBeDeletedId);
        if (!userDeleted) {
            return res
                .status(404)
                .json({ success: false, msg: "User not found" });
        }
        res.status(200).json({
            success: true,
            msg: "User deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};
export const logoutController = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};
export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found",
            });
        }
        let token = await tokenModel.findOne({ userId: user._id });
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
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                msg: `Email could not be sent, ${error instanceof Error ? error.message : error}`,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};
export const resetPasswordController = async (req, res) => {
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
        const hashedPassword = await hashPassword(password);
        await userModel.findByIdAndUpdate(user._id, {
            password: hashedPassword,
        });
        await tokenModel.findOneAndDelete({ token });
        res.status(200).json({
            success: true,
            msg: "Password reset successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
};
