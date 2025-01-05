var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import { userModel } from '../models/userModel.js';
import dotenv from 'dotenv';
import { Token } from '../models/token.js';
dotenv.config();
export const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.header('RefreshToken');
        const privateKey = process.env.PRIVATE_KEY;
        const privateRefreshKey = process.env.PRIVATE_REFRESH_KEY;
        if (!refreshToken) {
            res.status(401).json({ success: false, error: 'Access denied' });
            return;
        }
        const decoded = jwt.verify(refreshToken, privateRefreshKey);
        const userFound = yield userModel.findById(decoded.id);
        if (userFound === null) {
            res.status(404).json({ success: false, error: 'userModel not found' });
            return;
        }
        // No roles implemented yet
        const token = jwt.sign({ id: userFound._id }, privateKey, { expiresIn: '1h' });
        const newRefreshToken = jwt.sign({ id: userFound._id }, privateRefreshKey, { expiresIn: '7d' });
        yield Token.create({ userId: userFound._id, token: newRefreshToken });
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).json({ newAccessToken: token });
        next();
    }
    catch (error) {
        res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'An error occured' });
    }
});
