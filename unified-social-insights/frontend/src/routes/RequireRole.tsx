import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role, hasAccess } from '../utils/roles';

const RequireRole: React.FC<{ required: Role; children: React.ReactNode }> = ({
  required,
  children,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasAccess(user.role, required)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6">
        <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl p-8 shadow max-w-md">
          <h2 className="text-xl font-bold mb-2">🔒 Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">
            This page requires a <strong>{required.toUpperCase()}</strong> plan or higher.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Your current plan:{' '}
            <strong>{(user?.role ?? 'free').toUpperCase()}</strong>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireRole;
