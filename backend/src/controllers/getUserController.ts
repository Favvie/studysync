import { Request, Response } from 'express';
import { userModel } from '../models/userModel.js';

export const getUserController = async (req: Request, res: Response) => {
    const users = await userModel.find();
    res.json({sucess: true, msg: users});
}

export const getUserByIdController = async (req: Request, res: Response) => {
    const userFound = await userModel.findById(req.params.id);
    res.json({sucess: true, msg: userFound});
}
