import { RequestHandler, Router } from 'express';
import { getGroups, getGroup, createGroup, joinGroup, deleteGroup, removeUserFromGroup, updateGroup } from '../controllers/groupController.js';
import { authorizationMiddleware } from '../middleware/auth.js'

const router = Router();

// type RequestHandler = (
//     req: Request,
//     res: Response,
//     next?: NextFunction
//   ) => Promise<void> | void;

router.use(authorizationMiddleware as RequestHandler);

router.get('/', getGroups as RequestHandler);
router.get('/:groupId', getGroup as RequestHandler);
router.post('/', createGroup as RequestHandler);
router.post('/:groupId/join', joinGroup as RequestHandler);
router.delete('/:groupId', deleteGroup as RequestHandler);
router.delete('/:groupId/members/:userId', removeUserFromGroup as RequestHandler);
router.patch('/:groupId', updateGroup as RequestHandler);

export default router;
