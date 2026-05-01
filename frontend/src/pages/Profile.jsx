 import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, isAuthenticated } from '../utils/auth';
import Navbar from '../components/Navbar';
import '../styles/profile.css';

function Profile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    school: '',
    bio: ''
  });

  useEffect(() => {
    // Demo mode: nếu chưa đăng nhập thì tạo user demo
    if (!isAuthenticated()) {
      const demoUser = {
        userId: 'demo-user-123',
        username: 'demo',
        email: 'demo@luyenthithpt.com',
        role: 'student'
      };
      setCurrentUser(demoUser);
      setFormData({
        fullName: demoUser.username,
        email: demoUser.email || '',
        phone: '',
        school: '',
        bio: ''
      });
    } else {
      const user = getUser();
      setCurrentUser(user);
      setFormData({
        fullName: user.username,
        email: user.email || '',
        phone: '',
        school: '',
        bio: ''
      });
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // TODO: Call API to update profile
    alert('Thông tin đã được cập nhật thành công!');
    setIsEditing(false);
  };

  const getRoleName = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin': return 'Quản trị viên';
      case 'teacher': return 'Giáo viên';
      case 'student': return 'Học sinh';
      default: return 'Người dùng';
    }
  };

  const getRoleBadgeClass = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin': return 'role-admin';
      case 'teacher': return 'role-teacher';
      case 'student': return 'role-student';
      default: return '';
    }
  };

  if (!currentUser) return <div className="loading">Đang tải...</div>;

  return (
    <div className="profile-page">
      <Navbar />
      
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {currentUser.username?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{currentUser.username}</h1>
            <span className={`role-badge ${getRoleBadgeClass(currentUser.role)}`}>
              {getRoleName(currentUser.role)}
            </span>
            <p className="profile-email">{currentUser.email || 'Chưa cập nhật email'}</p>
          </div>
          <button 
            className="btn btn-primary edit-profile-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            <i className={`fas ${isEditing ? 'fa-times' : 'fa-edit'}`}></i>
            {isEditing ? 'Hủy' : 'Chỉnh sửa'}
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="card-header">
              <h2><i className="fas fa-user-circle"></i> Thông tin cá nhân</h2>
            </div>
            <div className="card-body">
              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Tên đăng nhập</label>
                    <input 
                      type="text" 
                      value={currentUser.username}
                      disabled
                      className="form-input disabled"
                    />
                  </div>
                  <div className="form-group">
                    <label>Họ và tên</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-input"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-input"
                      placeholder="Nhập địa chỉ email"
                    />
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input 
                      type="text" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-input"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Trường / Đơn vị</label>
                  <input 
                    type="text" 
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                    placeholder="Nhập tên trường học hoặc đơn vị công tác"
                  />
                </div>

                <div className="form-group">
                  <label>Giới thiệu</label>
                  <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-textarea"
                    placeholder="Viết vài dòng giới thiệu về bản thân..."
                    rows="4"
                  />
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button className="btn btn-success" onClick={handleSave}>
                      <i className="fas fa-save"></i> Lưu thay đổi
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-icon blue">
                <i className="fas fa-book"></i>
              </div>
              <div className="stat-info">
                <h3>12</h3>
                <p>Bài đã làm</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon green">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-info">
                <h3>87%</h3>
                <p>Tỷ lệ đúng</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon purple">
                <i className="fas fa-trophy"></i>
              </div>
              <div className="stat-info">
                <h3>#45</h3>
                <p>Hạng hiện tại</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon orange">
                <i className="fas fa-fire"></i>
              </div>
              <div className="stat-info">
                <h3>7</h3>
                <p>Ngày liên tiếp</p>
              </div>
            </div>
          </div>

          <div className="profile-card">
            <div className="card-header">
              <h2><i className="fas fa-key"></i> Bảo mật tài khoản</h2>
            </div>
            <div className="card-body">
              <div className="security-item">
                <div className="security-info">
                  <div className="security-title">Đổi mật khẩu</div>
                  <div className="security-desc">Cập nhật mật khẩu mới cho tài khoản của bạn</div>
                </div>
                <button className="btn btn-outline btn-sm">
                  <i className="fas fa-lock"></i> Đổi mật khẩu
                </button>
              </div>
              
              <div className="security-item">
                <div className="security-info">
                  <div className="security-title">Xác thực hai yếu tố</div>
                  <div className="security-desc">Tăng cường bảo mật bằng OTP qua email</div>
                </div>
                <button className="btn btn-outline btn-sm">
                  <i className="fas fa-shield-alt"></i> Bật xác thực
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Profile;