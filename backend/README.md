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
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [Author](#author)

## 🎯 Overview

StudySync's backend provides a robust API for managing study groups, tasks, messaging, and file sharing. Built with TypeScript and Express.js, it offers secure user authentication and real-time collaboration features.

## ✨ Features

- 🔐 JWT-based Authentication
- 👥 User Management
- 📚 Study Group Operations
- 💬 Messaging
- ✅ Task Management
- 📁 File Sharing
- 👫 Friend System
- 📝 Search Files

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Upload**: Multer
- **Security**: bcrypt
- **Caching**: Redis

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

### Message Routes

```
GET    /api/v1/messages/:groupId - Get messages by group ID
POST   /api/v1/messages/:groupId - Send message
```

### Friend Routes

```
GET    /api/v1/friends       - Get all friends
POST   /api/v1/friends/:id   - Send friend request
DELETE /api/v1/friends/:id   - Remove friend
```

## 🔐 Environment Variables

```env
PORT=5000
HOST=localhost
MONGODB_URI=your_db_uri
PRIVATE_KEY=your_jwt_secret
PRIVATE_REFRESH_KEY=your_refresh_token_secret
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👤 Author

- **Jesse Ekow Yeboah**

---

<div align="center">
Made with ❤️ by the StudySync Team
</div>
