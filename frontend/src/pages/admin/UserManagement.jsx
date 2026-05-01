// src/pages/admin/UserManagement.jsx
import React, { useState } from 'react';
import UserModal from './components/UserModal';

function UserManagement({ 
  users, 
  totalUsers, 
  filters, 
  onFilterChange, 
  loading,
  onCreateUser,
  onUpdateUser,
  onToggleStatus,
  onShowToast 
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handleAddUser = () => {
    setSelectedUserId(null);
    setEditMode(true);
    setShowModal(true);
  };

  const handleViewUser = (userId) => {
    setSelectedUserId(userId);
    setEditMode(false);
    setShowModal(true);
  };

  const handleEditUser = (userId) => {
    setSelectedUserId(userId);
    setEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = async (userData) => {
    let result;
    if (selectedUserId) {
      // Update user
      result = await onUpdateUser(selectedUserId, userData);
    } else {
      // Create new user
      result = await onCreateUser(userData);
    }
    
    if (result.success) {
      onShowToast(result.message, 'success');
      setShowModal(false);
      // Refresh danh sách (nếu có callback)
      onFilterChange({ ...filters });
    } else {
      onShowToast(result.message, 'error');
    }
  };

  const handleToggleStatus = async (userId, isActive) => {
    const result = await onToggleStatus(userId, isActive);
    onShowToast(result.message, result.success ? 'success' : 'error');
  };

  return (
    <div className="tab-content">
      <div className="content-header">
        <div className="content-header-left">
          <h2 className="content-title">Quản lý tài khoản</h2>
          <p className="content-description">Quản lý tài khoản và phân quyền người dùng</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddUser}>
          <i className="fas fa-plus"></i>
          Thêm người dùng
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Vai trò:</label>
          <select 
            className="filter-select"
            value={filters.role || ''}
            onChange={(e) => onFilterChange({ ...filters, role: e.target.value || undefined, page: 1 })}
          >
            <option value="">Tất cả</option>
            <option value="Admin">Admin</option>
            <option value="Teacher">Teacher</option>
            <option value="Student">Student</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Trạng thái:</label>
          <select 
            className="filter-select"
            value={filters.isActive === undefined ? '' : filters.isActive.toString()}
            onChange={(e) => {
              const value = e.target.value;
              onFilterChange({ 
                ...filters, 
                isActive: value === '' ? undefined : value === 'true',
                page: 1 
              });
            }}
          >
            <option value="">Tất cả</option>
            <option value="true">Hoạt động</option>
            <option value="false">Đã khóa</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Tìm kiếm:</label>
          <input
            type="text"
            className="filter-input"
            placeholder="Tên đăng nhập hoặc email..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value || undefined, page: 1 })}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="table-section">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên đăng nhập</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>Đang tải...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>Không có dữ liệu</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr 
                    key={user.userId} 
                    onClick={() => handleViewUser(user.userId)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{user.userId.slice(0, 8)}...</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.isActive ? 'active' : 'locked'}`}>
                        {user.isActive ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                        <button 
                          className="action-btn edit"
                          onClick={() => handleEditUser(user.userId)}
                          title="Chỉnh sửa"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="action-btn toggle"
                          onClick={() => handleToggleStatus(user.userId, !user.isActive)}
                          title={user.isActive ? "Khóa" : "Mở khóa"}
                        >
                          <i className={`fas ${user.isActive ? "fa-lock" : "fa-unlock"}`}></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalUsers > filters.pageSize && (
          <div className="pagination">
            <button 
              disabled={filters.page === 1}
              onClick={() => onFilterChange({ ...filters, page: filters.page - 1 })}
            >
              Previous
            </button>
            <span>Trang {filters.page} / {Math.ceil(totalUsers / filters.pageSize)}</span>
            <button 
              disabled={filters.page >= Math.ceil(totalUsers / filters.pageSize)}
              onClick={() => onFilterChange({ ...filters, page: filters.page + 1 })}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* User Modal */}
      {showModal && (
        <UserModal
          userId={selectedUserId}
          isEditMode={editMode}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default UserManagement;