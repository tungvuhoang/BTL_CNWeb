import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute giúp ngăn chặn người dùng chưa đăng nhập truy cập vào các trang yêu cầu quyền.
 * Nếu không có token trong localStorage, nó sẽ điều hướng về trang Login.
 */
const ProtectedRoute = () => {
  // Kiểm tra sự tồn tại của accessToken (Bạn có thể lấy từ AuthContext hoặc localStorage)
  const token = localStorage.getItem('accessToken');

  // Nếu chưa đăng nhập, chuyển hướng về trang login và lưu lại vị trí hiện tại (optional)
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // Nếu đã đăng nhập, cho phép truy cập vào các component con bên trong
  return <Outlet />;
};

export default ProtectedRoute;
