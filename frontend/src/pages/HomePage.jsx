import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import bannerImg from "../assets/images/banner.png";
import banner3Img from "../assets/images/banner3.jpg";
import icon1Img from "../assets/images/icon-1.png";
import icon3Img from "../assets/images/icon-3.png";
import icon4Img from "../assets/images/icon-4.png";

function HomePage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(null);
  const [activeTab, setActiveTab] = useState('grammar');
  const [activeGrammar, setActiveGrammar] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    setCurrentUser(null);
    showToast('Đăng xuất thành công!');
  };


  const practiceTopics = {
    grammar: [
      { title: '12 Thì trong tiếng Anh', questions: 50, duration: '30 phút' },
      { title: 'Câu bị động', questions: 40, duration: '25 phút' },
      { title: 'Mệnh đề quan hệ', questions: 35, duration: '20 phút' },
      { title: 'So sánh hơn & nhất', questions: 30, duration: '15 phút' }
    ],
    vocabulary: [
      { title: 'Từ vựng gia đình', questions: 100, duration: '45 phút' },
      { title: 'Từ vựng công việc', questions: 80, duration: '40 phút' }
    ],
    reading: [
      { title: 'Đọc báo tiếng Anh', questions: 5, duration: '60 phút' },
      { title: 'Đọc hiểu khoa học', questions: 4, duration: '50 phút' }
    ],
    listening: [
      { title: 'Luyện nghe hội thoại', questions: 10, duration: '45 phút' },
      { title: 'IELTS Listening', questions: 4, duration: '30 phút' }
    ]
  };

  const vocabWords = [
    { word: 'Achievement', phonetic: '/əˈtʃiːvmənt/', meaning: 'Thành tựu', icon: '🏆' },
    { word: 'Environment', phonetic: '/ɪnˈvaɪrənmənt/', meaning: 'Môi trường', icon: '🌍' },
    { word: 'Knowledge', phonetic: '/ˈnɒlɪdʒ/', meaning: 'Kiến thức', icon: '📚' },
    { word: 'Opportunity', phonetic: '/ˌɒpəˈtjuːnəti/', meaning: 'Cơ hội', icon: '🚪' },
    { word: 'Responsibility', phonetic: '/rɪˌspɒnsəˈbɪləti/', meaning: 'Trách nhiệm', icon: '👔' },
    { word: 'Technology', phonetic: '/tekˈnɒlədʒi/', meaning: 'Công nghệ', icon: '💻' },
    { word: 'Communication', phonetic: '/kəˌmjuːnɪˈkeɪʃn/', meaning: 'Giao tiếp', icon: '💬' },
    { word: 'Development', phonetic: '/dɪˈveləpmənt/', meaning: 'Phát triển', icon: '📈' }
  ];

  const grammarTopics = [
    {
      title: '12 Thì trong tiếng Anh',
      icon: 'fa-clock',
      content: 'Tiếng Anh có 12 thì cơ bản, mỗi thì dùng để biểu đạt hành động xảy ra ở các thời điểm khác nhau.',
      examples: [
        { tense: 'Present Simple', example: 'I study English every day.' },
        { tense: 'Present Continuous', example: 'I am studying English now.' },
        { tense: 'Present Perfect', example: 'I have studied English for 5 years.' },
        { tense: 'Past Simple', example: 'I studied English yesterday.' }
      ]
    },
    {
      title: 'Câu bị động (Passive Voice)',
      icon: 'fa-exchange-alt',
      content: 'Câu bị động được sử dụng khi muốn nhấn mạnh đối tượng chịu tác động của hành động.',
      formula: 'S + be + V3/V-ed + (by + O)',
      examples: [
        { type: 'Active', example: 'They build this house.' },
        { type: 'Passive', example: 'This house is built by them.' }
      ]
    },
    {
      title: 'Mệnh đề quan hệ (Relative Clauses)',
      icon: 'fa-link',
      content: 'Mệnh đề quan hệ dùng để bổ sung thông tin về một danh từ.',
      examples: [
        { pronoun: 'Who', example: 'The man who is standing there is my teacher.' },
        { pronoun: 'Which', example: 'The book which I bought is interesting.' },
        { pronoun: 'That', example: 'The car that he drives is expensive.' },
        { pronoun: 'Whose', example: 'The girl whose father is a doctor is my friend.' }
      ]
    },
    {
      title: 'So sánh hơn và so sánh nhất',
      icon: 'fa-level-up-alt',
      content: 'Dùng để so sánh mức độ giữa hai hoặc nhiều đối tượng.',
      rules: [
        'Ngắn: adj-er / adj-est (tall → taller → tallest)',
        'Dài: more/most + adj (beautiful → more beautiful → most)',
        'Đặc biệt: good → better → best'
      ]
    },
    {
      title: 'Câu hỏi đuôi (Tag Questions)',
      icon: 'fa-question-circle',
      content: 'Dùng để xác nhận thông tin hoặc hỏi ý kiến người nghe.',
      rules: [
        'Khẳng định (+) → Phủ định (-): You are a student, aren\'t you?',
        'Phủ định (-) → Khẳng định (+): He isn\'t here, is he?',
        'Lưu ý sự nhất quán của trợ động từ'
      ]
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Ngọc Quân', level: 25, score: 9850, streak: 45, avatar: 'NA' },
    { rank: 2, name: 'Trần Bình', level: 23, score: 9520, streak: 38, avatar: 'TB' },
    { rank: 3, name: 'Hoàng Thanh', level: 22, score: 3667, streak: 36, avatar: 'LC' },
    { rank: 4, name: 'Thành Đạt', level: 21, score: 9120, streak: 28, avatar: 'PD' },
    { rank: 5, name: 'Thanh Bình', level: 20, score: 8950, streak: 25, avatar: 'HE' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero" style={{backgroundImage: `url(${bannerImg})`}}>
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <i className="fas fa-star"></i> Nền tảng học tiếng Anh #1 Việt Nam
            </div>
            <h1 className="hero-title">
              Chinh phục tiếng Anh
              <span>Dễ dàng & Hiệu quả</span>
            </h1>
            <p className="hero-description">
              Hàng nghìn bài tập, từ vựng và ngữ pháp được thiết kế bởi chuyên gia. 
              Luyện thi THPT Quốc gia, IELTS, TOEIC với phương pháp học thông minh.
            </p>
            <div className="hero-buttons">
              <button className="btn-hero btn-hero-primary" onClick={() => scrollToSection('practice')}>
                <i className="fas fa-play"></i> Bắt đầu học ngay
              </button>
              <button className="btn-hero btn-hero-secondary" onClick={() => scrollToSection('features')}>
                <i className="fas fa-info-circle"></i> Tìm hiểu thêm
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Học viên</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Bài tập</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">Đậu</div>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img src={banner3Img} alt="English Learning" className="hero-banner-img" />
            <div className="hero-card">
              <div className="card-header">
                <div className="card-icon">
                  <i className="fas fa-question-circle"></i>
                </div>
                <div className="card-title">Câu hỏi hôm nay</div>
              </div>
              <div className="quiz-item" onClick={() => scrollToSection('quiz')}>
                <div className="quiz-number">1</div>
                <div className="quiz-text">Thì Hiện tại Hoàn thành</div>
                <i className="fas fa-arrow-right quiz-arrow"></i>
              </div>
              <div className="quiz-item" onClick={() => scrollToSection('quiz')}>
                <div className="quiz-number">2</div>
                <div className="quiz-text">Câu bị động</div>
                <i className="fas fa-arrow-right quiz-arrow"></i>
              </div>
              <div className="quiz-item" onClick={() => scrollToSection('quiz')}>
                <div className="quiz-number">3</div>
                <div className="quiz-text">Từ vựng IELTS</div>
                <i className="fas fa-arrow-right quiz-arrow"></i>
              </div>
            </div>
            <div className="floating-card floating-card-1">
              <div className="mini-stats">
                <div className="mini-icon green">
                  <i className="fas fa-check"></i>
                </div>
                <div>
                  <div className="mini-text">Điểm số</div>
                  <div className="mini-number">850+</div>
                </div>
              </div>
            </div>
            <div className="floating-card floating-card-2">
              <div className="mini-stats">
                <div className="mini-icon orange">
                  <i className="fas fa-fire"></i>
                </div>
                <div>
                  <div className="mini-text">Streak</div>
                  <div className="mini-number">7 ngày</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Profile Section */}
      {currentUser && (
        <div className="user-profile-section">
          <div className="container">
            <div className="user-profile-card">
              <div className="user-avatar">
                {currentUser.username?.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <h3>{currentUser.username}</h3>
                <p>{currentUser.role === 'admin' ? 'Quản trị viên' : currentUser.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}</p>
              </div>
              <div className="user-actions">
                {currentUser.role === 'admin' && (
                  <button className="btn-dashboard" onClick={() => navigate('/admin')}>
                    <i className="fas fa-chart-line"></i> Quản trị
                  </button>
                )}
                {currentUser.role === 'teacher' && (
                  <button className="btn-dashboard" onClick={() => navigate('/teacher')}>
                    <i className="fas fa-chalkboard-teacher"></i> Giáo viên
                  </button>
                )}
                {currentUser.role === 'student' && (
                  <button className="btn-dashboard" onClick={() => navigate('/student')}>
                    <i className="fas fa-user-graduate"></i> Học sinh
                  </button>
                )}
                <button className="btn-logout" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Tính năng nổi bật</div>
            <h2 className="section-title">Tại sao chọn <span>EnglishPro</span>?</h2>
            <p className="section-description">
              Nền tảng học tiếng Anh toàn diện với công nghệ AI tiên tiến
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card" onClick={() => showToast('Tính năng bài tập đa dạng đang được mở!')}>
              <div className="feature-icon">
                <img src={icon1Img} alt="Bài tập đa dạng" />
              </div>
              <h3 className="feature-title">Bài tập đa dạng</h3>
              <p className="feature-description">Hàng nghìn bài tập từ cơ bản đến nâng cao, bao gồm tất cả ngữ pháp và từ vựng</p>
              <button className="feature-link" onClick={(e) => e.preventDefault()}>
                Khám phá <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            <div className="feature-card" onClick={() => showToast('Tính năng đang được phát triển!')}>
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3 className="feature-title">Tiến độ học tập</h3>
              <p className="feature-description">Theo dõi quá trình học tập và đánh giá kết quả</p>
              <button className="feature-link" onClick={(e) => e.preventDefault()}>
                Khám phá <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            <div className="feature-card" onClick={() => showToast('Tính năng thi thử đang được mở!')}>
              <div className="feature-icon">
                <img src={icon3Img} alt="Thi thử như thật" />
              </div>
              <h3 className="feature-title">Thi thử như thật</h3>
              <p className="feature-description">Đề thi mô phỏng chính xác format THPT Quốc gia, IELTS, TOEIC</p>
              <a href="#" className="feature-link" onClick={(e) => e.preventDefault()}>
                Khám phá <i className="fas fa-arrow-right"></i>
              </a>
            </div>
            <div className="feature-card" onClick={() => showToast('Tính năng video bài giảng đang được mở!')}>
              <div className="feature-icon">
                <img src={icon4Img} alt="Video bài giảng" />
              </div>
              <h3 className="feature-title">Video bài giảng</h3>
              <p className="feature-description">Video chất lượng cao từ giáo viên giàu kinh nghiệm</p>
              <a href="#" className="feature-link" onClick={(e) => e.preventDefault()}>
                Khám phá <i className="fas fa-arrow-right"></i>
              </a>
            </div>
            <div className="feature-card" onClick={() => showToast('Tính năng từ vựng thông minh đang được mở!')}>
              <div className="feature-icon">
                <i className="fas fa-brain"></i>
              </div>
              <h3 className="feature-title">Từ vựng thông minh</h3>
              <p className="feature-description">Học từ vựng với flashcard, spaced repetition và luyện phát âm</p>
              <a href="#" className="feature-link" onClick={(e) => e.preventDefault()}>
                Khám phá <i className="fas fa-arrow-right"></i>
              </a>
            </div>
            <div className="feature-card" onClick={() => showToast('Tính năng cộng đồng đang được mở!')}>
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3 className="feature-title">Cộng đồng năng động</h3>
              <p className="feature-description">Kết nối với hàng nghìn học viên, chia sẻ kinh nghiệm và động viên lẫn nhau</p>
              <a href="#" className="feature-link" onClick={(e) => e.preventDefault()}>
                Khám phá <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Section */}
      <section className="practice" id="practice">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Luyện tập</div>
            <h2 className="section-title">Chọn chủ đề <span>luyện tập</span></h2>
            <p className="section-description">
              Đa dạng chủ đề giúp bạn nâng cao toàn diện khả năng tiếng Anh
            </p>
          </div>
          <div className="practice-tabs">
            <button className={`tab-btn ${activeTab === 'grammar' ? 'active' : ''}`} onClick={() => setActiveTab('grammar')}>
              <i className="fas fa-book"></i> Ngữ pháp
            </button>
            <button className={`tab-btn ${activeTab === 'vocabulary' ? 'active' : ''}`} onClick={() => setActiveTab('vocabulary')}>
              <i className="fas fa-spell-check"></i> Từ vựng
            </button>
            <button className={`tab-btn ${activeTab === 'reading' ? 'active' : ''}`} onClick={() => setActiveTab('reading')}>
              <i className="fas fa-glasses"></i> Đọc hiểu
            </button>
            <button className={`tab-btn ${activeTab === 'listening' ? 'active' : ''}`} onClick={() => setActiveTab('listening')}>
              <i className="fas fa-headphones"></i> Nghe
            </button>
          </div>
          <div className="practice-grid">
            {practiceTopics[activeTab]?.map((topic, index) => (
              <div key={index} className="practice-card" onClick={() => showToast(`Bắt đầu ${topic.title}!`)}>
                <div className="practice-image">
                  <i className={`fas ${activeTab === 'grammar' ? 'fa-clock' : activeTab === 'vocabulary' ? 'fa-book' : activeTab === 'reading' ? 'fa-newspaper' : 'fa-podcast'}`}></i>
                  <div className="practice-image-content">
                    <h3>{topic.title}</h3>
                    <p>{activeTab === 'grammar' ? 'Nắm vững ngữ pháp' : activeTab === 'vocabulary' ? 'Mở rộng từ vựng' : activeTab === 'reading' ? 'Tăng kỹ năng đọc' : 'Luyện nghe hiệu quả'}</p>
                  </div>
                </div>
                <div className="practice-body">
                  <h3 className="practice-title">{topic.title}</h3>
                  <p className="practice-description">
                    Học và luyện tập với bài tập tương tác
                  </p>
                  <div className="practice-meta">
                    <div className="practice-info">
                      <div className="practice-info-item">
                        <i className="fas fa-question-circle"></i>
                        <span>{topic.questions} câu</span>
                      </div>
                      <div className="practice-info-item">
                        <i className="fas fa-clock"></i>
                        <span>{topic.duration}</span>
                      </div>
                    </div>
                    <button className="btn-practice">Bắt đầu</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vocabulary Section */}
      <section className="vocabulary" id="vocabulary">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Từ vựng</div>
            <h2 className="section-title">Học <span>từ vựng</span> mỗi ngày</h2>
            <p className="section-description">
              Mở rộng vốn từ vựng với phương pháp học hiệu quả
            </p>
          </div>
          <div className="vocab-grid">
            {vocabWords.map((vocab, index) => (
              <div key={index} className="vocab-card" onClick={() => showToast(`Phát âm: ${vocab.word}`)}>
                <div className="vocab-icon">{vocab.icon}</div>
                <div className="vocab-word">{vocab.word}</div>
                <div className="vocab-phonetic">{vocab.phonetic}</div>
                <div className="vocab-meaning">{vocab.meaning}</div>
                <button className="vocab-audio" onClick={(e) => { e.stopPropagation(); showToast(`Phát âm: ${vocab.word}`); }}>
                  <i className="fas fa-volume-up"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grammar Section */}
      <section className="grammar" id="grammar">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Ngữ pháp</div>
            <h2 className="section-title">Nắm vững <span>ngữ pháp</span></h2>
            <p className="section-description">
              Hệ thống ngữ pháp tiếng Anh toàn diện và dễ hiểu
            </p>
          </div>
          <div className="grammar-accordion">
            {grammarTopics.map((grammar, index) => (
              <div key={index} className={`grammar-item ${activeGrammar === index ? 'active' : ''}`}>
                <div className="grammar-header" onClick={() => setActiveGrammar(activeGrammar === index ? -1 : index)}>
                  <div className="grammar-title">
                    <i className={`fas ${grammar.icon}`}></i>
                    <span>{grammar.title}</span>
                  </div>
                  <i className="fas fa-chevron-down grammar-arrow"></i>
                </div>
                <div className="grammar-content">
                  <div className="grammar-body">
                    <p>{grammar.content}</p>
                    {grammar.formula && (
                      <div className="grammar-example">
                        <div className="grammar-example-title">Công thức:</div>
                        <div className="grammar-example-sentence">
                          <span>{grammar.formula}</span>
                        </div>
                      </div>
                    )}
                    {grammar.examples && (
                      <div className="grammar-example">
                        <div className="grammar-example-title">Ví dụ:</div>
                        <div className="grammar-example-sentence">
                          {grammar.examples.map((ex, i) => (
                            <div key={i}>
                              {ex.tense && <span>{ex.tense}:</span>}
                              {ex.type && <span>{ex.type}:</span>}
                              {ex.pronoun && <span>{ex.pronoun}:</span>}
                              {' '}{ex.example}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {grammar.rules && (
                      <div className="grammar-example">
                        <div className="grammar-example-title">Quy tắc:</div>
                        <div className="grammar-example-sentence">
                          {grammar.rules.map((rule, i) => (
                            <div key={i}>• {rule}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="leaderboard" id="leaderboard">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Xếp hạng</div>
            <h2 className="section-title">Bảng xếp hạng <span>học viên</span></h2>
            <p className="section-description">
              Cạnh tranh lành mạnh, cùng nhau tiến bộ
            </p>
          </div>
          <div className="leaderboard-container">
            <div className="leaderboard-table">
              <div className="leaderboard-header">
                <div>Hạng</div>
                <div>Học viên</div>
                <div>Điểm</div>
                <div>Streak</div>
              </div>
              {leaderboard.map((user, index) => (
                <div key={index} className="leaderboard-row">
                  <div className={`rank rank-${user.rank}`}>
                    {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : user.rank}
                  </div>
                  <div className="user-info">
                    <div className="user-avatar">{user.avatar}</div>
                    <div>
                      <div className="user-name">{user.name}</div>
                      <div className="user-level">Level {user.level}</div>
                    </div>
                  </div>
                  <div className="user-score">{user.score.toLocaleString()}</div>
                  <div className="user-streak">
                    <i className="fas fa-fire"></i> {user.streak}
                  </div>
                </div>
              ))}
            </div>
            <div className="your-rank-card">
              <div className="your-rank-title">Thứ hạng của bạn</div>
              <div className="your-rank-number">#42</div>
              <div className="your-rank-label">trong 10,000 học viên</div>
              <div className="your-stats">
                <div className="your-stat-item">
                  <div className="your-stat-value">5,230</div>
                  <div className="your-stat-label">Điểm</div>
                </div>
                <div className="your-stat-item">
                  <div className="your-stat-value">12</div>
                  <div className="your-stat-label">Streak</div>
                </div>
                <div className="your-stat-item">
                  <div className="your-stat-value">15</div>
                  <div className="your-stat-label">Level</div>
                </div>
                <div className="your-stat-item">
                  <div className="your-stat-value">85%</div>
                  <div className="your-stat-label">Độ chính xác</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Sẵn sàng chinh phục tiếng Anh?</h2>
            <p className="cta-description">
              Đăng ký ngay để nhận 7 ngày học MIỄN PHÍ và lộ trình học cá nhân hóa
            </p>
            <div className="cta-buttons">
              <button className="btn-cta btn-cta-primary" onClick={() => showToast('Đăng ký thành công!')}>
                <i className="fas fa-rocket"></i> Bắt đầu miễn phí
              </button>
              <button className="btn-cta btn-cta-secondary" onClick={() => scrollToSection('features')}>
                <i className="fas fa-play-circle"></i> Xem demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      {showModal === 'login' && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Đăng nhập</h3>
              <button className="modal-close" onClick={() => setShowModal(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              const users = JSON.parse(localStorage.getItem('users') || '[]');
              const formData = new FormData(e.target);
              const username = formData.get('username');
              const password = formData.get('password');
              
              const user = users.find(u => u.username === username && u.password === password);
              
              if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.setItem('isLoggedIn', 'true');
                setCurrentUser(user);
                setShowModal(null);
                showToast('Đăng nhập thành công!');
              } else {
                showToast('Tên đăng nhập hoặc mật khẩu không đúng!', 'error');
              }
            }}>
              <div className="form-group">
                <label className="form-label">Tên đăng nhập</label>
                <input type="text" name="username" className="form-input" placeholder="Nhập tên đăng nhập" required />
              </div>
              <div className="form-group">
                <label className="form-label">Mật khẩu</label>
                <input type="password" name="password" className="form-input" placeholder="Nhập mật khẩu" required />
              </div>
              <button type="submit" className="form-submit">Đăng nhập</button>
            </form>
            <div className="modal-footer">
              <p>Chưa có tài khoản? <button className="link-btn" onClick={() => setShowModal('register')}>Đăng ký ngay</button></p>
              <p className="demo-hint">Demo: admin/123, teacher/123, student/123</p>
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showModal === 'register' && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Đăng ký tài khoản</h3>
              <button className="modal-close" onClick={() => setShowModal(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              const formData = new FormData(e.target);
              const username = formData.get('username');
              const password = formData.get('password');
              const confirmPassword = formData.get('confirmPassword');
              
              if (password !== confirmPassword) {
                showToast('Mật khẩu không khớp!', 'error');
                return;
              }
              
              const users = JSON.parse(localStorage.getItem('users') || '[]');
              
              if (users.find(u => u.username === username)) {
                showToast('Tên đăng nhập đã tồn tại!', 'error');
                return;
              }
              
              const newUser = {
                id: users.length + 1,
                username,
                password,
                role: 'student'
              };
              
              users.push(newUser);
              localStorage.setItem('users', JSON.stringify(users));
              
              setShowModal('login');
              showToast('Đăng ký thành công! Vui lòng đăng nhập.');
            }}>
              <div className="form-group">
                <label className="form-label">Họ và tên</label>
                <input type="text" name="fullName" className="form-input" placeholder="Nhập họ và tên" required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-input" placeholder="Nhập email" required />
              </div>
              <div className="form-group">
                <label className="form-label">Tên đăng nhập</label>
                <input type="text" name="username" className="form-input" placeholder="Nhập tên đăng nhập" required />
              </div>
              <div className="form-group">
                <label className="form-label">Mật khẩu</label>
                <input type="password" name="password" className="form-input" placeholder="Tạo mật khẩu" required />
              </div>
              <div className="form-group">
                <label className="form-label">Xác nhận mật khẩu</label>
                <input type="password" name="confirmPassword" className="form-input" placeholder="Nhập lại mật khẩu" required />
              </div>
              <button type="submit" className="form-submit">Đăng ký</button>
            </form>
            <div className="modal-footer">
              <p>Đã có tài khoản? <button className="link-btn" onClick={() => setShowModal('login')}>Đăng nhập</button></p>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast show ${toast.type}`}>
          <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default HomePage;