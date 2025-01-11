import express, { RequestHandler } from "express";
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
/**
 * Represents a middleware function that handles HTTP requests in Express.js.
 * @param {Request} req - The Express request object containing information about the HTTP request.
 * @param {Response} res - The Express response object for sending responses to the client.
 * @param {NextFunction} [next] - Optional callback function to pass control to the next middleware function.
 * @returns {Promise<void> | void} - A Promise that resolves to void, or void if synchronous.
 */
// type RequestHandler = (
//   req: Request,
//   res: Response,
//   next?: NextFunction
// ) => Promise<void> | void;

// Public route
router.post("/signup", signUp as RequestHandler);

router.post("/signin", signInAuth as RequestHandler, signIn as RequestHandler);

router.get('/refresh', refreshToken as RequestHandler);
//Authorization Middleware for protected routes
router.use(authorizationMiddleware as RequestHandler);

router.get('/users', getUserController as RequestHandler);

router.get('/users/:id', getUserByIdController as RequestHandler);

router.delete('/users/:id',deleteUserController as RequestHandler);

router.patch('/users/:id',patchUserController as RequestHandler);

export default router;