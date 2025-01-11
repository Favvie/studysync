import express from "express";
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
// Public route
router.post("/signup", signUp);
router.post("/signin", signInAuth, signIn);
router.get('/refresh', refreshToken);
//Authorization Middleware for protected routes
router.use(authorizationMiddleware);
router.get('/users', getUserController);
router.get('/users/:id', getUserByIdController);
router.delete('/users/:id', deleteUserController);
router.patch('/users/:id', patchUserController);
export default router;
