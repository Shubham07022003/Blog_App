# Blog Application

A full-stack blog application with JWT authentication, draft functionality, and auto-save features.

## Features

- User authentication (register, login, profile management)
- Create, edit, and delete blog posts
- Save posts as drafts
- Auto-save functionality (every 5 seconds)
- Comment system
- Responsive design
- Rich text editor
- Reading time estimation

## Tech Stack

### Frontend
- React (Vite)
- React Router
- Tailwind CSS
- React Quill (Rich text editor)
- Axios
- Headless UI

### Backend
- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT Authentication
- bcryptjs

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd blog-app
```

2. Install dependencies:
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

3. Create a MySQL database:
```sql
CREATE DATABASE blog_db;
```

4. Create a `.env` file in the root directory:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=blog_db
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

5. Start the development servers:
```bash
# Start backend server (from root directory)
npm run dev

# Start frontend server (from frontend directory)
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Posts
- GET /api/posts - Get all published posts
- GET /api/posts/my-posts - Get user's posts (including drafts)
- GET /api/posts/:id - Get single post
- POST /api/posts - Create new post
- PUT /api/posts/:id - Update post
- DELETE /api/posts/:id - Delete post

### Comments
- GET /api/posts/:id/comments - Get post comments
- POST /api/posts/:id/comments - Add comment to post

### User Profile
- GET /api/users/me - Get user profile
- PUT /api/users/me - Update user profile
- PUT /api/users/me/password - Change password

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 