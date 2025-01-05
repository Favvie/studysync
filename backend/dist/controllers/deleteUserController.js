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
export const deleteUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDeleted = yield userModel.findByIdAndDelete(req.params.id);
        if (!userDeleted) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }
        res.status(200).json({ success: true, msg: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : error });
    }
});
