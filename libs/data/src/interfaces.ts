import { Role, TaskStatus, TaskCategory } from "./enums";

export interface User {
    id: string;
    email: string;
    password?: string; // Optional for response DTOs
    firstName: string;
    lastName: string;
    role: Role;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  parentId?: string; // For 2-level hierarchy
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  category: TaskCategory;
  priority: number; // 1-5 scale
  dueDate?: Date;
  assignedToId: string;
  assignedTo?: User;
  createdById: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: Date;
  ipAddress?: string;
}

// DTOs for API requests/responses
export interface CreateTaskDto {
  title: string;
  description?: string;
  category: TaskCategory;
  priority: number;
  dueDate?: string;
  assignedToId?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  category?: TaskCategory;
  priority?: number;
  dueDate?: string;
  assignedToId?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName?: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface TaskQueryParams {
  status?: TaskStatus;
  category?: TaskCategory;
  assignedToId?: string;
  sortBy?: 'title' | 'createdAt' | 'dueDate' | 'priority';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}