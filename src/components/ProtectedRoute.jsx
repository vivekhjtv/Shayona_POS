import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { usePOSContext } from '../contexts/PosContext';

const ProtectedRoute = () => {
  const { isAuthenticated } = usePOSContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
