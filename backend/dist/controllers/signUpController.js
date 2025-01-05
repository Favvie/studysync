var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { userModel } from '../models/userModel.js';
import { hash } from 'bcrypt';
export const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const salt = 10;
        if (!email || !password) {
            res.status(400).json({ success: false, msg: "Email and password are required!" });
            return;
        }
        const emailIsPresent = yield userModel.findOne({ email });
        if (emailIsPresent !== null) {
            res.status(400).json({ success: false, msg: "Email is already used!" });
            return;
        }
        const hashedPassword = yield hash(password, salt);
        const newUser = new userModel({
            email,
            password: hashedPassword,
        });
        yield newUser.save();
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(400).json({ success: true, error: error instanceof Error ? error.message : 'An error occurred' });
    }
});
