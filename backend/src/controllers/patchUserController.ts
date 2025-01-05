import { userModel } from '../models/userModel.js';
import { Request, Response } from 'express';

export const patchUserController = async (req: Request, res: Response) => {
  try {
    const userUpdated = await userModel.findByIdAndUpdate(req.params.id ,req.body, {new: true});
    res.status(200).send(userUpdated);
    } catch (error) {
        res.status(500).json({ success: false, msg: error instanceof Error ? error.message : error });
    }
}
