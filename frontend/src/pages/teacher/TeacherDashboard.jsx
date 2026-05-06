// src/pages/teacher/TeacherDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../utils/auth";
import { useTeacherData } from "../../hooks/useTeacherData";
import QuestionBank from "./QuestionBank";
import "../../styles/teacher-dashboard.css";

function TeacherDashboard() {
  const navigate = useNavigate();
  const currentUser = getUser();
  const [activeTab, setActiveTab] = useState("questions");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // ================== HOOK: lấy toàn bộ state & API ==================
  const {
    loading: loadingQuestions,
    questions,
    totalQuestions,
    questionFilters,
    setQuestionFilters,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    // Exam
    exams,
    totalExams,
    examFilters,
    setExamFilters,
    createExam,
    updateExam,
    deleteExam,
    activateExam,
    deactivateExam,
    fetchScoreDistribution,
  } = useTeacherData();

  // ================== STATE CỤC BỘ (mock cho chức năng chưa có API) ==================
  // --- Bài đọc hiểu (mock) ---
  const [passages, setPassages] = useState([
    { id: 1, title: "Environmental Protection", skill: "Reading", questionCount: 5, status: "approved", content: "The environment is facing many challenges..." },
    { id: 2, title: "Technology in Education", skill: "Reading", questionCount: 6, status: "approved", content: "Technology has transformed education..." },
    { id: 3, title: "Health and Lifestyle", skill: "Reading", questionCount: 5, status: "pending", content: "Healthy living is essential..." },
  ]);

  // --- Ma trận đề thi (mock, sẽ thay bằng API sau) ---
  const [examMatrices, setExamMatrices] = useState([
    { id: "matrix1", name: "Ma trận THPT chuẩn", totalQuestions: 50 },
    { id: "matrix2", name: "Ma trận chuyên", totalQuestions: 60 },
  ]);

  // --- Analytics (mock) ---
  const [analyticsExams, setAnalyticsExams] = useState([
    { id: 1, name: "Thi thử lần 1", totalStudents: 120, avgScore: 6.5, highestScore: 9.5, passingRate: 68 },
    { id: 2, name: "Thi thử lần 2", totalStudents: 115, avgScore: 7.2, highestScore: 10, passingRate: 75 },
  ]);

  // ================== MODALS & UI STATE ==================
  // Passage modal
  const [showPassageModal, setShowPassageModal] = useState(false);
  const [editingPassage, setEditingPassage] = useState(null);
  const [passageForm, setPassageForm] = useState({ title: "", skill: "Reading", content: "", questionCount: 5 });

  // Generate exam modal
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedMatrix, setSelectedMatrix] = useState("");
  const [numberOfVersions, setNumberOfVersions] = useState(2);

  // Edit exam modal
  const [showEditExamModal, setShowEditExamModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [editExamForm, setEditExamForm] = useState({
    title: "",
    durationMinutes: 60,
    totalCodes: 10,
    openTime: "",
    closeTime: "",
    matrixId: "",
  });
  const [savingExam, setSavingExam] = useState(false);

  // Score distribution modal
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedScoreExam, setSelectedScoreExam] = useState(null);
  const [scoreDistribution, setScoreDistribution] = useState([]);
  const [loadingScore, setLoadingScore] = useState(false);

  // ================== KIỂM TRA QUYỀN ==================
  useEffect(() => {
    if (!currentUser || currentUser.role?.toLowerCase() !== "teacher") {
      navigate("/");
    }
  }, [currentUser, navigate]);

  // ================== TOAST ==================
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // ================== PASSAGE HANDLERS ==================
  const openPassageModal = (passage = null) => {
    if (passage) {
      setPassageForm({
        title: passage.title,
        skill: passage.skill,
        content: passage.content,
        questionCount: passage.questionCount,
      });
      setEditingPassage(passage);
    } else {
      setPassageForm({ title: "", skill: "Reading", content: "", questionCount: 5 });
      setEditingPassage(null);
    }
    setShowPassageModal(true);
  };

  const closePassageModal = () => {
    setShowPassageModal(false);
    setEditingPassage(null);
  };

  const savePassage = (e) => {
    e.preventDefault();
    if (editingPassage) {
      setPassages(passages.map(p => p.id === editingPassage.id ? { ...p, ...passageForm } : p));
      showToast("Cập nhật bài đọc thành công");
    } else {
      const newId = Math.max(...passages.map(p => p.id), 0) + 1;
      setPassages([...passages, { id: newId, ...passageForm, status: "pending" }]);
      showToast("Thêm bài đọc thành công");
    }
    closePassageModal();
  };

  const deletePassage = (id) => {
    if (window.confirm("Xóa bài đọc này?")) {
      setPassages(passages.filter(p => p.id !== id));
      showToast("Xóa bài đọc thành công");
    }
  };

  // ================== EXAM HANDLERS (gọi API thật) ==================
  const handleGenerateExams = async () => {
    if (!selectedMatrix) {
      showToast("Vui lòng chọn ma trận đề thi", "error");
      return;
    }
    const matrix = examMatrices.find(m => m.id === selectedMatrix);
    if (!matrix) return;

    for (let i = 0; i < numberOfVersions; i++) {
      const examData = {
        title: `${matrix.name} - Mã ${String(i + 1).padStart(3, "0")}`,
        durationMinutes: 60,
        totalCodes: 1,            // mỗi exam là một mã đề, có thể thay đổi
        openTime: new Date().toISOString(),
        closeTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        matrixId: matrix.id,
      };
      const result = await createExam(examData);
      if (!result.success) {
        showToast(`Lỗi tạo mã đề thứ ${i + 1}: ${result.message}`, "error");
        return;
      }
    }
    showToast(`Đã tạo ${numberOfVersions} kỳ thi thành công`, "success");
    setShowGenerateModal(false);
    setSelectedMatrix("");
    setNumberOfVersions(2);
  };

  const openEditExamModal = (exam) => {
    setEditingExam(exam);
    setEditExamForm({
      title: exam.title || "",
      durationMinutes: exam.durationMinutes || 60,
      totalCodes: exam.totalCodes || 10,
      openTime: exam.openTime ? new Date(exam.openTime).toISOString().slice(0, 16) : "",
      closeTime: exam.closeTime ? new Date(exam.closeTime).toISOString().slice(0, 16) : "",
      matrixId: exam.matrixId || "",
    });
    setShowEditExamModal(true);
  };

  const saveEditExam = async (e) => {
    e.preventDefault();
    setSavingExam(true);
    const result = await updateExam(editingExam.id, editExamForm);
    setSavingExam(false);
    if (result.success) {
      showToast("Cập nhật kỳ thi thành công", "success");
      setShowEditExamModal(false);
    } else {
      showToast(result.message, "error");
    }
  };

  const deleteExamHandler = async (examId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa kỳ thi này?")) return;
    const result = await deleteExam(examId);
    showToast(result.message, result.success ? "success" : "error");
  };

  const activateExamHandler = async (examId) => {
    const result = await activateExam(examId);
    showToast(result.message, result.success ? "success" : "error");
  };

  const deactivateExamHandler = async (examId) => {
    const result = await deactivateExam(examId);
    showToast(result.message, result.success ? "success" : "error");
  };

  const openScoreDistributionModal = async (exam) => {
    setSelectedScoreExam(exam);
    setShowScoreModal(true);
    setLoadingScore(true);
    const data = await fetchScoreDistribution(exam.id);
    setScoreDistribution(Array.isArray(data) ? data : []);
    setLoadingScore(false);
  };

  // Xuất file (mock)
  const exportToWord = (examCode) => {
    showToast(`Đang xuất đề ${examCode} ra file Word...`, "info");
    setTimeout(() => showToast(`Xuất file Word cho đề ${examCode} thành công`, "success"), 1000);
  };
  const exportToPdf = (examCode) => {
    showToast(`Đang xuất đề ${examCode} ra file PDF...`, "info");
    setTimeout(() => showToast(`Xuất file PDF cho đề ${examCode} thành công`, "success"), 1000);
  };
  const getExamLink = (examCode) => `${window.location.origin}/exam/${examCode}`;

  // ================== TABS ==================
  const tabs = [
    { id: "questions", label: "Ngân hàng câu hỏi", icon: "❓" },
    { id: "generation", label: "Quản lý kỳ thi", icon: "🎯" },
    { id: "analytics", label: "Theo dõi kết quả", icon: "📊" },
  ];

  // ================== RENDER ==================
  return (
    <div className="teacher-dashboard">
      {/* HEADER */}
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
            <div className="teacher-avatar">{currentUser?.username?.charAt(0).toUpperCase()}</div>
            <div className="teacher-user-details">
              <span className="teacher-username">{currentUser?.username}</span>
              <span className="teacher-role">Giáo viên</span>
            </div>
          </div>
        </div>
      </header>

      <div className="teacher-layout">
        {/* SIDEBAR */}
        <aside className="teacher-sidebar">
          <nav className="teacher-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`teacher-nav-item ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span className="nav-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="teacher-main">
          {/* ========== TAB 1: NGÂN HÀNG CÂU HỎI ========== */}
          {activeTab === "questions" && (
            <QuestionBank
              questions={questions}
              totalQuestions={totalQuestions}
              filters={questionFilters}
              onFilterChange={setQuestionFilters}
              loading={loadingQuestions}
              onCreateQuestion={createQuestion}
              onUpdateQuestion={updateQuestion}
              onDeleteQuestion={deleteQuestion}
              onShowToast={showToast}
            />
          )}

          {/* ========== TAB 2: QUẢN LÝ BÀI ĐỌC HIỂU ========== */}
          {activeTab === "passages" && (
            <div className="tab-content">
              <div className="content-header">
                <div className="content-header-left">
                  <h2 className="content-title">Quản lý bài đọc hiểu</h2>
                  <p className="content-description">
                    Tạo và quản lý các đoạn văn đọc hiểu, mỗi bài đọc có thể nhóm 5-7 câu hỏi riêng
                  </p>
                </div>
                <button className="btn btn-primary" onClick={() => openPassageModal()}>
                  <i className="fas fa-plus"></i> Thêm bài đọc
                </button>
              </div>

              <div className="table-section">
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tiêu đề</th>
                        <th>Kỹ năng</th>
                        <th>Số câu hỏi</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {passages.map(p => (
                        <tr key={p.id}>
                          <td>#{p.id}</td>
                          <td>{p.title}</td>
                          <td>{p.skill}</td>
                          <td>{p.questionCount}</td>
                          <td>
                            <span className={`status-badge ${p.status}`}>
                              {p.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="action-btn view" onClick={() => openPassageModal(p)}>
                                <i className="fas fa-eye"></i>
                              </button>
                              <button className="action-btn edit" onClick={() => openPassageModal(p)}>
                                <i className="fas fa-edit"></i>
                              </button>
                              <button className="action-btn delete" onClick={() => deletePassage(p.id)}>
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

          {/* ========== TAB 3: SINH ĐỀ THI & QUẢN LÝ KỲ THI ========== */}
          {activeTab === "generation" && (
            <div className="tab-content">
              <div className="content-header">
                <div className="content-header-left">
                  <h2 className="content-title">Quản lý kỳ thi</h2>
                  <p className="content-description">
                    Tạo mới, chỉnh sửa, kích hoạt hoặc xóa các kỳ thi
                  </p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowGenerateModal(true)}>
                  <i className="fas fa-plus"></i> Tạo kỳ thi mới
                </button>
              </div>

              <div className="table-section">
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Tiêu đề</th>
                        <th>Thời lượng (phút)</th>
                        <th>Số mã đề</th>
                        <th>Trạng thái</th>
                        <th>Mở lúc</th>
                        <th>Đóng lúc</th>
                        <th>Tạo bởi</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exams.length === 0 ? (
                        <tr>
                          <td colSpan="8" style={{ textAlign: "center" }}>Chưa có kỳ thi nào</td>
                        </tr>
                      ) : (
                        exams.map(exam => (
                          <tr key={exam.id}>
                            <td>{exam.title}</td>
                            <td>{exam.durationMinutes}</td>
                            <td>{exam.totalCodes}</td>
                            <td>
                              <span className={`status-badge ${exam.isActive ? "active" : "inactive"}`}>
                                {exam.status}
                              </span>
                            </td>
                            <td>{exam.openTime ? new Date(exam.openTime).toLocaleString("vi-VN") : "—"}</td>
                            <td>{exam.closeTime ? new Date(exam.closeTime).toLocaleString("vi-VN") : "—"}</td>
                            <td>{exam.createdByUsername}</td>
                            <td>
                              <div className="action-buttons">
                                <button className="action-btn edit" title="Sửa" onClick={() => openEditExamModal(exam)}>
                                  <i className="fas fa-edit"></i>
                                </button>
                                {exam.isActive ? (
                                  <button className="action-btn warning" title="Vô hiệu hóa" onClick={() => deactivateExamHandler(exam.id)}>
                                    <i className="fas fa-pause-circle"></i>
                                  </button>
                                ) : (
                                  <button className="action-btn success" title="Kích hoạt" onClick={() => activateExamHandler(exam.id)}>
                                    <i className="fas fa-play-circle"></i>
                                  </button>
                                )}
                                <button className="action-btn info" title="Phân phối điểm" onClick={() => openScoreDistributionModal(exam)}>
                                  <i className="fas fa-chart-bar"></i>
                                </button>
                                <button className="action-btn delete" title="Xóa" onClick={() => deleteExamHandler(exam.id)}>
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Phân trang */}
                {totalExams > examFilters.pageSize && (
                  <div className="pagination">
                    <button
                      disabled={examFilters.page <= 1}
                      onClick={() => setExamFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                    >
                      Trước
                    </button>
                    <span>Trang {examFilters.page}</span>
                    <button
                      disabled={exams.length < examFilters.pageSize}
                      onClick={() => setExamFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                    >
                      Sau
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========== TAB 4: THEO DÕI KẾT QUẢ ========== */}
          {activeTab === "analytics" && (
            <div className="tab-content">
              <div className="content-header">
                <div className="content-header-left">
                  <h2 className="content-title">Thống kê kết quả thi</h2>
                  <p className="content-description">
                    Phân tích điểm số, tỷ lệ đúng/sai, xác định câu hỏi khó
                  </p>
                </div>
              </div>

              <div className="summary-cards">
                <div className="summary-card">
                  <div className="summary-icon"><i className="fas fa-users"></i></div>
                  <div className="summary-content">
                    <div className="summary-value">{analyticsExams.reduce((sum, e) => sum + e.totalStudents, 0)}</div>
                    <div className="summary-label">Tổng lượt thi</div>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon"><i className="fas fa-chart-line"></i></div>
                  <div className="summary-content">
                    <div className="summary-value">{analyticsExams.length}</div>
                    <div className="summary-label">Kỳ thi đã tổ chức</div>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon"><i className="fas fa-trophy"></i></div>
                  <div className="summary-content">
                    <div className="summary-value">7.8</div>
                    <div className="summary-label">Điểm TB cao nhất</div>
                  </div>
                </div>
              </div>

              <div className="table-section">
                <h3 className="section-title">Kết quả theo kỳ thi</h3>
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Kỳ thi</th>
                        <th>Số học sinh</th>
                        <th>Điểm trung bình</th>
                        <th>Điểm cao nhất</th>
                        <th>Tỷ lệ đạt (%)</th>
                        <th>Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsExams.map(exam => (
                        <tr key={exam.id}>
                          <td>{exam.name}</td>
                          <td>{exam.totalStudents}</td>
                          <td>{exam.avgScore.toFixed(1)}</td>
                          <td>{exam.highestScore.toFixed(1)}</td>
                          <td>{exam.passingRate}%</td>
                          <td>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => openScoreDistributionModal(exam)}
                            >
                              <i className="fas fa-chart-bar"></i> Xem
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon-wrapper purple"><i className="fas fa-question-circle"></i></div>
                  <div className="stat-content">
                    <div className="stat-value">5</div>
                    <div className="stat-label">Câu hỏi sai nhiều nhất</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon-wrapper green"><i className="fas fa-check-double"></i></div>
                  <div className="stat-content">
                    <div className="stat-value">82%</div>
                    <div className="stat-label">Tỷ lệ hoàn thành</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon-wrapper orange"><i className="fas fa-chart-simple"></i></div>
                  <div className="stat-content">
                    <div className="stat-value">6.8</div>
                    <div className="stat-label">Độ khó trung bình</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================== TOAST ================== */}
      {toast.show && (
        <div className={`toast ${toast.type}`}>
          <i className={`fas ${toast.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`}></i>
          <span>{toast.message}</span>
        </div>
      )}

      {/* ================== MODAL: THÊM/SỬA BÀI ĐỌC ================== */}
      {showPassageModal && (
        <div className="modal-overlay" onClick={closePassageModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingPassage ? "Chỉnh sửa bài đọc" : "Thêm bài đọc mới"}</h3>
              <button className="modal-close" onClick={closePassageModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={savePassage}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Tiêu đề bài đọc *</label>
                  <input
                    type="text"
                    value={passageForm.title}
                    onChange={e => setPassageForm({ ...passageForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Kỹ năng</label>
                  <select
                    value={passageForm.skill}
                    onChange={e => setPassageForm({ ...passageForm, skill: e.target.value })}
                  >
                    <option value="Reading">Đọc hiểu</option>
                    <option value="Grammar">Ngữ pháp</option>
                    <option value="Vocabulary">Từ vựng</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Nội dung đoạn văn</label>
                  <textarea
                    rows="5"
                    value={passageForm.content}
                    onChange={e => setPassageForm({ ...passageForm, content: e.target.value })}
                    placeholder="Nhập nội dung bài đọc..."
                  />
                </div>
                <div className="form-group">
                  <label>Số câu hỏi đi kèm</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={passageForm.questionCount}
                    onChange={e => setPassageForm({ ...passageForm, questionCount: parseInt(e.target.value) })}
                  />
                </div>
                <p className="form-hint">📌 Lưu ý: Có thể thêm/cập nhật câu hỏi chi tiết sau khi tạo bài đọc.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closePassageModal}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPassage ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================== MODAL: TẠO KỲ THI MỚI ================== */}
      {showGenerateModal && (
        <div className="modal-overlay" onClick={() => setShowGenerateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tạo kỳ thi mới</h3>
              <button className="modal-close" onClick={() => setShowGenerateModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Chọn ma trận đề thi</label>
                <select
                  className="filter-select"
                  value={selectedMatrix}
                  onChange={e => setSelectedMatrix(e.target.value)}
                  required
                >
                  <option value="">-- Chọn ma trận --</option>
                  {examMatrices.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} (Tổng {m.totalQuestions} câu)
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Số lượng mã đề cần sinh</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={numberOfVersions}
                  onChange={e => setNumberOfVersions(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="form-info">
                <p>💡 Hệ thống sẽ tự động lấy câu hỏi từ ngân hàng theo tỷ lệ % của ma trận.</p>
                <p>📌 Các câu hỏi thuộc bài đọc hiểu sẽ được giữ nguyên nhóm.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowGenerateModal(false)}>
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleGenerateExams}>
                <i className="fas fa-magic"></i> Tạo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================== MODAL: CHỈNH SỬA KỲ THI ================== */}
      {showEditExamModal && (
        <div className="modal-overlay" onClick={() => setShowEditExamModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chỉnh sửa kỳ thi</h3>
              <button className="modal-close" onClick={() => setShowEditExamModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={saveEditExam}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Tiêu đề *</label>
                  <input
                    type="text"
                    value={editExamForm.title}
                    onChange={e => setEditExamForm({ ...editExamForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Thời lượng (phút)</label>
                  <input
                    type="number"
                    min="5"
                    max="600"
                    value={editExamForm.durationMinutes}
                    onChange={e => setEditExamForm({ ...editExamForm, durationMinutes: parseInt(e.target.value) || 60 })}
                  />
                </div>
                <div className="form-group">
                  <label>Tổng số mã đề</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={editExamForm.totalCodes}
                    onChange={e => setEditExamForm({ ...editExamForm, totalCodes: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div className="form-group">
                  <label>Thời gian mở</label>
                  <input
                    type="datetime-local"
                    value={editExamForm.openTime}
                    onChange={e => setEditExamForm({ ...editExamForm, openTime: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Thời gian đóng</label>
                  <input
                    type="datetime-local"
                    value={editExamForm.closeTime}
                    onChange={e => setEditExamForm({ ...editExamForm, closeTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditExamModal(false)} disabled={savingExam}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary" disabled={savingExam}>
                  {savingExam ? (
                    <>
                      <span className="loading-spinner"></span> Đang lưu...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i> Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================== MODAL: PHÂN PHỐI ĐIỂM ================== */}
      {showScoreModal && (
        <div className="modal-overlay" onClick={() => setShowScoreModal(false)}>
          <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📊 Phân phối điểm - {selectedScoreExam?.title || selectedScoreExam?.name}</h3>
              <button className="modal-close" onClick={() => setShowScoreModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              {loadingScore ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Đang tải dữ liệu điểm...</p>
                </div>
              ) : scoreDistribution.length > 0 ? (
                <div className="score-distribution">
                  <div className="distribution-summary">
                    <div className="stat-item">
                      <span className="stat-label">Tổng số học sinh</span>
                      <span className="stat-value">{scoreDistribution.reduce((sum, item) => sum + item.count, 0)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Điểm trung bình</span>
                      <span className="stat-value">{selectedScoreExam?.avgScore?.toFixed(1) || "—"}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Điểm cao nhất</span>
                      <span className="stat-value">{selectedScoreExam?.highestScore?.toFixed(1) || "—"}</span>
                    </div>
                  </div>
                  <div className="distribution-chart">
                    {scoreDistribution.map((item, index) => (
                      <div key={index} className="chart-bar-container">
                        <div className="chart-bar" style={{ height: `${Math.max((item.count / Math.max(...scoreDistribution.map(i => i.count), 1)) * 180, 10)}px` }}>
                          <span className="bar-count">{item.count}</span>
                        </div>
                        <div className="bar-label">{item.scoreRange}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <i className="fas fa-chart-bar"></i>
                  <p>Chưa có dữ liệu điểm cho kỳ thi này</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowScoreModal(false)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;