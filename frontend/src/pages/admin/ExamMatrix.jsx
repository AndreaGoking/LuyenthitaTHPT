// src/pages/admin/ExamMatrix.jsx
import React, { useState } from 'react';
import MatrixRuleModal from './components/MatrixRuleModal';

function ExamMatrix({
  examMatrices = [],
  totalMatrices = 0,
  filters = { page: 1, pageSize: 10 },
  onFilterChange,
  loading = false,
  onCreateMatrix,
  onUpdateMatrix,
  onDeleteMatrix,
  onFetchSkillDistributions,
  onUpdateSkillDistributions,
  onValidateMatrix,
  onShowToast,
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedMatrixId, setSelectedMatrixId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [skillDistributions, setSkillDistributions] = useState([]);

  const handleFilterChange = (newFilters) => {
    onFilterChange({ ...filters, ...newFilters, page: 1 });
  };

  const handleAdd = () => {
    setSelectedMatrixId(null);
    setEditMode(true);
    setViewMode(false);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    setSelectedMatrixId(id);
    setEditMode(true);
    setViewMode(false);
    setShowModal(true);
  };

  const handleView = async (id) => {
    setSelectedMatrixId(id);
    setEditMode(false);
    setViewMode(true);
    // Tải skill distributions nếu cần hiển thị trong modal xem
    const dists = await onFetchSkillDistributions(id);
    setSkillDistributions(dists);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa ma trận này không?')) return;
    const result = await onDeleteMatrix(id);
    onShowToast(result.message, result.success ? 'success' : 'error');
  };

  const handleSubmit = async (data) => {
    let result;
    if (selectedMatrixId && editMode) {
      result = await onUpdateMatrix(selectedMatrixId, data);
    } else if (!selectedMatrixId) {
      result = await onCreateMatrix(data);
    }
    if (result?.success) {
      onShowToast(result.message, 'success');
      setShowModal(false);
      setSelectedMatrixId(null);
      setEditMode(false);
      setViewMode(false);
    } else {
      onShowToast(result?.message || 'Có lỗi xảy ra', 'error');
    }
  };

  const handleUpdateDistributions = async (distributions) => {
    if (!selectedMatrixId) return;
    const result = await onUpdateSkillDistributions(selectedMatrixId, distributions);
    onShowToast(result.message, result.success ? 'success' : 'error');
    if (result.success) setShowModal(false);
  };

  const handleValidate = async () => {
    if (!selectedMatrixId) return;
    const result = await onValidateMatrix(selectedMatrixId);
    if (result) {
      const message = result.isValid
        ? `✅ Ma trận hợp lệ. Tổng câu hỏi: ${result.totalQuestions}, Tổng tỷ lệ: ${result.totalRate}%`
        : `❌ Ma trận không hợp lệ:\n${result.errors.join('\n')}`;
      onShowToast(message, result.isValid ? 'success' : 'error');
    } else {
      onShowToast('Không thể validate ma trận', 'error');
    }
  };

  return (
    <div className="tab-content">
      <div className="content-header">
        <div className="content-header-left">
          <h2 className="content-title">Ma trận đề thi</h2>
          <p className="content-description">Quản lý cấu trúc đề thi, tỷ lệ câu hỏi theo mức độ nhận thức và kỹ năng</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <i className="fas fa-plus"></i> Thêm ma trận
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Tìm kiếm:</label>
          <input
            type="text"
            className="filter-input"
            placeholder="Tên ma trận..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange({ search: e.target.value || undefined })}
          />
        </div>
      </div>

      {/* Bảng ma trận */}
      <div className="table-section">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên ma trận</th>
                <th>Tổng câu hỏi</th>
                <th>Nhận biết</th>
                <th>Thông hiểu</th>
                <th>Vận dụng</th>
                <th>Vận dụng cao</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{textAlign:'center'}}>Đang tải...</td></tr>
              ) : examMatrices.length === 0 ? (
                <tr><td colSpan="8" style={{textAlign:'center'}}>Chưa có ma trận nào</td></tr>
              ) : (
                examMatrices.map((matrix) => (
                  <tr key={matrix.matrixId}>
                    <td>{matrix.matrixId.slice(0,8)}...</td>
                    <td>{matrix.name}</td>
                    <td>{matrix.totalQuestions}</td>
                    <td>{matrix.recognitionRate}%</td>
                    <td>{matrix.understandingRate}%</td>
                    <td>{matrix.applicationRate}%</td>
                    <td>{matrix.highAppRate}%</td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view" onClick={() => handleView(matrix.matrixId)} title="Xem chi tiết">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="action-btn edit" onClick={() => handleEdit(matrix.matrixId)} title="Chỉnh sửa">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete(matrix.matrixId)} title="Xóa">
                          <i className="fas fa-trash"></i>
                        </button>
                        <button className="action-btn validate" onClick={() => {
                          setSelectedMatrixId(matrix.matrixId);
                          handleValidate();
                        }} title="Kiểm tra hợp lệ">
                          <i className="fas fa-check-circle"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalMatrices > filters.pageSize && (
          <div className="pagination">
            <button disabled={filters.page === 1} onClick={() => handleFilterChange({ page: filters.page - 1 })}>Previous</button>
            <span>Trang {filters.page} / {Math.ceil(totalMatrices / filters.pageSize)}</span>
            <button disabled={filters.page >= Math.ceil(totalMatrices / filters.pageSize)} onClick={() => handleFilterChange({ page: filters.page + 1 })}>Next</button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <MatrixRuleModal
          matrixId={selectedMatrixId}
          isEditMode={editMode}
          isViewMode={viewMode}
          initialDistributions={skillDistributions}
          onSubmit={handleSubmit}
          onUpdateDistributions={handleUpdateDistributions}
          onClose={() => setShowModal(false)}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
}

export default ExamMatrix;