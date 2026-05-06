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

const teacherService = {
  // ================== EXÁM ====================
  getExams: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);
    if (filters.pageSize) params.append('pageSize', filters.pageSize);
    const queryString = params.toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_EXAMS}${queryString ? `?${queryString}` : ''}`;
    return authFetch(endpoint);
  },

  getExamById: async (id) => {
    const endpoint = API_CONFIG.ENDPOINTS.GET_EXAM.replace('{id}', id);
    return authFetch(endpoint);
  },

  createExam: async (examData) => {
    // examData nên chứa: title, durationMinutes, totalCodes, openTime, closeTime, matrixId
    return authFetch(API_CONFIG.ENDPOINTS.CREATE_EXAM, {
      method: 'POST',
      body: JSON.stringify(examData),
    });
  },

  updateExam: async (id, examData) => {
    const endpoint = API_CONFIG.ENDPOINTS.UPDATE_EXAM.replace('{id}', id);
    return authFetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(examData),
    });
  },

  deleteExam: async (id) => {
    const endpoint = API_CONFIG.ENDPOINTS.DELETE_EXAM.replace('{id}', id);
    return authFetch(endpoint, { method: 'DELETE' });
  },

  activateExam: async (id) => {
    const endpoint = API_CONFIG.ENDPOINTS.ACTIVATE_EXAM.replace('{id}', id);
    return authFetch(endpoint, { method: 'PATCH' });
  },

  deactivateExam: async (id) => {
    const endpoint = API_CONFIG.ENDPOINTS.DEACTIVATE_EXAM.replace('{id}', id);
    return authFetch(endpoint, { method: 'PATCH' });
  },

  getScoreDistribution: async (id) => {
    const endpoint = API_CONFIG.ENDPOINTS.GET_SCORE_DISTRIBUTION.replace('{id}', id);
    return authFetch(endpoint);
  },

  // ======= QUESTIONS & PASSAGES (giữ nguyên) =======
  getQuestions: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.skill) params.append('Skill', filters.skill);
    if (filters.level) params.append('Level', filters.level);
    if (filters.topic) params.append('Topic', filters.topic);
    if (filters.search) params.append('Search', filters.search);
    if (filters.page) params.append('Page', filters.page);
    if (filters.pageSize) params.append('PageSize', filters.pageSize);
    const queryString = params.toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.QUESTIONS}${queryString ? `?${queryString}` : ''}`;
    return authFetch(endpoint);
  },
  createQuestion: async (questionData) => {
    return authFetch(API_CONFIG.ENDPOINTS.CREATE_QUESTION, {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  },
  updateQuestion: async (id, questionData) => {
    const endpoint = API_CONFIG.ENDPOINTS.UPDATE_QUESTION.replace('{id}', id);
    return authFetch(endpoint, { method: 'PUT', body: JSON.stringify(questionData) });
  },
  deleteQuestion: async (id) => {
    const endpoint = API_CONFIG.ENDPOINTS.DELETE_QUESTION.replace('{id}', id);
    return authFetch(endpoint, { method: 'DELETE' });
  },
  // ... có thể thêm ReadingPassages CRUD ...
};

export default teacherService;