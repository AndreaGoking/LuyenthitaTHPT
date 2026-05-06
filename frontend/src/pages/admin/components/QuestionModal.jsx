import React, { useState, useEffect } from 'react';
import API_CONFIG from '../../../config/api.config';
import { getToken } from '../../../utils/auth';

const SKILLS = [
  { value: 'Phonetics', label: 'Ngữ âm' },
  { value: 'Grammar', label: 'Ngữ pháp' },
  { value: 'Vocabulary', label: 'Từ vựng' },
  { value: 'Reading', label: 'Đọc hiểu' },
  { value: 'Listening', label: 'Nghe' },
  { value: 'Writing', label: 'Viết' },
];

const LEVELS = [
  { value: 'Remember', label: 'Nhận biết' },
  { value: 'Understand', label: 'Thông hiểu' },
  { value: 'Apply', label: 'Vận dụng' },
  { value: 'Analyze', label: 'Vận dụng cao' },
];

function QuestionModal({ questionId, onClose, onSubmit, isEditMode = false }) {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(isEditMode);
  const [formData, setFormData] = useState({
    content: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    skill: SKILLS[0].value,
    level: LEVELS[0].value,
    topic: '',
    source: '',
    passageId: '',
  });
  const [errors, setErrors] = useState({});

  // Tải dữ liệu khi có questionId (chỉ xem hoặc chỉnh sửa)
  useEffect(() => {
    if (questionId) {
      if (editMode) {
        // Khi mở modal để sửa: tải dữ liệu và vẫn giữ edit mode
        fetchQuestionData();
      } else {
        // Xem chi tiết: tải dữ liệu
        fetchQuestionData();
      }
    } else {
      // Reset form khi thêm mới
      resetForm();
    }
  }, [questionId, editMode]);

  const fetchQuestionData = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.GET_QUESTION.replace('{id}', questionId)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error('Không thể tải dữ liệu câu hỏi');
      const data = await response.json();
      setFormData({
        content: data.content || '',
        optionA: data.optionA || '',
        optionB: data.optionB || '',
        optionC: data.optionC || '',
        optionD: data.optionD || '',
        correctAnswer: data.correctAnswer || 'A',
        skill: data.skill || SKILLS[0].value,
        level: data.level || LEVELS[0].value,
        topic: data.topic || '',
        source: data.source || '',
        passageId: data.passageId || '',
      });
    } catch (error) {
      console.error('Lỗi tải chi tiết câu hỏi:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      content: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      skill: SKILLS[0].value,
      level: LEVELS[0].value,
      topic: '',
      source: '',
      passageId: '',
    });
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.content.trim()) newErrors.content = 'Vui lòng nhập nội dung câu hỏi';
    if (!formData.optionA.trim()) newErrors.optionA = 'Vui lòng nhập đáp án A';
    if (!formData.optionB.trim()) newErrors.optionB = 'Vui lòng nhập đáp án B';
    if (!formData.optionC.trim()) newErrors.optionC = 'Vui lòng nhập đáp án C';
    if (!formData.optionD.trim()) newErrors.optionD = 'Vui lòng nhập đáp án D';
    if (!formData.topic.trim()) newErrors.topic = 'Vui lòng nhập chủ đề';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData = { ...formData };
    if (submitData.passageId === '') delete submitData.passageId;
    if (!submitData.source) delete submitData.source;

    onSubmit(submitData);
  };

  const handleEditClick = () => setEditMode(true);
  const handleCancelEdit = () => {
    if (questionId) {
      fetchQuestionData(); // reload dữ liệu gốc
    } else {
      resetForm();
    }
    setEditMode(false);
    setErrors({});
  };

  // Chế độ xem chi tiết (khi có questionId và không trong edit mode)
  const renderDetailView = () => (
    <div className="question-detail-view">
      <div className="detail-row"><strong>Nội dung:</strong> {formData.content}</div>
      <div className="detail-row"><strong>A.</strong> {formData.optionA}</div>
      <div className="detail-row"><strong>B.</strong> {formData.optionB}</div>
      <div className="detail-row"><strong>C.</strong> {formData.optionC}</div>
      <div className="detail-row"><strong>D.</strong> {formData.optionD}</div>
      <div className="detail-row"><strong>Đáp án đúng:</strong> {formData.correctAnswer}</div>
      <div className="detail-row">
        <strong>Kỹ năng:</strong> {SKILLS.find(s => s.value === formData.skill)?.label}
      </div>
      <div className="detail-row">
        <strong>Mức độ:</strong> {LEVELS.find(l => l.value === formData.level)?.label}
      </div>
      <div className="detail-row"><strong>Chủ đề:</strong> {formData.topic}</div>
      {formData.source && <div className="detail-row"><strong>Nguồn:</strong> {formData.source}</div>}
      {formData.passageId && <div className="detail-row"><strong>Passage ID:</strong> {formData.passageId}</div>}
    </div>
  );

  // Form thêm / sửa
  const renderEditForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="modal-body">
        <div className="form-group">
          <label>Nội dung câu hỏi *</label>
          <textarea rows="3" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required />
          {errors.content && <small className="error">{errors.content}</small>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Đáp án A *</label>
            <input value={formData.optionA} onChange={e => setFormData({...formData, optionA: e.target.value})} required />
            {errors.optionA && <small>{errors.optionA}</small>}
          </div>
          <div className="form-group">
            <label>Đáp án B *</label>
            <input value={formData.optionB} onChange={e => setFormData({...formData, optionB: e.target.value})} required />
            {errors.optionB && <small>{errors.optionB}</small>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Đáp án C *</label>
            <input value={formData.optionC} onChange={e => setFormData({...formData, optionC: e.target.value})} required />
            {errors.optionC && <small>{errors.optionC}</small>}
          </div>
          <div className="form-group">
            <label>Đáp án D *</label>
            <input value={formData.optionD} onChange={e => setFormData({...formData, optionD: e.target.value})} required />
            {errors.optionD && <small>{errors.optionD}</small>}
          </div>
        </div>

        <div className="form-group">
          <label>Đáp án đúng *</label>
          <select value={formData.correctAnswer} onChange={e => setFormData({...formData, correctAnswer: e.target.value})}>
            <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Kỹ năng *</label>
            <select value={formData.skill} onChange={e => setFormData({...formData, skill: e.target.value})}>
              {SKILLS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Mức độ *</label>
            <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}>
              {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Chủ đề *</label>
          <input value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} required />
          {errors.topic && <small>{errors.topic}</small>}
        </div>
        <div className="form-group">
          <label>Nguồn (tùy chọn)</label>
          <input value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Passage ID (tùy chọn)</label>
          <input value={formData.passageId} onChange={e => setFormData({...formData, passageId: e.target.value})} />
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Hủy</button>
        <button type="submit" className="btn btn-primary">{questionId ? 'Cập nhật' : 'Thêm mới'}</button>
      </div>
    </form>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {!questionId 
              ? 'Thêm câu hỏi mới' 
              : (editMode ? 'Chỉnh sửa câu hỏi' : 'Chi tiết câu hỏi')}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        {loading ? (
          <div className="modal-body" style={{ textAlign: 'center' }}>Đang tải...</div>
        ) : (
          <>
            {questionId && !editMode && renderDetailView()}
            {(editMode || !questionId) && renderEditForm()}
            {questionId && !editMode && (
              <div className="modal-footer" style={{ justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={handleEditClick}>
                  <i className="fas fa-edit"></i> Chỉnh sửa
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default QuestionModal;