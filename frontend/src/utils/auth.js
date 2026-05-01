// Utility functions for authentication and API calls

const API_BASE_URL = 'https://localhost:5001';

// Lưu token vào localStorage
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Lấy token từ localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Xóa token khỏi localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Lưu thông tin user
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Lấy thông tin user
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Kiểm tra xem user đã đăng nhập chưa
export const isAuthenticated = () => {
  return !!getToken();
};

// Tạo headers cho API request với token
export const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Thực hiện API request có xác thực
export const authFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = getAuthHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  // Nếu token hết hạn (401), xóa token và redirect về login
  if (response.status === 401) {
    removeToken();
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  return response;
};

// Đăng xuất
export const logout = () => {
  removeToken();
  window.location.href = '/login';
};

// Kiểm tra role của user
export const getUserRole = () => {
  const user = getUser();
  return user ? (user.role ? user.role.toLowerCase() : null) : null;
};

// Kiểm tra xem user có phải là admin không
export const isAdmin = () => {
  return getUserRole() === 'admin';
};

// Kiểm tra xem user có phải là teacher không
export const isTeacher = () => {
  return getUserRole() === 'teacher';
};

// Kiểm tra xem user có phải là student không
export const isStudent = () => {
  return getUserRole() === 'student';
};

// Kiểm tra xem user có quyền truy cập role cụ thể không
export const hasRole = (allowedRoles) => {
  const userRole = getUserRole();
  if (!userRole) return false;
  // Chuyển tất cả về lowercase để so sánh
  return allowedRoles.map(r => r.toLowerCase()).includes(userRole);
};

// Lấy đường dẫn dashboard theo role
export const getDashboardPath = () => {
  const role = getUserRole();
  switch (role) {
    case 'admin':
      return '/admin';
    case 'teacher':
      return '/teacher';
    case 'student':
      return '/student';
    default:
      return '/';
  }
};

const authService = {
  setToken,
  getToken,
  removeToken,
  setUser,
  getUser,
  isAuthenticated,
  getAuthHeaders,
  authFetch,
  logout,
  getUserRole,
  isAdmin,
  isTeacher,
  isStudent,
  hasRole,
  getDashboardPath,
};

export default authService;
