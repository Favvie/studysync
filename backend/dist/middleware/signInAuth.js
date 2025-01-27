import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";
import { compare } from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
export const signInAuth = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const privateKey = process.env.PRIVATE_KEY;
        const refreshkey = process.env.PRIVATE_REFRESH_KEY;
        if (!privateKey || !refreshkey) {
            res.status(500).json({
                success: false,
                error: "Please check your environment variables",
            });
            return;
        }
        const userFound = await userModel.findOne({ email });
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
        const payload = {
            sub: userFound._id,
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
