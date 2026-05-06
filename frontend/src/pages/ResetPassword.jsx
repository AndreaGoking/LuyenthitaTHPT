import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { userService } from '../services/userService';
import '../styles/login.css';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Lấy token và email từ URL params
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');
    
    if (urlToken) setToken(urlToken);
    if (urlEmail) setEmail(urlEmail);
  }, [searchParams]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!newPassword.trim()) {
      newErrors.newPassword = 'Please enter new password';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await userService.resetPassword({
        token,
        email,
        newPassword,
        confirmPassword
      });

      setSuccess('Password has been reset successfully!');
      
      // Chuyển hướng về trang đăng nhập sau 3 giây
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError(
        err.message || 
        'Failed to reset password. The link may be expired or invalid'
      );
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
              <i className="fas fa-key"></i>
            </div>
            <h2 className="login-title">Reset Password</h2>
            <p className="login-subtitle">Enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                {success}
                <br />
                <small>Redirecting to login page...</small>
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-lock"></i> New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.newPassword) setErrors(prev => ({ ...prev, newPassword: '' }));
                }}
                placeholder="Enter new password"
                className={`form-input ${errors.newPassword ? 'input-error' : ''}`}
                disabled={loading || success}
              />
              {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-lock"></i> Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                }}
                placeholder="Confirm new password"
                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                disabled={loading || success}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
            
            <button type="submit" className="login-button" disabled={loading || success}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Resetting password...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Reset Password
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Remember your password? 
              <button className="link-btn" onClick={() => navigate('/login')}>
                Back to Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;