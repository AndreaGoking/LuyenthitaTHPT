// src/pages/admin/QuestionBank.jsx
import React, { useState } from 'react';

const QuestionBank = ({ questions, loading, onFetchQuestions, onShowToast }) => {
  const [filters, setFilters] = useState({ skill: '', cognitive: '' });
  const skills = ['Ngữ âm', 'Ngữ pháp', 'Từ vựng', 'Đọc hiểu', 'Nghe', 'Viết'];
  const cognitiveLevels = ['Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao'];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFetchQuestions(newFilters);
  };

  return (
    <div className="tab-content">
      <div className="content-header">
        <div className="content-header-left">
          <h2 className="content-title">Ngân hàng câu hỏi</h2>
          <p className="content-description">Quản lý tất cả câu hỏi trong hệ thống</p>
        </div>
        <button className="btn btn-primary" onClick={() => onShowToast('Tính năng đang phát triển', 'info')}>
          <i className="fas fa-plus"></i>
          Thêm câu hỏi
        </button>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Kỹ năng:</label>
          <select 
            className="filter-select"
            value={filters.skill}
            onChange={(e) => handleFilterChange('skill', e.target.value)}
          >
            <option value="">Tất cả</option>
            {skills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Mức độ:</label>
          <select 
            className="filter-select"
            value={filters.cognitive}
            onChange={(e) => handleFilterChange('cognitive', e.target.value)}
          >
            <option value="">Tất cả</option>
            {cognitiveLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-section">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nội dung</th>
                <th>Kỹ năng</th>
                <th>Mức độ</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>Đang tải...</td>
                </tr>
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>Chưa có câu hỏi nào</td>
                </tr>
              ) : (
                questions.map(question => (
                  <tr key={question.id}>
                    <td>#{question.id}</td>
                    <td className="question-content">{question.content}</td>
                    <td><span className="skill-badge">{question.skill}</span></td>
                    <td>
                      <span className={`cognitive-badge ${question.cognitive?.toLowerCase().replace(/\s+/g, '-')}`}>
                        {question.cognitive}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view" title="Xem">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="action-btn edit" title="Chỉnh sửa">
                          <i className="fas fa-edit"></i>
                        </button>
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

export default QuestionBank;