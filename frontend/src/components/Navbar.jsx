import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUser, isAuthenticated, logout } from "../utils/auth";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check auth status on mount and location change
  useEffect(() => {
    if (isAuthenticated()) {
      const user = getUser();
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
    setShowUserDropdown(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setShowUserDropdown(false);
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
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
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="logo" onClick={() => navigate('/')}>
          <i className="fas fa-graduation-cap"></i>
          <span>EnglishPro</span>
        </div>

        <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <li>
            <a 
              href="#hero" 
              className={isActive('/') ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}
            >
              Trang chủ
            </a>
          </li>
          <li>
            <a 
              href="#features" 
              onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}
            >
              Tính năng
            </a>
          </li>
          <li>
            <a 
              href="#practice" 
              onClick={(e) => { e.preventDefault(); scrollToSection('practice'); }}
            >
              Luyện tập
            </a>
          </li>
          <li>
            <a 
              href="#vocabulary" 
              onClick={(e) => { e.preventDefault(); scrollToSection('vocabulary'); }}
            >
              Từ vựng
            </a>
          </li>
          <li>
            <a 
              href="#grammar" 
              onClick={(e) => { e.preventDefault(); scrollToSection('grammar'); }}
            >
              Ngữ pháp
            </a>
          </li>
          <li>
            <a 
              href="#leaderboard" 
              onClick={(e) => { e.preventDefault(); scrollToSection('leaderboard'); }}
            >
              Xếp hạng
            </a>
          </li>
        </ul>

        <div className="nav-buttons">
          {currentUser ? (
            <div className="user-menu">
              <button 
                className="user-btn"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <div className="user-avatar">
                  {currentUser.username?.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{currentUser.username}</span>
                <i className={`fas fa-chevron-${showUserDropdown ? 'up' : 'down'}`}></i>
              </button>
              
              {showUserDropdown && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {currentUser.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="dropdown-info">
                      <span className="dropdown-name">{currentUser.username}</span>
                       <span className="dropdown-role">
                         {currentUser.role?.toLowerCase() === 'admin' ? 'Quản trị viên' : 
                          currentUser.role?.toLowerCase() === 'teacher' ? 'Giáo viên' : 'Học sinh'}
                       </span>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  
                   {currentUser.role?.toLowerCase() === 'admin' && (
                    <button className="dropdown-item" onClick={() => { navigate('/admin'); setShowUserDropdown(false); }}>
                      <i className="fas fa-chart-line"></i>
                      Quản trị hệ thống
                    </button>
                  )}
                   {currentUser.role?.toLowerCase() === 'teacher' && (
                    <button className="dropdown-item" onClick={() => { navigate('/teacher'); setShowUserDropdown(false); }}>
                      <i className="fas fa-chalkboard-teacher"></i>
                      Quản lý nội dung
                    </button>
                  )}
                    {currentUser.role?.toLowerCase() === 'student' && (
                     <button className="dropdown-item" onClick={() => { navigate('/student'); setShowUserDropdown(false); }}>
                       <i className="fas fa-user-graduate"></i>
                       Trang học sinh
                     </button>
                   )}
                   
                   <button className="dropdown-item" onClick={() => { navigate('/profile'); setShowUserDropdown(false); }}>
                     <i className="fas fa-user-cog"></i>
                     Thông tin tài khoản
                   </button>
                   
                   <button className="dropdown-item logout" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="btn btn-outline" onClick={() => navigate('/login')}>
                Đăng nhập
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/register')}>
                Đăng ký
              </button>
            </>
          )}
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
    </nav>
  );
}

export default Navbar;