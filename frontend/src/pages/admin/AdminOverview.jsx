// src/pages/admin/AdminOverview.jsx
import React from 'react';

const AdminOverview = ({ statistics, onNavigate }) => {
  // Mock data nếu statistics chưa có
  const statsData = statistics || {
    totalUsers: 0,
    totalExams: 0,
    totalAttempts: 0,
    activeToday: 0,
    avgScore: 0,
    passRate: 0
  };

  return (
    <div className="tab-content">
      <div className="content-header">
        <h2 className="content-title">Tổng quan hệ thống</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{statsData.totalUsers.toLocaleString()}</div>
            <div className="stat-label">Tổng người dùng</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{statsData.totalExams}</div>
            <div className="stat-label">Tổng đề thi</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{statsData.totalAttempts.toLocaleString()}</div>
            <div className="stat-label">Lượt thi</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper orange">
            <i className="fas fa-signal"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{statsData.activeToday}</div>
            <div className="stat-label">Đang hoạt động</div>
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
          <div className="stat-icon-wrapper teal">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{statsData.passRate}%</div>
            <div className="stat-label">Tỷ lệ đậu</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview; // Default export