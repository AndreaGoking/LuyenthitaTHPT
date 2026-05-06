import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { examService } from "../services/examService";
import "../styles/exam-taking.css";

function ExamTaking() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
  // Exam state
  const [exam, setExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [attemptId, setAttemptId] = useState(null);
  
  // Tạo phiên làm bài thi và lấy đề thi
  useEffect(() => {
    const initExam = async () => {
      try {
         // Tạo phiên làm bài thi mới với examCodeId
         const attemptResult = await examService.createExamAttempt(examId);
         
         // Lưu attemptId từ response
         if (attemptResult.data?.id) {
           setAttemptId(attemptResult.data.id);
         }

         // Load dữ liệu đề thi
         const examData = await examService.getExamById(examId);
        
        setExam(examData.data || examData);
        setTimeLeft((examData.data?.duration || 60) * 60);
      } catch (error) {
        alert(error.message);
        navigate("/student");
      }
    };

    initExam();
  }, [examId, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitting) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [timeLeft, isSubmitting, handleSubmit]);

  // Check if user is student
  useEffect(() => {
    if (!currentUser || currentUser.role !== "student") {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleAnswer = (questionId, optionId) => {
    const newAnswers = {
      ...answers,
      [questionId]: optionId
    };
    
    setAnswers(newAnswers);

    // Auto save answers to server khi có attemptId
    if (attemptId) {
      const answersArray = Object.entries(newAnswers).map(([id, selected]) => ({
        examQuestionId: id,
        selectedOption: selected
      }));
      
      // Auto save không cần đợi response
      examService.updateExamAttemptAnswers(attemptId, answersArray)
        .catch(err => console.warn('Auto save answers failed:', err));
    }
  };

  const handleNext = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    
    try {
      // Lưu toàn bộ câu trả lời lần cuối lên server
      if (attemptId) {
        const answersArray = Object.entries(answers).map(([id, selected]) => ({
          examQuestionId: id,
          selectedOption: selected
        }));
        
        await examService.updateExamAttemptAnswers(attemptId, answersArray);
        
        // Gọi endpoint nộp bài thi chính thức
        await examService.submitExamAttempt(attemptId);
      }

      // Chuyển về dashboard sau khi nộp bài thành công
      navigate("/student");
    } catch (error) {
      alert('Nộp bài thất bại: ' + error.message);
      setIsSubmitting(false);
    }
  }, [attemptId, answers, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const progress = exam ? (answeredCount / exam.questions.length) * 100 : 0;

  if (!exam) {
    return (
      <div className="exam-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải đề thi...</p>
      </div>
    );
  }

  const question = exam.questions[currentQuestion];

  return (
    <div className="exam-taking">
      {/* Header */}
      <header className="exam-header">
        <div className="exam-header-left">
          <h1 className="exam-title">{exam.name}</h1>
          <span className="exam-code">Mã đề: {exam.code}</span>
        </div>
        <div className="exam-header-right">
          <div className={`timer ${timeLeft < 300 ? 'warning' : ''}`}>
            <span className="timer-icon">⏱️</span>
            <span className="timer-text">{formatTime(timeLeft)}</span>
          </div>
          <div className="progress-info">
            <span>{answeredCount}/{exam.questions.length} câu</span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress-fill" style={{width: `${progress}%`}}></div>
      </div>

      {/* Main Content */}
      <main className="exam-main">
        {/* Question Navigation */}
        <div className="question-nav">
          <h3>📋 Câu hỏi</h3>
          <div className="question-grid">
            {exam.questions.map((q, index) => (
              <button
                key={q.id}
                className={`question-btn ${currentQuestion === index ? 'active' : ''} ${answers[q.id] ? 'answered' : ''}`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question Content */}
        <div className="question-content">
          <div className="question-header">
            <span className="question-number">Câu {currentQuestion + 1}</span>
            <span className="question-skill">{question.skill}</span>
          </div>
          
          <div className="question-text">
            {question.content}
          </div>

          <div className="options">
            {question.options.map(option => (
              <label
                key={option.id}
                className={`option ${answers[question.id] === option.id ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.id}
                  checked={answers[question.id] === option.id}
                  onChange={() => handleAnswer(question.id, option.id)}
                />
                <span className="option-label">{option.id}.</span>
                <span className="option-content">{option.content}</span>
              </label>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="question-actions">
            <button
              className="btn btn-secondary"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              ← Câu trước
            </button>
            
            {currentQuestion === exam.questions.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={() => setShowConfirm(true)}
              >
                📝 Nộp bài
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleNext}
              >
                Câu tiếp →
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Confirm Submit Modal */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>📝 Xác nhận nộp bài</h3>
            </div>
            <div className="modal-body">
              <p>Bạn đã trả lời <strong>{answeredCount}/{exam.questions.length}</strong> câu hỏi.</p>
              <p>Thời gian còn lại: <strong>{formatTime(timeLeft)}</strong></p>
              {answeredCount < exam.questions.length && (
                <p className="warning-text">
                  ⚠️ Bạn còn {exam.questions.length - answeredCount} câu chưa trả lời!
                </p>
              )}
              <p>Bạn có chắc chắn muốn nộp bài?</p>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowConfirm(false)}
              >
                Tiếp tục làm bài
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang nộp..." : "Nộp bài"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submitting Overlay */}
      {isSubmitting && (
        <div className="submitting-overlay">
          <div className="submitting-content">
            <div className="loading-spinner"></div>
            <h3>Đang nộp bài...</h3>
            <p>Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExamTaking;