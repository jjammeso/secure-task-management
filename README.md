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

**Note: still working on readme


