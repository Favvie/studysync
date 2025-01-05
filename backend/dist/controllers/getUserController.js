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
export const getUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel.find();
    res.json({ sucess: true, msg: users });
});
export const getUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userFound = yield userModel.findById(req.params.id);
    res.json({ sucess: true, msg: userFound });
});
