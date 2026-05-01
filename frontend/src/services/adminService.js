// src/services/adminService.js
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

const adminService = {
  // User Management
  getUsers: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.role) params.append('role', filters.role);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.pageSize) params.append('pageSize', filters.pageSize);
    
    const queryString = params.toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_USERS}${queryString ? `?${queryString}` : ''}`;
    
    const response = await authFetch(endpoint);
    return response; // { success, data: PagedResult, message }
  },

  createUser: async (userData) => {
    const response = await authFetch(API_CONFIG.ENDPOINTS.CREATE_USER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  },

  updateUser: async (userId, userData) => {
    const endpoint = API_CONFIG.ENDPOINTS.UPDATE_USER.replace('{id}', userId);
    const response = await authFetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response;
  },

  deleteUser: async (userId) => {
    const endpoint = API_CONFIG.ENDPOINTS.DELETE_USER.replace('{id}', userId);
    const response = await authFetch(endpoint, { 
      method: 'DELETE' 
    });
    return response;
  },

  lockUser: async (userId) => {
    const endpoint = API_CONFIG.ENDPOINTS.LOCK_USER.replace('{id}', userId);
    const response = await authFetch(endpoint, { 
      method: 'PATCH' 
    });
    return response;
  },

  unlockUser: async (userId) => {
    const endpoint = API_CONFIG.ENDPOINTS.UNLOCK_USER.replace('{id}', userId);
    const response = await authFetch(endpoint, { 
      method: 'PATCH' 
    });
    return response;
  },

  assignRole: async (userId, role) => {
    const endpoint = API_CONFIG.ENDPOINTS.ASSIGN_ROLE.replace('{id}', userId);
    const response = await authFetch(endpoint, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
    return response;
  },
};

export default adminService;