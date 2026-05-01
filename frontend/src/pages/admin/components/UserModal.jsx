// src/pages/admin/components/UserModal.jsx
import React, { useState, useEffect } from 'react';
import API_CONFIG from '../../../config/api.config';

function UserModal({ userId, user: propUser, onSubmit, onClose, isEditMode = false }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(isEditMode);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Student',
    school: '',
    grade: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userId) {
      fetchUserDetail();
    } else if (propUser) {
      setUser(propUser);
      setFormData({
        username: propUser.username || '',
        email: propUser.email || '',
        password: '',
        role: propUser.role || 'Student',
        school: propUser.school || '',
        grade: propUser.grade || '',
      });
    } else {
      setUser(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'Student',
        school: '',
        grade: '',
      });
    }
  }, [userId, propUser]);

  const fetchUserDetail = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.GET_USER.replace('{id}', userId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch user detail');
      const userData = await response.json();
      setUser(userData);
      setFormData({
        username: userData.username || '',
        email: userData.email || '',
        password: '',
        role: userData.role || 'Student',
        school: userData.school || '',
        grade: userData.grade || '',
      });
    } catch (error) {
      console.error('Lỗi tải chi tiết user:', error);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Vui lòng nhập tên đăng nhập';
    if (!formData.email) newErrors.email = 'Vui lòng nhập email';
    if (!user && !formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    if (!user && formData.password?.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    if (formData.role === 'Student' && !formData.grade) newErrors.grade = 'Vui lòng nhập lớp';
    if (formData.role === 'Teacher' && !formData.school) newErrors.school = 'Vui lòng nhập trường';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submitData = { ...formData };
      if (user) delete submitData.password;
      if (submitData.grade) submitData.grade = parseInt(submitData.grade);
      onSubmit(submitData);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '',
        role: user.role || 'Student',
        school: user.school || '',
        grade: user.grade || '',
      });
    }
    setEditMode(false);
    setErrors({});
  };

  const renderDetailView = () => {
    if (!user) return null;
    return (
      <div className="user-detail-view">
        <div className="detail-row">
          <strong>ID:</strong> {user.userId}
        </div>
        <div className="detail-row">
          <strong>Tên đăng nhập:</strong> {user.username}
        </div>
        <div className="detail-row">
          <strong>Email:</strong> {user.email}
        </div>
        <div className="detail-row">
          <strong>Vai trò:</strong> {user.role}
        </div>
        {user.role === 'Teacher' && (
          <div className="detail-row">
            <strong>Trường:</strong> {user.school || 'Chưa cập nhật'}
          </div>
        )}
        {user.role === 'Student' && (
          <div className="detail-row">
            <strong>Lớp:</strong> {user.grade || 'Chưa cập nhật'}
          </div>
        )}
        <div className="detail-row">
          <strong>Trạng thái:</strong>
          <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
            {user.isActive ? 'Hoạt động' : 'Đã khóa'}
          </span>
        </div>
        <div className="detail-row">
          <strong>Ngày tạo:</strong> {new Date(user.createdAt).toLocaleString('vi-VN')}
        </div>
        <div className="detail-row">
          <strong>Lần đăng nhập cuối:</strong> {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('vi-VN') : 'Chưa đăng nhập'}
        </div>
      </div>
    );
  };

  const renderEditForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div className="form-group">
            <label>Tên đăng nhập *</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              disabled={!!user}
              required
            />
            {errors.username && <small className="error">{errors.username}</small>}
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            {errors.email && <small className="error">{errors.email}</small>}
          </div>

          {!user && (
            <div className="form-group">
              <label>Mật khẩu *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              {errors.password && <small className="error">{errors.password}</small>}
            </div>
          )}

          <div className="form-group">
            <label>Vai trò *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="Student">Học sinh</option>
              <option value="Teacher">Giáo viên</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {formData.role === 'Teacher' && (
            <div className="form-group">
              <label>Trường học</label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => setFormData({...formData, school: e.target.value})}
                placeholder="Nhập tên trường"
              />
              {errors.school && <small className="error">{errors.school}</small>}
            </div>
          )}

          {formData.role === 'Student' && (
            <div className="form-group">
              <label>Lớp</label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({...formData, grade: e.target.value})}
              >
                <option value="">Chọn lớp</option>
                <option value="10">Lớp 10</option>
                <option value="11">Lớp 11</option>
                <option value="12">Lớp 12</option>
              </select>
              {errors.grade && <small className="error">{errors.grade}</small>}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
            Hủy
          </button>
          <button type="submit" className="btn btn-primary">
            {user ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {!userId ? 'Thêm người dùng mới' : (editMode ? 'Chỉnh sửa người dùng' : 'Chi tiết người dùng')}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        {loading ? (
          <div className="modal-body" style={{ textAlign: 'center' }}>Đang tải...</div>
        ) : (
          <>
            {userId && !editMode && renderDetailView()}
            {(editMode || !userId) && renderEditForm()}
            {userId && !editMode && (
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

export default UserModal;