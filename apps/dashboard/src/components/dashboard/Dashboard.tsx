
'use client';

import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskCategory } from '@myorg/data';
import { useTask } from '@/hooks/useTask';
import { useAuth } from '@/contexts/AuthContext';
import { rbacService, Permission } from '@myorg/auth';
import { Button } from '@/components/ui/Button';
import { TaskCard } from '../tasks/TaskCard';
import { TaskForm } from '../tasks/TaskForm';
import { TaskFilter } from '../tasks/TaskFilter';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  XMarkIcon,
  ArchiveBoxArrowDownIcon,
  CheckCircleIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';

interface TaskModalState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  task?: Task;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { useTasks, createTask, updateTask, deleteTask } = useTask();

  // State
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>();
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>();
  const [sortBy, setSortBy] = useState<'title' | 'createdAt' | 'dueDate' | 'priority'>('createdAt');
  const [searchTerm, setSearchTerm] = useState('');
  const [taskModal, setTaskModal] = useState<TaskModalState>({ isOpen: false, mode: 'create' });

  // Fetch tasks
  const { data: tasksData, isLoading, error } = useTasks({
    status: selectedStatus,
    category: selectedCategory,
    sortBy,
  });

  // Filter tasks based on search
  const filteredTasks = (tasksData?.tasks || []).filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check permissions
  const canCreateTask = !!(user && rbacService.hasPermission(user.role, Permission.CREATE_TASK));
  const canEditTask = !!(user && rbacService.hasPermission(user.role, Permission.UPDATE_TASK));
  const canDeleteTask = !!(user && rbacService.hasPermission(user.role, Permission.DELETE_TASK));

  // Handlers
  const handleCreateTask = async (data: any) => {
    try {
      await createTask.mutateAsync(data);
      setTaskModal({ isOpen: false, mode: 'create' });
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTask = async (data: any) => {
    try {
      if (!taskModal.task) return;
      await updateTask.mutateAsync({
        id: taskModal.task.id,
        data,
      });
      setTaskModal({ isOpen: false, mode: 'create' });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask.mutate(taskId);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    const task = filteredTasks.find(t => t.id === taskId);
    if (task) {
      await updateTask.mutateAsync({
        id: taskId,
        data: { status: newStatus },
      });
    }
  };

  // Statistics
  const stats = {
    total: tasksData?.total || 0,
    completed: filteredTasks.filter(t => t.status === TaskStatus.DONE).length,
    inProgress: filteredTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
    todo: filteredTasks.filter(t => t.status === TaskStatus.TODO).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Tasks
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Manage your tasks securely
              </p>
            </div>

            {canCreateTask && (
              <Button
                onClick={() => setTaskModal({ isOpen: true, mode: 'create' })}
                className="flex items-center"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                New Task
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Tasks</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">{stats.total}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{stats.inProgress}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">To Do</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">{stats.todo}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">{stats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar filters */}
          <div className="lg:col-span-1">
            <TaskFilter
              selectedStatus={selectedStatus}
              selectedCategory={selectedCategory}
              onStatusChange={setSelectedStatus}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>

          {/* Tasks list */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="mb-6">
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Tasks grid */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-600 dark:text-gray-400 mt-4">Loading tasks...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 text-center">
                <p className="text-red-600 dark:text-red-400">Failed to load tasks</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                <ListBulletIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">No tasks found</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                  Create a new task to get started
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={() => setTaskModal({ isOpen: true, mode: 'edit', task })}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                    canEdit={canEditTask}
                    canDelete={canDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {taskModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {taskModal.mode === 'create' ? 'Create New Task' : 'Edit Task'}
              </h2>
              <button
                onClick={() => setTaskModal({ isOpen: false, mode: 'create' })}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <TaskForm
                task={taskModal.task}
                onSubmit={taskModal.mode === 'create' ? handleCreateTask : handleUpdateTask}
                isLoading={createTask.isPending || updateTask.isPending}
                onCancel={() => setTaskModal({ isOpen: false, mode: 'create' })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
