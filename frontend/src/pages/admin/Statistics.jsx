// src/pages/admin/Statistics.jsx
import React from 'react';

const Statistics = ({ statistics }) => {
  const statsData = statistics || {
    totalAttempts: 0,
    avgScore: 0,
    passRate: 0,
    highestScore: 0
  };

  return (
    <div className="tab-content">
      <div className="content-header">
        <h2 className="content-title">Thống kê kết quả thi</h2>
        <p className="content-description">Xem báo cáo và phân tích kết quả</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{statsData.totalAttempts.toLocaleString()}</div>
            <div className="stat-label">Tổng lượt thi</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper yellow">
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{statsData.avgScore}</div>
            <div className="stat-label">Điểm trung bình</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{statsData.passRate}%</div>
            <div className="stat-label">Tỷ lệ đậu</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <i className="fas fa-trophy"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{statsData.highestScore}</div>
            <div className="stat-label">Điểm cao nhất</div>
          </div>
        </div>
      </div>

      <div className="table-section">
        <h3 className="section-title">Thống kê theo kỳ thi</h3>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tên kỳ thi</th>
                <th>Số lượt thi</th>
                <th>Điểm TB</th>
                <th>Tỷ lệ đậu</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>Đang cập nhật dữ liệu...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistics;