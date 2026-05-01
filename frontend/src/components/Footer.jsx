import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/footer.css";

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo" onClick={() => navigate('/')}>
              <i className="fas fa-graduation-cap"></i>
              <span>EnglishPro</span>
            </div>
            <p className="footer-description">
              Nền tảng học tiếng Anh hàng đầu Việt Nam, giúp hàng nghìn học viên chinh phục mục tiêu tiếng Anh.
            </p>
            <div className="footer-social">
              <a href="#" className="social-btn" onClick={(e) => { e.preventDefault(); showToastMessage('Facebook'); }}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-btn" onClick={(e) => { e.preventDefault(); showToastMessage('YouTube'); }}>
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="social-btn" onClick={(e) => { e.preventDefault(); showToastMessage('Instagram'); }}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-btn" onClick={(e) => { e.preventDefault(); showToastMessage('TikTok'); }}>
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-column">
            <h4>Sản phẩm</h4>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); showToastMessage('Luyện thi THPT'); }}>Luyện thi THPT</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); showToastMessage('IELTS Preparation'); }}>IELTS Preparation</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); showToastMessage('TOEIC Practice'); }}>TOEIC Practice</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); showToastMessage('Tiếng Anh giao tiếp'); }}>Tiếng Anh giao tiếp</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Hỗ trợ</h4>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); showToastMessage('Trung tâm trợ giúp'); }}>Trung tâm trợ giúp</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); showToastMessage('Liên hệ'); }}>Liên hệ</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); showToastMessage('FAQ'); }}>FAQ</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); showToastMessage('Góp ý'); }}>Góp ý</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Công ty</h4>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); showToastMessage('Về chúng tôi'); }}>Về chúng tôi</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); showToastMessage('Tuyển dụng'); }}>Tuyển dụng</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); showToastMessage('Điều khoản'); }}>Điều khoản</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); showToastMessage('Bảo mật'); }}>Bảo mật</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 EnglishPro. All rights reserved.</p>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast show success">
          <i className="fas fa-check-circle"></i>
          <span>{toastMessage}</span>
        </div>
      )}
    </footer>
  );
}

export default Footer;