'use client';

import React from 'react';
import { User } from '@myorg/data';
import { useUser } from '@/hooks/useUser';

interface UserSelectProps {
  value?: string;
  onChange: (userId: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export const UserSelect: React.FC<UserSelectProps> = ({
  value,
  onChange,
  error,
  label = 'Assign To',
  required = false,
  disabled = false,
}) => {
  const { useUsers } = useUser();
  const { data, isLoading, error: fetchError } = useUsers();

  const users = data?.users || [];
  

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || isLoading}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">Unassigned (Assign to yourself)</option>
        
        {isLoading && (
          <option disabled>Loading users...</option>
        )}
        
        {fetchError && (
          <option disabled>Error loading users</option>
        )}
        
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.firstName} {user.lastName} ({user.role}) - {'No Org'}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      
      {!isLoading && users.length === 0 && !fetchError && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          No users available to assign
        </p>
      )}
    </div>
  );
};