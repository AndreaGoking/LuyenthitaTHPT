// src/services/userService.js
import apiClient from "./apiClient";

export const userService = {
  // Lấy danh sách users (phân trang)
  getUsers: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.role) params.append('role', filters.role);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.pageSize) params.append('pageSize', filters.pageSize);
    
    const response = await apiClient.get(`/users?${params.toString()}`);
    return response.data;
  },

  // Lấy chi tiết 1 user
  getUserDetail: async (userId) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  // Tạo user mới
  createUser: async (userData) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  // Cập nhật user
  updateUser: async (userId, userData) => {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Vô hiệu hóa tài khoản
  deactivateUser: async (userId) => {
    const response = await apiClient.patch(`/users/${userId}/deactivate`);
    return response.data;
  },

  // Kích hoạt tài khoản
  activateUser: async (userId) => {
    const response = await apiClient.patch(`/users/${userId}/activate`);
    return response.data;
  },

  // Phân quyền
  assignRole: async (userId, role) => {
    const response = await apiClient.patch(`/users/${userId}/role`, { role });
    return response.data;
  }
};