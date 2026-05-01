import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/teachers.css";

function Teachers() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // State for teachers - chỉ giáo viên tiếng Anh
  const [teachers, setTeachers] = useState([
    { id: 1, name: "Lê Văn Giáo", email: "giaolv@school.edu.vn", subject: "Tiếng Anh Cơ Bản", phone: "0987654323", address: "Đà Nẵng", status: "Active" },
    { id: 2, name: "Lê Văn Giáo", email: "giaolv2@school.edu.vn", subject: "Tiếng Anh Nâng Cao", phone: "0987654324", address: "Đà Nẵng", status: "Active" },
    { id: 3, name: "Lê Văn Giáo", email: "giaolv3@school.edu.vn", subject: "IELTS Preparation", phone: "0987654325", address: "Đà Nẵng", status: "Active" },
    { id: 4, name: "Lê Văn Giáo", email: "giaolv4@school.edu.vn", subject: "TOEIC Prep", phone: "0987654326", address: "Đà Nẵng", status: "Active" },
    { id: 5, name: "Lê Văn Giáo", email: "giaolv5@school.edu.vn", subject: "Luyện Thi THPT", phone: "0987654327", address: "Đà Nẵng", status: "Active" },
    { id: 6, name: "Lê Văn Giáo", email: "giaolv6@school.edu.vn", subject: "Giao Tiếp", phone: "0987654328", address: "Đà Nẵng", status: "On Leave" }
  ]);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
    address: "",
    status: "Active"
  });

  // Available subjects
  const subjects = ["Toán", "Văn", "Anh", "Lý", "Hóa", "Sinh", "Sử", "Địa", "Tin", "GDCD", "Thể dục", "Nghệ thuật"];

  // Check if user is admin
  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/");
    }
  }, [currentUser, navigate]);

  // Filter teachers
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === "all" || teacher.subject === filterSubject;
    const matchesStatus = filterStatus === "all" || teacher.status === filterStatus;
    
    return matchesSearch && matchesSubject && matchesStatus;
  });

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle add new teacher
  const handleAddTeacher = () => {
    setEditingTeacher(null);
    setFormData({
      name: "",
      email: "",
      subject: "",
      phone: "",
      address: "",
      status: "Active"
    });
    setShowModal(true);
  };

  // Handle edit teacher
  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      subject: teacher.subject,
      phone: teacher.phone,
      address: teacher.address,
      status: teacher.status
    });
    setShowModal(true);
  };

  // Handle delete teacher
  const handleDeleteTeacher = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giáo viên này?")) {
      setTeachers(teachers.filter(t => t.id !== id));
    }
  };

  // Handle save teacher
  const handleSaveTeacher = () => {
    if (!formData.name || !formData.email || !formData.subject) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (editingTeacher) {
      // Update existing teacher
      setTeachers(teachers.map(t => 
        t.id === editingTeacher.id 
          ? { ...t, ...formData }
          : t
      ));
    } else {
      // Add new teacher
      const newTeacher = {
        id: Math.max(...teachers.map(t => t.id)) + 1,
        ...formData
      };
      setTeachers([...teachers, newTeacher]);
    }

    setShowModal(false);
    setEditingTeacher(null);
    setFormData({
      name: "",
      email: "",
      subject: "",
      phone: "",
      address: "",
      status: "Active"
    });
  };

  // Handle toggle status
  const handleToggleStatus = (id) => {
    setTeachers(teachers.map(t => 
      t.id === id 
        ? { ...t, status: t.status === "Active" ? "Inactive" : "Active" }
        : t
    ));
  };

  return (
    <div className="teachers-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate("/admin")}>
            <span className="back-icon">←</span>
            Quay lại Dashboard
          </button>
          <h1 className="page-title">👨‍🏫 Quản lý giáo viên</h1>
        </div>
        <div className="header-right">
          <span className="welcome-text">Xin chào, <strong>{currentUser?.username}</strong></span>
        </div>
      </header>

      {/* Main Content */}
      <main className="page-main">
        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <select 
              value={filterSubject} 
              onChange={(e) => setFilterSubject(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả môn học</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Active">Đang dạy</option>
              <option value="On Leave">Nghỉ phép</option>
              <option value="Inactive">Nghỉ việc</option>
            </select>
          </div>
          
          <button className="add-btn" onClick={handleAddTeacher}>
            <span className="add-icon">➕</span>
            Thêm giáo viên
          </button>
        </div>

        {/* Statistics */}
        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-icon">👨‍🏫</span>
            <span className="stat-value">{teachers.length}</span>
            <span className="stat-label">Tổng giáo viên</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">✅</span>
            <span className="stat-value">{teachers.filter(t => t.status === "Active").length}</span>
            <span className="stat-label">Đang dạy</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⏸️</span>
            <span className="stat-value">{teachers.filter(t => t.status === "On Leave").length}</span>
            <span className="stat-label">Nghỉ phép</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">❌</span>
            <span className="stat-value">{teachers.filter(t => t.status === "Inactive").length}</span>
            <span className="stat-label">Nghỉ việc</span>
          </div>
        </div>

        {/* Teachers Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên giáo viên</th>
                <th>Email</th>
                <th>Môn học</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map(teacher => (
                <tr key={teacher.id}>
                  <td>{teacher.id}</td>
                  <td className="teacher-name">{teacher.name}</td>
                  <td>{teacher.email}</td>
                  <td>
                    <span className="subject-badge">{teacher.subject}</span>
                  </td>
                  <td>{teacher.phone}</td>
                  <td>{teacher.address}</td>
                  <td>
                    <button 
                      className={`status-toggle ${teacher.status.toLowerCase().replace(' ', '-')}`}
                      onClick={() => handleToggleStatus(teacher.id)}
                    >
                      {teacher.status === "Active" ? "✅ Đang dạy" : 
                       teacher.status === "On Leave" ? "⏸️ Nghỉ phép" : "❌ Nghỉ việc"}
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn" 
                        onClick={() => handleEditTeacher(teacher)}
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteTeacher(teacher.id)}
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredTeachers.length === 0 && (
            <div className="no-data">
              <span className="no-data-icon">📭</span>
              <span className="no-data-text">Không tìm thấy giáo viên nào</span>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingTeacher ? "✏️ Chỉnh sửa giáo viên" : "➕ Thêm giáo viên mới"}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            
            <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="name">Họ và tên *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="subject">Môn học *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn môn học</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="status">Trạng thái</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Đang dạy</option>
                    <option value="On Leave">Nghỉ phép</option>
                    <option value="Inactive">Nghỉ việc</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Địa chỉ</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ"
                />
              </div>
            </form>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Hủy
              </button>
              <button className="save-btn" onClick={handleSaveTeacher}>
                {editingTeacher ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teachers;