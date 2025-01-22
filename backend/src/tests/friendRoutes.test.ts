import request from 'supertest';
import app from '../app';
import { friendsModel } from '../models/friendsModel';
import { getFriends, getFriend, addFriend, deleteFriend, changeFriendStatus } from '../controllers/friendsController';
import { authorizationMiddleware } from '../middleware/auth';

jest.mock('../models/friendsModel');

describe('Friend Routes', () => {
  let server: any;

  beforeAll(() => {
    server = app.listen(4000);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('GET /friends', () => {
    it('should get all friends', async () => {
      const friends = [{ friendId: 'friend1' }, { friendId: 'friend2' }];
      (friendsModel.find as jest.Mock).mockResolvedValue(friends);

      const response = await request(server).get('/friends');

      expect(response.status).toBe(200);
      expect(response.body.msg).toEqual(friends);
    });
  });

  describe('GET /friends/:friendId', () => {
    it('should get friend by id', async () => {
      const friend = { friendId: 'friend1' };
      (friendsModel.findOne as jest.Mock).mockResolvedValue(friend);

      const response = await request(server).get('/friends/friend1');

      expect(response.status).toBe(200);
      expect(response.body.msg).toEqual(friend);
    });
  });

  describe('POST /friends', () => {
    it('should add a new friend', async () => {
      const newFriend = { friendId: 'friend1' };
      (friendsModel.create as jest.Mock).mockResolvedValue(newFriend);

      const response = await request(server).post('/friends').send(newFriend);

      expect(response.status).toBe(200);
      expect(response.body.msg).toEqual(newFriend);
    });
  });

  describe('DELETE /friends/:friendId', () => {
    it('should delete friend by id', async () => {
      (friendsModel.deleteOne as jest.Mock).mockResolvedValue({});

      const response = await request(server).delete('/friends/friend1');

      expect(response.status).toBe(200);
      expect(response.body.msg).toBe('Friend deleted!');
    });
  });

  describe('PATCH /friends/:friendId', () => {
    it('should change friend status', async () => {
      const updatedFriend = { friendId: 'friend1', status: 'accepted' };
      (friendsModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedFriend);

      const response = await request(server).patch('/friends/friend1').send({ status: 'accepted' });

      expect(response.status).toBe(200);
      expect(response.body.msg).toBe('Friend status changed for both users!');
    });
  });
});
