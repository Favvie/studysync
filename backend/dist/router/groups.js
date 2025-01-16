import { Router } from "express";
import { getGroups, getGroup, createGroup, joinGroup, deleteGroup, removeUserFromGroup, updateGroup, } from "../controllers/groupController.js";
import { authorizationMiddleware } from "../middleware/auth.js";
const router = Router();
// type RequestHandler = (
//     req: Request,
//     res: Response,
//     next?: NextFunction
//   ) => Promise<void> | void;
router.use(authorizationMiddleware);
router.get("/", getGroups);
router.get("/:groupId", getGroup);
router.post("/", createGroup);
router.post("/:groupId/join", joinGroup);
router.delete("/:groupId", deleteGroup);
router.delete("/:groupId/members/:userId", removeUserFromGroup);
router.patch("/:groupId", updateGroup);
export default router;
