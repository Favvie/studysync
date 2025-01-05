import { Request, Response } from "express";
import { userModel } from "../models/userModel.js";

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const userDeleted  = await userModel.findByIdAndDelete(req.params.id);
    if (!userDeleted) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    res.status(200).json({ success: true, msg: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error? error.message: error });
    }
}
