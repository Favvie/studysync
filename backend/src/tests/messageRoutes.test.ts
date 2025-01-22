import request from 'supertest';
import express from 'express';
import { messageModel } from '../models/messageModel';
import messageRoutes from '../router/message';

const app = express();
app.use(express.json());
app.use('/messages', messageRoutes);

jest.mock('../models/messageModel');

describe('Message Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /messages', () => {
        it('should return all messages', async () => {
            const mockMessages = [{ message: 'Hello' }, { message: 'Hi' }];
            messageModel.find.mockResolvedValue(mockMessages);

            const response = await request(app).get('/messages');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockMessages);
        });

        it('should handle errors', async () => {
            messageModel.find.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/messages');

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Database error');
        });
    });

    describe('POST /messages', () => {
        it('should create a new message', async () => {
            const mockMessage = { message: 'Hello' };
            messageModel.create.mockResolvedValue(mockMessage);

            const response = await request(app)
                .post('/messages')
                .send({ message: 'Hello', userId: '1', groupId: '1' });

            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockMessage);
        });

        it('should handle errors', async () => {
            messageModel.create.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/messages')
                .send({ message: 'Hello', userId: '1', groupId: '1' });

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Database error');
        });
    });
});
