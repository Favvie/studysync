import request from 'supertest';
import express from 'express';
import fileRoutes from '../router/file';
import { fileModel } from '../models/fileModel';
import { authorizationMiddleware } from '../middleware/auth';
import { fileUploadMiddlware } from '../middleware/fileUpload';

const app = express();
app.use(express.json());
app.use('/api/v1/files', fileRoutes);

jest.mock('../models/fileModel');
jest.mock('../middleware/auth');
jest.mock('../middleware/fileUpload');

describe('File Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /:groupId/groupfiles', () => {
        it('should return files for a group', async () => {
            const mockFiles = [{ fileName: 'file1' }, { fileName: 'file2' }];
            fileModel.find.mockResolvedValue(mockFiles);

            const response = await request(app).get('/api/v1/files/123/groupfiles');

            expect(response.status).toBe(200);
            expect(response.body.msg).toEqual(mockFiles);
        });

        it('should return 401 if groupId is missing', async () => {
            const response = await request(app).get('/api/v1/files//groupfiles');

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Unauthorized');
        });
    });

    describe('POST /:groupId/upload', () => {
        it('should upload a file', async () => {
            const mockFile = {
                filename: 'file1',
                size: 1000,
                mimetype: 'image/png',
                destination: 'uploads'
            };
            const mockUser = { userId: '123' };
            const mockGroup = { groupId: '456' };
            const mockNewFile = { fileName: 'file1', fileType: 'image/png', fileSize: 1000, fileUrl: 'uploads/file1', userId: '123', groupId: '456' };

            fileUploadMiddlware.mockImplementation(() => (req, res, next) => {
                req.file = mockFile;
                next();
            });

            authorizationMiddleware.mockImplementation((req, res, next) => {
                req.customData = mockUser;
                next();
            });

            fileModel.create.mockResolvedValue(mockNewFile);

            const response = await request(app)
                .post('/api/v1/files/456/upload')
                .attach('file', Buffer.from('file content'), 'file1.png');

            expect(response.status).toBe(201);
            expect(response.body.msg).toEqual(mockNewFile);
        });

        it('should return 401 if userId or groupId is missing', async () => {
            const response = await request(app).post('/api/v1/files//upload');

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Unauthorized');
        });
    });

    describe('GET /search', () => {
        it('should search files', async () => {
            const mockFiles = [{ fileName: 'file1' }, { fileName: 'file2' }];
            fileModel.find.mockResolvedValue(mockFiles);

            const response = await request(app).get('/api/v1/files/search?searchquery=test');

            expect(response.status).toBe(200);
            expect(response.body.msg).toEqual(mockFiles);
        });

        it('should return 400 if search query is missing', async () => {
            const response = await request(app).get('/api/v1/files/search');

            expect(response.status).toBe(400);
            expect(response.body.msg).toBe('Search query is missing');
        });
    });

    describe('GET /:fileId', () => {
        it('should return file by id', async () => {
            const mockFile = { fileName: 'file1' };
            fileModel.findById.mockResolvedValue(mockFile);

            const response = await request(app).get('/api/v1/files/123');

            expect(response.status).toBe(200);
            expect(response.body.msg).toEqual(mockFile);
        });

        it('should return 400 if fileId is missing', async () => {
            const response = await request(app).get('/api/v1/files/');

            expect(response.status).toBe(400);
            expect(response.body.msg).toBe('FileId is missing');
        });
    });

    describe('GET /:fileId/download', () => {
        it('should download file by id', async () => {
            const mockFile = { fileUrl: 'uploads/file1.png' };
            fileModel.findById.mockResolvedValue(mockFile);

            const response = await request(app).get('/api/v1/files/123/download');

            expect(response.status).toBe(200);
        });

        it('should return 400 if fileId is missing', async () => {
            const response = await request(app).get('/api/v1/files//download');

            expect(response.status).toBe(400);
            expect(response.body.msg).toBe('FileId is missing');
        });
    });

    describe('DELETE /:fileId/delete', () => {
        it('should delete file by id', async () => {
            const mockUser = { userId: '123' };
            const mockFile = { fileId: '456', userId: '123' };

            authorizationMiddleware.mockImplementation((req, res, next) => {
                req.customData = mockUser;
                next();
            });

            fileModel.findOneAndDelete.mockResolvedValue(mockFile);

            const response = await request(app).delete('/api/v1/files/456/delete');

            expect(response.status).toBe(200);
            expect(response.body.msg).toBe('File successfully deleted');
        });

        it('should return 400 if fileId is missing', async () => {
            const response = await request(app).delete('/api/v1/files//delete');

            expect(response.status).toBe(400);
            expect(response.body.msg).toBe('FileId is missing');
        });
    });

    describe('PATCH /:fileId/updatefile', () => {
        it('should update file metadata', async () => {
            const mockUser = { userId: '123' };
            const mockFile = { _id: '456', userId: '123' };
            const mockUpdatedFile = { fileName: 'updatedFile' };

            authorizationMiddleware.mockImplementation((req, res, next) => {
                req.customData = mockUser;
                next();
            });

            fileModel.findOne.mockResolvedValue(mockFile);
            fileModel.findOneAndUpdate.mockResolvedValue(mockUpdatedFile);

            const response = await request(app)
                .patch('/api/v1/files/456/updatefile')
                .send({ fileName: 'updatedFile' });

            expect(response.status).toBe(200);
            expect(response.body.msg).toEqual(mockUpdatedFile);
        });

        it('should return 400 if fileId is missing', async () => {
            const response = await request(app).patch('/api/v1/files//updatefile');

            expect(response.status).toBe(400);
            expect(response.body.msg).toBe('FileId is missing');
        });
    });
});
