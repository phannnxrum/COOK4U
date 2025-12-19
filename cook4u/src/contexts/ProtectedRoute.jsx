import React from 'react';
import { Navigate } from 'react-router';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  // Nếu chưa đăng nhập
  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }
  
  // Nếu cần admin nhưng không phải admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/home" replace />;
  }
  
  // Cho phép truy cập
  return children;
};

export default ProtectedRoute;