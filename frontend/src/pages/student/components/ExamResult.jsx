// src/pages/student/components/ExamResult.jsx
import React from 'react';

const ExamResult = ({ result, onBack }) => {
  if (!result) return null;

  // Dựa vào cấu trúc dữ liệu, giả sử result có:
  // { score, correctCount, wrongCount, totalQuestions, ... }
  const { score, correctCount, wrongCount, totalQuestions } = result;

  return (
    <div className="exam-result">
      <h2>Kết quả bài thi</h2>
      <div className="result-summary">
        <div className="result-item">
          <span className="label">Điểm</span>
          <span className="value">{score} / 10</span>
        </div>
        <div className="result-item">
          <span className="label">Số câu đúng</span>
          <span className="value">{correctCount} / {totalQuestions}</span>
        </div>
        <div className="result-item">
          <span className="label">Số câu sai</span>
          <span className="value">{wrongCount}</span>
        </div>
        <div className="result-item">
          <span className="label">Tỷ lệ đúng</span>
          <span className="value">{((correctCount / totalQuestions) * 100).toFixed(1)}%</span>
        </div>
      </div>
      <button className="btn btn-primary" onClick={onBack}>
        Quay lại danh sách kỳ thi
      </button>
    </div>
  );
};

export default ExamResult;