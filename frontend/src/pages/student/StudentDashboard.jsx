// src/pages/student/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../utils/auth';
import { useStudentData } from '../../hooks/useStudentData';
import ExamList from './components/ExamList';
import ExamTaking from './components/ExamTaking';
import ExamResult from './components/ExamResult';
import '../../styles/student-dashboard.css'; // CSS riêng cho student

function StudentDashboard() {
  const navigate = useNavigate();
  const currentUser = getUser();

  const {
    exams, loadingExams, fetchExams,
    attempt, loadingAttempt, startExam,
    saveAnswers, submitExam, fetchRemainingTime, saving,
    result, setResult, fetchResult,
    history, totalHistory, historyPage, loadingHistory, fetchProgressHistory, setHistoryPage,
  } = useStudentData();

  const [activeTab, setActiveTab] = useState('exams');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [viewingResultAttemptId, setViewingResultAttemptId] = useState(null);

  useEffect(() => {
    if (!currentUser || currentUser.role?.toLowerCase() !== 'student') {
      navigate('/');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (activeTab === 'exams') fetchExams();
    if (activeTab === 'results') {
      fetchProgressHistory(historyPage, 10);
    }
  }, [activeTab, fetchExams, fetchProgressHistory, historyPage]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleStartExam = async (examId) => {
    try {
      await startExam(examId);
      setActiveTab('taking');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleSubmit = async () => {
    try {
      await submitExam();
      setActiveTab('result-detail');
      showToast('Nộp bài thành công!', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleCancelExam = () => {
    if (window.confirm('Bạn có chắc muốn thoát? Bài làm sẽ được lưu nháp.')) {
      setActiveTab('exams');
    }
  };

  const handleBackToExams = () => {
    setResult(null);
    setActiveTab('exams');
  };

  const handleViewHistoryResult = async (attemptId) => {
    setViewingResultAttemptId(attemptId);
    await fetchResult(attemptId);
    setActiveTab('result-detail');
  };

  const handleBackFromHistoryDetail = () => {
    setResult(null);
    setViewingResultAttemptId(null);
    setActiveTab('results');
  };

  const tabs = [
    { id: 'exams', label: 'Kỳ thi đang mở', icon: '📋' },
    { id: 'results', label: 'Lịch sử làm bài', icon: '📊' },
  ];

  const renderMainContent = () => {
    switch (activeTab) {
      case 'exams':
        return <ExamList exams={exams} loading={loadingExams} onStart={handleStartExam} />;

      case 'results':
        return (
          <div className="tab-content">
            <div className="content-header">
              <div className="content-header-left">
                <h2 className="content-title">Lịch sử bài thi</h2>
                <p className="content-description">Danh sách các lần làm bài của bạn</p>
              </div>
            </div>
            {loadingHistory ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải lịch sử...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-history empty-icon"></i>
                <p>Chưa có lần làm bài nào</p>
              </div>
            ) : (
              <div className="table-section">
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Kỳ thi</th>
                        <th>Mã đề</th>
                        <th>Bắt đầu</th>
                        <th>Kết thúc</th>
                        <th>Trạng thái</th>
                        <th>Điểm</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map(item => (
                        <tr key={item.attemptId}>
                          <td>{item.examTitle}</td>
                          <td>{item.codeNumber}</td>
                          <td>{item.startTime ? new Date(item.startTime).toLocaleString('vi-VN') : '—'}</td>
                          <td>{item.submitTime ? new Date(item.submitTime).toLocaleString('vi-VN') : '—'}</td>
                          <td>
                            <span className={`status-badge ${item.isSubmitted ? 'submitted' : 'in-progress'}`}>
                              {item.isSubmitted ? (item.isAutoSubmitted ? 'Tự động nộp' : 'Đã nộp') : 'Đang làm'}
                            </span>
                          </td>
                          <td>{item.score != null ? item.score.toFixed(1) : '—'}</td>
                          <td>
                            {item.isSubmitted && (
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => handleViewHistoryResult(item.attemptId)}
                              >
                                <i className="fas fa-chart-bar"></i> Xem
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Phân trang lịch sử */}
                {totalHistory > 10 && (
                  <div className="pagination">
                    <button
                      disabled={historyPage <= 1}
                      onClick={() => setHistoryPage(prev => Math.max(prev - 1, 1))}
                    >
                      Trước
                    </button>
                    <span>Trang {historyPage}</span>
                    <button
                      disabled={history.length < 10}
                      onClick={() => setHistoryPage(prev => prev + 1)}
                    >
                      Sau
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'taking':
        return (
          <ExamTaking
            attempt={attempt}
            onSave={saveAnswers}
            onSubmit={handleSubmit}
            onFetchRemainingTime={fetchRemainingTime}
            saving={saving}
            loading={loadingAttempt}
            onBack={handleCancelExam}
          />
        );

      case 'result-detail':
        return (
          <ExamResult
            result={result}
            onBack={viewingResultAttemptId ? handleBackFromHistoryDetail : handleBackToExams}
            showBackLabel={viewingResultAttemptId ? 'Quay lại lịch sử' : 'Quay lại danh sách kỳ thi'}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="student-dashboard">
      {/* Header */}
      <header className="student-header">
        <div className="student-header-left">
          <button className="back-btn" onClick={() => navigate('/')}>
            <i className="fas fa-arrow-left"></i>
            <span>Về trang chủ</span>
          </button>
          <div className="student-title-wrapper">
            <p className="student-subtitle">Student Dashboard</p>
          </div>
        </div>
        <div className="student-header-right">
          <div className="student-user-info">
            <div className="student-avatar">{currentUser?.username?.charAt(0).toUpperCase()}</div>
            <div className="student-user-details">
              <span className="student-username">{currentUser?.username}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="student-layout">
        {/* Sidebar chỉ hiện khi không làm bài hoặc xem chi tiết kết quả */}
        {(activeTab !== 'taking' && activeTab !== 'result-detail') && (
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
        )}

        <main
          className="student-main"
          style={activeTab === 'taking' || activeTab === 'result-detail' ? { width: '100%', marginLeft: 0 } : {}}
        >
          {renderMainContent()}
        </main>
      </div>

      {/* Toast */}
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