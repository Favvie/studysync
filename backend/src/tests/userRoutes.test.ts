import request from 'supertest';
import app from '../app';
import { userModel } from '../models/userModel';
import { tokenModel } from '../models/tokenModel';
import { blacklistTokenModel } from '../models/blacklistTokens';
import { signUp, signIn, refreshToken, logoutController, getUserController, getUserByIdController, deleteUserController, patchUserController } from '../controllers/userController';
import { signInAuth } from '../middleware/signInAuth';
import { authorizationMiddleware } from '../middleware/auth';

jest.mock('../models/userModel');
jest.mock('../models/tokenModel');
jest.mock('../models/blacklistTokens');

describe('User Routes', () => {
  let server: any;

  beforeAll(() => {
    server = app.listen(4000);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('POST /signup', () => {
    it('should sign up a new user', async () => {
      const newUser = { email: 'test@example.com', password: 'password123' };
      (userModel.create as jest.Mock).mockResolvedValue(newUser);

      const response = await request(server).post('/signup').send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newUser);
    });

    it('should return 400 if email is already used', async () => {
      const newUser = { email: 'test@example.com', password: 'password123' };
      (userModel.findOne as jest.Mock).mockResolvedValue(newUser);

      const response = await request(server).post('/signup').send(newUser);

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Email is already used!');
    });
  });

  describe('POST /signin', () => {
    it('should sign in a user', async () => {
      const user = { email: 'test@example.com', password: 'password123' };
      const token = 'some-token';
      (signInAuth as jest.Mock).mockImplementation((req, res, next) => {
        req.customData = { token };
        next();
      });
      (userModel.findOne as jest.Mock).mockResolvedValue(user);

      const response = await request(server).post('/signin').send(user);

      expect(response.status).toBe(200);
      expect(response.body.token).toBe(token);
    });

    it('should return 401 if credentials are invalid', async () => {
      const user = { email: 'test@example.com', password: 'wrongpassword' };
      (userModel.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(server).post('/signin').send(user);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });
  });

  describe('GET /refresh', () => {
    it('should refresh token', async () => {
      const refreshToken = 'some-refresh-token';
      const newAccessToken = 'new-access-token';
      (tokenModel.create as jest.Mock).mockResolvedValue({ token: refreshToken });
      (userModel.findById as jest.Mock).mockResolvedValue({ _id: 'user-id' });

      const response = await request(server).get('/refresh').set('RefreshToken', refreshToken);

      expect(response.status).toBe(200);
      expect(response.body.newAccessToken).toBe(newAccessToken);
    });

    it('should return 401 if refresh token is missing', async () => {
      const response = await request(server).get('/refresh');

      expect(response.status).toBe(401);
      expect(response.body.msg).toBe('Access denied');
    });
  });

  describe('GET /logout', () => {
    it('should log out a user', async () => {
      const refreshToken = 'some-refresh-token';
      (tokenModel.findOneAndDelete as jest.Mock).mockResolvedValue({ token: refreshToken });
      (blacklistTokenModel.create as jest.Mock).mockResolvedValue({ token: refreshToken });

      const response = await request(server).get('/logout').set('Cookie', `refreshToken=${refreshToken}`);

      expect(response.status).toBe(200);
      expect(response.body.msg).toBe('User logged out successfully');
    });

    it('should return 204 if refresh token is missing', async () => {
      const response = await request(server).get('/logout');

      expect(response.status).toBe(204);
    });
  });

  describe('GET /', () => {
    it('should get all users', async () => {
      const users = [{ email: 'test1@example.com' }, { email: 'test2@example.com' }];
      (userModel.find as jest.Mock).mockResolvedValue(users);

      const response = await request(server).get('/');

      expect(response.status).toBe(200);
      expect(response.body.msg).toEqual(users);
    });
  });

  describe('GET /:id', () => {
    it('should get user by id', async () => {
      const user = { email: 'test@example.com' };
      (userModel.findById as jest.Mock).mockResolvedValue(user);

      const response = await request(server).get('/123');

      expect(response.status).toBe(200);
      expect(response.body.msg).toEqual(user);
    });
  });

  describe('DELETE /:id', () => {
    it('should delete user by id', async () => {
      (userModel.findByIdAndDelete as jest.Mock).mockResolvedValue({});

      const response = await request(server).delete('/123');

      expect(response.status).toBe(200);
      expect(response.body.msg).toBe('User deleted successfully');
    });

    it('should return 404 if user not found', async () => {
      (userModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const response = await request(server).delete('/123');

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe('User not found');
    });
  });

  describe('PATCH /:id', () => {
    it('should update user by id', async () => {
      const updatedUser = { email: 'updated@example.com' };
      (userModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedUser);

      const response = await request(server).patch('/123').send(updatedUser);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedUser);
    });
  });
});
