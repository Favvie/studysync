import express, { RequestHandler } from "express";
import { signInAuth } from "../middleware/signInAuth.js";
import {
    signUpController,
    signInController,
    getUsersController,
    getUserByIdController,
    deleteUserController,
    patchUserController,
    refreshTokenController,
    logoutController,
    forgotPasswordController,
    resetPasswordController,
} from "../controllers/userController.js";
import { authorizationMiddleware } from "../middleware/auth.js";
import { schemas, validateRequest } from "../middleware/validator.js";

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
router.post(
    "/auth/signup",
    validateRequest(schemas.signup),
    signUpController as RequestHandler
);

router.post(
    "/auth/signin",
    validateRequest(schemas.signin),
    signInAuth as RequestHandler,
    signInController as RequestHandler
);

router.get("/auth/refresh", refreshTokenController as RequestHandler);

router.post(
    "/auth/forgot-password",
    validateRequest(schemas.forgotPassword),
    forgotPasswordController as RequestHandler
);

router.post(
    "/auth/reset-password/:token",
    resetPasswordController as RequestHandler
);

//Authorization Middleware for protected routes
router.use(authorizationMiddleware as RequestHandler);

router.get("/", getUsersController as RequestHandler);

router.get("/logout", logoutController as RequestHandler);

router.get("/:id", getUserByIdController as RequestHandler);

router.delete("/:id", deleteUserController as RequestHandler);

router.patch(
    "/:id",
    validateRequest(schemas.patchUser),
    patchUserController as RequestHandler
);

export default router;
