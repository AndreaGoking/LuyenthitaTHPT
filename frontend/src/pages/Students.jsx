import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/students.css";

function Students() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // State for students - học sinh học tiếng Anh
  const [students, setStudents] = useState([
    { id: 1, name: "Nguyễn Văn A", email: "vana@email.com", class: "Anh 12A1", phone: "0123456789", address: "Hà Nội", status: "Active", course: "Tiếng Anh Cơ Bản" },
    { id: 2, name: "Trần Thị B", email: "vanb@email.com", class: "Anh 12A2", phone: "0123456790", address: "Hồ Chí Minh", status: "Active", course: "Tiếng Anh Nâng Cao" },
    { id: 3, name: "Lê Văn C", email: "vanc@email.com", class: "Anh 11A1", phone: "0123456791", address: "Đà Nẵng", status: "Active", course: "IELTS Preparation" },
    { id: 4, name: "Phạm Thị D", email: "vand@email.com", class: "Anh 11B2", phone: "0123456792", address: "Hải Phòng", status: "Inactive", course: "TOEIC Prep" },
    { id: 5, name: "Hoàng Văn E", email: "vane@email.com", class: "Anh 10A3", phone: "0123456793", address: "Cần Thơ", status: "Active", course: "Luyện Thi THPT" },
    { id: 6, name: "Vũ Thị F", email: "vanf@email.com", class: "Anh 12A1", phone: "0123456794", address: "Huế", status: "Active", course: "Giao Tiếp" },
    { id: 7, name: "Đặng Văn G", email: "vang@email.com", class: "Anh 12B1", phone: "0123456795", address: "Nha Trang", status: "Active", course: "Tiếng Anh Cơ Bản" },
    { id: 8, name: "Bùi Thị H", email: "vanh@email.com", class: "Anh 11A2", phone: "0123456796", address: "Vũng Tàu", status: "Inactive", course: "Tiếng Anh Nâng Cao" }
  ]);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    class: "",
    phone: "",
    address: "",
    status: "Active"
  });

  // Available classes
  const classes = ["10A1", "10A2", "10A3", "11A1", "11A2", "11B1", "11B2", "12A1", "12A2", "12B1", "12B2"];

  // Check if user is admin
  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/");
    }
  }, [currentUser, navigate]);

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === "all" || student.class === filterClass;
    const matchesStatus = filterStatus === "all" || student.status === filterStatus;
    
    return matchesSearch && matchesClass && matchesStatus;
  });

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle add new student
  const handleAddStudent = () => {
    setEditingStudent(null);
    setFormData({
      name: "",
      email: "",
      class: "",
      phone: "",
      address: "",
      status: "Active"
    });
    setShowModal(true);
  };

  // Handle edit student
  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      class: student.class,
      phone: student.phone,
      address: student.address,
      status: student.status
    });
    setShowModal(true);
  };

  // Handle delete student
  const handleDeleteStudent = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa học sinh này?")) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  // Handle save student
  const handleSaveStudent = () => {
    if (!formData.name || !formData.email || !formData.class) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (editingStudent) {
      // Update existing student
      setStudents(students.map(s => 
        s.id === editingStudent.id 
          ? { ...s, ...formData }
          : s
      ));
    } else {
      // Add new student
      const newStudent = {
        id: Math.max(...students.map(s => s.id)) + 1,
        ...formData
      };
      setStudents([...students, newStudent]);
    }

    setShowModal(false);
    setEditingStudent(null);
    setFormData({
      name: "",
      email: "",
      class: "",
      phone: "",
      address: "",
      status: "Active"
    });
  };

  // Handle toggle status
  const handleToggleStatus = (id) => {
    setStudents(students.map(s => 
      s.id === id 
        ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" }
        : s
    ));
  };

  return (
    <div className="students-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate("/admin")}>
            <span className="back-icon">←</span>
            Quay lại Dashboard
          </button>
          <h1 className="page-title">👨‍🎓 Quản lý học sinh</h1>
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
              value={filterClass} 
              onChange={(e) => setFilterClass(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả lớp</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Active">Đang học</option>
              <option value="Inactive">Nghỉ học</option>
            </select>
          </div>
          
          <button className="add-btn" onClick={handleAddStudent}>
            <span className="add-icon">➕</span>
            Thêm học sinh
          </button>
        </div>

        {/* Statistics */}
        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-icon">👨‍🎓</span>
            <span className="stat-value">{students.length}</span>
            <span className="stat-label">Tổng học sinh</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">✅</span>
            <span className="stat-value">{students.filter(s => s.status === "Active").length}</span>
            <span className="stat-label">Đang học</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">❌</span>
            <span className="stat-value">{students.filter(s => s.status === "Inactive").length}</span>
            <span className="stat-label">Nghỉ học</span>
          </div>
        </div>

        {/* Students Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên học sinh</th>
                <th>Email</th>
                <th>Lớp</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td className="student-name">{student.name}</td>
                  <td>{student.email}</td>
                  <td>
                    <span className="class-badge">{student.class}</span>
                  </td>
                  <td>{student.phone}</td>
                  <td>{student.address}</td>
                  <td>
                    <button 
                      className={`status-toggle ${student.status.toLowerCase()}`}
                      onClick={() => handleToggleStatus(student.id)}
                    >
                      {student.status === "Active" ? "✅ Đang học" : "❌ Nghỉ học"}
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn" 
                        onClick={() => handleEditStudent(student)}
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteStudent(student.id)}
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
          
          {filteredStudents.length === 0 && (
            <div className="no-data">
              <span className="no-data-icon">📭</span>
              <span className="no-data-text">Không tìm thấy học sinh nào</span>
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
                {editingStudent ? "✏️ Chỉnh sửa học sinh" : "➕ Thêm học sinh mới"}
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
                  <label htmlFor="class">Lớp *</label>
                  <select
                    id="class"
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn lớp</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
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
                    <option value="Active">Đang học</option>
                    <option value="Inactive">Nghỉ học</option>
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
              <button className="save-btn" onClick={handleSaveStudent}>
                {editingStudent ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;