import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  
  // Mock exam data
  useEffect(() => {
    const mockExam = {
      id: examId,
      name: "Thi thử lần 1",
      code: "001",
      duration: 60,
      questions: [
        {
          id: 1,
          content: 'Choose the correct pronunciation of "pronunciation"',
          skill: "Ngữ âm",
          options: [
            { id: "A", content: "/prəˌnʌnsiˈeɪʃən/" },
            { id: "B", content: "/prəˌnaʊnsiˈeɪʃən/" },
            { id: "C", content: "/prəˌnʌnsiˈeɪʃn/" },
            { id: "D", content: "/prəˌnaʊnsiˈeɪʃn/" }
          ]
        },
        {
          id: 2,
          content: 'Complete the sentence: She _____ to the store yesterday.',
          skill: "Ngữ pháp",
          options: [
            { id: "A", content: "go" },
            { id: "B", content: "goes" },
            { id: "C", content: "went" },
            { id: "D", content: "going" }
          ]
        },
        {
          id: 3,
          content: 'What is the synonym of "happy"?',
          skill: "Từ vựng",
          options: [
            { id: "A", content: "sad" },
            { id: "B", content: "angry" },
            { id: "C", content: "joyful" },
            { id: "D", content: "tired" }
          ]
        },
        {
          id: 4,
          content: 'Read the passage and answer: What is the main idea?',
          skill: "Đọc hiểu",
          options: [
            { id: "A", content: "Technology is bad" },
            { id: "B", content: "Education is important" },
            { id: "C", content: "Students should study more" },
            { id: "D", content: "Teachers are not needed" }
          ]
        },
        {
          id: 5,
          content: 'Listen to the audio and choose the correct answer.',
          skill: "Nghe",
          options: [
            { id: "A", content: "The man is a teacher" },
            { id: "B", content: "The woman is a student" },
            { id: "C", content: "They are in a library" },
            { id: "D", content: "It is raining outside" }
          ]
        }
      ]
    };
    
    setExam(mockExam);
    setTimeLeft(mockExam.duration * 60); // Convert to seconds
  }, [examId]);

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
  }, [timeLeft, isSubmitting]);

  // Check if user is student
  useEffect(() => {
    if (!currentUser || currentUser.role !== "student") {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleAnswer = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
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

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Calculate score
    let correct = 0;
    exam.questions.forEach(question => {
      if (answers[question.id] === "B") { // Mock correct answer
        correct++;
      }
    });
    
    const score = (correct / exam.questions.length) * 10;
    
    // Save result
    const result = {
      examId: exam.id,
      examName: exam.name,
      code: exam.code,
      score: score,
      correct: correct,
      total: exam.questions.length,
      answers: answers,
      date: new Date().toISOString().split('T')[0],
      time: formatTime(exam.duration * 60 - timeLeft)
    };
    
    // Save to localStorage
    const existingResults = JSON.parse(localStorage.getItem("examResults") || "[]");
    existingResults.push(result);
    localStorage.setItem("examResults", JSON.stringify(existingResults));
    
    // Navigate to results
    setTimeout(() => {
      navigate("/student", { state: { result } });
    }, 1000);
  };

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