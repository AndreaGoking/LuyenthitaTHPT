// src/pages/admin/components/MatrixRuleModal.jsx
import React, { useState, useEffect } from 'react';
import API_CONFIG from '../../../config/api.config';
import { getToken } from '../../../utils/auth';

const SKILL_OPTIONS = [
  'Phonetics', 'Grammar', 'Vocabulary', 'Reading', 'Listening', 'Writing'
];

function MatrixRuleModal({
  matrixId,
  isEditMode = false,
  isViewMode = false,
  initialDistributions = [],
  onSubmit,
  onUpdateDistributions,
  onClose,
  onShowToast,
}) {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(isEditMode);
  const [viewMode, setViewMode] = useState(isViewMode);
  const [formData, setFormData] = useState({
    name: '',
    recognitionRate: 0,
    understandingRate: 0,
    applicationRate: 0,
    highAppRate: 0,
  });
  const [skillDistributions, setSkillDistributions] = useState([]);
  const [errors, setErrors] = useState({});

  // Fetch matrix chi tiết nếu có matrixId (và không phải tạo mới)
  useEffect(() => {
    if (matrixId) {
      fetchMatrixDetail();
    } else {
      // Reset form cho thêm mới
      setFormData({
        name: '',
        recognitionRate: 0,
        understandingRate: 0,
        applicationRate: 0,
        highAppRate: 0,
      });
      setSkillDistributions([]);
    }
  }, [matrixId]);

  const fetchMatrixDetail = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.GET_EXAM_MATRIX.replace('{id}', matrixId)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const matrix = data.data;
        setFormData({
          name: matrix.name || '',
          recognitionRate: matrix.recognitionRate || 0,
          understandingRate: matrix.understandingRate || 0,
          applicationRate: matrix.applicationRate || 0,
          highAppRate: matrix.highAppRate || 0,
        });
        setSkillDistributions(matrix.skillDistributions || initialDistributions || []);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(error);
      onShowToast('Không thể tải chi tiết ma trận', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập tên ma trận';
    const totalRate = formData.recognitionRate + formData.understandingRate + formData.applicationRate + formData.highAppRate;
    if (Math.abs(totalRate - 100) > 0.01) newErrors.rate = 'Tổng tỷ lệ các mức phải bằng 100%';
    if (skillDistributions.length === 0) newErrors.skills = 'Vui lòng thêm ít nhất một phân bổ kỹ năng';
    skillDistributions.forEach((dist, idx) => {
      if (!dist.skill) newErrors[`skill_${idx}`] = 'Chọn kỹ năng';
      if (dist.questionCount <= 0) newErrors[`count_${idx}`] = 'Số câu hỏi phải > 0';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const submitData = {
      name: formData.name,
      recognitionRate: formData.recognitionRate,
      understandingRate: formData.understandingRate,
      applicationRate: formData.applicationRate,
      highAppRate: formData.highAppRate,
      skillDistributions: skillDistributions.map(d => ({
        skill: d.skill,
        questionCount: d.questionCount,
      })),
    };
    onSubmit(submitData);
  };

  const handleUpdateDistributions = () => {
    if (!validateForm()) return;
    const dists = skillDistributions.map(d => ({
      skill: d.skill,
      questionCount: d.questionCount,
    }));
    onUpdateDistributions(dists);
  };

  // Thêm/xóa phân bổ kỹ năng
  const addSkillDistribution = () => {
    setSkillDistributions([...skillDistributions, { skill: '', questionCount: 1 }]);
  };
  const removeSkillDistribution = (index) => {
    const newList = skillDistributions.filter((_, i) => i !== index);
    setSkillDistributions(newList);
  };
  const updateSkillDistribution = (index, field, value) => {
    const newList = [...skillDistributions];
    newList[index][field] = value;
    setSkillDistributions(newList);
  };

  const renderDetailView = () => (
    <div className="matrix-detail-view">
      <div className="detail-row"><strong>Tên ma trận:</strong> {formData.name}</div>
      <div className="detail-row"><strong>Tỷ lệ nhận biết:</strong> {formData.recognitionRate}%</div>
      <div className="detail-row"><strong>Tỷ lệ thông hiểu:</strong> {formData.understandingRate}%</div>
      <div className="detail-row"><strong>Tỷ lệ vận dụng:</strong> {formData.applicationRate}%</div>
      <div className="detail-row"><strong>Tỷ lệ vận dụng cao:</strong> {formData.highAppRate}%</div>
      <div className="detail-row"><strong>Phân bổ kỹ năng:</strong></div>
      <table className="sub-table">
        <thead><tr><th>Kỹ năng</th><th>Số câu hỏi</th></tr></thead>
        <tbody>
          {skillDistributions.map((dist, idx) => (
            <tr key={idx}><td>{dist.skill}</td><td>{dist.questionCount}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderEditForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="modal-body">
        <div className="form-group">
          <label>Tên ma trận *</label>
          <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          {errors.name && <small className="error">{errors.name}</small>}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Nhận biết (%)</label>
            <input type="number" step="0.1" value={formData.recognitionRate} onChange={e => setFormData({...formData, recognitionRate: parseFloat(e.target.value) || 0})} />
          </div>
          <div className="form-group">
            <label>Thông hiểu (%)</label>
            <input type="number" step="0.1" value={formData.understandingRate} onChange={e => setFormData({...formData, understandingRate: parseFloat(e.target.value) || 0})} />
          </div>
          <div className="form-group">
            <label>Vận dụng (%)</label>
            <input type="number" step="0.1" value={formData.applicationRate} onChange={e => setFormData({...formData, applicationRate: parseFloat(e.target.value) || 0})} />
          </div>
          <div className="form-group">
            <label>Vận dụng cao (%)</label>
            <input type="number" step="0.1" value={formData.highAppRate} onChange={e => setFormData({...formData, highAppRate: parseFloat(e.target.value) || 0})} />
          </div>
        </div>
        {errors.rate && <small className="error">{errors.rate}</small>}
        <div className="form-group">
          <label>Phân bổ câu hỏi theo kỹ năng</label>
          {skillDistributions.map((dist, idx) => (
            <div key={idx} className="skill-dist-row">
              <select value={dist.skill} onChange={e => updateSkillDistribution(idx, 'skill', e.target.value)} required>
                <option value="">Chọn kỹ năng</option>
                {SKILL_OPTIONS.map(skill => <option key={skill} value={skill}>{skill}</option>)}
              </select>
              <input type="number" min="1" value={dist.questionCount} onChange={e => updateSkillDistribution(idx, 'questionCount', parseInt(e.target.value) || 1)} required />
              <button type="button" className="btn-icon delete" onClick={() => removeSkillDistribution(idx)}><i className="fas fa-trash"></i></button>
            </div>
          ))}
          <button type="button" className="btn btn-secondary btn-sm" onClick={addSkillDistribution}>+ Thêm kỹ năng</button>
          {errors.skills && <small className="error">{errors.skills}</small>}
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
        <button type="submit" className="btn btn-primary">{matrixId ? 'Cập nhật' : 'Tạo mới'}</button>
      </div>
    </form>
  );

  const renderDistributionsEdit = () => (
    <div>
      <h4>Cập nhật phân bổ kỹ năng</h4>
      {skillDistributions.map((dist, idx) => (
        <div key={idx} className="skill-dist-row">
          <select value={dist.skill} onChange={e => updateSkillDistribution(idx, 'skill', e.target.value)} required>
            <option value="">Chọn kỹ năng</option>
            {SKILL_OPTIONS.map(skill => <option key={skill} value={skill}>{skill}</option>)}
          </select>
          <input type="number" min="1" value={dist.questionCount} onChange={e => updateSkillDistribution(idx, 'questionCount', parseInt(e.target.value) || 1)} required />
          <button type="button" className="btn-icon delete" onClick={() => removeSkillDistribution(idx)}><i className="fas fa-trash"></i></button>
        </div>
      ))}
      <button type="button" className="btn btn-secondary btn-sm" onClick={addSkillDistribution}>+ Thêm kỹ năng</button>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>Hủy</button>
        <button className="btn btn-primary" onClick={handleUpdateDistributions}>Lưu phân bổ</button>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {!matrixId ? 'Thêm ma trận mới' : (editMode ? 'Chỉnh sửa ma trận' : (viewMode ? 'Chi tiết ma trận' : 'Quản lý phân bổ kỹ năng'))}
          </h3>
          <button className="modal-close" onClick={onClose}><i className="fas fa-times"></i></button>
        </div>
        {loading ? (
          <div className="modal-body" style={{textAlign:'center'}}>Đang tải...</div>
        ) : (
          <>
            {matrixId && viewMode && renderDetailView()}
            {matrixId && !viewMode && !editMode && (
              // Chế độ chỉ quản lý phân bổ kỹ năng (nếu muốn tách riêng)
              renderDistributionsEdit()
            )}
            {(editMode || !matrixId) && renderEditForm()}
            {matrixId && viewMode && (
              <div className="modal-footer" style={{justifyContent:'center'}}>
                <button className="btn btn-primary" onClick={() => { setViewMode(false); setEditMode(true); }}><i className="fas fa-edit"></i> Chỉnh sửa</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MatrixRuleModal;