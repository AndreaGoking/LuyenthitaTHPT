// src/pages/admin/ExamManagement.jsx
import React from 'react';
import { examService } from '../../services/examService';

const ExamManagement = ({ scheduledExams, examTemplates, onShowToast }) => {

  const handleViewSubmissionStatus = async (examId) => {
    try {
      const result = await examService.getExamSubmissionStatus(examId);
      console.log('📊 Trạng thái nộp bài:', result);
      onShowToast('Đã tải dữ liệu trạng thái nộp bài!', 'success');
    } catch (error) {
      onShowToast(error.message, 'error');
    }
  };

  const handleViewScoreChart = async (examId) => {
    try {
      const result = await examService.getExamScoreChart(examId);
      console.log('📈 Biểu đồ điểm:', result);
      onShowToast('Đã tải dữ liệu biểu đồ điểm!', 'success');
    } catch (error) {
      onShowToast(error.message, 'error');
    }
  };
  return (
    <div className="tab-content">
      <div className="content-header">
        <div className="content-header-left">
          <h2 className="content-title">Quản lý kỳ thi</h2>
          <p className="content-description">Tạo và quản lý các kỳ thi</p>
        </div>
        <button className="btn btn-primary" onClick={() => onShowToast('Tính năng đang phát triển', 'info')}>
          <i className="fas fa-plus"></i>
          Tạo kỳ thi
        </button>
      </div>

      <div className="table-section">
        <h3 className="section-title">Danh sách kỳ thi</h3>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên kỳ thi</th>
                <th>Mẫu đề</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {scheduledExams.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>Chưa có kỳ thi nào</td>
                </tr>
              ) : (
                scheduledExams.map(exam => (
                  <tr key={exam.id}>
                    <td>#{exam.id}</td>
                    <td>{exam.name}</td>
                    <td>{examTemplates.find(t => t.id === exam.templateId)?.name || 'N/A'}</td>
                    <td>{new Date(exam.startTime).toLocaleString('vi-VN')}</td>
                    <td>
                      <span className={`status-badge ${exam.status}`}>
                        {exam.status === 'completed' ? 'Đã hoàn thành' : 
                         exam.status === 'active' ? 'Đang diễn ra' : 'Đã lên lịch'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view" title="Xem">
                          <i className="fas fa-eye"></i>
                        </button>
                        
                        {exam.status === 'active' || exam.status === 'completed' ? (
                          <button 
                            className="action-btn info" 
                            title="Trạng thái nộp bài"
                            onClick={() => handleViewSubmissionStatus(exam.id)}
                          >
                            <i className="fas fa-clipboard-check"></i>
                          </button>
                        ) : null}
                        
                        {exam.status === 'completed' ? (
                          <button 
                            className="action-btn success" 
                            title="Biểu đồ điểm"
                            onClick={() => handleViewScoreChart(exam.id)}
                          >
                            <i className="fas fa-chart-line"></i>
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExamManagement;