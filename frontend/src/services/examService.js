// src/services/examService.js
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

export const examService = {
  // Lấy danh sách bài kiểm tra
  getExams: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);
    if (filters.pageSize) params.append('pageSize', filters.pageSize);
    
    const queryString = params.toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_EXAMS}${queryString ? `?${queryString}` : ''}`;
    
    const response = await authFetch(endpoint);
    return response;
  },

  // Tạo kỳ thi mới
  createExam: async (examData) => {
    const response = await authFetch(API_CONFIG.ENDPOINTS.GET_EXAMS, {
      method: 'POST',
      body: JSON.stringify(examData),
    });
    return response;
  },

  // Lấy chi tiết 1 kỳ thi theo ID
  getExamById: async (examId) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_EXAMS}/${examId}`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Cập nhật thông tin kỳ thi
  updateExam: async (examId, examData) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_EXAMS}/${examId}`;
    const response = await authFetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(examData),
    });
    return response;
  },

  // Xóa kỳ thi
  deleteExam: async (examId) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_EXAMS}/${examId}`;
    const response = await authFetch(endpoint, {
      method: 'DELETE',
    });
    return response;
  },

  // Kích hoạt kỳ thi
  activateExam: async (examId) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_EXAMS}/${examId}/activate`;
    const response = await authFetch(endpoint, {
      method: 'PATCH',
    });
    return response;
  },

  // Vô hiệu hóa kỳ thi
  deactivateExam: async (examId) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_EXAMS}/${examId}/deactivate`;
    const response = await authFetch(endpoint, {
      method: 'PATCH',
    });
    return response;
  },

  // Lấy phân phối điểm của kỳ thi
  getExamScoreDistribution: async (examId) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_EXAMS}/${examId}/score-distribution`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Tạo phiên làm bài thi mới
  createExamAttempt: async (examCodeId) => {
    const response = await authFetch(API_CONFIG.ENDPOINTS.CREATE_EXAM_ATTEMPT, {
      method: 'POST',
      body: JSON.stringify({ examCodeId })
    });
    return response;
  },

  // Lấy danh sách phiên làm bài thi
  getExamAttempts: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);
    if (filters.pageSize) params.append('pageSize', filters.pageSize);
    
    const queryString = params.toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_EXAM_ATTEMPTS}${queryString ? `?${queryString}` : ''}`;
    
    const response = await authFetch(endpoint);
    return response;
  },

  // Lấy chi tiết 1 phiên làm bài thi theo ID
  getExamAttemptById: async (attemptId) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_EXAM_ATTEMPTS}/${attemptId}`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Cập nhật câu trả lời cho phiên làm bài thi
  updateExamAttemptAnswers: async (attemptId, answers) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_EXAM_ATTEMPTS}/${attemptId}/answers`;
    const response = await authFetch(endpoint, {
      method: 'PATCH',
      body: JSON.stringify({ answers })
    });
    return response;
  },

  // Nộp bài thi chính thức
  submitExamAttempt: async (attemptId) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_EXAM_ATTEMPTS}/${attemptId}/submit`;
    const response = await authFetch(endpoint, {
      method: 'POST'
    });
    return response;
  },

  // Tự động nộp bài khi hết thời gian
  autoSubmitExamAttempt: async (attemptId) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_EXAM_ATTEMPTS}/${attemptId}/auto-submit`;
    const response = await authFetch(endpoint, {
      method: 'POST'
    });
    return response;
  },

  // Lấy thời gian còn lại của phiên làm bài thi
  getExamAttemptRemainingTime: async (attemptId) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_EXAM_ATTEMPTS}/${attemptId}/remaining-time`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Lấy danh sách mã đề của kỳ thi
  getExamCodes: async (examId) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_EXAMS}/${examId}/codes`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Lấy chi tiết 1 mã đề theo ID
  getExamCodeById: async (examId, codeId) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_EXAMS}/${examId}/codes/${codeId}`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Xóa mã đề thi
  deleteExamCode: async (examId, codeId) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_EXAMS}/${examId}/codes/${codeId}`;
    const response = await authFetch(endpoint, {
      method: 'DELETE'
    });
    return response;
  },

  // Sinh nhiều mã đề thi ngẫu nhiên
  generateExamCodes: async (examId, count) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_EXAMS}/${examId}/codes/generate`;
    const response = await authFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ count })
    });
    return response;
  },

  // Xáo trộn câu hỏi trong mã đề thi
  shuffleExamCodeQuestions: async (examId, codeId) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_EXAMS}/${examId}/codes/${codeId}/shuffle`;
    const response = await authFetch(endpoint, {
      method: 'POST'
    });
    return response;
  },

  // Export mã đề thi ra file Word
  exportExamCodeToWord: async (examId, codeId) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_EXAMS}/${examId}/codes/${codeId}/export/word`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Export mã đề thi ra file PDF
  exportExamCodeToPdf: async (examId, codeId) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_EXAMS}/${examId}/codes/${codeId}/export/pdf`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Lấy danh sách ma trận đề thi
  getExamMatrices: async () => {
    const endpoint = API_CONFIG.ENDPOINTS.EXAM_MATRICES;
    const response = await authFetch(endpoint);
    return response;
  },

  // Tạo ma trận đề thi mới
  createExamMatrix: async (matrixData) => {
    const endpoint = API_CONFIG.ENDPOINTS.EXAM_MATRICES;
    const response = await authFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(matrixData)
    });
    return response;
  },

  // Lấy chi tiết ma trận đề thi theo ID
  getExamMatrixById: async (matrixId) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.EXAM_MATRICES}/${matrixId}`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Cập nhật thông tin ma trận đề thi
  updateExamMatrix: async (matrixId, matrixData) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.EXAM_MATRICES}/${matrixId}`;
    const response = await authFetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(matrixData)
    });
    return response;
  },

  // Xóa ma trận đề thi
  deleteExamMatrix: async (matrixId) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.EXAM_MATRICES}/${matrixId}`;
    const response = await authFetch(endpoint, {
      method: 'DELETE'
    });
    return response;
  },

  // Lấy phân phối kỹ năng của ma trận đề thi
  getExamMatrixSkillDistributions: async (matrixId) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.EXAM_MATRICES}/${matrixId}/skill-distributions`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Cập nhật phân phối kỹ năng của ma trận đề thi
  updateExamMatrixSkillDistributions: async (matrixId, skillDistributions) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.EXAM_MATRICES}/${matrixId}/skill-distributions`;
    const response = await authFetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify({ skillDistributions })
    });
    return response;
  },

  // Kiểm tra tính hợp lệ của ma trận đề thi
  validateExamMatrix: async (matrixId) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.EXAM_MATRICES}/${matrixId}/validate`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Lấy kết quả chi tiết bài thi theo attempt ID
  getExamResult: async (attemptId) => {
    const endpoint = `api/exam-results/${attemptId}`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Lấy kết quả chi tiết từng câu hỏi bài thi
  getExamResultDetail: async (attemptId) => {
    const endpoint = `api/exam-results/${attemptId}/detail`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Lấy phân tích kết quả theo kỹ năng
  getExamResultSkillBreakdown: async (attemptId) => {
    const endpoint = `api/exam-results/${attemptId}/skill-breakdown`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Lấy danh sách chủ đề yếu sau khi thi
  getExamResultWeakTopics: async (attemptId) => {
    const endpoint = `api/exam-results/${attemptId}/weak-topics`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Lấy thông tin profile người dùng
  getProfile: async () => {
    const endpoint = API_CONFIG.ENDPOINTS.GET_PROFILE;
    const response = await authFetch(endpoint);
    return response;
  },

  // Cập nhật thông tin profile người dùng
  updateProfile: async (profileData) => {
    const endpoint = API_CONFIG.ENDPOINTS.GET_PROFILE;
    const response = await authFetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    return response;
  },

  // Lấy tiến độ học tập tổng quan
  getLearningProgress: async () => {
    const endpoint = 'api/progress';
    const response = await authFetch(endpoint);
    return response;
  },

  // Lấy lịch sử tiến độ học tập
  getProgressHistory: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);
    if (filters.pageSize) params.append('pageSize', filters.pageSize);
    
    const queryString = params.toString();
    const endpoint = `api/progress/history${queryString ? `?${queryString}` : ''}`;
    
    const response = await authFetch(endpoint);
    return response;
  },

  // Lấy xu hướng tiến độ theo kỹ năng
  getProgressSkillTrend: async () => {
    const endpoint = 'api/progress/skill-trend';
    const response = await authFetch(endpoint);
    return response;
  },

  // Lấy danh sách chủ đề yếu của học sinh
  getProgressWeakTopics: async () => {
    const endpoint = 'api/progress/weak-topics';
    const response = await authFetch(endpoint);
    return response;
  },

  // Lấy danh sách câu hỏi
  getQuestions: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.skill) params.append('Skill', filters.skill);
    if (filters.level) params.append('Level', filters.level);
    if (filters.topic) params.append('Topic', filters.topic);
    if (filters.source) params.append('Source', filters.source);
    if (filters.passageId) params.append('PassageId', filters.passageId);
    if (filters.search) params.append('Search', filters.search);
    if (filters.page) params.append('Page', filters.page);
    if (filters.pageSize) params.append('PageSize', filters.pageSize);
    
    const queryString = params.toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.QUESTIONS}${queryString ? `?${queryString}` : ''}`;
    
    const response = await authFetch(endpoint);
    return response;
  },

  // Tạo câu hỏi mới
  createQuestion: async (questionData) => {
    const endpoint = API_CONFIG.ENDPOINTS.QUESTIONS;
    const response = await authFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(questionData)
    });
    return response;
  },

  // Lấy chi tiết câu hỏi theo ID
  getQuestionById: async (questionId) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.QUESTIONS}/${questionId}`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Cập nhật thông tin câu hỏi
  updateQuestion: async (questionId, questionData) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.QUESTIONS}/${questionId}`;
    const response = await authFetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(questionData)
    });
    return response;
  },

  // Xóa câu hỏi
  deleteQuestion: async (questionId) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.QUESTIONS}/${questionId}`;
    const response = await authFetch(endpoint, {
      method: 'DELETE'
    });
    return response;
  },

  // Import câu hỏi từ file Excel/CSV
  importQuestionsFromFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const endpoint = `${API_CONFIG.ENDPOINTS.QUESTIONS}/import`;
    const response = await authFetch(endpoint, {
      method: 'POST',
      body: formData,
      headers: {} // Cho browser tự động set Content-Type multipart/form-data với boundary
    });
    return response;
  },

  // Lấy thống kê chi tiết từng câu hỏi theo kỳ thi
  getQuestionStatistics: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.examId) params.append('examId', filters.examId);
    if (filters.page) params.append('page', filters.page);
    if (filters.pageSize) params.append('pageSize', filters.pageSize);
    
    const queryString = params.toString();
    const endpoint = `api/question-statistics${queryString ? `?${queryString}` : ''}`;
    
    const response = await authFetch(endpoint);
    return response;
  },

  // Lấy chi tiết thống kê 1 câu hỏi theo ID
  getQuestionStatisticsById: async (questionId) => {
    const endpoint = `api/question-statistics/${questionId}`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Lấy danh sách TOP câu hỏi khó nhất toàn hệ thống
  getDifficultQuestions: async () => {
    const endpoint = `api/question-statistics/difficult`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Tính toán lại toàn bộ thống kê câu hỏi cho 1 kỳ thi
  recalculateExamStatistics: async (examId) => {
    const endpoint = `api/question-statistics/recalculate/${examId}`;
    const response = await authFetch(endpoint, {
      method: 'POST'
    });
    return response;
  },

  // Lấy danh sách tất cả đoạn văn đọc hiểu
  getReadingPassages: async () => {
    const endpoint = `api/reading-passages`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Tạo mới đoạn văn đọc hiểu
  createReadingPassage: async (passageData) => {
    const endpoint = `api/reading-passages`;
    const response = await authFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(passageData)
    });
    return response;
  },

  // Lấy chi tiết 1 đoạn văn đọc hiểu theo ID
  getReadingPassageById: async (passageId) => {
    const endpoint = `api/reading-passages/${passageId}`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Cập nhật thông tin đoạn văn đọc hiểu
  updateReadingPassage: async (passageId, passageData) => {
    const endpoint = `api/reading-passages/${passageId}`;
    const response = await authFetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(passageData)
    });
    return response;
  },

  // Xóa đoạn văn đọc hiểu
  deleteReadingPassage: async (passageId) => {
    const endpoint = `api/reading-passages/${passageId}`;
    const response = await authFetch(endpoint, {
      method: 'DELETE'
    });
    return response;
  },

  // Gắn câu hỏi vào đoạn văn đọc hiểu
  addQuestionToReadingPassage: async (passageId, questionId) => {
    const endpoint = `api/reading-passages/${passageId}/questions`;
    const response = await authFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ questionId })
    });
    return response;
  },

  // Xóa liên kết câu hỏi khỏi đoạn văn đọc hiểu
  removeQuestionFromReadingPassage: async (passageId, questionId) => {
    const endpoint = `api/reading-passages/${passageId}/questions/${questionId}`;
    const response = await authFetch(endpoint, {
      method: 'DELETE'
    });
    return response;
  },

  // Lấy thống kê tổng quan hệ thống
  getStatisticsOverview: async () => {
    const endpoint = `api/statistics/overview`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Lấy danh sách người tham gia kỳ thi
  getExamParticipants: async (examId, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);
    if (filters.pageSize) params.append('pageSize', filters.pageSize);
    
    const queryString = params.toString();
    const endpoint = `api/statistics/exams/${examId}/participants${queryString ? `?${queryString}` : ''}`;
    
    const response = await authFetch(endpoint);
    return response;
  },

  // Lấy trạng thái nộp bài của kỳ thi
  getExamSubmissionStatus: async (examId) => {
    const endpoint = `api/statistics/exams/${examId}/submission-status`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Lấy dữ liệu biểu đồ điểm của kỳ thi
  getExamScoreChart: async (examId) => {
    const endpoint = `api/statistics/exams/${examId}/score-chart`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Lấy tổng số người dùng hệ thống
  getUsersCount: async () => {
    const endpoint = `api/statistics/users/count`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Lấy danh sách tài liệu học tập
  getStudyMaterials: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.Skill) params.append('Skill', filters.Skill);
    if (filters.Topic) params.append('Topic', filters.Topic);
    if (filters.Search) params.append('Search', filters.Search);
    if (filters.Page) params.append('Page', filters.Page);
    if (filters.PageSize) params.append('PageSize', filters.PageSize);
    
    const queryString = params.toString();
    const endpoint = `api/study-materials${queryString ? `?${queryString}` : ''}`;
    
    const response = await authFetch(endpoint);
    return response;
  },

  // Tạo tài liệu học tập mới
  createStudyMaterial: async (materialData) => {
    const response = await authFetch('api/study-materials', {
      method: 'POST',
      body: JSON.stringify(materialData),
    });
    return response;
  },

  // Lấy chi tiết tài liệu học tập theo ID
  getStudyMaterialById: async (materialId) => {
    const endpoint = `api/study-materials/${materialId}`;
    const response = await authFetch(endpoint);
    return response;
  },

  // Cập nhật tài liệu học tập
  updateStudyMaterial: async (materialId, materialData) => {
    const endpoint = `api/study-materials/${materialId}`;
    const response = await authFetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(materialData),
    });
    return response;
  },

  // Xóa tài liệu học tập
  deleteStudyMaterial: async (materialId) => {
    const endpoint = `api/study-materials/${materialId}`;
    const response = await authFetch(endpoint, {
      method: 'DELETE',
    });
    return response;
  },

  // Lấy danh sách người dùng
  getUsers: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.Role) params.append('Role', filters.Role);
    if (filters.IsActive !== undefined) params.append('IsActive', filters.IsActive);
    if (filters.Search) params.append('Search', filters.Search);
    if (filters.Page) params.append('Page', filters.Page);
    if (filters.PageSize) params.append('PageSize', filters.PageSize);
    
    const queryString = params.toString();
    const endpoint = `api/users${queryString ? `?${queryString}` : ''}`;
    
    const response = await authFetch(endpoint);
    return response;
  }
};
