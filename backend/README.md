# StudySync Backend API

<div align="center">

![StudySync Logo](https://via.placeholder.com/150x150.png?text=StudySync)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](https://jwt.io/)

</div>

## 📑 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

## 🎯 Overview

StudySync's backend provides a robust API for managing study groups, tasks, messaging, and file sharing. Built with TypeScript and Express.js, it offers secure user authentication and real-time collaboration features.

## ✨ Features

- 🔐 JWT-based Authentication
- 👥 User Management
- 📚 Study Group Operations
- 💬 Real-time Messaging
- ✅ Task Management
- 📁 File Sharing
- 👫 Friend System

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Upload**: Multer
- **Security**: bcrypt

## 🚀 Getting Started

1. **Clone the repository**
```bash
git clone [repository-url]
cd studysync-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

4. **Build and run**
```bash
npm run build
npm run dev
```

## 🏃‍♂️ Running the Application

To run the application, use the following command:
```bash
npm run dev
```
This will start the server on the specified port and host as defined in your environment variables.

## 📡 API Documentation

### Authentication Routes
```
POST /api/v1/signup    - Register new user
POST /api/v1/signin    - User login
GET  /api/v1/refresh   - Refresh access token
```

### User Routes
```
GET    /api/v1/users       - Get all users
GET    /api/v1/users/:id   - Get user by ID
PATCH  /api/v1/users/:id   - Update user
DELETE /api/v1/users/:id   - Delete user
```

### Group Routes
```
GET    /api/v1/groups          - Get all groups
GET    /api/v1/groups/:id      - Get group by ID
POST   /api/v1/groups          - Create group
POST   /api/v1/groups/:id/join - Join group
DELETE /api/v1/groups/:id      - Delete group
PATCH  /api/v1/groups/:id      - Update group
```

### Task Routes
```
GET    /api/v1/tasks      - Get all tasks
GET    /api/v1/tasks/:id  - Get task by ID
POST   /api/v1/tasks      - Create task
PATCH  /api/v1/tasks/:id  - Update task
DELETE /api/v1/tasks/:id  - Delete task
```

### File Routes
```
GET    /api/v1/:groupId/groupfiles - Get group files
POST   /api/v1/:groupId/upload     - Upload file
GET    /api/v1/files/search        - Search files
GET    /api/v1/files/:fileId       - Get file by ID
DELETE /api/v1/files/:fileId       - Delete file
```

### Friend Routes
```
GET    /api/v1/friends       - Get all friends
GET    /api/v1/friends/:id   - Get friend by ID
POST   /api/v1/friends       - Add friend
PATCH  /api/v1/friends/:id   - Update friend status
DELETE /api/v1/friends/:id   - Delete friend
```

## 🔐 Environment Variables

```env
PORT=3000
HOST=localhost
MONGODB_URI=mongodb://localhost:27017/studysync
PRIVATE_KEY=your_jwt_secret
PRIVATE_REFRESH_KEY=your_refresh_token_secret
```

- `PORT`: The port number on which the server will run.
- `HOST`: The host address for the server.
- `MONGODB_URI`: The URI for connecting to the MongoDB database.
- `PRIVATE_KEY`: The secret key used for signing JWT tokens.
- `PRIVATE_REFRESH_KEY`: The secret key used for signing refresh tokens.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
Made with ❤️ by the StudySync Team
</div>
