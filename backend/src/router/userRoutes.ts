import express, { Request, Response, NextFunction } from "express";
import { signUp } from "../controllers/userController.js";
import { signIn } from "../controllers/userController.js";
import { signInAuth } from "../middleware/signInAuth.js";
import { getUserController } from '../controllers/userController.js';
import { getUserByIdController } from '../controllers/userController.js';
import { deleteUserController } from '../controllers/userController.js';
import { patchUserController } from '../controllers/userController.js';
import { refreshToken } from "../controllers/userController.js";
import { authorizationMiddleware } from "../middleware/auth.js";
const router = express.Router();

// Make sure your handler functions follow this type pattern:
type RequestHandler = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<void> | void;


router.get('/users', authorizationMiddleware as RequestHandler, getUserController as RequestHandler);

router.get('/users/:id', authorizationMiddleware as RequestHandler, getUserByIdController as RequestHandler);

router.post("/signup", signUp as RequestHandler);

router.post("/signin", signInAuth as RequestHandler, signIn as RequestHandler);

router.delete('/users/:id', authorizationMiddleware as RequestHandler,deleteUserController as RequestHandler);

router.patch('/users/:id', authorizationMiddleware as RequestHandler,patchUserController as RequestHandler);

router.post('/refresh', authorizationMiddleware as RequestHandler, refreshToken as RequestHandler);

export default router;