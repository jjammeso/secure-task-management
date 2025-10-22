'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header
        onToggleSidebar={()=>setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
        />
        <Dashboard />
      </div>
    </ProtectedRoute>
  );
}