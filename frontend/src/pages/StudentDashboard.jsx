import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";
import "../styles/student-dashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();
  const currentUser = getUser();
  
  // Active tab state
  const [activeTab, setActiveTab] = useState("exams");
  
  // Toast state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  // Data states
  const [availableExams] = useState([
    { id: 1, name: "Thi thử lần 1", duration: 60, questions: 50, status: "active", startTime: "2024-04-01 08:00", endTime: "2024-04-02 17:00" },
    { id: 2, name: "Thi thử lần 2", duration: 60, questions: 50, status: "active", startTime: "2024-04-15 08:00", endTime: "2024-04-16 17:00" },
    { id: 3, name: "Thi cuối kỳ", duration: 90, questions: 50, status: "scheduled", startTime: "2024-05-01 08:00", endTime: "2024-05-02 17:00" }
  ]);
  
  const [examAttempts] = useState([
    { id: 1, examName: "Thi thử lần 1", code: "001", score: 8.5, correct: 42, total: 50, date: "2024-04-01", time: "45:30", status: "completed" },
    { id: 2, examName: "Thi thử lần 1", code: "002", score: 7.8, correct: 39, total: 50, date: "2024-04-01", time: "52:15", status: "completed" },
    { id: 3, examName: "Thi thử lần 2", code: "001", score: 9.2, correct: 46, total: 50, date: "2024-04-15", time: "38:45", status: "completed" }
  ]);

  // Check if user is student
  useEffect(() => {
    if (!currentUser || currentUser.role !== "student") {
      navigate("/");
    }
  }, [currentUser, navigate]);

  // Show toast
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // Tab navigation
  const tabs = [
    { id: "exams", label: "Kỳ thi", icon: "📝" },
    { id: "history", label: "Lịch sử thi", icon: "📊" },
    { id: "results", label: "Kết quả", icon: "📈" }
  ];

  const handleStartExam = (examId) => {
    navigate(`/exam/${examId}`);
  };

  return (
    <div className="student-dashboard">
      {/* Header */}
      <header className="student-header">
        <div className="student-header-container">
          <div className="student-header-left">
            <button className="back-btn" onClick={() => navigate("/")}>
              <i className="fas fa-arrow-left"></i>
              <span>Về trang chủ</span>
            </button>
            <div className="student-title-wrapper">
              <h1 className="student-title">Học sinh</h1>
              <p className="student-subtitle">Student Dashboard</p>
            </div>
          </div>
          <div className="student-header-right">
            <div className="student-user-info">
              <div className="student-avatar">
                {currentUser?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="student-user-details">
                <span className="student-username">{currentUser?.username}</span>
                <span className="student-role">Học sinh</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="student-layout">
        {/* Sidebar */}
        <aside className="student-sidebar">
          <nav className="student-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`student-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span className="nav-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="student-main">
          {/* Exams Tab */}
          {activeTab === "exams" && (
            <div className="tab-content">
              <div className="content-header">
                <div className="content-header-left">
                  <h2 className="content-title">Danh sách kỳ thi</h2>
                  <p className="content-description">Chọn kỳ thi để bắt đầu làm bài</p>
                </div>
              </div>

              {/* Exams Grid */}
              <div className="exams-grid">
                {availableExams.map(exam => (
                  <div key={exam.id} className="exam-card">
                    <div className="exam-card-header">
                      <div className="exam-icon">
                        <i className="fas fa-clipboard-list"></i>
                      </div>
                      <span className={`status-badge ${exam.status}`}>
                        {exam.status === "active" ? "Đang mở" : "Sắp tới"}
                      </span>
                    </div>
                    <h3 className="exam-name">{exam.name}</h3>
                    <div className="exam-info">
                      <div className="exam-info-item">
                        <i className="fas fa-clock"></i>
                        <span>{exam.duration} phút</span>
                      </div>
                      <div className="exam-info-item">
                        <i className="fas fa-question-circle"></i>
                        <span>{exam.questions} câu hỏi</span>
                      </div>
                    </div>
                    <div className="exam-time">
                      <div className="time-item">
                        <span className="time-label">Bắt đầu:</span>
                        <span className="time-value">{exam.startTime}</span>
                      </div>
                      <div className="time-item">
                        <span className="time-label">Kết thúc:</span>
                        <span className="time-value">{exam.endTime}</span>
                      </div>
                    </div>
                    <div className="exam-actions">
                      {exam.status === "active" ? (
                        <button 
                          className="btn btn-primary btn-block"
                          onClick={() => handleStartExam(exam.id)}
                        >
                          <i className="fas fa-play"></i>
                          Bắt đầu thi
                        </button>
                      ) : (
                        <button className="btn btn-secondary btn-block" disabled>
                          <i className="fas fa-clock"></i>
                          Chưa mở
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="tab-content">
              <div className="content-header">
                <div className="content-header-left">
                  <h2 className="content-title">Lịch sử thi</h2>
                  <p className="content-description">Xem lại các bài thi đã hoàn thành</p>
                </div>
              </div>

              {/* History Table */}
              <div className="table-section">
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Kỳ thi</th>
                        <th>Mã đề</th>
                        <th>Điểm</th>
                        <th>Đúng/Tổng</th>
                        <th>Ngày thi</th>
                        <th>Thời gian</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examAttempts.map(attempt => (
                        <tr key={attempt.id}>
                          <td>
                            <span className="attempt-id">#{attempt.id}</span>
                          </td>
                          <td className="exam-name-cell">
                            <i className="fas fa-clipboard-list"></i>
                            <span>{attempt.examName}</span>
                          </td>
                          <td>
                            <span className="version-code">{attempt.code}</span>
                          </td>
                          <td>
                            <span className={`score-badge ${attempt.score >= 8 ? 'high' : attempt.score >= 6.5 ? 'medium' : 'low'}`}>
                              {attempt.score}
                            </span>
                          </td>
                          <td>
                            <span className="correct-count">{attempt.correct}</span>
                            <span className="total-count">/{attempt.total}</span>
                          </td>
                          <td>{attempt.date}</td>
                          <td>{attempt.time}</td>
                          <td>
                            <span className={`status-badge ${attempt.status}`}>
                              {attempt.status === "completed" ? "Hoàn thành" : "Đang thi"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === "results" && (
            <div className="tab-content">
              <div className="content-header">
                <div className="content-header-left">
                  <h2 className="content-title">Kết quả chi tiết</h2>
                  <p className="content-description">Phân tích kết quả học tập của bạn</p>
                </div>
              </div>

              {/* Result Summary */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon-wrapper purple">
                    <i className="fas fa-clipboard-list"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{examAttempts.length}</div>
                    <div className="stat-label">Tổng số bài thi</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon-wrapper yellow">
                    <i className="fas fa-star"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">
                      {examAttempts.length > 0 
                        ? (examAttempts.reduce((sum, a) => sum + a.score, 0) / examAttempts.length).toFixed(1)
                        : 0}
                    </div>
                    <div className="stat-label">Điểm trung bình</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon-wrapper green">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">
                      {examAttempts.length > 0 
                        ? Math.round((examAttempts.reduce((sum, a) => sum + a.correct, 0) / examAttempts.reduce((sum, a) => sum + a.total, 0)) * 100)
                        : 0}%
                    </div>
                    <div className="stat-label">Tỷ lệ đúng</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon-wrapper blue">
                    <i className="fas fa-trophy"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">
                      {examAttempts.length > 0 ? Math.max(...examAttempts.map(a => a.score)) : 0}
                    </div>
                    <div className="stat-label">Điểm cao nhất</div>
                  </div>
                </div>
              </div>

              {/* Recent Results */}
              <div className="recent-results-section">
                <h3 className="section-title">Kết quả bài thi gần đây</h3>
                <div className="results-grid">
                  {examAttempts.slice(0, 3).map(attempt => (
                    <div key={attempt.id} className="result-card">
                      <div className="result-card-header">
                        <div className="result-exam-info">
                          <h4>{attempt.examName}</h4>
                          <span className="result-code">Mã đề {attempt.code}</span>
                        </div>
                        <span className="result-date">{attempt.date}</span>
                      </div>
                      <div className="result-stats">
                        <div className="result-stat-item">
                          <span className="stat-label">Điểm số:</span>
                          <span className={`stat-value score-${attempt.score >= 8 ? 'high' : attempt.score >= 6.5 ? 'medium' : 'low'}`}>
                            {attempt.score}/10
                          </span>
                        </div>
                        <div className="result-stat-item">
                          <span className="stat-label">Câu đúng:</span>
                          <span className="stat-value">{attempt.correct}/{attempt.total}</span>
                        </div>
                        <div className="result-stat-item">
                          <span className="stat-label">Thời gian:</span>
                          <span className="stat-value">{attempt.time}</span>
                        </div>
                      </div>
                      <div className="result-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => showToast('Xem chi tiết bài thi')}>
                          <i className="fas fa-eye"></i>
                          Xem chi tiết
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => showToast('Phân tích kết quả')}>
                          <i className="fas fa-chart-bar"></i>
                          Phân tích
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Analysis */}
              <div className="skill-analysis-section">
                <h3 className="section-title">Phân tích theo kỹ năng</h3>
                <div className="skill-grid">
                  {[
                    { name: "Ngữ âm", score: 85, color: "blue" },
                    { name: "Ngữ pháp", score: 72, color: "green" },
                    { name: "Từ vựng", score: 90, color: "purple" },
                    { name: "Đọc hiểu", score: 78, color: "orange" },
                    { name: "Nghe", score: 65, color: "red" }
                  ].map((skill, index) => (
                    <div key={index} className="skill-card">
                      <div className="skill-header">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-score">{skill.score}%</span>
                      </div>
                      <div className="skill-bar">
                        <div 
                          className={`skill-progress ${skill.color}`}
                          style={{ width: `${skill.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast ${toast.type}`}>
          <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;