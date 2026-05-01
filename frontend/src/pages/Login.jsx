import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_CONFIG from '../config/api.config';
import '../styles/login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // DEMO MODE: Fake đăng nhập không cần backend
    setTimeout(() => {
      let demoUser = null;

      if (username === 'admin' && password === 'admin123') {
        demoUser = {
          userId: 'admin-001',
          username: 'admin',
          email: 'admin@luyenthithpt.com',
          role: 'admin'
        };
      } else if (username === 'teacher' && password === 'teacher123') {
        demoUser = {
          userId: 'teacher-001',
          username: 'teacher',
          email: 'teacher@luyenthithpt.com',
          role: 'teacher'
        };
      } else if (username === 'student' && password === 'student123') {
        demoUser = {
          userId: 'student-001',
          username: 'student',
          email: 'student@luyenthithpt.com',
          role: 'student'
        };
      } else {
        setError('Tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại.');
        setLoading(false);
        return;
      }

      // Lưu thông tin user vào localStorage
      localStorage.setItem('token', 'demo-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(demoUser));

      // Chuyển hướng
      const userRole = demoUser.role;
      
      setTimeout(() => {
        if (userRole === 'admin') {
          window.location.href = '/admin';
        } else if (userRole === 'teacher') {
          window.location.href = '/teacher';
        } else if (userRole === 'student') {  
          window.location.href = '/student';
        }
      }, 300);
      
    }, 500);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-backdrop"></div>
        
        <div className="login-box">
          <div className="login-header">
            <div className="login-logo">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <h2 className="login-title">Đăng nhập</h2>
            <p className="login-subtitle">Chào mừng bạn quay trở lại!</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                <i className="fas fa-user"></i> Tên đăng nhập
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                className="form-input"
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <i className="fas fa-lock"></i> Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="form-input"
                required
                disabled={loading}
              />
            </div>
            
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Đăng nhập
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Chưa có tài khoản? 
              <button className="link-btn" onClick={() => navigate('/register')}>
                Đăng ký ngay
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

export default Login;