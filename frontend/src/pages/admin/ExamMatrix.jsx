// src/pages/admin/ExamMatrix.jsx
import React, { useState, useEffect } from 'react';

const ExamMatrix = ({ examTemplates, matrixRules, onFetchMatrixRules, onShowToast }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    if (examTemplates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(examTemplates[0]);
      onFetchMatrixRules(examTemplates[0].id);
    }
  }, [examTemplates, selectedTemplate, onFetchMatrixRules]);

  const handleTemplateChange = (template) => {
    setSelectedTemplate(template);
    onFetchMatrixRules(template.id);
  };

  const cognitiveLevels = ['Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao'];
  const skills = ['Ngữ âm', 'Ngữ pháp', 'Từ vựng', 'Đọc hiểu', 'Nghe', 'Viết'];

  return (
    <div className="tab-content">
      <div className="content-header">
        <div className="content-header-left">
          <h2 className="content-title">Ma trận đề thi</h2>
          <p className="content-description">Cấu hình ma trận và quy tắc sinh đề</p>
        </div>
        <button className="btn btn-primary" onClick={() => onShowToast('Tính năng đang phát triển', 'info')}>
          <i className="fas fa-plus"></i>
          Thêm mẫu đề
        </button>
      </div>

      <div className="templates-section">
        <h3 className="section-title">Danh sách mẫu đề thi</h3>
        <div className="templates-grid">
          {examTemplates.map(template => (
            <div 
              key={template.id} 
              className={`template-card ${selectedTemplate?.id === template.id ? 'active' : ''}`}
              onClick={() => handleTemplateChange(template)}
            >
              <div className="template-header">
                <div className="template-icon">
                  <i className="fas fa-file-alt"></i>
                </div>
                <div className="template-info">
                  <h4 className="template-name">{template.name}</h4>
                  <span className="template-questions">{template.totalQuestion} câu hỏi</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="matrix-section">
        <h3 className="section-title">Quy tắc ma trận</h3>
        <div className="cognitive-summary">
          {cognitiveLevels.map(level => {
            const total = matrixRules
              .filter(r => r.cognitive === level)
              .reduce((sum, r) => sum + r.questionCount, 0);
            return (
              <div key={level} className="cognitive-card">
                <div className="cognitive-label">{level}</div>
                <div className="cognitive-value">{total} câu</div>
              </div>
            );
          })}
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Kỹ năng</th>
                <th>Mức độ</th>
                <th>Số câu</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {matrixRules.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>Chưa có quy tắc ma trận</td>
                </tr>
              ) : (
                matrixRules.map(rule => (
                  <tr key={rule.id}>
                    <td><span className="skill-badge">{rule.skill}</span></td>
                    <td>
                      <span className={`cognitive-badge ${rule.cognitive.toLowerCase().replace(/\s+/g, '-')}`}>
                        {rule.cognitive}
                      </span>
                    </td>
                    <td><span className="question-count">{rule.questionCount}</span></td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn edit" title="Chỉnh sửa">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="action-btn delete" title="Xóa">
                          <i className="fas fa-trash"></i>
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

export default ExamMatrix;