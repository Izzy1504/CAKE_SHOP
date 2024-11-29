// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const rolesString = localStorage.getItem('roles');

  if (!token || !rolesString) {
    return <Navigate to="/" />;
  }

  let roles;
  try {
    roles = JSON.parse(rolesString);
  } catch (error) {
    console.error('Invalid roles in localStorage:', error);
    return <Navigate to="/" />;
  }

  if (!Array.isArray(roles)) {
    return <Navigate to="/" />;
  }

  if (!roles.includes(requiredRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;