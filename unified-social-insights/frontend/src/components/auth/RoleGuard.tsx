// src/components/auth/RoleGuard.tsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface RoleGuardProps {
  allowed: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowed, children, fallback = null }) => {
  const { user } = useAuth();

  if (!user || !allowed.includes(user.role.toLowerCase())) {
    return <>{fallback}</>; // or show upgrade CTA or 403 message
  }

  return <>{children}</>;
};
