import express, { Request, Response, NextFunction } from "express";
import { signUp } from "../controllers/signUpController.js";
import { signIn } from "../controllers/signInController.js";
import { signInAuth } from "../middleware/signInAuth.js";
import { getUserController } from '../controllers/getUserController.js';
import { getUserByIdController } from '../controllers/getUserController.js';
import { deleteUserController } from '../controllers/deleteUserController.js';
import { patchUserController } from '../controllers/patchUserController.js';

const router = express.Router();

// Make sure your handler functions follow this type pattern:
type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;


router.get('/users', getUserController);

router.get('/users/:id', getUserByIdController);

router.post("/signup", signUp as RequestHandler);

router.post("/signin", signInAuth as RequestHandler, signIn as RequestHandler);

router.delete('/users/:id', deleteUserController as RequestHandler);

router.patch('/users/:id', patchUserController as RequestHandler);  

export default router;