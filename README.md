# secure-task-management

A full-stack task management application with role-based access control (RBAC), JWT authentication, and organizational hierarchy support

## 🎯 Overview
- **Monorepo structure** with shared libraries
- **JWT-based authentication** with token refresh
- **Role-based access control (RBAC)** with three tiers: Owner, Admin, Viewer
- **Organizational hierarchy** support (parent/child organizations)
- **Type-safe** TypeScript throughout

## Monorepo Structure

monorepo/  
├── apps/  
│   ├── api/                    # Express.js backend  
│   └── dashboard/              # Next.js frontend  
└── libs/  
    &nbsp;&nbsp;&nbsp;├── data/                   # Shared types & interfaces  
    &nbsp;&nbsp;&nbsp;└── auth/                   # RBAC & JWT logic  

## ✨ Features  
### 🔐 Authentication & Authorization  

- JWT token-based authentication  
- Password hashing with bcrypt  
- Refresh token support  
- Role-based permissions  
- Organization-scoped access

### 📝 Task Management

- Create, read, update, delete tasks  
- Task categories: Work, Personal, Urgent, General  
- Task status tracking: To Do, In Progress, Done  
- Priority levels (0-5)  
- Due dates and assignees  
- Filtering by status/category  
- Sorting by multiple fields

### 👥 Role-Based Access Control
- **Owner**: Full system access, manage users, view audit logs
- **Admin**: Create/edit/delete tasks, view audit logs
- **Viewer**: Read-only access to tasks

### 🏢 Organizational Hierarchy
- Two-level organization structure
- Scoped resource access
- User isolation by organization

### 🎨 Frontend Features
- Responsive design (mobile → desktop)
- Real-time task filtering & search
- Loading states

## 📦 Prerequisites

- Node.js 20+
- npm or yarn
- SQLite (included via npm)

## 🚀 Installation

### 1. Clone the project

```bash
# Clone the repository
git clone https://github.com/jjammeso/secure-task-management.git
cd secure-task-management

# Install dependencies (from root)
npm install

# Or install individually
cd apps/api && npm install
cd ../dashboard && npm install
```

### 2. Setup Environment Files

**Backend (apps/api/.env):**
```bash
cp apps/api/.env.example apps/api/.env
```

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
FRONTEND_URL=http://localhost:3000
```

**Frontend (apps/dashboard/.env.local):**
```bash
cp apps/dashboard/.env.local.example apps/dashboard/.env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## ▶️ Running the Application

### Development 

# Run at once
```bash
#In the root folder
npm run dev
```

# Running Frontend and Backend individually
**Terminal 1 - Backend:**
```bash
cd apps/api
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd apps/dashboard
npm run dev
# App runs on http://localhost:3000
```

## 📚 API Documentation

### Authentication Endpoints

**POST /api/auth/login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**GET /api/auth/me**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

### Task Endpoints

**POST /api/tasks**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Task",
    "description": "Task description",
    "category": "work",
    "status": "todo",
    "priority": 1,
    "assignedToId": "someid"
  }'
```

**GET /api/tasks**
```bash
# With filters
curl -X GET 'http://localhost:5000/api/tasks?status=todo&category=work&sortBy=createdAt&sortOrder=desc' \
  -H "Authorization: Bearer <token>"
```

**PUT /api/tasks/:id**
```bash
curl -X PUT http://localhost:5000/api/tasks/task-id \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress"
  }'
```

**DELETE /api/tasks/:id**
```bash
curl -X DELETE http://localhost:5000/api/tasks/task-id \
  -H "Authorization: Bearer <token>"
```



