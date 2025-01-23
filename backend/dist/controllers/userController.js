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
import { main } from "../utils/sendMailer.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
export const signUpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                msg: "Email and password are required!",
            });
            return;
        }
        const emailIsPresent = yield userModel.findOne({ email });
        if (emailIsPresent !== null) {
            res.status(400).json({
                success: false,
                msg: "Email is already used!",
            });
            return;
        }
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
export const signInController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
export const refreshTokenController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.header("RefreshToken");
        const privateKey = process.env.PRIVATE_KEY;
        const privateRefreshKey = process.env.PRIVATE_REFRESH_KEY;
        if (!refreshToken) {
            res.status(401).json({ success: false, msg: "Access denied" });
            return;
        }
        const decoded = jwt.verify(refreshToken, privateRefreshKey);
        const userFound = yield userModel.findById(decoded.id);
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
export const patchUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
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
export const getUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel.find();
    res.json({ sucess: true, msg: users });
});
export const getUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userFound = yield userModel.findById(req.params.id);
    res.json({ sucess: true, msg: userFound });
});
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
export const forgotPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found",
            });
        }
        let token = yield tokenModel.findOne({ userId: user._id });
        if (token == null) {
            token = yield tokenModel.create({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            });
        }
        const resetUrl = `${req.protocol}://${req.get("host")}/reset-password/${token.token}`;
        const message = `Hello,

        We received a request to reset your password. If you did not make this request, please disregard this email. Otherwise, follow this link to reset your password:
        ${resetUrl}

        Best regards,
        Support Team`;
        try {
            yield main(user.email, "Password Reset", message);
            res.status(200).json({
                success: true,
                msg: "Token sent to email!",
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
});
export const resetPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const resetToken = yield tokenModel.findOne({ token });
        if (!resetToken) {
            return res.status(404).json({
                success: false,
                msg: "Token not found",
            });
        }
        const user = yield userModel.findById(resetToken.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found",
            });
        }
        const hashedPassword = yield hashPassword(password);
        yield userModel.findByIdAndUpdate(user._id, {
            password: hashedPassword,
        });
        yield tokenModel.findOneAndDelete({ token });
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
});
