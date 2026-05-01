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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Đăng nhập thành công
        const accessToken = data.data.accessToken;
        const userData = data.data.user;  

        localStorage.setItem('token', accessToken);

        const userToStore = {
          userId: userData.userId,
          username: userData.username,
          email: userData.email,
          role: userData.role.toLowerCase()
        };

        localStorage.setItem('user', JSON.stringify(userToStore));

        const userRole = userToStore.role;

        setTimeout(() => {
          if (userRole === 'admin') {
            window.location.href = '/admin';
          } else if (userRole === 'teacher') {
            window.location.href = '/teacher';
          } else if (userRole === 'student') {  
            window.location.href = '/student';
          } else {
            window.location.href = '/';
          }
        }, 100);

      } else if (response.status === 401) {
        // ✅ Hiển thị thông báo lỗi từ server
        const errorMessage = data.message || data.data?.message || 'Đăng nhập thất bại';
        
        // Phân biệt các loại lỗi để hiển thị phù hợp
        if (errorMessage.toLowerCase().includes('tên đăng nhập') || errorMessage.toLowerCase().includes('username') 
            || errorMessage.toLowerCase().includes('mật khẩu') || errorMessage.toLowerCase().includes('password')) {
          setError('Tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại.');
        } else if (  errorMessage.toLowerCase().includes('khóa') || errorMessage.toLowerCase().includes('lock')) {
          setError('Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.');
          
        } else {
          setError(errorMessage);
        }
      } else {
        // Các lỗi khác (500, 400, etc.)
        setError(data.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy hay chưa.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
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