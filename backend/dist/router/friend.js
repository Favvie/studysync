import { Router } from 'express';
import { getFriends, getFriend, addFriend, deleteFriend, changeFriendStatus } from '../controllers/friendsController.js';
const router = Router();
router.get('/friends', getFriends);
router.get('/friends/:friendId', getFriend);
router.post('/friends', addFriend);
router.delete('/friends/:friendId', deleteFriend);
router.patch('/friends/:friendId', changeFriendStatus);
export default router;
