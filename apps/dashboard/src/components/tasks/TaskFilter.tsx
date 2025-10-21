
'use client';

import React from 'react';
import { TaskStatus, TaskCategory } from  '@myorg/data';
import { Button } from '@/components/ui/Button';

interface TaskFilterProps {
  selectedStatus?: TaskStatus;
  selectedCategory?: TaskCategory;
  onStatusChange: (status?: TaskStatus) => void;
  onCategoryChange: (category?: TaskCategory) => void;
  sortBy: 'title' | 'createdAt' | 'dueDate' | 'priority';
  onSortChange: (sort: 'title' | 'createdAt' | 'dueDate' | 'priority') => void;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({
  selectedStatus,
  selectedCategory,
  onStatusChange,
  onCategoryChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Status
        </h3>
        <div className="space-y-2">
          {[
            { value: undefined, label: 'All' },
            { value: TaskStatus.TODO, label: 'To Do' },
            { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
            { value: TaskStatus.DONE, label: 'Done' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onStatusChange(item.value)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                selectedStatus === item.value
                  ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Category
        </h3>
        <div className="space-y-2">
          {[
            { value: undefined, label: 'All' },
            { value: TaskCategory.GENERAL, label: 'General' },
            { value: TaskCategory.WORK, label: 'Work' },
            { value: TaskCategory.PERSONAL, label: 'Personal' },
            { value: TaskCategory.URGENT, label: 'Urgent' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onCategoryChange(item.value)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                selectedCategory === item.value
                  ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Sort By
        </h3>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as any)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="createdAt">Created Date</option>
          <option value="title">Title</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
    </div>
  );
};