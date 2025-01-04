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
import { User } from '../models/User.js';
import { compare } from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
export const signInAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const privateKey = process.env.PRIVATE_KEY;
        if (!email || !password) {
            res.status(400).json({ success: false, error: 'Please provide email and password' });
            return;
        }
        const user = yield User.findOne({ email });
        if (user === null) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }
        const isMatch = yield compare(password, user.password);
        if (isMatch === false) {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
            return;
        }
        const token = jwt.sign({ id: user._id }, privateKey, { expiresIn: '1h' });
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
    }
    catch (error) {
        res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'An error occured' });
    }
});
