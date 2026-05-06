import React, { useState } from 'react';
import { useTeacherData } from '../../hooks/useTeacherData';
import ExamModel from './components/ExamModel';

const ExamManagement = () => {
  const {
    loading,
    exams,
    examFilters,
    setExamFilters,
    createExam,
    updateExam,
    deleteExam,
    activateExam,
    deactivateExam,
    fetchScoreDistribution,
  } = useTeacherData();

  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null); // null => tạo mới, object => sửa
  const [scoreDistributions, setScoreDistributions] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState(null);

  const handleCreate = () => {
    setEditingExam(null);
    setShowModal(true);
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xoá kỳ thi này?')) {
      const result = await deleteExam(id);
      alert(result.message);
    }
  };

  const handleActivate = async (id) => {
    const result = await activateExam(id);
    alert(result.message);
  };

  const handleDeactivate = async (id) => {
    const result = await deactivateExam(id);
    alert(result.message);
  };

  const handleViewScoreDistribution = async (id) => {
    setSelectedExamId(id);
    const data = await fetchScoreDistribution(id);
    setScoreDistributions(data);
    // Có thể mở một modal/biểu đồ để hiển thị phân phối điểm
    alert(JSON.stringify(data, null, 2)); // Demo đơn giản
  };

  const handleModalSubmit = async (examData) => {
    if (editingExam) {
      return await updateExam(editingExam.id, examData);
    } else {
      return await createExam(examData);
    }
  };

  return (
    <div className="tab-content">
      <div className="content-header">
        <div className="content-header-left">
          <h2 className="content-title">Quản lý kỳ thi</h2>
          <p className="content-description">Tạo và quản lý các kỳ thi của bạn</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <i className="fas fa-plus"></i> Tạo kỳ thi
        </button>
      </div>

      <div className="table-section">
        <h3 className="section-title">Danh sách kỳ thi</h3>
        {loading && <p>Đang tải...</p>}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên kỳ thi</th>
                <th>Mô tả</th>
                <th>Thời gian bắt đầu</th>
                <th>Thời gian kết thúc</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {exams.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>Chưa có kỳ thi nào</td>
                </tr>
              ) : (
                exams.map((exam) => (
                  <tr key={exam.id}>
                    <td>#{exam.id}</td>
                    <td>{exam.name}</td>
                    <td>{exam.description || '—'}</td>
                    <td>{exam.startTime ? new Date(exam.startTime).toLocaleString('vi-VN') : '—'}</td>
                    <td>{exam.endTime ? new Date(exam.endTime).toLocaleString('vi-VN') : '—'}</td>
                    <td>
                      <span className={`status-badge ${exam.isActive ? 'active' : 'inactive'}`}>
                        {exam.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view" title="Xem" onClick={() => handleEdit(exam)}>
                          <i className="fas fa-edit"></i>
                        </button>
                        {exam.isActive ? (
                          <button className="action-btn warning" title="Vô hiệu hoá" onClick={() => handleDeactivate(exam.id)}>
                            <i className="fas fa-pause-circle"></i>
                          </button>
                        ) : (
                          <button className="action-btn success" title="Kích hoạt" onClick={() => handleActivate(exam.id)}>
                            <i className="fas fa-play-circle"></i>
                          </button>
                        )}
                        <button className="action-btn info" title="Phân phối điểm" onClick={() => handleViewScoreDistribution(exam.id)}>
                          <i className="fas fa-chart-bar"></i>
                        </button>
                        <button className="action-btn delete" title="Xoá" onClick={() => handleDelete(exam.id)}>
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
        {/* Phân trang đơn giản
        {totalExams > examFilters.pageSize && (
          <div className="pagination">
            <button
              disabled={examFilters.page <= 1}
              onClick={() => setExamFilters(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              Trước
            </button>
            <span>Trang {examFilters.page}</span>
            <button
              disabled={examFilters.page * examFilters.pageSize >= totalExams}
              onClick={() => setExamFilters(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              Sau
            </button>
          </div>
        )} */}
      </div>

      {showModal && (
        <ExamModel
          exam={editingExam}
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default ExamManagement;