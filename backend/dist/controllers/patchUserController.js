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
export const patchUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userUpdated = yield userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(userUpdated);
    }
    catch (error) {
        res.status(500).json({ success: false, msg: error instanceof Error ? error.message : error });
    }
});
