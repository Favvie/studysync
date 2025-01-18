var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { userModel } from "../models/userModel.js";
import { hashPassword } from "../utils/hashPassword.js";
import { tokenModel } from "../models/tokenModel.js";
import { blacklistTokenModel } from "../models/blacklistTokens.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
/**
 * Handle user registration
 * @param req Request object containing email and password in body
 * @param res Response object
 */
export const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validate required fields
        if (!email || !password) {
            res.status(400).json({
                success: false,
                msg: "Email and password are required!",
            });
            return;
        }
        // Check if email already exists
        const emailIsPresent = yield userModel.findOne({ email });
        if (emailIsPresent !== null) {
            res.status(400).json({
                success: false,
                msg: "Email is already used!",
            });
            return;
        }
        // Hash password and create new user
        const hashedPassword = yield hashPassword(password);
        const newUser = new userModel({
            email,
            password: hashedPassword,
        });
        yield newUser.save();
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(400).json({
            success: true,
            error: error instanceof Error ? error.message : "An error occurred",
        });
    }
});
/**
 * Handle user sign in
 * @param req Request object with customData from middleware
 * @param res Response object
 */
export const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.customData) {
            return res
                .status(400)
                .json({ success: false, msg: "Custom data is missing" });
        }
        const { payload, headers, success, message, token } = req.customData;
        yield tokenModel.create({
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
});
/**
 * Handle token refresh
 * @param req Request object containing refresh token in header
 * @param res Response object
 */
export const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.header("RefreshToken");
        const privateKey = process.env.PRIVATE_KEY;
        const privateRefreshKey = process.env.PRIVATE_REFRESH_KEY;
        // Validate refresh token
        if (!refreshToken) {
            res.status(401).json({ success: false, msg: "Access denied" });
            return;
        }
        // Verify and decode token
        const decoded = jwt.verify(refreshToken, privateRefreshKey);
        const userFound = yield userModel.findById(decoded.id);
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
        const newRefreshToken = jwt.sign({ id: userFound._id }, privateRefreshKey, {
            expiresIn: "7d",
        });
        // Save refresh token and send response
        yield tokenModel.create({
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
});
/**
 * Update user information
 * @param req Request object containing user data to update
 * @param res Response object
 */
export const patchUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    // Hash new password if provided
    if (password) {
        const hashedPassword = yield hashPassword(password);
        req.body.password = hashedPassword;
    }
    try {
        const userUpdated = yield userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(userUpdated);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: error instanceof Error ? error.message : error,
        });
    }
});
/**
 * Get all users
 * @param req Request object
 * @param res Response object
 */
export const getUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel.find();
    res.json({ sucess: true, msg: users });
});
/**
 * Get user by ID
 * @param req Request object containing user ID
 * @param res Response object
 */
export const getUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userFound = yield userModel.findById(req.params.id);
    res.json({ sucess: true, msg: userFound });
});
/**
 * Delete user by ID
 * @param req Request object containing user ID
 * @param res Response object
 */
export const deleteUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDeleted = yield userModel.findByIdAndDelete(req.params.id);
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
});
/**
 * Handle user logout
 * @param req Request object
 * @param res Response object
 */
export const logoutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(204);
        }
        refreshToken = refreshToken.toString().split(" ")[1];
        yield tokenModel.findOneAndDelete({
            token: refreshToken,
        });
        yield blacklistTokenModel.create({ token: refreshToken });
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
});
