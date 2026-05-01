// src/hooks/useAdminData.js
import { useState, useEffect, useCallback } from 'react';
import adminService from '../services/adminService';

export const useAdminData = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userFilters, setUserFilters] = useState({ page: 1, pageSize: 10 });
  
  const [examTemplates, setExamTemplates] = useState([]);
  const [matrixRules, setMatrixRules] = useState([]);
  const [scheduledExams, setScheduledExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [statistics, setStatistics] = useState(null);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers(userFilters);
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
    // TODO: Implement when backend ready
    setQuestions([]);
  }, []);

  const fetchStatistics = useCallback(async () => {
    // TODO: Implement when backend ready
    setStatistics({
      totalUsers: totalUsers,
      totalExams: 0,
      totalAttempts: 0,
      activeToday: 0,
      avgScore: 0,
      passRate: 0,
      highestScore: 0
    });
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

  // Initial fetch
  useEffect(() => {
    fetchUsers();
    fetchExamTemplates();
    fetchScheduledExams();
    fetchStatistics();
  }, [fetchUsers, fetchExamTemplates, fetchScheduledExams, fetchStatistics]);

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
  };
};