import request from 'supertest';
import express from 'express';
import { groupModel } from '../models/groupModel';
import { userModel } from '../models/userModel';
import { authorizationMiddleware } from '../middleware/auth';
import groupRoutes from '../router/groups';

const app = express();
app.use(express.json());
app.use('/groups', groupRoutes);

jest.mock('../models/groupModel');
jest.mock('../models/userModel');
jest.mock('../middleware/auth');

describe('Group Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /groups', () => {
        it('should return all groups', async () => {
            const mockGroups = [{ name: 'Group 1' }, { name: 'Group 2' }];
            groupModel.find.mockResolvedValue(mockGroups);

            const response = await request(app).get('/groups');

            expect(response.status).toBe(200);
            expect(response.body.msg).toEqual(mockGroups);
        });

        it('should handle errors', async () => {
            groupModel.find.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/groups');

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Database error');
        });
    });

    describe('GET /groups/:groupId', () => {
        it('should return a group by ID', async () => {
            const mockGroup = { name: 'Group 1' };
            groupModel.findById.mockResolvedValue(mockGroup);

            const response = await request(app).get('/groups/1');

            expect(response.status).toBe(200);
            expect(response.body.msg).toEqual(mockGroup);
        });

        it('should handle errors', async () => {
            groupModel.findById.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/groups/1');

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Database error');
        });
    });

    describe('POST /groups', () => {
        it('should create a new group', async () => {
            const mockGroup = { name: 'Group 1' };
            groupModel.create.mockResolvedValue(mockGroup);

            const response = await request(app)
                .post('/groups')
                .send({ name: 'Group 1' });

            expect(response.status).toBe(201);
            expect(response.body.msg).toEqual(mockGroup);
        });

        it('should handle errors', async () => {
            groupModel.create.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/groups')
                .send({ name: 'Group 1' });

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Database error');
        });
    });

    describe('POST /groups/:groupId/join', () => {
        it('should join a group', async () => {
            const mockGroup = { name: 'Group 1', usersId: [] };
            const mockUser = { _id: '1' };
            groupModel.findById.mockResolvedValue(mockGroup);
            userModel.findById.mockResolvedValue(mockUser);
            groupModel.prototype.save.mockResolvedValue();

            const response = await request(app)
                .post('/groups/1/join')
                .send({ userId: '1' });

            expect(response.status).toBe(200);
            expect(response.body.msg).toEqual(mockGroup);
        });

        it('should handle errors', async () => {
            groupModel.findById.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/groups/1/join')
                .send({ userId: '1' });

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Database error');
        });
    });

    describe('DELETE /groups/:groupId', () => {
        it('should delete a group', async () => {
            groupModel.findByIdAndDelete.mockResolvedValue();

            const response = await request(app).delete('/groups/1');

            expect(response.status).toBe(200);
            expect(response.body.msg).toBe('Group deleted successfully');
        });

        it('should handle errors', async () => {
            groupModel.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

            const response = await request(app).delete('/groups/1');

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Database error');
        });
    });

    describe('PATCH /groups/:groupId', () => {
        it('should update a group', async () => {
            const mockGroup = { name: 'Updated Group' };
            groupModel.findByIdAndUpdate.mockResolvedValue(mockGroup);

            const response = await request(app)
                .patch('/groups/1')
                .send({ name: 'Updated Group' });

            expect(response.status).toBe(200);
            expect(response.body.msg).toEqual(mockGroup);
        });

        it('should handle errors', async () => {
            groupModel.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .patch('/groups/1')
                .send({ name: 'Updated Group' });

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Database error');
        });
    });

    describe('DELETE /groups/:groupId/members/:userId', () => {
        it('should remove a user from a group', async () => {
            const mockGroup = { name: 'Group 1', usersId: ['1'] };
            groupModel.findById.mockResolvedValue(mockGroup);
            groupModel.prototype.save.mockResolvedValue();

            const response = await request(app).delete('/groups/1/members/1');

            expect(response.status).toBe(200);
            expect(response.body.msg).toEqual(mockGroup);
        });

        it('should handle errors', async () => {
            groupModel.findById.mockRejectedValue(new Error('Database error'));

            const response = await request(app).delete('/groups/1/members/1');

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Database error');
        });
    });
});
