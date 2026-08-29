import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/ui/Loader';

export const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullscreen />;
  }

  if (!isAuthenticated) {
    // Redirect to login but save the attempted URL for redirection after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If business profile setup is incomplete and user is not Super Admin, force them to setup page
  if (
    user?.role !== 'SUPER_ADMIN' &&
    user?.business &&
    !user.business.profileCompleted &&
    location.pathname !== '/business/setup'
  ) {
    return <Navigate to="/business/setup" replace />;
  }

  return children;
};

export default ProtectedRoute;
