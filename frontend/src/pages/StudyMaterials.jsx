import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { examService } from "../services/examService";
import "../styles/courses.css";

function StudyMaterials() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    skill: "",
    content: ""
  });
  const [editingMaterial, setEditingMaterial] = useState(null);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSkill, setFilterSkill] = useState("all");
  const [filterTopic, setFilterTopic] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);

  const skills = ["Ngữ âm", "Ngữ pháp", "Từ vựng", "Đọc hiểu", "Nghe hiểu", "Viết", "Nói"];
  const topics = ["Thì hiện tại đơn", "Thì hiện tại tiếp diễn", "Thì quá khứ đơn", "Cấu trúc câu", "Từ loại", "Liên từ", "Đại từ"];

  // Fetch study materials
  // eslint-disable-next-line no-undef
  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const result = await examService.getStudyMaterials({
        Skill: filterSkill !== 'all' ? filterSkill : undefined,
        Topic: filterTopic !== 'all' ? filterTopic : undefined,
        Search: searchTerm || undefined,
        Page: page,
        PageSize: pageSize
      });

      if (result.success && result.data) {
        if (Array.isArray(result.data)) {
          setMaterials(result.data);
          setTotal(result.data.length);
        } else if (result.data.items) {
          setMaterials(result.data.items);
          setTotal(result.data.totalCount || result.data.items.length);
        }
      } else {
        setMaterials([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Error fetching study materials:', error);
      setMaterials([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filterSkill, filterTopic, searchTerm, page, pageSize]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  // Filter materials
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = !searchTerm || 
      material.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = filterSkill === "all" || material.skill === filterSkill;
    const matchesTopic = filterTopic === "all" || material.topic === filterTopic;
    
    return matchesSearch && matchesSkill && matchesTopic;
  });

  return (
    <div className="courses-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate("/")}>
            <span className="back-icon">←</span>
            Quay lại trang chủ
          </button>
          <h1 className="page-title">📖 Tài liệu học tập</h1>
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
              placeholder="🔍 Tìm kiếm tài liệu học tập..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <select 
              value={filterSkill} 
              onChange={(e) => { setFilterSkill(e.target.value); setPage(1); }}
              className="filter-select"
            >
              <option value="all">Tất cả kỹ năng</option>
              {skills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
            
            <select 
              value={filterTopic} 
              onChange={(e) => { setFilterTopic(e.target.value); setPage(1); }}
              className="filter-select"
            >
              <option value="all">Tất cả chủ đề</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
        </div>

        <div className="header-right" style={{ marginLeft: '20px' }}>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            <span className="add-icon">➕</span>
            Thêm tài liệu
          </button>
        </div>
      </div>

        {/* Statistics */}
        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-icon">📖</span>
            <span className="stat-value">{total}</span>
            <span className="stat-label">Tổng tài liệu</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🎯</span>
            <span className="stat-value">{filteredMaterials.length}</span>
            <span className="stat-label">Kết quả tìm kiếm</span>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <i className="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...
          </div>
        ) : (
          <>
            {/* Materials Grid */}
            <div className="courses-grid">
              {filteredMaterials.map(material => (
                <div key={material.id} className="course-card">
                  <div className="course-header">
                    <h3 className="course-name">{material.title || material.name}</h3>
                    <span className={`course-status active`}>
                      ✅ Hoạt động
                    </span>
                  </div>
                  
                  <div className="course-body">
                    <div className="course-info">
                      <div className="info-item">
                        <span className="info-icon">🎯</span>
                        <span className="info-text">{material.skill || 'Chưa phân loại'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-icon">📚</span>
                        <span className="info-text">{material.topic || 'Chung'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-icon">📄</span>
                        <span className="info-text">{material.type || 'Tài liệu'}</span>
                      </div>
                    </div>
                    
                    <p className="course-description">{material.description || 'Không có mô tả'}</p>
                  </div>
                  
                      <div className="course-actions">
                    <button 
                      className="edit-btn" 
                      title="Xem chi tiết"
                      onClick={async () => {
                        try {
                          const detail = await examService.getStudyMaterialById(material.id);
                          console.log('📄 Chi tiết tài liệu:', detail);
                        } catch (error) {
                          console.error('Error loading material detail:', error);
                        }
                      }}
                    >
                      👁️ Xem
                    </button>
                    <button 
                      className="edit-btn" 
                      title="Sửa tài liệu"
                      onClick={() => {
                        setEditingMaterial(material);
                        setFormData({
                          title: material.title,
                          topic: material.topic,
                          skill: material.skill,
                          content: material.content || ''
                        });
                        setShowModal(true);
                      }}
                    >
                      ✏️ Sửa
                    </button>
                    <button 
                      className="status-btn"
                      title="Tải xuống"
                    >
                      ⬇️ Tải
                    </button>
                    <button 
                      className="delete-btn" 
                      title="Xóa tài liệu"
                      onClick={async () => {
                        if (window.confirm(`Bạn có chắc muốn xóa tài liệu "${material.title}"?`)) {
                          try {
                            await examService.deleteStudyMaterial(material.id);
                            fetchMaterials();
                          } catch (error) {
                            console.error('Error deleting material:', error);
                          }
                        }
                      }}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredMaterials.length === 0 && (
              <div className="no-data">
                <span className="no-data-icon">📭</span>
                <span className="no-data-text">Không tìm thấy tài liệu học tập nào</span>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal Add Material */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
            <h2 className="modal-title">
              {editingMaterial ? "✏️ Chỉnh sửa tài liệu học tập" : "➕ Thêm tài liệu học tập mới"}
            </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            
            <form className="modal-form" onSubmit={async (e) => {
              e.preventDefault();
              try {
                await examService.createStudyMaterial(formData);
                setShowModal(false);
                setFormData({ title: "", topic: "", skill: "", content: "" });
                fetchMaterials();
              } catch (error) {
                console.error('Error creating material:', error);
              }
            }}>
              <div className="form-group">
                <label htmlFor="title">Tiêu đề tài liệu *</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Nhập tiêu đề tài liệu"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="skill">Kỹ năng</label>
                  <select
                    id="skill"
                    name="skill"
                    value={formData.skill}
                    onChange={(e) => setFormData(prev => ({ ...prev, skill: e.target.value }))}
                  >
                    <option value="">Chọn kỹ năng</option>
                    {skills.map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="topic">Chủ đề</label>
                  <select
                    id="topic"
                    name="topic"
                    value={formData.topic}
                    onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  >
                    <option value="">Chọn chủ đề</option>
                    {topics.map(topic => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="content">Nội dung tài liệu</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Nhập nội dung chi tiết tài liệu học tập..."
                  rows="6"
                />
              </div>
            </form>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Hủy
              </button>
              <button className="save-btn" onClick={async () => {
                try {
                  if (editingMaterial) {
                    await examService.updateStudyMaterial(editingMaterial.id, formData);
                  } else {
                    await examService.createStudyMaterial(formData);
                  }
                  setShowModal(false);
                  setFormData({ title: "", topic: "", skill: "", content: "" });
                  setEditingMaterial(null);
                  fetchMaterials();
                } catch (error) {
                  console.error('Error saving material:', error);
                }
              }}>
                {editingMaterial ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudyMaterials;
