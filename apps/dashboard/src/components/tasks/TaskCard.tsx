
'use client';

import React from 'react';
import { format } from 'date-fns';
import { Task, TaskStatus, TaskCategory } from '@libs/data/src';
import { Button } from '@/components/ui/Button';
import { 
  CalendarIcon, 
  UserIcon, 
  PencilIcon, 
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  canEdit: boolean;
  canDelete: boolean;
}

const statusIcons = {
  [TaskStatus.TODO]: ClockIcon,
  [TaskStatus.IN_PROGRESS]: ExclamationTriangleIcon,
  [TaskStatus.DONE]: CheckCircleIcon,
};

const statusColors = {
  [TaskStatus.TODO]: 'text-gray-500 bg-gray-100',
  [TaskStatus.IN_PROGRESS]: 'text-yellow-600 bg-yellow-100',
  [TaskStatus.DONE]: 'text-green-600 bg-green-100',
};

const categoryColors = {
  [TaskCategory.WORK]: 'bg-blue-100 text-blue-800',
  [TaskCategory.PERSONAL]: 'bg-purple-100 text-purple-800',
  [TaskCategory.URGENT]: 'bg-red-100 text-red-800',
  [TaskCategory.GENERAL]: 'bg-gray-100 text-gray-800',
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  canEdit,
  canDelete
}) => {
  const StatusIcon = statusIcons[task.status];

  const handleStatusClick = () => {
    if (!canEdit) return;
    
    const statusOrder = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    onStatusChange(task.id, nextStatus);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate flex-1 mr-2">
          {task.title}
        </h3>
        
        <div className="flex items-center space-x-2">
          {/* Priority indicator */}
          {task.priority > 0 && (
            <span className="flex items-center justify-center w-6 h-6 bg-red-100 text-red-800 text-xs font-bold rounded-full">
              {task.priority}
            </span>
          )}
          
          {/* Status */}
          <button
            onClick={handleStatusClick}
            disabled={!canEdit}
            className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]} ${
              canEdit ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'
            }`}
          >
            <StatusIcon className="w-3 h-3 mr-1" />
            {task.status.replace('_', ' ')}
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Category */}
      <div className="flex items-center mb-3">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryColors[task.category]}`}>
          {task.category}
        </span>
      </div>

      {/* Metadata */}
      <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
        {/* Due date */}
        {task.dueDate && (
          <div className="flex items-center">
            <CalendarIcon className="w-3 h-3 mr-1" />
            <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
          </div>
        )}

        {/* Assignee */}
        {task.assignedTo && (
          <div className="flex items-center">
            <UserIcon className="w-3 h-3 mr-1" />
            <span>{task.assignedTo.firstName} {task.assignedTo.lastName}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      {(canEdit || canDelete) && (
        <div className="flex items-center justify-end space-x-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          {canEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(task)}
              className="flex items-center"
            >
              <PencilIcon className="w-4 h-4" />
            </Button>
          )}
          {canDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="flex items-center"
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
