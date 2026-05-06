// src/hooks/useStudentData.js
import { useState, useCallback } from 'react';
import studentService from '../services/studentService';

export const useStudentData = () => {
  const [exams, setExams] = useState([]);
  const [loadingExams, setLoadingExams] = useState(false);

  // Trạng thái làm bài
  const [attempt, setAttempt] = useState(null);         // { attemptId, questions, endTime, ... }
  const [result, setResult] = useState(null);           // kết quả sau khi nộp
  const [loadingAttempt, setLoadingAttempt] = useState(false);
  const [saving, setSaving] = useState(false);

  const [history, setHistory] = useState([]);
  const [totalHistory, setTotalHistory] = useState(0);
  const [historyPage, setHistoryPage] = useState(1);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Lấy danh sách kỳ thi (chỉ active)
  const fetchExams = useCallback(async (filters = {}) => {
    setLoadingExams(true);
    try {
      const response = await studentService.getExams({ status: 'Active', ...filters });
      if (response.success && response.data) {
        const items = response.data.items || [];
        // Chuẩn hóa dữ liệu (có thể giữ nguyên)
        setExams(items.map(item => ({
          id: item.examId,
          title: item.title,
          durationMinutes: item.durationMinutes,
          totalCodes: item.totalCodes,
          openTime: item.openTime,
          closeTime: item.closeTime,
          createdByUsername: item.createdByUsername,
          createdAt: item.createdAt,
          status: item.status,
        })));
      } else {
        setExams([]);
      }
    } catch (error) {
      console.error('Fetch exams error:', error);
      setExams([]);
    } finally {
      setLoadingExams(false);
    }
  }, []);

  // Bắt đầu bài thi: chọn ngẫu nhiên mã đề, tạo attempt
  const startExam = async (examId) => {
    setLoadingAttempt(true);
    try {
      // 1. Lấy danh sách mã đề của kỳ thi
      const codesRes = await studentService.getExamCodes(examId);
      if (!codesRes.success || !codesRes.data || codesRes.data.length === 0) {
        throw new Error('Không có mã đề nào cho kỳ thi này');
      }
      const codes = codesRes.data;
      // Chọn ngẫu nhiên một mã đề
      const randomCode = codes[Math.floor(Math.random() * codes.length)];
      const examCodeId = randomCode.examCodeId;

      // 2. Tạo attempt
      const attemptRes = await studentService.createAttempt(examCodeId);
      if (!attemptRes.success) {
        throw new Error(attemptRes.message || 'Không thể bắt đầu bài thi');
      }
      const attemptData = attemptRes.data;
      // Giả sử attemptData có dạng:
      // { attemptId, questions: [...], startTime, endTime, durationMinutes, ... }
      setAttempt({
        attemptId: attemptData.attemptId,
        questions: attemptData.questions || [],
        startTime: attemptData.startTime,
        endTime: attemptData.endTime,
        durationMinutes: attemptData.durationMinutes || exams.find(e => e.id === examId)?.durationMinutes || 60,
      });
      setResult(null); // reset kết quả cũ
    } catch (error) {
      throw error; // để component xử lý toast
    } finally {
      setLoadingAttempt(false);
    }
  };

  // Lưu nháp đáp án (có thể gọi liên tục)
  const saveAnswers = async (answers) => {
    if (!attempt) return;
    setSaving(true);
    try {
      await studentService.saveAnswers(attempt.attemptId, answers);
      // Không cần update state gì thêm
    } catch (error) {
      console.error('Save answers error:', error);
      // Có thể hiện toast nhẹ
    } finally {
      setSaving(false);
    }
  };

  // Nộp bài
  const submitExam = async () => {
    if (!attempt) return;
    setLoadingAttempt(true);
    try {
      const res = await studentService.submitAttempt(attempt.attemptId);
      if (res.success) {
        // Sau khi nộp thành công, lấy kết quả
        const resultRes = await studentService.getResult(attempt.attemptId);
        if (resultRes.success) {
          setResult(resultRes.data);
        }
        setAttempt(null); // dọn dẹp attempt
      } else {
        throw new Error(res.message || 'Nộp bài thất bại');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoadingAttempt(false);
    }
  };

  // Lấy thời gian còn lại (dùng để đồng bộ)
  const fetchRemainingTime = async () => {
    if (!attempt) return null;
    try {
      const res = await studentService.getRemainingTime(attempt.attemptId);
      if (res.success) {
        return res.data; // giả sử { remainingSeconds: number }
      }
    } catch (error) {
      console.error('Get remaining time error:', error);
    }
    return null;
  };

  // Xem kết quả (nếu có attemptId từ history)
  const fetchResult = async (attemptId) => {
    setLoadingAttempt(true);
    try {
      const res = await studentService.getResult(attemptId);
      if (res.success) {
        setResult(res.data);
      }
    } catch (error) {
      console.error('Fetch result error:', error);
    } finally {
      setLoadingAttempt(false);
    }
  };

  const fetchProgressHistory = useCallback(async (page = 1, pageSize = 10) => {
    setLoadingHistory(true);
    try {
      const response = await studentService.getProgressHistory({ page, pageSize });
      if (response.success && response.data) {
        setHistory(response.data.items || []);
        setTotalHistory(response.data.totalCount || 0);
        setHistoryPage(page);
      } else {
        setHistory([]);
        setTotalHistory(0);
      }
    } catch (error) {
      console.error('Fetch history error:', error);
      setHistory([]);
      setTotalHistory(0);
    } finally {
      setLoadingHistory(false);
    }
  }, []);


  return {
    exams,
    loadingExams,
    fetchExams,
    attempt,
    loadingAttempt,
    startExam,
    saveAnswers,
    submitExam,
    fetchRemainingTime,
    result,
    setResult,
    fetchResult,
    saving,
    history,
    totalHistory,
    historyPage,
    loadingHistory,
    fetchProgressHistory,
  };
};