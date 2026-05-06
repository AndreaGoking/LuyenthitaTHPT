// src/services/userService.js
import { getToken } from '../utils/auth';
import API_CONFIG from '../config/api.config';

const API_URL = API_CONFIG.BASE_URL;

// Helper function để gọi API có auth
const authFetch = async (endpoint, options = {}) => {
  const token = getToken();
  
  const response = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  // Parse response
  const data = await response.json();
  
  // Nếu token hết hạn
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  // Backend trả về { success, data, message, errors }
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Có lỗi xảy ra');
  }

  return data;
};

export const userService = {
  // Lấy danh sách users (phân trang)
  getUsers: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.role) params.append('role', filters.role);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.pageSize) params.append('pageSize', filters.pageSize);
    
    const response = await authFetch(`users?${params.toString()}`);
    return response.data;
  },

  // Lấy chi tiết 1 user
  getUserDetail: async (userId) => {
    const response = await authFetch(`users/${userId}`);
    return response.data;
  },

  // Tạo user mới
  createUser: async (userData) => {
    const response = await authFetch('users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data;
  },

  // Cập nhật user
  updateUser: async (userId, userData) => {
    const response = await authFetch(`users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.data;
  },

  // Vô hiệu hóa tài khoản
  deactivateUser: async (userId) => {
    const response = await authFetch(`users/${userId}/deactivate`, {
      method: 'PATCH'
    });
    return response.data;
  },

  // Kích hoạt tài khoản
  activateUser: async (userId) => {
    const response = await authFetch(`users/${userId}/activate`, {
      method: 'PATCH'
    });
    return response.data;
  },

  // Phân quyền
  assignRole: async (userId, role) => {
    const response = await authFetch(`users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
    return response.data;
  },

  // Đổi mật khẩu
  changePassword: async (passwordData) => {
    const response = await authFetch(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
    return response;
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    const response = await authFetch(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return response;
  },

  // Reset mật khẩu
  resetPassword: async (resetData) => {
    const response = await authFetch(API_CONFIG.ENDPOINTS.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(resetData),
    });
    return response;
  }
};
