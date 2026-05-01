import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasRole } from '../utils/auth';

// Component bảo vệ route yêu cầu đăng nhập
export function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Component bảo vệ route theo role cụ thể
export function RoleRoute({ allowedRoles, children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(allowedRoles)) {
    // Redirect về trang chủ nếu không có quyền truy cập
    return <Navigate to="/" replace />;
  }

  return children;
}

// Component bảo vệ route cho Admin
export function AdminRoute({ children }) {
  return <RoleRoute allowedRoles={['admin']}>{children}</RoleRoute>;
}

// Component bảo vệ route cho Teacher
export function TeacherRoute({ children }) {
  return <RoleRoute allowedRoles={['admin', 'teacher']}>{children}</RoleRoute>;
}

// Component bảo vệ route cho Student
export function StudentRoute({ children }) {
  return <RoleRoute allowedRoles={['student']}>{children}</RoleRoute>;
}

export default ProtectedRoute;