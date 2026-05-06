// src/pages/student/components/ExamList.jsx
import React from 'react';

const ExamList = ({ exams, loading, onStart }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải danh sách kỳ thi...</p>
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="empty-state">
        <i className="fas fa-calendar-times empty-icon"></i>
        <p>Hiện chưa có kỳ thi nào đang hoạt động.</p>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="table-section">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tên kỳ thi</th>
                <th>Thời lượng</th>
                <th>Mở lúc</th>
                <th>Đóng lúc</th>
                <th>Số mã đề</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td className="exam-name-cell">{exam.title}</td>
                  <td>{exam.durationMinutes} phút</td>
                  <td>{new Date(exam.openTime).toLocaleString('vi-VN')}</td>
                  <td>{new Date(exam.closeTime).toLocaleString('vi-VN')}</td>
                  <td>{exam.totalCodes}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => onStart(exam.id)}
                    >
                      <i className="fas fa-play"></i> Tham gia thi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExamList;