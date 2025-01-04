import { Request, Response } from 'express';
import { User } from '../models/User.js';
import {  hash  } from 'bcrypt';

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const salt = 10;
    if (!email || !password) {
      res.status(400).json({success: false, msg: "Email and password are required!"});
      return;
    }
    const emailIsPresent = await User.findOne({email});
    if (emailIsPresent !== null) {
      res.status(400).json({success: false, msg: "Email is already used!"});
      return;
    }
    const hashedPassword = await hash(password, salt);
    const user = new User({
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ success: true, error: error instanceof Error ? error.message : 'An error occurred' });
  }
}
