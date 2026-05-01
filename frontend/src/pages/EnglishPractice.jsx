import React, { useState, useEffect } from 'react';
import '../styles/english-practice.css';

const EnglishPractice = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [showModal, setShowModal] = useState(null);
  const [activeTab, setActiveTab] = useState('grammar-tab');
  const [activeGrammar, setActiveGrammar] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const quizData = [
    {
      question: "She ___ to school every day.",
      options: ["go", "goes", "going", "went"],
      correct: "B"
    },
    {
      question: "I ___ English for 5 years.",
      options: ["study", "studied", "have studied", "am studying"],
      correct: "C"
    },
    {
      question: "If I ___ you, I would study harder.",
      options: ["am", "was", "were", "be"],
      correct: "C"
    },
    {
      question: "This book ___ by a famous author.",
      options: ["wrote", "was written", "is writing", "writes"],
      correct: "B"
    },
    {
      question: "He is the man ___ car was stolen.",
      options: ["who", "which", "whose", "whom"],
      correct: "C"
    }
  ];

  const vocabData = [
    { word: 'Achievement', phonetic: '/əˈtʃiːvmənt/', meaning: 'Thành tựu, sự đạt được', icon: '🏆' },
    { word: 'Environment', phonetic: '/ɪnˈvaɪrənmənt/', meaning: 'Môi trường', icon: '🌍' },
    { word: 'Knowledge', phonetic: '/ˈnɒlɪdʒ/', meaning: 'Kiến thức, sự hiểu biết', icon: '📚' },
    { word: 'Opportunity', phonetic: '/ˌɒpəˈtjuːnəti/', meaning: 'Cơ hội', icon: '🚪' },
    { word: 'Responsibility', phonetic: '/rɪˌspɒnsəˈbɪləti/', meaning: 'Trách nhiệm', icon: '👔' },
    { word: 'Technology', phonetic: '/tekˈnɒlədʒi/', meaning: 'Công nghệ', icon: '💻' },
    { word: 'Communication', phonetic: '/kəˌmjuːnɪˈkeɪʃn/', meaning: 'Giao tiếp, truyền thông', icon: '💬' },
    { word: 'Development', phonetic: '/dɪˈveləpmənt/', meaning: 'Sự phát triển', icon: '📈' }
  ];

  const grammarData = [
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          showResult();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const selectOption = (answer) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      showResult();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const showResult = () => {
    setShowModal('result');
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers([]);
    setTimeLeft(300);
    setShowModal(null);
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleGrammar = (index) => {
    setActiveGrammar(activeGrammar === index ? -1 : index);
  };

  return (
    <div className="english-practice">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo" onClick={() => scrollToSection('hero')}>
            <i className="fas fa-graduation-cap"></i>
            <span>EnglishPro</span>
          </div>
          <ul className="nav-links">
            <li><a href="#hero" onClick={() => scrollToSection('hero')}>Trang chủ</a></li>
            <li><a href="#features" onClick={() => scrollToSection('features')}>Tính năng</a></li>
            <li><a href="#practice" onClick={() => scrollToSection('practice')}>Luyện tập</a></li>
            <li><a href="#vocabulary" onClick={() => scrollToSection('vocabulary')}>Từ vựng</a></li>
            <li><a href="#grammar" onClick={() => scrollToSection('grammar')}>Ngữ pháp</a></li>
            <li><a href="#leaderboard" onClick={() => scrollToSection('leaderboard')}>Xếp hạng</a></li>
          </ul>
          <div className="nav-buttons">
            <button className="btn btn-outline" onClick={() => setShowModal('login')}>Đăng nhập</button>
            <button className="btn btn-primary" onClick={() => setShowModal('register')}>Đăng ký</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="hero">
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
            <div className="hero-card">
              <div className="card-header">
                <div className="card-icon">
                  <i className="fas fa-question-circle"></i>
                </div>
                <div className="card-title">Câu hỏi hôm nay</div>
              </div>
              <div className="quiz-item" onClick={() => scrollToSection('quiz-section')}>
                <div className="quiz-number">1</div>
                <div className="quiz-text">Thì hiện tại hoàn thành</div>
                <i className="fas fa-arrow-right quiz-arrow"></i>
              </div>
              <div className="quiz-item" onClick={() => scrollToSection('quiz-section')}>
                <div className="quiz-number">2</div>
                <div className="quiz-text">Câu bị động</div>
                <i className="fas fa-arrow-right quiz-arrow"></i>
              </div>
              <div className="quiz-item" onClick={() => scrollToSection('quiz-section')}>
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
                <i className="fas fa-book-open"></i>
              </div>
              <h3 className="feature-title">Bài tập đa dạng</h3>
              <p className="feature-description">
                Hàng nghìn bài tập từ cơ bản đến nâng cao, bao gồm tất cả ngữ pháp và từ vựng
              </p>
              <a href="#" className="feature-link">
                Khám phá <i className="fas fa-arrow-right"></i>
              </a>
            </div>
            <div className="feature-card" onClick={() => showToast('Tính năng AI cá nhân hóa đang được mở!')}>
              <div className="feature-icon">
                <i className="fas fa-robot"></i>
              </div>
              <h3 className="feature-title">AI cá nhân hóa</h3>
              <p className="feature-description">
                Hệ thống AI phân tích điểm mạnh, yếu và tạo lộ trình học phù hợp
              </p>
              <a href="#" className="feature-link">
                Tìm hiểu <i className="fas fa-arrow-right"></i>
              </a>
            </div>
            <div className="feature-card" onClick={() => showToast('Tính năng thi thử đang được mở!')}>
              <div className="feature-icon">
                <i className="fas fa-clipboard-check"></i>
              </div>
              <h3 className="feature-title">Thi thử như thật</h3>
              <p className="feature-description">
                Đề thi mô phỏng chính xác format THPT Quốc gia, IELTS, TOEIC
              </p>
              <a href="#" className="feature-link">
                Bắt đầu <i className="fas fa-arrow-right"></i>
              </a>
            </div>
            <div className="feature-card" onClick={() => showToast('Tính năng video bài giảng đang được mở!')}>
              <div className="feature-icon">
                <i className="fas fa-video"></i>
              </div>
              <h3 className="feature-title">Video bài giảng</h3>
              <p className="feature-description">
                Video chất lượng cao từ giáo viên giàu kinh nghiệm, giải thích rõ ràng dễ hiểu
              </p>
              <a href="#" className="feature-link">
                Xem ngay <i className="fas fa-arrow-right"></i>
              </a>
            </div>
            <div className="feature-card" onClick={() => showToast('Tính năng từ vựng thông minh đang được mở!')}>
              <div className="feature-icon">
                <i className="fas fa-brain"></i>
              </div>
              <h3 className="feature-title">Từ vựng thông minh</h3>
              <p className="feature-description">
                Học từ vựng với flashcard, spaced repetition và luyện phát âm
              </p>
              <a href="#" className="feature-link">
                Học ngay <i className="fas fa-arrow-right"></i>
              </a>
            </div>
            <div className="feature-card" onClick={() => showToast('Tính năng cộng đồng đang được mở!')}>
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3 className="feature-title">Cộng đồng năng động</h3>
              <p className="feature-description">
                Kết nối với hàng nghìn học viên, chia sẻ kinh nghiệm và động viên lẫn nhau
              </p>
              <a href="#" className="feature-link">
                Tham gia <i className="fas fa-arrow-right"></i>
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
            <button className={`tab-btn ${activeTab === 'grammar-tab' ? 'active' : ''}`} onClick={() => setActiveTab('grammar-tab')}>
              <i className="fas fa-book"></i> Ngữ pháp
            </button>
            <button className={`tab-btn ${activeTab === 'vocabulary-tab' ? 'active' : ''}`} onClick={() => setActiveTab('vocabulary-tab')}>
              <i className="fas fa-spell-check"></i> Từ vựng
            </button>
            <button className={`tab-btn ${activeTab === 'reading-tab' ? 'active' : ''}`} onClick={() => setActiveTab('reading-tab')}>
              <i className="fas fa-glasses"></i> Đọc hiểu
            </button>
            <button className={`tab-btn ${activeTab === 'listening-tab' ? 'active' : ''}`} onClick={() => setActiveTab('listening-tab')}>
              <i className="fas fa-headphones"></i> Nghe
            </button>
          </div>
          
          {activeTab === 'grammar-tab' && (
            <div className="practice-grid">
              <div className="practice-card" onClick={() => scrollToSection('quiz-section')}>
                <div className="practice-image">
                  <i className="fas fa-clock"></i>
                  <div className="practice-image-content">
                    <h3>12 Thì trong tiếng Anh</h3>
                    <p>Nắm vững tất cả các thì</p>
                  </div>
                </div>
                <div className="practice-body">
                  <h3 className="practice-title">Thì trong tiếng Anh</h3>
                  <p className="practice-description">Học và luyện tập 12 thì cơ bản trong tiếng Anh với bài tập tương tác</p>
                  <div className="practice-meta">
                    <div className="practice-info">
                      <div className="practice-info-item">
                        <i className="fas fa-question-circle"></i>
                        <span>50 câu</span>
                      </div>
                      <div className="practice-info-item">
                        <i className="fas fa-clock"></i>
                        <span>30 phút</span>
                      </div>
                    </div>
                    <button className="btn-practice">Bắt đầu</button>
                  </div>
                </div>
              </div>
              <div className="practice-card" onClick={() => scrollToSection('quiz-section')}>
                <div className="practice-image">
                  <i className="fas fa-exchange-alt"></i>
                  <div className="practice-image-content">
                    <h3>Câu bị động</h3>
                    <p>Passive Voice</p>
                  </div>
                </div>
                <div className="practice-body">
                  <h3 className="practice-title">Câu bị động</h3>
                  <p className="practice-description">Làm chủ câu bị động trong tiếng Anh với các bài tập từ dễ đến khó</p>
                  <div className="practice-meta">
                    <div className="practice-info">
                      <div className="practice-info-item">
                        <i className="fas fa-question-circle"></i>
                        <span>40 câu</span>
                      </div>
                      <div className="practice-info-item">
                        <i className="fas fa-clock"></i>
                        <span>25 phút</span>
                      </div>
                    </div>
                    <button className="btn-practice">Bắt đầu</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vocabulary-tab' && (
            <div className="practice-grid">
              <div className="practice-card" onClick={() => scrollToSection('quiz-section')}>
                <div className="practice-image">
                  <i className="fas fa-home"></i>
                  <div className="practice-image-content">
                    <h3>Gia đình & Nhà cửa</h3>
                    <p>Family & Home</p>
                  </div>
                </div>
                <div className="practice-body">
                  <h3 className="practice-title">Từ vựng gia đình</h3>
                  <p className="practice-description">Học từ vựng về gia đình, mối quan hệ và nhà cửa</p>
                  <div className="practice-meta">
                    <div className="practice-info">
                      <div className="practice-info-item">
                        <i className="fas fa-book"></i>
                        <span>100 từ</span>
                      </div>
                      <div className="practice-info-item">
                        <i className="fas fa-clock"></i>
                        <span>45 phút</span>
                      </div>
                    </div>
                    <button className="btn-practice">Học ngay</button>
                  </div>
                </div>
              </div>
              <div className="practice-card" onClick={() => scrollToSection('quiz-section')}>
                <div className="practice-image">
                  <i className="fas fa-briefcase"></i>
                  <div className="practice-image-content">
                    <h3>Công việc</h3>
                    <p>Jobs & Work</p>
                  </div>
                </div>
                <div className="practice-body">
                  <h3 className="practice-title">Từ vựng công việc</h3>
                  <p className="practice-description">Từ vựng về nghề nghiệp, nơi làm việc và các hoạt động công việc</p>
                  <div className="practice-meta">
                    <div className="practice-info">
                      <div className="practice-info-item">
                        <i className="fas fa-book"></i>
                        <span>80 từ</span>
                      </div>
                      <div className="practice-info-item">
                        <i className="fas fa-clock"></i>
                        <span>40 phút</span>
                      </div>
                    </div>
                    <button className="btn-practice">Học ngay</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reading-tab' && (
            <div className="practice-grid">
              <div className="practice-card" onClick={() => scrollToSection('quiz-section')}>
                <div className="practice-image">
                  <i className="fas fa-newspaper"></i>
                  <div className="practice-image-content">
                    <h3>Báo chí & Truyền thông</h3>
                    <p>News & Media</p>
                  </div>
                </div>
                <div className="practice-body">
                  <h3 className="practice-title">Đọc báo tiếng Anh</h3>
                  <p className="practice-description">Luyện đọc hiểu qua các bài báo thực tế với câu hỏi trắc nghiệm</p>
                  <div className="practice-meta">
                    <div className="practice-info">
                      <div className="practice-info-item">
                        <i className="fas fa-file-alt"></i>
                        <span>5 bài</span>
                      </div>
                      <div className="practice-info-item">
                        <i className="fas fa-clock"></i>
                        <span>60 phút</span>
                      </div>
                    </div>
                    <button className="btn-practice">Đọc ngay</button>
                  </div>
                </div>
              </div>
              <div className="practice-card" onClick={() => scrollToSection('quiz-section')}>
                <div className="practice-image">
                  <i className="fas fa-flask"></i>
                  <div className="practice-image-content">
                    <h3>Khoa học</h3>
                    <p>Science</p>
                  </div>
                </div>
                <div className="practice-body">
                  <h3 className="practice-title">Đọc hiểu khoa học</h3>
                  <p className="practice-description">Các bài đọc về khoa học, công nghệ và khám phá</p>
                  <div className="practice-meta">
                    <div className="practice-info">
                      <div className="practice-info-item">
                        <i className="fas fa-file-alt"></i>
                        <span>4 bài</span>
                      </div>
                      <div className="practice-info-item">
                        <i className="fas fa-clock"></i>
                        <span>50 phút</span>
                      </div>
                    </div>
                    <button className="btn-practice">Đọc ngay</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'listening-tab' && (
            <div className="practice-grid">
              <div className="practice-card" onClick={() => scrollToSection('quiz-section')}>
                <div className="practice-image">
                  <i className="fas fa-podcast"></i>
                  <div className="practice-image-content">
                    <h3>Hội thoại</h3>
                    <p>Conversations</p>
                  </div>
                </div>
                <div className="practice-body">
                  <h3 className="practice-title">Luyện nghe hội thoại</h3>
                  <p className="practice-description">Nghe và hiểu hội thoại hàng ngày, nâng cao khả năng nghe hiểu</p>
                  <div className="practice-meta">
                    <div className="practice-info">
                      <div className="practice-info-item">
                        <i className="fas fa-headphones"></i>
                        <span>10 bài</span>
                      </div>
                      <div className="practice-info-item">
                        <i className="fas fa-clock"></i>
                        <span>45 phút</span>
                      </div>
                    </div>
                    <button className="btn-practice">Nghe ngay</button>
                  </div>
                </div>
              </div>
              <div className="practice-card" onClick={() => scrollToSection('quiz-section')}>
                <div className="practice-image">
                  <i className="fas fa-microphone-alt"></i>
                  <div className="practice-image-content">
                    <h3>IELTS Listening</h3>
                    <p>Academic</p>
                  </div>
                </div>
                <div className="practice-body">
                  <h3 className="practice-title">IELTS Listening</h3>
                  <p className="practice-description">Luyện nghe IELTS với format chính thức và đáp án chi tiết</p>
                  <div className="practice-meta">
                    <div className="practice-info">
                      <div className="practice-info-item">
                        <i className="fas fa-headphones"></i>
                        <span>4 sections</span>
                      </div>
                      <div className="practice-info-item">
                        <i className="fas fa-clock"></i>
                        <span>30 phút</span>
                      </div>
                    </div>
                    <button className="btn-practice">Luyện ngay</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quiz Section */}
      <section className="quiz-section" id="quiz-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Kiểm tra</div>
            <h2 className="section-title">Làm bài <span>kiểm tra</span></h2>
            <p className="section-description">Kiểm tra kiến thức của bạn ngay bây giờ</p>
          </div>
          <div className="quiz-container">
            <div className="quiz-box">
              <div className="quiz-header">
                <div className="quiz-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}></div>
                  </div>
                  <span className="progress-text">{currentQuestion + 1}/{quizData.length}</span>
                </div>
                <div className="quiz-timer">
                  <i className="fas fa-clock"></i>
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>
              <div className="quiz-question">
                <div className="question-number">Câu {currentQuestion + 1}</div>
                <div className="question-text">{quizData[currentQuestion].question}</div>
              </div>
              <div className="quiz-options">
                {quizData[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-btn ${userAnswers[currentQuestion] === ['A', 'B', 'C', 'D'][index] ? 'selected' : ''}`}
                    onClick={() => selectOption(['A', 'B', 'C', 'D'][index])}
                  >
                    <span className="option-letter">{['A', 'B', 'C', 'D'][index]}</span>
                    <span>{option}</span>
                  </button>
                ))}
              </div>
              <div className="quiz-footer">
                <button className="btn-quiz btn-quiz-prev" onClick={prevQuestion} disabled={currentQuestion === 0}>
                  <i className="fas fa-arrow-left"></i> Câu trước
                </button>
                <button className="btn-quiz btn-quiz-next" onClick={nextQuestion}>
                  {currentQuestion === quizData.length - 1 ? 'Hoàn thành' : 'Câu tiếp'} 
                  {currentQuestion === quizData.length - 1 ? <i className="fas fa-check"></i> : <i className="fas fa-arrow-right"></i>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vocabulary Section */}
      <section className="vocabulary" id="vocabulary">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Từ vựng</div>
            <h2 className="section-title">Học <span>từ vựng</span> mỗi ngày</h2>
            <p className="section-description">Mở rộng vốn từ vựng với phương pháp học hiệu quả</p>
          </div>
          <div className="vocab-grid">
            {vocabData.map((vocab, index) => (
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
            <p className="section-description">Hệ thống ngữ pháp tiếng Anh toàn diện và dễ hiểu</p>
          </div>
          <div className="grammar-accordion">
            {grammarData.map((grammar, index) => (
              <div key={index} className={`grammar-item ${activeGrammar === index ? 'active' : ''}`}>
                <div className="grammar-header" onClick={() => toggleGrammar(index)}>
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
                              {ex.tense && <span>{ex.tense}:</span>} {ex.example}
                              {ex.pronoun && <span>{ex.pronoun}:</span>}
                              {ex.type && <span>{ex.type}:</span>}
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
            <p className="section-description">Cạnh tranh lành mạnh, cùng nhau tiến bộ</p>
          </div>
          <div className="leaderboard-container">
            <div className="leaderboard-table">
              <div className="leaderboard-header">
                <div>Hạng</div>
                <div>Học viên</div>
                <div>Điểm</div>
                <div>Streak</div>
              </div>
              {[
                { rank: 1, name: 'Nguyễn An', level: 25, score: 9850, streak: 45, avatar: 'NA' },
                { rank: 2, name: 'Trần Bình', level: 23, score: 9520, streak: 38, avatar: 'TB' },
                { rank: 3, name: 'Lê Chi', level: 22, score: 9350, streak: 32, avatar: 'LC' },
                { rank: 4, name: 'Phạm Dũng', level: 21, score: 9120, streak: 28, avatar: 'PD' },
                { rank: 5, name: 'Hoàng Em', level: 20, score: 8950, streak: 25, avatar: 'HE' }
              ].map((user, index) => (
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
              <button className="btn-cta btn-cta-primary" onClick={() => setShowModal('register')}>
                <i className="fas fa-rocket"></i> Bắt đầu miễn phí
              </button>
              <button className="btn-cta btn-cta-secondary" onClick={() => scrollToSection('features')}>
                <i className="fas fa-play-circle"></i> Xem demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <i className="fas fa-graduation-cap"></i> EnglishPro
              </div>
              <p className="footer-description">
                Nền tảng học tiếng Anh hàng đầu Việt Nam, giúp hàng nghìn học viên chinh phục mục tiêu tiếng Anh.
              </p>
              <div className="footer-social">
                <a href="#" className="social-btn" onClick={() => showToast('Facebook')}>
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="social-btn" onClick={() => showToast('YouTube')}>
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="#" className="social-btn" onClick={() => showToast('Instagram')}>
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="social-btn" onClick={() => showToast('TikTok')}>
                  <i className="fab fa-tiktok"></i>
                </a>
              </div>
            </div>
            <div className="footer-column">
              <h4>Sản phẩm</h4>
              <ul className="footer-links">
                <li><a href="#" onClick={() => showToast('Luyện thi THPT')}>Luyện thi THPT</a></li>
                <li><a href="#" onClick={() => showToast('IELTS Preparation')}>IELTS Preparation</a></li>
                <li><a href="#" onClick={() => showToast('TOEIC Practice')}>TOEIC Practice</a></li>
                <li><a href="#" onClick={() => showToast('Tiếng Anh giao tiếp')}>Tiếng Anh giao tiếp</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Hỗ trợ</h4>
              <ul className="footer-links">
                <li><a href="#" onClick={() => showToast('Trung tâm trợ giúp')}>Trung tâm trợ giúp</a></li>
                <li><a href="#" onClick={() => showToast('Liên hệ')}>Liên hệ</a></li>
                <li><a href="#" onClick={() => showToast('FAQ')}>FAQ</a></li>
                <li><a href="#" onClick={() => showToast('Góp ý')}>Góp ý</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Công ty</h4>
              <ul className="footer-links">
                <li><a href="#" onClick={() => showToast('Về chúng tôi')}>Về chúng tôi</a></li>
                <li><a href="#" onClick={() => showToast('Tuyển dụng')}>Tuyển dụng</a></li>
                <li><a href="#" onClick={() => showToast('Điều khoản')}>Điều khoản</a></li>
                <li><a href="#" onClick={() => showToast('Bảo mật')}>Bảo mật</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 EnglishPro. All rights reserved.</p>
          </div>
        </div>
      </footer>

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
            <form onSubmit={(e) => { e.preventDefault(); setShowModal(null); showToast('Đăng nhập thành công!'); }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="Nhập email của bạn" required />
              </div>
              <div className="form-group">
                <label className="form-label">Mật khẩu</label>
                <input type="password" className="form-input" placeholder="Nhập mật khẩu" required />
              </div>
              <button type="submit" className="form-submit">Đăng nhập</button>
            </form>
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
            <form onSubmit={(e) => { e.preventDefault(); setShowModal(null); showToast('Đăng ký thành công!'); }}>
              <div className="form-group">
                <label className="form-label">Họ và tên</label>
                <input type="text" className="form-input" placeholder="Nhập họ và tên" required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="Nhập email của bạn" required />
              </div>
              <div className="form-group">
                <label className="form-label">Mật khẩu</label>
                <input type="password" className="form-input" placeholder="Tạo mật khẩu" required />
              </div>
              <div className="form-group">
                <label className="form-label">Xác nhận mật khẩu</label>
                <input type="password" className="form-input" placeholder="Nhập lại mật khẩu" required />
              </div>
              <button type="submit" className="form-submit">Đăng ký</button>
            </form>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {showModal === 'result' && (
        <div className="modal active">
          <div className="modal-content">
            <div className="result-icon">
              <i className="fas fa-trophy"></i>
            </div>
            <div className="result-score">
              <h3>{Math.round((userAnswers.filter((a, i) => a === quizData[i].correct).length / quizData.length) * 100)}/100</h3>
              <p>Chúc mừng bạn đã hoàn thành bài kiểm tra!</p>
            </div>
            <div className="result-details">
              <div className="result-detail-item">
                <div className="result-detail-value">{userAnswers.filter((a, i) => a === quizData[i].correct).length}</div>
                <div className="result-detail-label">Câu đúng</div>
              </div>
              <div className="result-detail-item">
                <div className="result-detail-value">{quizData.length - userAnswers.filter((a, i) => a === quizData[i].correct).length}</div>
                <div className="result-detail-label">Câu sai</div>
              </div>
              <div className="result-detail-item">
                <div className="result-detail-value">{formatTime(300 - timeLeft)}</div>
                <div className="result-detail-label">Thời gian</div>
              </div>
            </div>
            <button className="form-submit" onClick={resetQuiz}>
              Làm lại bài kiểm tra
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast show ${toast.type}`}>
          <i className="fas fa-check-circle"></i>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default EnglishPractice;