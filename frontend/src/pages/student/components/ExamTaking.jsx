// src/pages/student/components/ExamTaking.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

const ExamTaking = ({
  attempt,
  onSave,
  onSubmit,
  onFetchRemainingTime,
  saving,
  loading,
  onBack,
}) => {
  const { attemptId, questions, endTime, durationMinutes } = attempt;
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitConfirm, setSubmitConfirm] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const questionRefs = useRef({});
  const timerRef = useRef(null);
  const containerRef = useRef(null);

  // Khởi tạo đáp án từ attempt (nếu có)
  useEffect(() => {
    const initialAnswers = {};
    questions.forEach(q => {
      if (q.selectedOption) {
        initialAnswers[q.examQuestionId] = q.selectedOption;
      }
    });
    setAnswers(initialAnswers);
  }, [questions]);

  // Đếm ngược thời gian
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      setTimeLeft(diff);
      if (diff === 0 && submitConfirm === false) {
        // Tự động nộp nếu hết giờ (có thể bật)
        // handleSubmit();
      }
    };
    calculateTimeLeft();
    timerRef.current = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timerRef.current);
  }, [endTime, submitConfirm]);

  // Tự động lưu nháp (debounce 2s)
  const saveDraft = useCallback(async () => {
    const answersArray = Object.entries(answers).map(([examQuestionId, selectedOption]) => ({
      examQuestionId,
      selectedOption,
    }));
    if (answersArray.length > 0) {
      await onSave(answersArray);
    }
  }, [answers, onSave]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      saveDraft();
    }, 2000);
    return () => clearTimeout(debounceTimer);
  }, [answers, saveDraft]);

  // Cảnh báo khi rời trang
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      saveDraft();
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveDraft]);

  const handleOptionChange = (examQuestionId, option) => {
    setAnswers(prev => ({ ...prev, [examQuestionId]: option }));
  };

  const isQuestionAnswered = (questionId) => {
    return !!answers[questionId];
  };

  const handleSubmit = async () => {
    if (!submitConfirm) {
      setSubmitConfirm(true);
      return;
    }
    await onSubmit();
    clearInterval(timerRef.current);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const scrollToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    const element = questionRefs.current[index];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="exam-taking-layout">
      {/* Header */}
      <div className="exam-header">
        <button className="btn btn-secondary" onClick={onBack}>
          <i className="fas fa-arrow-left"></i> Quay lại
        </button>
        <div className="timer">
          <i className="fas fa-hourglass-half"></i>
          {timeLeft !== null ? formatTime(timeLeft) : '...'}
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {submitConfirm ? (
            <><i className="fas fa-check-double"></i> Xác nhận nộp?</>
          ) : (
            <><i className="fas fa-paper-plane"></i> Nộp bài</>
          )}
        </button>
      </div>

      <div className="exam-body">
        {/* Sidebar điều hướng câu hỏi + nút Nộp bài */}
        <div className="exam-question-nav">
          <div className="nav-title">Danh sách câu hỏi</div>
          <div className="nav-grid">
            {questions.map((q, index) => (
              <div
                key={q.examQuestionId}
                className={`nav-circle ${isQuestionAnswered(q.examQuestionId) ? 'answered' : ''} ${index === currentQuestionIndex ? 'active' : ''}`}
                onClick={() => scrollToQuestion(index)}
              >
                {index + 1}
              </div>
            ))}
          </div>
          {saving && <div className="saving-indicator">Đang lưu...</div>}

          {/* Nút Nộp bài dưới danh sách */}
          <div className="nav-submit-area">
            <button
              className="btn btn-primary btn-full"
              onClick={handleSubmit}
              disabled={loading}
            >
              {submitConfirm ? (
                <><i className="fas fa-check-double"></i> Xác nhận nộp bài</>
              ) : (
                <><i className="fas fa-paper-plane"></i> Nộp bài</>
              )}
            </button>
            {submitConfirm && (
              <p className="confirm-hint">Nhấn lần nữa để nộp chính thức</p>
            )}
          </div>
        </div>

        {/* Nội dung câu hỏi */}
        <div className="exam-questions-container" ref={containerRef}>
          {questions.map((q, index) => (
            <div
              key={q.examQuestionId}
              className={`question-item ${index === currentQuestionIndex ? 'highlight' : ''}`}
              ref={el => (questionRefs.current[index] = el)}
            >
              <div className="question-number">Câu {index + 1}</div>
              <div className="question-content">{q.content}</div>
              <div className="options">
                {['A', 'B', 'C', 'D'].map(opt => (
                  <label
                    key={opt}
                    className={`option ${answers[q.examQuestionId] === opt ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.examQuestionId}`}
                      value={opt}
                      checked={answers[q.examQuestionId] === opt}
                      onChange={() => handleOptionChange(q.examQuestionId, opt)}
                    />
                    <span className="option-text">{opt}. {q[`option${opt}`]}</span>
                  </label>
                ))}
              </div>
              {q.passageId && <div className="passage-indicator">📄 Bài đọc</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamTaking;