import request from 'supertest';
import express from 'express';
import { taskModel } from '../models/taskModel';
import { authorizationMiddleware } from '../middleware/auth';
import taskRoutes from '../router/task';

const app = express();
app.use(express.json());
app.use('/tasks', taskRoutes);

jest.mock('../models/taskModel');
jest.mock('../middleware/auth');

describe('Task Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /tasks', () => {
        it('should return all tasks for authenticated user', async () => {
            const mockTasks = [{ title: 'Task 1' }, { title: 'Task 2' }];
            taskModel.find.mockResolvedValue(mockTasks);

            const response = await request(app).get('/tasks');

            expect(response.status).toBe(200);
            expect(response.body.msg).toEqual(mockTasks);
        });

        it('should handle errors', async () => {
            taskModel.find.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/tasks');

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Database error');
        });
    });

    describe('GET /tasks/:taskId', () => {
        it('should return a task by ID for authenticated user', async () => {
            const mockTask = { title: 'Task 1' };
            taskModel.findOne.mockResolvedValue(mockTask);

            const response = await request(app).get('/tasks/1');

            expect(response.status).toBe(200);
            expect(response.body.msg).toEqual(mockTask);
        });

        it('should handle errors', async () => {
            taskModel.findOne.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/tasks/1');

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Database error');
        });
    });

    describe('POST /tasks', () => {
        it('should create a new task for authenticated user', async () => {
            const mockTask = { title: 'Task 1' };
            taskModel.create.mockResolvedValue(mockTask);

            const response = await request(app)
                .post('/tasks')
                .send({ title: 'Task 1', description: 'Task description', status: 'pending' });

            expect(response.status).toBe(201);
            expect(response.body.msg).toEqual(mockTask);
        });

        it('should handle errors', async () => {
            taskModel.create.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/tasks')
                .send({ title: 'Task 1', description: 'Task description', status: 'pending' });

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Database error');
        });
    });

    describe('PATCH /tasks/:taskId', () => {
        it('should update a task for authenticated user', async () => {
            const mockTask = { title: 'Updated Task' };
            taskModel.findOneAndUpdate.mockResolvedValue(mockTask);

            const response = await request(app)
                .patch('/tasks/1')
                .send({ title: 'Updated Task' });

            expect(response.status).toBe(200);
            expect(response.body.msg).toEqual(mockTask);
        });

        it('should handle errors', async () => {
            taskModel.findOneAndUpdate.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .patch('/tasks/1')
                .send({ title: 'Updated Task' });

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Database error');
        });
    });

    describe('DELETE /tasks/:taskId', () => {
        it('should delete a task for authenticated user', async () => {
            taskModel.findOneAndDelete.mockResolvedValue();

            const response = await request(app).delete('/tasks/1');

            expect(response.status).toBe(200);
            expect(response.body.msg).toBe('Task successfully deleted');
        });

        it('should handle errors', async () => {
            taskModel.findOneAndDelete.mockRejectedValue(new Error('Database error'));

            const response = await request(app).delete('/tasks/1');

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Database error');
        });
    });
});
