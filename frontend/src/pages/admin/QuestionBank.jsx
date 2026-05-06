import React, { useState, useEffect } from 'react';
import QuestionModal from './components/QuestionModal';
import { examService } from '../../services/examService';

// Ánh xạ kỹ năng và mức độ nhận thức
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
  const [readingPassages, setReadingPassages] = useState([]);
  const [loadingPassages, setLoadingPassages] = useState(false);
  const [activeTab, setActiveTab] = useState('questions');
  const [showPassageModal, setShowPassageModal] = useState(false);
  const [passageForm, setPassageForm] = useState({
    title: '',
    content: ''
  });
  const [submittingPassage, setSubmittingPassage] = useState(false);

  // Load danh sách đoạn văn đọc hiểu
  useEffect(() => {
    if (activeTab === 'passages') {
      const loadPassages = async () => {
        try {
          setLoadingPassages(true);
          const response = await examService.getReadingPassages();
          const data = response?.data || response;
          setReadingPassages(Array.isArray(data) ? data : data?.items || data?.data || []);
        } catch (error) {
          onShowToast(error.message, 'error');
        } finally {
          setLoadingPassages(false);
        }
      };
      loadPassages();
    }
  }, [activeTab, onShowToast]);

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
          <p className="content-description">Quản lý tất cả câu hỏi trong hệ thống</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {activeTab === 'questions' && (
            <button className="btn btn-primary" onClick={handleAdd}>
              <i className="fas fa-plus"></i> Thêm câu hỏi
            </button>
          )}
          {activeTab === 'passages' && (
            <button className="btn btn-primary" onClick={() => setShowPassageModal(true)}>
              <i className="fas fa-plus"></i> Thêm đoạn văn
            </button>
          )}
          <button className={`btn ${activeTab === 'passages' ? 'btn-secondary' : 'btn-outline'}`} onClick={() => setActiveTab('passages')}>
            <i className="fas fa-book"></i> Đoạn văn đọc hiểu
          </button>
          <button className={`btn ${activeTab === 'questions' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('questions')}>
            <i className="fas fa-question"></i> Câu hỏi
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs" style={{ marginBottom: '20px', borderBottom: '2px solid #eee' }}>
        <button 
          className={`admin-tab ${activeTab === 'questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          📝 Danh sách câu hỏi
        </button>
        <button 
          className={`admin-tab ${activeTab === 'passages' ? 'active' : ''}`}
          onClick={() => setActiveTab('passages')}
        >
          📖 Đoạn văn đọc hiểu
        </button>
      </div>

      {activeTab === 'questions' && (
        <>

      {/* Bộ lọc */}
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

      {/* Bảng câu hỏi */}
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
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>Đang tải...</td></tr>
              ) : questions.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>Chưa có câu hỏi nào</td></tr>
              ) : (
                questions.map((q) => (
                  <tr key={q.questionId}>
                    <td>{q.questionId.slice(0, 8)}...</td>
                    <td className="question-content">{q.content}</td>
                    <td><span className="skill-badge">{SKILL_MAP[q.skill] || q.skill}</span></td>
                    <td><span className="cognitive-badge">{LEVEL_MAP[q.level] || q.level}</span></td>
                    <td>{q.topic}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view"
                          title="Xem"
                          onClick={() => handleView(q.questionId)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          className="action-btn edit"
                          title="Sửa"
                          onClick={() => handleEdit(q.questionId)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="action-btn delete"
                          title="Xóa"
                          onClick={() => handleDelete(q.questionId)}
                        >
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

        {/* Phân trang */}
        {totalQuestions > filters.pageSize && (
          <div className="pagination">
            <button
              disabled={filters.page === 1}
              onClick={() => handleFilterChange({ page: filters.page - 1 })}
            >
              Previous
            </button>
            <span>
              Trang {filters.page} / {Math.ceil(totalQuestions / filters.pageSize)}
            </span>
            <button
              disabled={filters.page >= Math.ceil(totalQuestions / filters.pageSize)}
              onClick={() => handleFilterChange({ page: filters.page + 1 })}
            >
              Next
            </button>
          </div>
        )}
      </div>

        </>
      )}

      {/* Tab Đoạn văn đọc hiểu */}
      {activeTab === 'passages' && (
        <div className="table-section">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tiêu đề đoạn văn</th>
                  <th>Độ khó</th>
                  <th>Số từ</th>
                  <th>Chủ đề</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loadingPassages ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                      <i className="fas fa-spinner fa-spin"></i> Đang tải dữ liệu đoạn văn...
                    </td>
                  </tr>
                ) : readingPassages.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>Chưa có đoạn văn nào</td>
                  </tr>
                ) : (
                  readingPassages.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{index + 1}</td>
                      <td style={{ maxWidth: '400px' }}>
                        <strong>{item.title || `Đoạn văn ${index + 1}`}</strong>
                        <p style={{ 
                          margin: '5px 0 0 0', 
                          fontSize: '12px', 
                          color: '#666',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {item.content || item.text || ''}
                        </p>
                      </td>
                      <td>{item.level || item.difficulty || 'N/A'}</td>
                      <td>{item.wordCount || 0}</td>
                      <td>{item.topic || item.category || 'N/A'}</td>
                      <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn view"
                            title="Xem chi tiết đoạn văn"
                            onClick={async () => {
                              try {
                                const detail = await examService.getReadingPassageById(item.id);
                                const data = detail?.data || detail;
                                alert(`📖 ${data.title || item.title}\n\n${data.content || item.content}`);
                              } catch (error) {
                                onShowToast(error.message, 'error');
                              }
                            }}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            className="action-btn edit"
                            title="Sửa đoạn văn"
                            onClick={async () => {
                              try {
                                const detail = await examService.getReadingPassageById(item.id);
                                const data = detail?.data || detail;
                                
                                const newTitle = prompt('Sửa tiêu đề:', data.title || item.title);
                                if (newTitle === null) return;
                                
                                const newContent = prompt('Sửa nội dung:', data.content || item.content);
                                if (newContent === null) return;
                                
                                await examService.updateReadingPassage(item.id, {
                                  title: newTitle,
                                  content: newContent
                                });
                                
                                onShowToast('✅ Cập nhật đoạn văn thành công!', 'success');
                                
                                // Refresh danh sách
                                const response = await examService.getReadingPassages();
                                const listData = response?.data || response;
                                setReadingPassages(Array.isArray(listData) ? listData : listData?.items || listData?.data || []);
                              } catch (error) {
                                onShowToast(error.message, 'error');
                              }
                            }}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="action-btn delete"
                            title="Xóa đoạn văn"
                            onClick={async () => {
                              if (!window.confirm(`Bạn có chắc muốn xóa đoạn văn "${item.title}"?`)) return;
                              
                              try {
                                await examService.deleteReadingPassage(item.id);
                                onShowToast('✅ Xóa đoạn văn thành công!', 'success');
                                
                                // Refresh danh sách
                                const response = await examService.getReadingPassages();
                                const listData = response?.data || response;
                                setReadingPassages(Array.isArray(listData) ? listData : listData?.items || listData?.data || []);
                              } catch (error) {
                                onShowToast(error.message, 'error');
                              }
                            }}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                          <button
                            className="action-btn success"
                            title="Gắn câu hỏi vào đoạn văn"
                            onClick={async () => {
                              const questionId = prompt('Nhập ID câu hỏi cần gắn vào đoạn văn này:');
                              if (!questionId || !questionId.trim()) return;
                              
                              try {
                                await examService.addQuestionToReadingPassage(item.id, questionId.trim());
                                onShowToast('✅ Gắn câu hỏi vào đoạn văn thành công!', 'success');
                              } catch (error) {
                                onShowToast(error.message, 'error');
                              }
                            }}
                          >
                            <i className="fas fa-link"></i>
                          </button>
                          <button
                            className="action-btn warning"
                            title="Xóa liên kết câu hỏi khỏi đoạn văn"
                            onClick={async () => {
                              const questionId = prompt('Nhập ID câu hỏi cần xóa liên kết:');
                              if (!questionId || !questionId.trim()) return;
                              
                              if (!window.confirm(`Bạn có chắc muốn xóa liên kết câu hỏi ID: ${questionId}?`)) return;
                              
                              try {
                                await examService.removeQuestionFromReadingPassage(item.id, questionId.trim());
                                onShowToast('✅ Xóa liên kết câu hỏi thành công!', 'success');
                              } catch (error) {
                                onShowToast(error.message, 'error');
                              }
                            }}
                          >
                            <i className="fas fa-unlink"></i>
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
      )}

      {/* Modal Thêm đoạn văn mới */}
      {showPassageModal && (
        <div className="modal active">
          <div className="modal-content" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3 className="modal-title">➕ Thêm đoạn văn đọc hiểu mới</h3>
              <button className="modal-close" onClick={() => setShowPassageModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                setSubmittingPassage(true);
                await examService.createReadingPassage(passageForm);
                onShowToast('✅ Tạo đoạn văn đọc hiểu thành công!', 'success');
                setShowPassageModal(false);
                setPassageForm({ title: '', content: '' });
                // Refresh danh sách
                const response = await examService.getReadingPassages();
                const data = response?.data || response;
                setReadingPassages(Array.isArray(data) ? data : data?.items || data?.data || []);
              } catch (error) {
                onShowToast(error.message, 'error');
              } finally {
                setSubmittingPassage(false);
              }
            }}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Tiêu đề đoạn văn *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required
                    value={passageForm.title}
                    onChange={(e) => setPassageForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nhập tiêu đề đoạn văn"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nội dung đoạn văn *</label>
                  <textarea 
                    className="form-input" 
                    style={{ minHeight: '200px', resize: 'vertical' }}
                    required
                    value={passageForm.content}
                    onChange={(e) => setPassageForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Nhập nội dung đoạn văn đọc hiểu..."
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-default" 
                  onClick={() => setShowPassageModal(false)}
                  disabled={submittingPassage}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submittingPassage}
                >
                  {submittingPassage ? <i className="fas fa-spinner fa-spin"></i> : ''}
                  Tạo đoạn văn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal */}
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