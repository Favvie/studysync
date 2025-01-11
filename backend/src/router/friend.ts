import { Router, RequestHandler } from 'express';
import { getFriends, getFriend, addFriend, deleteFriend, changeFriendStatus } from '../controllers/friendsController.js';
const router = Router();



router.get('/friends', getFriends as RequestHandler);
router.get('/friends/:friendId', getFriend as RequestHandler);
router.post('/friends', addFriend as RequestHandler);
router.delete('/friends/:friendId', deleteFriend as RequestHandler);
router.patch('/friends/:friendId', changeFriendStatus as RequestHandler);

export default router;