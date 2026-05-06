import React, { useState } from 'react';
import QuestionModal from './components/QuestionModal';

const SKILL_MAP = {
  Phonetics: 'Ngữ âm',
  Grammar: 'Ngữ pháp',
  Vocabulary: 'Từ vựng',
  Reading: 'Đọc hiểu',
  Listening: 'Nghe',
  Writing: 'Viết',
};

const LEVEL_MAP = {
  Remember: 'Nhận biết',
  Understand: 'Thông hiểu',
  Apply: 'Vận dụng',
  Analyze: 'Vận dụng cao',
};

function QuestionBank({
  questions = [],
  totalQuestions = 0,
  filters = { page: 1, pageSize: 10 },
  onFilterChange,
  loading = false,
  onCreateQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onShowToast,
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handleFilterChange = (newFilters) => {
    onFilterChange({ ...filters, ...newFilters, page: 1 });
  };

  const handleAdd = () => {
    setSelectedQuestionId(null);
    setEditMode(true);
    setShowModal(true);
  };

  const handleView = (id) => {
    setSelectedQuestionId(id);
    setEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    setSelectedQuestionId(id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa câu hỏi này không?')) return;
    const result = await onDeleteQuestion(id);
    onShowToast(result.message, result.success ? 'success' : 'error');
  };

  const handleSubmit = async (data) => {
    let result;
    if (selectedQuestionId && editMode) {
      result = await onUpdateQuestion(selectedQuestionId, data);
    } else {
      result = await onCreateQuestion(data);
    }
    if (result.success) {
      onShowToast(result.message, 'success');
      setShowModal(false);
      setSelectedQuestionId(null);
      setEditMode(false);
    } else {
      onShowToast(result.message, 'error');
    }
  };

  return (
    <div className="tab-content">
      <div className="content-header">
        <div className="content-header-left">
          <h2 className="content-title">Ngân hàng câu hỏi</h2>
          <p className="content-description">Quản lý câu hỏi của bạn</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <i className="fas fa-plus"></i> Thêm câu hỏi
        </button>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Kỹ năng:</label>
          <select
            className="filter-select"
            value={filters.skill || ''}
            onChange={(e) => handleFilterChange({ skill: e.target.value || undefined })}
          >
            <option value="">Tất cả</option>
            {Object.entries(SKILL_MAP).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Mức độ:</label>
          <select
            className="filter-select"
            value={filters.level || ''}
            onChange={(e) => handleFilterChange({ level: e.target.value || undefined })}
          >
            <option value="">Tất cả</option>
            {Object.entries(LEVEL_MAP).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Chủ đề:</label>
          <input
            type="text"
            className="filter-input"
            placeholder="Chủ đề"
            value={filters.topic || ''}
            onChange={(e) => handleFilterChange({ topic: e.target.value || undefined })}
          />
        </div>
        <div className="filter-group">
          <label>Tìm kiếm:</label>
          <input
            type="text"
            className="filter-input"
            placeholder="Nội dung câu hỏi..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange({ search: e.target.value || undefined })}
          />
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
                <th>Chủ đề</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{textAlign:'center'}}>Đang tải...</td></tr>
              ) : questions.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign:'center'}}>Chưa có câu hỏi nào</td></tr>
              ) : (
                questions.map((q) => (
                  <tr key={q.questionId}>
                    <td>{q.questionId.slice(0,8)}...</td>
                    <td className="question-content">{q.content}</td>
                    <td><span className="skill-badge">{SKILL_MAP[q.skill] || q.skill}</span></td>
                    <td><span className="cognitive-badge">{LEVEL_MAP[q.level] || q.level}</span></td>
                    <td>{q.topic}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view" onClick={() => handleView(q.questionId)}>
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="action-btn edit" onClick={() => handleEdit(q.questionId)}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete(q.questionId)}>
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
        {totalQuestions > filters.pageSize && (
          <div className="pagination">
            <button disabled={filters.page === 1} onClick={() => handleFilterChange({ page: filters.page - 1 })}>Previous</button>
            <span>Trang {filters.page} / {Math.ceil(totalQuestions / filters.pageSize)}</span>
            <button disabled={filters.page >= Math.ceil(totalQuestions / filters.pageSize)} onClick={() => handleFilterChange({ page: filters.page + 1 })}>Next</button>
          </div>
        )}
      </div>

      {showModal && (
        <QuestionModal
          questionId={selectedQuestionId}
          isEditMode={editMode}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default QuestionBank;