import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/ui/Loader';

export const PublicRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loader fullscreen />;
  }

  if (isAuthenticated) {
    if (user?.role === 'SUPER_ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
