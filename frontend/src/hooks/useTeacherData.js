import { useState, useEffect, useCallback } from 'react';
import teacherService from '../services/teacherService';

export const useTeacherData = () => {
  const [loading, setLoading] = useState(false);
  
  // Questions state
  const [questions, setQuestions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questionFilters, setQuestionFilters] = useState({ page: 1, pageSize: 10 });

  // Exams state
  const [exams, setExams] = useState([]);
  const [totalExams, setTotalExams] = useState(0);
  const [examFilters, setExamFilters] = useState({ page: 1, pageSize: 20 });

  // ======== QUESTIONS (giữ nguyên) ========
  const fetchQuestions = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const response = await teacherService.getQuestions(filters);
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

  const createQuestion = async (questionData) => { /* giữ nguyên */ };
  const updateQuestion = async (id, questionData) => { /* giữ nguyên */ };
  const deleteQuestion = async (id) => { /* giữ nguyên */ };

  // ======== EXAMS (cập nhật theo API thực tế) ========
  const fetchExams = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const response = await teacherService.getExams(filters);
      if (response.success && response.data) {
        // API trả về { items: [...], totalCount, page, pageSize, totalPages }
        const items = response.data.items || [];
        // Chuẩn hóa dữ liệu: map examId -> id, title -> name (để dễ dùng)
        const mapped = items.map(exam => ({
          id: exam.examId,
          name: exam.title,         // dùng "name" cho đồng bộ với giao diện cũ
          title: exam.title,
          durationMinutes: exam.durationMinutes,
          status: exam.status,      // "Active", "Draft", ...
          isActive: exam.status === 'Active' || exam.status === 'active',
          totalCodes: exam.totalCodes,
          openTime: exam.openTime,
          closeTime: exam.closeTime,
          createdByUsername: exam.createdByUsername,
          createdAt: exam.createdAt,
          // Giữ nguyên các trường khác nếu cần
        }));
        setExams(mapped);
        setTotalExams(response.data.totalCount || 0);
      } else {
        setExams([]);
        setTotalExams(0);
      }
    } catch (error) {
      console.error('Fetch exams error:', error);
      setExams([]);
      setTotalExams(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const createExam = async (examData) => {
    try {
      const response = await teacherService.createExam(examData);
      if (response.success) {
        await fetchExams(examFilters); // refresh list
        return { success: true, message: response.message || 'Tạo kỳ thi thành công' };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateExam = async (id, examData) => {
    try {
      const response = await teacherService.updateExam(id, examData);
      if (response.success) {
        await fetchExams(examFilters);
        return { success: true, message: response.message || 'Cập nhật thành công' };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const deleteExam = async (id) => {
    try {
      const response = await teacherService.deleteExam(id);
      if (response.success) {
        await fetchExams(examFilters);
        return { success: true, message: response.message || 'Xóa thành công' };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const activateExam = async (id) => {
    try {
      const response = await teacherService.activateExam(id);
      if (response.success) {
        await fetchExams(examFilters);
        return { success: true, message: response.message || 'Kích hoạt thành công' };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const deactivateExam = async (id) => {
    try {
      const response = await teacherService.deactivateExam(id);
      if (response.success) {
        await fetchExams(examFilters);
        return { success: true, message: response.message || 'Vô hiệu hóa thành công' };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const fetchScoreDistribution = async (id) => {
    try {
      const response = await teacherService.getScoreDistribution(id);
      if (response.success) return response.data;
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  // Tự động fetch khi mount hoặc filter thay đổi
  useEffect(() => {
    fetchQuestions(questionFilters);
  }, [fetchQuestions, questionFilters]);

  useEffect(() => {
    fetchExams(examFilters);
  }, [fetchExams, examFilters]);

  return {
    loading,
    // Questions
    questions, totalQuestions, questionFilters, setQuestionFilters,
    createQuestion, updateQuestion, deleteQuestion,
    // Exams
    exams, totalExams, examFilters, setExamFilters,
    createExam, updateExam, deleteExam, activateExam, deactivateExam,
    fetchScoreDistribution,
  };
};