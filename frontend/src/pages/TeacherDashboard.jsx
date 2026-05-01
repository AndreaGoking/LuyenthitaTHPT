import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";
import "../styles/teacher-dashboard.css";

function TeacherDashboard() {
  const navigate = useNavigate();
  const currentUser = getUser();
  
  // Active tab state
  const [activeTab, setActiveTab] = useState("questions");
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editItem, setEditItem] = useState(null);
  
  // Toast state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  // Data states
  const [questions, setQuestions] = useState([
    { id: 1, content: 'Choose the correct pronunciation of "pronunciation"', skill: "Ngữ âm", cognitive: "Nhận biết", type: "single", status: "approved" },
    { id: 2, content: 'Read the passage and answer questions 1-5', skill: "Đọc hiểu", cognitive: "Thông hiểu", type: "passage", status: "approved" },
    { id: 3, content: 'Complete the sentence with the correct form of the verb', skill: "Ngữ pháp", cognitive: "Vận dụng", type: "single", status: "pending" },
    { id: 4, content: 'What is the synonym of "happy"?', skill: "Từ vựng", cognitive: "Nhận biết", type: "single", status: "approved" },
    { id: 5, content: 'Listen to the audio and choose the best answer', skill: "Nghe", cognitive: "Thông hiểu", type: "single", status: "approved" }
  ]);
  
  const [passages, setPassages] = useState([
    { id: 1, title: "Environmental Protection", questions: 5, skill: "Đọc hiểu", status: "approved" },
    { id: 2, title: "Technology in Education", questions: 6, skill: "Đọc hiểu", status: "approved" },
    { id: 3, title: "Health and Lifestyle", questions: 5, skill: "Đọc hiểu", status: "pending" }
  ]);
  
  const [examVersions, setExamVersions] = useState([
    { id: 1, code: "001", exam: "Thi thử lần 1", questions: 50, status: "generated" },
    { id: 2, code: "002", exam: "Thi thử lần 1", questions: 50, status: "generated" },
    { id: 3, code: "001", exam: "Thi thử lần 2", questions: 50, status: "pending" }
  ]);
  
  const [skills] = useState([
    "Ngữ âm", "Ngữ pháp", "Từ vựng", "Đọc hiểu", "Nghe", "Viết"
  ]);
  
  const [cognitiveLevels] = useState([
    "Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"
  ]);

  // Check if user is teacher
  useEffect(() => {
    if (!currentUser || currentUser.role !== "teacher") {
      navigate("/");
    }
  }, [currentUser, navigate]);

  // Show toast
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // Modal handlers
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setEditItem(null);
  };

  // Question management
  const handleAddQuestion = (questionData) => {
    const newQuestion = {
      id: questions.length + 1,
      ...questionData,
      status: "pending"
    };
    setQuestions([...questions, newQuestion]);
    closeModal();
    showToast("Thêm câu hỏi thành công!");
  };

  const handleDeleteQuestion = (questionId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
      setQuestions(questions.filter(q => q.id !== questionId));
      showToast("Xóa câu hỏi thành công!");
    }
  };

  // Passage management
  const handleAddPassage = (passageData) => {
    const newPassage = {
      id: passages.length + 1,
      ...passageData,
      status: "pending"
    };
    setPassages([...passages, newPassage]);
    closeModal();
    showToast("Thêm bài đọc thành công!");
  };

  // Exam generation
  const handleGenerateExam = () => {
    const newVersion = {
      id: examVersions.length + 1,
      code: String(examVersions.filter(v => v.exam === "Thi thử lần 2").length + 1).padStart(3, '0'),
      exam: "Thi thử lần 2",
      questions: 50,
      status: "generated"
    };
    setExamVersions([...examVersions, newVersion]);
    showToast("Sinh mã đề thành công!");
  };

  // Tab navigation
  const tabs = [
    { id: "questions", label: "Ngân hàng câu hỏi", icon: "❓" },
    { id: "passages", label: "Bài đọc hiểu", icon: "📄" },
    { id: "generation", label: "Sinh đề thi", icon: "🎯" }
  ];

  return (
    <div className="teacher-dashboard">
      {/* Header */}
      <header className="teacher-header">
        <div className="teacher-header-left">
          <button className="back-btn" onClick={() => navigate("/")}>
            <i className="fas fa-arrow-left"></i>
            <span>Về trang chủ</span>
          </button>
          <div className="teacher-title-wrapper">
            <h1 className="teacher-title">Quản lý nội dung</h1>
            <p className="teacher-subtitle">Teacher Dashboard</p>
          </div>
        </div>
        <div className="teacher-header-right">
          <div className="teacher-user-info">
            <div className="teacher-avatar">
              {currentUser?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="teacher-user-details">
              <span className="teacher-username">{currentUser?.username}</span>
              <span className="teacher-role">Giáo viên</span>
            </div>
          </div>
        </div>
      </header>

      <div className="teacher-layout">
        {/* Sidebar */}
        <aside className="teacher-sidebar">
          <nav className="teacher-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`teacher-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span className="nav-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="teacher-main">
          {/* Questions Tab */}
          {activeTab === "questions" && (
            <div className="tab-content">
              <div className="content-header">
                <div className="content-header-left">
                  <h2 className="content-title">Ngân hàng câu hỏi</h2>
                  <p className="content-description">Quản lý tất cả câu hỏi trong hệ thống</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal("question")}>
                  <i className="fas fa-plus"></i>
                  Thêm câu hỏi
                </button>
              </div>

              {/* Question Stats */}
              <div className="summary-cards">
                <div className="summary-card">
                  <div className="summary-icon">
                    <i className="fas fa-question-circle"></i>
                  </div>
                  <div className="summary-content">
                    <div className="summary-value">{questions.length}</div>
                    <div className="summary-label">Tổng câu hỏi</div>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="summary-content">
                    <div className="summary-value">{questions.filter(q => q.status === "approved").length}</div>
                    <div className="summary-label">Đã duyệt</div>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="summary-content">
                    <div className="summary-value">{questions.filter(q => q.status === "pending").length}</div>
                    <div className="summary-label">Chờ duyệt</div>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="filters-section">
                <div className="filter-group">
                  <label>Kỹ năng:</label>
                  <select className="filter-select">
                    <option value="">Tất cả</option>
                    {skills.map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Mức độ:</label>
                  <select className="filter-select">
                    <option value="">Tất cả</option>
                    {cognitiveLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Trạng thái:</label>
                  <select className="filter-select">
                    <option value="">Tất cả</option>
                    <option value="approved">Đã duyệt</option>
                    <option value="pending">Chờ duyệt</option>
                  </select>
                </div>
              </div>

              {/* Questions Table */}
              <div className="table-section">
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nội dung</th>
                        <th>Kỹ năng</th>
                        <th>Mức độ</th>
                        <th>Loại</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.map(question => (
                        <tr key={question.id}>
                          <td>
                            <span className="question-id">#{question.id}</span>
                          </td>
                          <td className="question-content">{question.content}</td>
                          <td>
                            <span className="skill-badge">{question.skill}</span>
                          </td>
                          <td>
                            <span className={`cognitive-badge ${question.cognitive.toLowerCase().replace(/\s+/g, '-')}`}>
                              {question.cognitive}
                            </span>
                          </td>
                          <td>
                            <span className={`type-badge ${question.type}`}>
                              {question.type === "single" ? "Đơn" : "Bài đọc"}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${question.status}`}>
                              {question.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="action-btn view" title="Xem">
                                <i className="fas fa-eye"></i>
                              </button>
                              <button className="action-btn edit" title="Chỉnh sửa">
                                <i className="fas fa-edit"></i>
                              </button>
                              <button 
                                className="action-btn delete"
                                onClick={() => handleDeleteQuestion(question.id)}
                                title="Xóa"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Passages Tab */}
          {activeTab === "passages" && (
            <div className="tab-content">
              <div className="content-header">
                <div className="content-header-left">
                  <h2 className="content-title">Quản lý bài đọc hiểu</h2>
                  <p className="content-description">Tạo và chỉnh sửa các bài đọc hiểu</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal("passage")}>
                  <i className="fas fa-plus"></i>
                  Thêm bài đọc
                </button>
              </div>

              {/* Passages Grid */}
              <div className="passages-grid">
                {passages.map(passage => (
                  <div key={passage.id} className="passage-card">
                    <div className="passage-header">
                      <div className="passage-icon">
                        <i className="fas fa-file-alt"></i>
                      </div>
                      <span className={`status-badge ${passage.status}`}>
                        {passage.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
                      </span>
                    </div>
                    <h4 className="passage-title">{passage.title}</h4>
                    <div className="passage-info">
                      <p><i className="fas fa-book"></i> {passage.skill}</p>
                      <p><i className="fas fa-question-circle"></i> {passage.questions} câu hỏi</p>
                    </div>
                    <div className="passage-actions">
                      <button className="btn btn-secondary btn-sm">
                        <i className="fas fa-eye"></i> Xem
                      </button>
                      <button className="btn btn-secondary btn-sm">
                        <i className="fas fa-edit"></i> Sửa
                      </button>
                      <button className="btn btn-secondary btn-sm">
                        <i className="fas fa-plus"></i> Thêm câu hỏi
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exam Generation Tab */}
          {activeTab === "generation" && (
            <div className="tab-content">
              <div className="content-header">
                <div className="content-header-left">
                  <h2 className="content-title">Sinh đề thi</h2>
                  <p className="content-description">Tạo mã đề thi tự động từ ngân hàng câu hỏi</p>
                </div>
                <button className="btn btn-primary" onClick={handleGenerateExam}>
                  <i className="fas fa-magic"></i>
                  Sinh mã đề mới
                </button>
              </div>

              {/* Generation Info */}
              <div className="generation-info">
                <h3>Quy trình sinh đề thi</h3>
                <div className="process-steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h4>Đọc ma trận đề thi</h4>
                      <p>Hệ thống đọc cấu hình từ Admin</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h4>Tìm câu hỏi phù hợp</h4>
                      <p>Lọc câu hỏi theo quy tắc</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h4>Tạo đề thi tự động</h4>
                      <p>Sinh mã đề và lưu vào hệ thống</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exam Versions */}
              <div className="table-section">
                <h3 className="section-title">Danh sách mã đề đã sinh</h3>
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Mã đề</th>
                        <th>Kỳ thi</th>
                        <th>Số câu hỏi</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examVersions.map(version => (
                        <tr key={version.id}>
                          <td>
                            <span className="version-id">#{version.id}</span>
                          </td>
                          <td>
                            <span className="version-code">{version.code}</span>
                          </td>
                          <td>{version.exam}</td>
                          <td>
                            <span className="question-count">{version.questions} câu</span>
                          </td>
                          <td>
                            <span className={`status-badge ${version.status}`}>
                              {version.status === "generated" ? "Đã sinh" : "Đang chờ"}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="action-btn view" title="Xem">
                                <i className="fas fa-eye"></i>
                              </button>
                              <button className="action-btn edit" title="Chỉnh sửa">
                                <i className="fas fa-edit"></i>
                              </button>
                              <button className="action-btn delete" title="Xóa">
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Statistics */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon-wrapper purple">
                    <i className="fas fa-file-alt"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{examVersions.length}</div>
                    <div className="stat-label">Tổng mã đề</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon-wrapper green">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{examVersions.filter(v => v.status === "generated").length}</div>
                    <div className="stat-label">Đã sinh thành công</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon-wrapper orange">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{examVersions.filter(v => v.status === "pending").length}</div>
                    <div className="stat-label">Đang chờ sinh</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalType === "question" && (editItem ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới")}
                {modalType === "passage" && "Thêm bài đọc hiểu mới"}
              </h3>
              <button className="modal-close" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              {modalType === "question" && (
                <QuestionForm 
                  question={editItem}
                  skills={skills}
                  cognitiveLevels={cognitiveLevels}
                  onSubmit={handleAddQuestion}
                  onCancel={closeModal}
                />
              )}
              {modalType === "passage" && (
                <PassageForm 
                  skills={skills}
                  onSubmit={handleAddPassage}
                  onCancel={closeModal}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast ${toast.type}`}>
          <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

// Question Form Component
function QuestionForm({ question, skills, cognitiveLevels, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    content: question?.content || "",
    skill: question?.skill || skills[0],
    cognitive: question?.cognitive || cognitiveLevels[0],
    type: question?.type || "single",
    options: question?.options || [
      { content: "", isCorrect: false },
      { content: "", isCorrect: false },
      { content: "", isCorrect: false },
      { content: "", isCorrect: false }
    ]
  });

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options];
    newOptions[index][field] = field === "isCorrect" ? value : value;
    if (field === "isCorrect" && value) {
      newOptions.forEach((opt, i) => {
        if (i !== index) opt.isCorrect = false;
      });
    }
    setFormData({...formData, options: newOptions});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nội dung câu hỏi</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          placeholder="Nhập nội dung câu hỏi..."
          rows="3"
          required
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Kỹ năng</label>
          <select
            value={formData.skill}
            onChange={(e) => setFormData({...formData, skill: e.target.value})}
          >
            {skills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Mức độ</label>
          <select
            value={formData.cognitive}
            onChange={(e) => setFormData({...formData, cognitive: e.target.value})}
          >
            {cognitiveLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Loại câu hỏi</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
        >
          <option value="single">Câu hỏi đơn</option>
          <option value="passage">Bài đọc hiểu</option>
        </select>
      </div>
      {formData.type === "single" && (
        <div className="form-group">
          <label>Đáp án</label>
          {formData.options.map((option, index) => (
            <div key={index} className="option-row">
              <span className="option-label">{String.fromCharCode(65 + index)}.</span>
              <input
                type="text"
                value={option.content}
                onChange={(e) => handleOptionChange(index, "content", e.target.value)}
                placeholder={`Đáp án ${String.fromCharCode(65 + index)}`}
                required
              />
              <label className="correct-checkbox">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={option.isCorrect}
                  onChange={(e) => handleOptionChange(index, "isCorrect", e.target.checked)}
                />
                Đúng
              </label>
            </div>
          ))}
        </div>
      )}
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Hủy
        </button>
        <button type="submit" className="btn btn-primary">
          {question ? "Cập nhật" : "Thêm câu hỏi"}
        </button>
      </div>
    </form>
  );
}

// Passage Form Component
function PassageForm({ skills, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    skill: skills[3] || "Đọc hiểu",
    content: "",
    questions: [
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" }
    ]
  });

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index].content = value;
    setFormData({...formData, questions: newQuestions});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      questions: formData.questions.length
    });
  };

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Tiêu đề bài đọc</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="VD: Environmental Protection"
          required
        />
      </div>
      <div className="form-group">
        <label>Kỹ năng</label>
        <select
          value={formData.skill}
          onChange={(e) => setFormData({...formData, skill: e.target.value})}
        >
          {skills.map(skill => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Nội dung bài đọc</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          placeholder="Nhập nội dung đoạn văn..."
          rows="6"
          required
        />
      </div>
      <div className="form-group">
        <label>Câu hỏi (5 câu)</label>
        {formData.questions.map((question, index) => (
          <div key={index} className="question-input">
            <span className="question-number">Câu {index + 1}:</span>
            <input
              type="text"
              value={question.content}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              placeholder={`Nhập câu hỏi ${index + 1}`}
              required
            />
          </div>
        ))}
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Hủy
        </button>
        <button type="submit" className="btn btn-primary">
          Thêm bài đọc
        </button>
      </div>
    </form>
  );
}

export default TeacherDashboard;