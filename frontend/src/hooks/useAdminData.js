// src/hooks/useAdminData.js
import { useState, useEffect, useCallback } from 'react';
import adminService from '../services/adminService';
import { examService } from '../services/examService';

export const useAdminData = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userFilters, setUserFilters] = useState({ page: 1, pageSize: 10 });
  
  const [examTemplates, setExamTemplates] = useState([]);
  const [matrixRules, setMatrixRules] = useState([]);
  const [scheduledExams, setScheduledExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questionFilters, setQuestionFilters] = useState({ page: 1, pageSize: 10 });
  const [statistics, setStatistics] = useState(null);

  // Matrix state
  const [examMatrices, setExamMatrices] = useState([]);
  const [totalMatrices, setTotalMatrices] = useState(0);
  const [matrixFilters, setMatrixFilters] = useState({ page: 1, pageSize: 10 });
  const [selectedMatrix, setSelectedMatrix] = useState(null); // dùng cho modal

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await examService.getUsers({
        Role: userFilters.role,
        IsActive: userFilters.isActive,
        Search: userFilters.search,
        Page: userFilters.page,
        PageSize: userFilters.pageSize
      });
      // Backend trả về { success, data: { items, totalCount, page, pageSize }, message }
      if (response.success && response.data) {
        setUsers(response.data.items || []);
        setTotalUsers(response.data.totalCount || 0);
      } else {
        console.error('Failed to fetch users:', response.message);
        setUsers([]);
        setTotalUsers(0);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  }, [userFilters]);

  const fetchExamMatrices = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const response = await adminService.getExamMatrices(filters);
      if (response.success && response.data) {
        // Kiểm tra nếu response.data là mảng trực tiếp (từ API hiện tại)
        if (Array.isArray(response.data)) {
          setExamMatrices(response.data);
          setTotalMatrices(response.data.length);
        } 
        // Nếu có cấu trúc phân trang { items, totalCount }
        else if (response.data.items && Array.isArray(response.data.items)) {
          setExamMatrices(response.data.items);
          setTotalMatrices(response.data.totalCount || response.data.items.length);
        }
        else {
          setExamMatrices([]);
          setTotalMatrices(0);
        }
      } else {
        setExamMatrices([]);
        setTotalMatrices(0);
      }
    } catch (error) {
      console.error('Fetch matrices error:', error);
      setExamMatrices([]);
      setTotalMatrices(0);
    } finally {
      setLoading(false);
    }
  }, []);
  // Mock data for other features (tạm thời)
  const fetchExamTemplates = useCallback(async () => {
    // TODO: Implement when backend ready
    setExamTemplates([
      { id: 1, name: 'THPT Mock Test', totalQuestion: 50 },
      { id: 2, name: 'IELTS Reading Practice', totalQuestion: 40 },
    ]);
  }, []);

  const fetchMatrixRules = useCallback(async (templateId) => {
    // TODO: Implement when backend ready
    setMatrixRules([
      { id: 1, templateId: 1, skill: 'Ngữ âm', cognitive: 'Nhận biết', questionCount: 4 },
      { id: 2, templateId: 1, skill: 'Ngữ pháp', cognitive: 'Nhận biết', questionCount: 6 },
    ]);
  }, []);

  const fetchScheduledExams = useCallback(async () => {
    // TODO: Implement when backend ready
    setScheduledExams([
      { id: 1, name: 'Thi thử lần 1', startTime: '2024-04-01T08:00:00', endTime: '2024-04-02T17:00:00', templateId: 1, status: 'completed' },
    ]);
  }, []);

  const fetchQuestions = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const response = await adminService.getQuestions(filters);
      if (response.success && response.data) {
        setQuestions(response.data.items || []);
        setTotalQuestions(response.data.totalCount || 0);
      } else {
        setQuestions([]);
        setTotalQuestions(0);
      }
    } catch (error) {
      console.error('Fetch questions error:', error);
      setQuestions([]);
      setTotalQuestions(0);
    } finally {
      setLoading(false);
    }
  }, []); 

  const fetchStatistics = useCallback(async () => {
    try {
      const userCountResult = await examService.getUsersCount();
      
      setStatistics({
        totalUsers: userCountResult?.data?.count || totalUsers,
        totalExams: 0,
        totalAttempts: 0,
        activeToday: 0,
        avgScore: 0,
        passRate: 0,
        highestScore: 0
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setStatistics({
        totalUsers: totalUsers,
        totalExams: 0,
        totalAttempts: 0,
        activeToday: 0,
        avgScore: 0,
        passRate: 0,
        highestScore: 0
      });
    }
  }, [totalUsers]);

  // CRUD operations for users
  const createUser = async (userData) => {
    try {
      const response = await adminService.createUser(userData);
      if (response.success) {
        await fetchUsers();
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      const response = await adminService.updateUser(userId, userData);
      if (response.success) {
        await fetchUsers();
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await adminService.deleteUser(userId);
      if (response.success) {
        await fetchUsers();
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const toggleUserStatus = async (userId, isActive) => {
    try {
      const response = isActive 
        ? await adminService.unlockUser(userId)
        : await adminService.lockUser(userId);
      if (response.success) {
        await fetchUsers();
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Thêm CRUD cho questions:
  const createQuestion = async (questionData) => {
    try {
      const response = await adminService.createQuestion(questionData);
      if (response.success) {
        await fetchQuestions(questionFilters);
        return { success: true, message: response.message || 'Thêm câu hỏi thành công' };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateQuestion = async (id, questionData) => {
    try {
      const response = await adminService.updateQuestion(id, questionData);
      if (response.success) {
        await fetchQuestions(questionFilters);
        return { success: true, message: response.message || 'Cập nhật thành công' };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const deleteQuestion = async (id) => {
    try {
      const response = await adminService.deleteQuestion(id);
      if (response.success) {
        await fetchQuestions(questionFilters);
        return { success: true, message: response.message || 'Xóa thành công' };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // CRUD operations
  const createExamMatrix = async (matrixData) => {
    try {
      const response = await adminService.createExamMatrix(matrixData);
      if (response.success) {
        await fetchExamMatrices(matrixFilters);
        return { success: true, message: response.message || 'Tạo ma trận thành công', data: response.data };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateExamMatrix = async (id, matrixData) => {
    try {
      const response = await adminService.updateExamMatrix(id, matrixData);
      if (response.success) {
        await fetchExamMatrices(matrixFilters);
        return { success: true, message: response.message || 'Cập nhật ma trận thành công' };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const deleteExamMatrix = async (id) => {
    try {
      const response = await adminService.deleteExamMatrix(id);
      if (response.success) {
        await fetchExamMatrices(matrixFilters);
        return { success: true, message: response.message || 'Xóa ma trận thành công' };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const fetchSkillDistributions = async (id) => {
    try {
      const response = await adminService.getSkillDistributions(id);
      if (response.success) return response.data;
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const updateSkillDistributions = async (id, distributions) => {
    try {
      const response = await adminService.updateSkillDistributions(id, distributions);
      if (response.success) {
        await fetchExamMatrices(matrixFilters);
        return { success: true, message: response.message || 'Cập nhật phân bổ kỹ năng thành công' };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const validateExamMatrix = async (id) => {
    try {
      const response = await adminService.validateExamMatrix(id);
      if (response.success) return response.data;
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
    fetchExamTemplates();
    fetchScheduledExams();
    fetchStatistics();
  }, [fetchUsers, fetchExamTemplates, fetchScheduledExams, fetchStatistics]);

  useEffect(() => {
    fetchQuestions(questionFilters);
  }, [fetchQuestions, questionFilters]);

  useEffect(() => {
    fetchExamMatrices(matrixFilters);
  }, [fetchExamMatrices, matrixFilters]);

  return {
    loading,
    users,
    totalUsers,
    userFilters,
    setUserFilters,
    examTemplates,
    matrixRules,
    scheduledExams,
    questions,
    statistics,
    fetchUsers,
    fetchMatrixRules,
    fetchQuestions,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    totalQuestions,
    questionFilters,
    setQuestionFilters,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    examMatrices,
    totalMatrices,
    matrixFilters,
    setMatrixFilters,
    selectedMatrix,
    setSelectedMatrix,
    fetchExamMatrices,
    createExamMatrix,
    updateExamMatrix,
    deleteExamMatrix,
    fetchSkillDistributions,
    updateSkillDistributions,
    validateExamMatrix,
  };
};