import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/courses.css";

function Courses() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // State for courses - chỉ môn tiếng Anh
  const [courses, setCourses] = useState([
    { id: 1, name: "Tiếng Anh Cơ Bản", teacher: "Lê Văn Giáo", duration: "12 tuần", students: 45, description: "Khóa học tiếng Anh cơ bản - ngữ pháp, từ vựng, đọc hiểu cơ bản", status: "Active" },
    { id: 2, name: "Tiếng Anh Nâng Cao", teacher: "Lê Văn Giáo", duration: "10 tuần", students: 38, description: "Tiếng Anh nâng cao - IELTS, TOEFL, giao tiếp thành thạo", status: "Active" },
    { id: 3, name: "Luyện Thi THPT Quốc Gia", teacher: "Lê Văn Giáo", duration: "8 tuần", students: 52, description: "Luyện thi tiếng Anh THPT Quốc Gia - đề thi thật, mẹo làm bài", status: "Active" },
    { id: 4, name: "Tiếng Anh Giao Tiếp", teacher: "Lê Văn Giáo", duration: "6 tuần", students: 35, description: "Luyện kỹ năng giao tiếp tiếng Anh thực tế", status: "Active" },
    { id: 5, name: "IELTS Preparation", teacher: "Lê Văn Giáo", duration: "8 tuần", students: 28, description: "Chuẩn bị thi IELTS - cả 4 kỹ năng", status: "Active" },
    { id: 6, name: "TOEIC Prep", teacher: "Lê Văn Giáo", duration: "10 tuần", students: 30, description: "Luyện thi TOEIC - nghe, đọc, nói, viết", status: "Active" }
  ]);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTeacher, setFilterTeacher] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    teacher: "",
    duration: "",
    students: "",
    description: "",
    status: "Active"
  });

  // Available teachers
  const teachers = ["Nguyễn Văn Giảng", "Trần Thị Dạy", "Lê Văn Giáo", "Phạm Thị Huấn", "Hoàng Văn Minh", "Vũ Thị Lan", "Đặng Văn Hùng", "Bùi Thị Mai"];

  // Check if user is admin
  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/");
    }
  }, [currentUser, navigate]);

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeacher = filterTeacher === "all" || course.teacher === filterTeacher;
    const matchesStatus = filterStatus === "all" || course.status === filterStatus;
    
    return matchesSearch && matchesTeacher && matchesStatus;
  });

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle add new course
  const handleAddCourse = () => {
    setEditingCourse(null);
    setFormData({
      name: "",
      teacher: "",
      duration: "",
      students: "",
      description: "",
      status: "Active"
    });
    setShowModal(true);
  };

  // Handle edit course
  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      teacher: course.teacher,
      duration: course.duration,
      students: course.students.toString(),
      description: course.description,
      status: course.status
    });
    setShowModal(true);
  };

  // Handle delete course
  const handleDeleteCourse = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  // Handle save course
  const handleSaveCourse = () => {
    if (!formData.name || !formData.teacher || !formData.duration) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (editingCourse) {
      // Update existing course
      setCourses(courses.map(c => 
        c.id === editingCourse.id 
          ? { ...c, ...formData, students: parseInt(formData.students) || 0 }
          : c
      ));
    } else {
      // Add new course
      const newCourse = {
        id: Math.max(...courses.map(c => c.id)) + 1,
        ...formData,
        students: parseInt(formData.students) || 0
      };
      setCourses([...courses, newCourse]);
    }

    setShowModal(false);
    setEditingCourse(null);
    setFormData({
      name: "",
      teacher: "",
      duration: "",
      students: "",
      description: "",
      status: "Active"
    });
  };

  // Handle toggle status
  const handleToggleStatus = (id) => {
    setCourses(courses.map(c => 
      c.id === id 
        ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" }
        : c
    ));
  };

  return (
    <div className="courses-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate("/admin")}>
            <span className="back-icon">←</span>
            Quay lại Dashboard
          </button>
          <h1 className="page-title">📚 Quản lý khóa học</h1>
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
              placeholder="🔍 Tìm kiếm theo tên khóa học hoặc giáo viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <select 
              value={filterTeacher} 
              onChange={(e) => setFilterTeacher(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả giáo viên</option>
              {teachers.map(teacher => (
                <option key={teacher} value={teacher}>{teacher}</option>
              ))}
            </select>
            
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Active">Đang mở</option>
              <option value="Inactive">Đã đóng</option>
            </select>
          </div>
          
          <button className="add-btn" onClick={handleAddCourse}>
            <span className="add-icon">➕</span>
            Thêm khóa học
          </button>
        </div>

        {/* Statistics */}
        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-icon">📚</span>
            <span className="stat-value">{courses.length}</span>
            <span className="stat-label">Tổng khóa học</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">✅</span>
            <span className="stat-value">{courses.filter(c => c.status === "Active").length}</span>
            <span className="stat-label">Đang mở</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">❌</span>
            <span className="stat-value">{courses.filter(c => c.status === "Inactive").length}</span>
            <span className="stat-label">Đã đóng</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">👨‍🎓</span>
            <span className="stat-value">{courses.reduce((sum, c) => sum + c.students, 0)}</span>
            <span className="stat-label">Tổng học sinh</span>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="courses-grid">
          {filteredCourses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-header">
                <h3 className="course-name">{course.name}</h3>
                <span className={`course-status ${course.status.toLowerCase()}`}>
                  {course.status === "Active" ? "✅ Đang mở" : "❌ Đã đóng"}
                </span>
              </div>
              
              <div className="course-body">
                <div className="course-info">
                  <div className="info-item">
                    <span className="info-icon">👨‍🏫</span>
                    <span className="info-text">{course.teacher}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">⏱️</span>
                    <span className="info-text">{course.duration}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">👨‍🎓</span>
                    <span className="info-text">{course.students} học sinh</span>
                  </div>
                </div>
                
                <p className="course-description">{course.description}</p>
              </div>
              
              <div className="course-actions">
                <button 
                  className="edit-btn" 
                  onClick={() => handleEditCourse(course)}
                  title="Chỉnh sửa"
                >
                  ✏️ Sửa
                </button>
                <button 
                  className="status-btn"
                  onClick={() => handleToggleStatus(course.id)}
                  title={course.status === "Active" ? "Đóng khóa học" : "Mở khóa học"}
                >
                  {course.status === "Active" ? "🔒 Đóng" : "🔓 Mở"}
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDeleteCourse(course.id)}
                  title="Xóa"
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredCourses.length === 0 && (
          <div className="no-data">
            <span className="no-data-icon">📭</span>
            <span className="no-data-text">Không tìm thấy khóa học nào</span>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingCourse ? "✏️ Chỉnh sửa khóa học" : "➕ Thêm khóa học mới"}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            
            <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="name">Tên khóa học *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên khóa học"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="teacher">Giáo viên *</label>
                  <select
                    id="teacher"
                    name="teacher"
                    value={formData.teacher}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn giáo viên</option>
                    {teachers.map(teacher => (
                      <option key={teacher} value={teacher}>{teacher}</option>
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
                    <option value="Active">Đang mở</option>
                    <option value="Inactive">Đã đóng</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="duration">Thời lượng *</label>
                  <input
                    id="duration"
                    name="duration"
                    type="text"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="VD: 12 tuần"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="students">Số học sinh</label>
                  <input
                    id="students"
                    name="students"
                    type="number"
                    value={formData.students}
                    onChange={handleInputChange}
                    placeholder="VD: 30"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Mô tả</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả khóa học"
                  rows="3"
                />
              </div>
            </form>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Hủy
              </button>
              <button className="save-btn" onClick={handleSaveCourse}>
                {editingCourse ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;