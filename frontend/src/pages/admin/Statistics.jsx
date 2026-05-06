// src/pages/admin/Statistics.jsx
import React, { useState, useEffect } from 'react';
import { examService } from '../../services/examService';

const Statistics = ({ statistics, onShowToast }) => {
  const [difficultQuestions, setDifficultQuestions] = useState([]);
  const [loadingDifficult, setLoadingDifficult] = useState(false);
  const [overview, setOverview] = useState({
    totalAttempts: 0,
    avgScore: 0,
    passRate: 0,
    highestScore: 0
  });
  const [loadingOverview, setLoadingOverview] = useState(false);

  // Load dữ liệu thống kê tổng quan
  useEffect(() => {
    const loadOverview = async () => {
      try {
        setLoadingOverview(true);
        const response = await examService.getStatisticsOverview();
        const data = response?.data || response;
        setOverview(data || {
          totalAttempts: 0,
          avgScore: 0,
          passRate: 0,
          highestScore: 0
        });
      } catch (error) {
        console.error('❌ Load statistics overview error:', error);
      } finally {
        setLoadingOverview(false);
      }
    };

    loadOverview();
  }, []);

  // Load TOP câu hỏi khó nhất
  useEffect(() => {
    const loadDifficultQuestions = async () => {
      try {
        setLoadingDifficult(true);
        const response = await examService.getDifficultQuestions();
        const data = response?.data || response;
        setDifficultQuestions(Array.isArray(data) ? data : data?.items || data?.data || []);
      } catch (error) {
        console.error('❌ Load difficult questions error:', error);
      } finally {
        setLoadingDifficult(false);
      }
    };

    loadDifficultQuestions();
  }, []);

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
            <div className="stat-value">{loadingOverview ? <i className="fas fa-spinner fa-spin"></i> : overview.totalAttempts.toLocaleString()}</div>
            <div className="stat-label">Tổng lượt thi</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper yellow">
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{loadingOverview ? <i className="fas fa-spinner fa-spin"></i> : overview.avgScore}</div>
            <div className="stat-label">Điểm trung bình</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{loadingOverview ? <i className="fas fa-spinner fa-spin"></i> : `${overview.passRate}%`}</div>
            <div className="stat-label">Tỷ lệ đậu</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <i className="fas fa-trophy"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{loadingOverview ? <i className="fas fa-spinner fa-spin"></i> : overview.highestScore}</div>
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

      {/* TOP Câu hỏi khó nhất hệ thống */}
      <div className="table-section">
        <h3 className="section-title">🔥 TOP 10 câu hỏi khó nhất toàn hệ thống</h3>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Câu hỏi</th>
                <th>Mức độ</th>
                <th>Kỹ năng</th>
                <th>Số lần làm</th>
                <th>Tỷ lệ đúng</th>
              </tr>
            </thead>
            <tbody>
              {loadingDifficult ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>
                    <i className="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...
                  </td>
                </tr>
              ) : difficultQuestions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>Chưa có dữ liệu</td>
                </tr>
              ) : (
                difficultQuestions.slice(0, 10).map((item, index) => (
                  <tr key={item.id || index}>
                    <td><strong className="text-danger">#{index + 1}</strong></td>
                    <td style={{ maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.questionText || item.content || 'Câu hỏi ' + (index + 1)}
                    </td>
                    <td>{item.level || 'N/A'}</td>
                    <td>{item.skill || item.skillName || 'N/A'}</td>
                    <td>{item.totalAttempts || item.attemptCount || 0}</td>
                    <td>
                      <strong style={{ color: '#dc3545' }}>
                        {item.correctRate ? `${item.correctRate.toFixed(1)}%` : '0%'}
                      </strong>
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

export default Statistics;