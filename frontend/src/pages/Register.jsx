import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken, setUser } from '../utils/auth';
import API_CONFIG from '../config/api.config';
import '../styles/login.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    email: '',
    school: '',
    className: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      role: role
    }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.password || !formData.email || !formData.school) {
      setError('Vui lòng điền đầy đủ thông tin!');
      return false;
    }

    // Kiểm tra lớp học cho student
    if (formData.role === 'student' && !formData.className) {
      setError('Vui lòng nhập lớp học của bạn!');
      return false;
    }

    // Kiểm tra độ dài password
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return false;
    }

    // Kiểm tra confirm password
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return false;
    }

    // Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email không hợp lệ!');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Chuyển đổi className thành grade (nếu là student)
      let grade = null;
      if (formData.role === 'student' && formData.className) {
        // Lấy số từ className (VD: "10A1" -> 10)
        const gradeMatch = formData.className.match(/\d+/);
        grade = gradeMatch ? parseInt(gradeMatch[0]) : null;
      }

      // Tạo payload đúng với backend
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword, // ← THÊM confirmPassword
        role: formData.role === 'student' ? 'Student' : 'Teacher', // ← Viết hoa chữ cái đầu
        school: formData.school || null,
        grade: grade  // ← Gửi grade thay vì className
      };

      console.log('Sending payload:', payload);

      // Gọi API đăng ký
      const response = await fetch(`${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('Register response:', data);

      if (response.ok && data.success) {
        // ✅ Lưu token và user từ response (cấu trúc khác với login)
        if (data.accessToken) {
          setToken(data.accessToken);  // ← Dùng accessToken, không phải token
        }
        
        if (data.user) {
          // Chuẩn hóa role thành chữ thường để đồng bộ với app
          const userToStore = {
            ...data.user,
            role: data.user.role.toLowerCase()
          };
          setUser(userToStore);
        }
        
        // Chuyển hướng dựa vào role
        const userRole = data.user?.role?.toLowerCase();
        if (userRole === 'teacher') {
          window.location.href = '/teacher';
        } else if (userRole === 'student') {
          window.location.href = '/student';
        } else {
          window.location.href = '/';
        }
      } else {
        // Hiển thị message lỗi từ backend
        setError(data.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Không thể đăng ký. Vui lòng thử lại sau.');
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-backdrop"></div>
        
        <div className="login-box register-box">
          <div className="login-header">
            <div className="login-logo">
              <i className="fas fa-user-plus"></i>
            </div>
            <h2 className="login-title">Đăng ký tài khoản</h2>
            <p className="login-subtitle">Tạo tài khoản mới để bắt đầu học tập</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}
            
            {/* ✅ Lựa chọn vai trò đăng ký */}
            <div className="role-selection">
              <button 
                type="button" 
                className={`role-btn ${formData.role === 'student' ? 'active' : ''}`}
                onClick={() => handleRoleChange('student')}
                disabled={loading}
              >
                <i className="fas fa-user-graduate"></i>
                <span>Đăng ký với tư cách Học sinh</span>
              </button>
              
              <button 
                type="button" 
                className={`role-btn ${formData.role === 'teacher' ? 'active' : ''}`}
                onClick={() => handleRoleChange('teacher')}
                disabled={loading}
              >
                <i className="fas fa-chalkboard-teacher"></i>
                <span>Đăng ký với tư cách Giáo viên</span>
              </button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                  <i className="fas fa-user"></i> Họ và tên
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <i className="fas fa-envelope"></i> Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ email"
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  <i className="fas fa-at"></i> Tên đăng nhập
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Nhập tên đăng nhập"
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="school" className="form-label">
                  <i className="fas fa-school"></i> Trường học
                </label>
                <input
                  type="text"
                  id="school"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="Nhập tên trường"
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* ✅ Chỉ hiển thị trường Lớp khi chọn đăng ký Học sinh */}
            {formData.role === 'student' && (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="className" className="form-label">
                    <i className="fas fa-chalkboard"></i> Lớp học
                  </label>
                  <select
                    id="className"
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                    className="form-input"
                    required
                    disabled={loading}
                  >
                    <option value="">Chọn lớp</option>
                    <option value="10">Lớp 10</option>
                    <option value="11">Lớp 11</option>
                    <option value="12">Lớp 12</option>
                  </select>
                  <small style={{color: '#666', fontSize: '12px', marginTop: '5px', display: 'block'}}>
                    Vui lòng chọn khối lớp của bạn
                  </small>
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <i className="fas fa-lock"></i> Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  <i className="fas fa-lock"></i> Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Đang đăng ký...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus"></i>
                  Đăng ký
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Đã có tài khoản? 
              <button className="link-btn" onClick={() => navigate('/login')}>
                Đăng nhập ngay
              </button>
            </p>
          </div>

          <button className="back-home-btn" onClick={() => navigate('/')}>
            <i className="fas fa-arrow-left"></i>
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;