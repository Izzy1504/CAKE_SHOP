// ProtectedRoute.js
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const rolesString = localStorage.getItem('roles');

  let roles;
  try {
    roles = rolesString ? JSON.parse(rolesString) : null;
  } catch (error) {
    console.error('Invalid roles in localStorage:', error);
    roles = null;
  }

  useEffect(() => {
    if (
      (!token || !roles) ||
      !Array.isArray(roles) ||
      !roles.includes(requiredRole)
    ) {
      toast.warn("Bạn muốn vượt rào à? Trở lại mua sắm đi", { autoClose: 3000 });
    }
  }, [token, roles, requiredRole]);

  if (
    !token ||
    !roles ||
    !Array.isArray(roles) ||
    !roles.includes(requiredRole)
  ) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;