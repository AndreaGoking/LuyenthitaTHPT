// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../utils/auth';
import { useAdminData } from '../../hooks/useAdminData';
import AdminOverview from './AdminOverview';      // Default import
import UserManagement from './UserManagement';    // Default import
import ExamMatrix from './ExamMatrix';            // Default import
import ExamManagement from './ExamManagement';    // Default import
import QuestionBank from './QuestionBank';        // Default import
import Statistics from './Statistics';            // Default import
import '../../styles/admin-dashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const currentUser = getUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const {
    loading,
    users,
    totalUsers,
    userFilters,
    setUserFilters,
    examTemplates,
    matrixRules,
    scheduledExams,
    questions,
    statistics,
    fetchMatrixRules,
    fetchQuestions,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
  } = useAdminData();

  useEffect(() => {
    if (!currentUser || currentUser.role?.toLowerCase() !== 'admin') {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: '📊' },
    { id: 'users', label: 'Quản lý tài khoản', icon: '👤' },
    { id: 'matrix', label: 'Ma trận đề thi', icon: '📐' },
    { id: 'exams', label: 'Quản lý kỳ thi', icon: '📝' },
    { id: 'questions', label: 'Ngân hàng câu hỏi', icon: '❓' },
    { id: 'statistics', label: 'Thống kê', icon: '📈' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview statistics={statistics} onNavigate={setActiveTab} />;
      case 'users':
        return (
          <UserManagement
            users={users}
            totalUsers={totalUsers}
            filters={userFilters}
            onFilterChange={setUserFilters}
            loading={loading}
            onCreateUser={createUser}
            onUpdateUser={updateUser}
            onDeleteUser={deleteUser}
            onToggleStatus={toggleUserStatus}
            onShowToast={showToast}
          />
        );
      case 'matrix':
        return (
          <ExamMatrix
            examTemplates={examTemplates}
            matrixRules={matrixRules}
            onFetchMatrixRules={fetchMatrixRules}
            onShowToast={showToast}
          />
        );
      case 'exams':
        return (
          <ExamManagement
            scheduledExams={scheduledExams}
            examTemplates={examTemplates}
            onShowToast={showToast}
          />
        );
      case 'questions':
        return (
          <QuestionBank
            questions={questions}
            loading={loading}
            onFetchQuestions={fetchQuestions}
            onShowToast={showToast}
          />
        );
      case 'statistics':
        return <Statistics statistics={statistics} />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header và các phần khác giữ nguyên */}
      <header className="admin-header">
        <div className="admin-header-container">
          <div className="admin-header-left">
            <button className="back-btn" onClick={() => navigate('/')}>
              <i className="fas fa-arrow-left"></i>
              <span>Về trang chủ</span>
            </button>
            <div className="admin-title-wrapper">
              <h1 className="admin-title">Quản trị hệ thống</h1>
              <p className="admin-subtitle">EnglishPro Dashboard</p>
            </div>
          </div>
          <div className="admin-header-right">
            <div className="admin-user-info">
              <div className="admin-avatar">
                {currentUser?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="admin-user-details">
                <span className="admin-username">{currentUser?.username}</span>
                <span className="admin-role">Quản trị viên</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span className="nav-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="admin-main">
          {renderTabContent()}
        </main>
      </div>

      {toast.show && (
        <div className={`toast ${toast.type}`}>
          <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;