// src/services/studentService.js
import { getToken } from '../utils/auth';
import API_CONFIG from '../config/api.config';

const API_URL = API_CONFIG.BASE_URL;

const authFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const data = await response.json();
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Phiên đăng nhập hết hạn');
  }
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Có lỗi xảy ra');
  }
  return data;
};

const studentService = {
  // Lấy danh sách kỳ thi (student chỉ xem những exam đang active)
  getExams: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);
    if (filters.pageSize) params.append('pageSize', filters.pageSize);
    const queryString = params.toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_EXAMS}${queryString ? `?${queryString}` : ''}`;
    return authFetch(endpoint);
  },

  // Lấy danh sách mã đề của một kỳ thi
  getExamCodes: async (examId) => {
    const endpoint = API_CONFIG.ENDPOINTS.GET_EXAM_CODES.replace('{examId}', examId);
    return authFetch(endpoint);
  },

  // Bắt đầu làm bài (tạo attempt)
  createAttempt: async (examCodeId) => {
    return authFetch(API_CONFIG.ENDPOINTS.CREATE_EXAM_ATTEMPT, {
      method: 'POST',
      body: JSON.stringify({ examCodeId }),
    });
  },

  // Lưu nháp đáp án
  saveAnswers: async (attemptId, answers) => {
    const endpoint = API_CONFIG.ENDPOINTS.SAVE_ANSWERS.replace('{id}', attemptId);
    return authFetch(endpoint, {
      method: 'PATCH',
      body: JSON.stringify({ answers }),
    });
  },

  // Nộp bài
  submitAttempt: async (attemptId) => {
    const endpoint = API_CONFIG.ENDPOINTS.SUBMIT_ATTEMPT.replace('{id}', attemptId);
    return authFetch(endpoint, { method: 'POST' });
  },

  // Lấy thời gian còn lại
  getRemainingTime: async (attemptId) => {
    const endpoint = API_CONFIG.ENDPOINTS.GET_REMAINING_TIME.replace('{id}', attemptId);
    return authFetch(endpoint);
  },

  // Lấy kết quả bài làm
  getResult: async (attemptId) => {
    const endpoint = API_CONFIG.ENDPOINTS.GET_RESULT.replace('{attemptId}', attemptId);
    return authFetch(endpoint);
  },

  getProgressHistory: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page);
    if (filters.pageSize) params.append('pageSize', filters.pageSize);
    const queryString = params.toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.PROGRESS_HISTORY}${queryString ? `?${queryString}` : ''}`;
    return authFetch(endpoint);
  }
};

export default studentService;