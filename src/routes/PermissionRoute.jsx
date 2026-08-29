import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/ui/Loader';
import { hasPermission } from '../utils/permissions';

export const PermissionRoute = ({ permission, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullscreen />;
  }

  if (!hasPermission(user, permission)) {
    // Redirection or forbidden error indicator
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PermissionRoute;
