import express, { Request, Response, NextFunction } from "express";
import { signUp } from "../controllers/signUpController.js";
import { signIn } from "../controllers/signInController.js";
import { signInAuth } from "../middleware/signInAuth.js";

const router = express.Router();

// Make sure your handler functions follow this type pattern:
type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

router.post("/signup", signUp as RequestHandler);
router.post("/signin", signInAuth as RequestHandler, signIn as RequestHandler);

export default router;