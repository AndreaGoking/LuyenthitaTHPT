import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/footer.css";

function Footer() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
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
              <button className="social-btn" onClick={() => showToastMessage('Facebook')}>
                <i className="fab fa-facebook-f"></i>
              </button>
              <button className="social-btn" onClick={() => showToastMessage('YouTube')}>
                <i className="fab fa-youtube"></i>
              </button>
              <button className="social-btn" onClick={() => showToastMessage('Instagram')}>
                <i className="fab fa-instagram"></i>
              </button>
              <button className="social-btn" onClick={() => showToastMessage('TikTok')}>
                <i className="fab fa-tiktok"></i>
              </button>
            </div>
          </div>
          
          <div className="footer-column">
            <h4>Sản phẩm</h4>
            <ul className="footer-links">
              <li><button className="link-btn" onClick={() => showToastMessage('Luyện thi THPT')}>Luyện thi THPT</button></li>
              <li><button className="link-btn" onClick={() => showToastMessage('IELTS Preparation')}>IELTS Preparation</button></li>
              <li><button className="link-btn" onClick={() => showToastMessage('TOEIC Practice')}>TOEIC Practice</button></li>
              <li><button className="link-btn" onClick={() => showToastMessage('Tiếng Anh giao tiếp')}>Tiếng Anh giao tiếp</button></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Hỗ trợ</h4>
            <ul className="footer-links">
              <li><button className="link-btn" onClick={() => showToastMessage('Trung tâm trợ giúp')}>Trung tâm trợ giúp</button></li>
              <li><button className="link-btn" onClick={() => showToastMessage('Liên hệ')}>Liên hệ</button></li>
              <li><button className="link-btn" onClick={() => showToastMessage('FAQ')}>FAQ</button></li>
              <li><button className="link-btn" onClick={() => showToastMessage('Góp ý')}>Góp ý</button></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Công ty</h4>
            <ul className="footer-links">
              <li><button className="link-btn" onClick={() => showToastMessage('Về chúng tôi')}>Về chúng tôi</button></li>
              <li><button className="link-btn" onClick={() => showToastMessage('Tuyển dụng')}>Tuyển dụng</button></li>
              <li><button className="link-btn" onClick={() => showToastMessage('Điều khoản')}>Điều khoản</button></li>
              <li><button className="link-btn" onClick={() => showToastMessage('Bảo mật')}>Bảo mật</button></li>
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