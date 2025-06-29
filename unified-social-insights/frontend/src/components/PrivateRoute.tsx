// src/components/PrivateRoute.tsx
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: ReactNode;
}

const PrivateRoute = ({ children }: Props): React.ReactElement => {
  const { token } = useAuth();

  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
