// src/config/api.config.js
const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'https://ltta-api.onrender.com',

    ENDPOINTS: {
        // Auth Endpoints
        LOGIN: 'api/auth/login',
        LOGOUT: 'api/auth/logout',
        REGISTER: 'api/auth/register',
        REFRESH_TOKEN: 'api/auth/refresh-token',
        CHANGE_PASSWORD: 'api/auth/change-password',
        FORGOT_PASSWORD: 'api/auth/forgot-password',
        RESET_PASSWORD: 'api/auth/reset-password',

        // Profile Endpoints
        GET_PROFILE: 'api/profile',
        UPDATE_PROFILE: 'api/profile',

        // User Management Endpoints
        GET_USERS: 'api/users',
        GET_USER: 'api/users/{id}',
        CREATE_USER: 'api/users',
        UPDATE_USER: 'api/users/{id}',
        LOCK_USER: 'api/users/{id}/deactivate',
        UNLOCK_USER: 'api/users/{id}/activate',
        ASSIGN_ROLE: 'api/users/{id}/role',

        // Reading Passages
        READING_PASSAGES: 'api/reading-passages',
        GET_READING_PASSAGE: 'api/reading-passages/{id}',
        CREATE_READING_PASSAGE: 'api/reading-passages',
        UPDATE_READING_PASSAGE: 'api/reading-passages/{id}',
        DELETE_READING_PASSAGE: 'api/reading-passages/{id}',

        // Questions
        QUESTIONS: 'api/questions',
        GET_QUESTION: 'api/questions/{id}',
        CREATE_QUESTION: 'api/questions',
        UPDATE_QUESTION: 'api/questions/{id}',
        DELETE_QUESTION: 'api/questions/{id}',

        // Exam Endpoints (thêm sau)
        GET_EXAM_TEMPLATES: 'api/exam-templates',
        GET_MATRIX_RULES: 'api/matrix-rules',
        GET_SCHEDULED_EXAMS: 'api/scheduled-exams',
        GET_QUESTIONS: 'api/questions',
        GET_ADMIN_STATISTICS: 'api/admin/statistics',
        GET_EXAMS: 'api/exams',

        // Exam Attempts
        CREATE_EXAM_ATTEMPT: 'api/exam-attempts',
        GET_EXAM_ATTEMPTS: 'api/exam-attempts',

        // Exam Matrix
        EXAM_MATRICES: 'api/exam-matrices',
        GET_EXAM_MATRIX: 'api/exam-matrices/{id}',
        CREATE_EXAM_MATRIX: 'api/exam-matrices',
        UPDATE_EXAM_MATRIX: 'api/exam-matrices/{id}',
        DELETE_EXAM_MATRIX: 'api/exam-matrices/{id}',
        GET_SKILL_DISTRIBUTIONS: 'api/exam-matrices/{id}/skill-distributions',
        UPDATE_SKILL_DISTRIBUTIONS: 'api/exam-matrices/{id}/skill-distributions',
        VALIDATE_EXAM_MATRIX: 'api/exam-matrices/{id}/validate',

        // Thêm vào phần Exam Endpoints
        GET_EXAMS: 'api/exams',
        GET_EXAM: 'api/exams/{id}',
        CREATE_EXAM: 'api/exams',
        UPDATE_EXAM: 'api/exams/{id}',
        DELETE_EXAM: 'api/exams/{id}',
        ACTIVATE_EXAM: 'api/exams/{id}/activate',
        DEACTIVATE_EXAM: 'api/exams/{id}/deactivate',
        GET_SCORE_DISTRIBUTION: 'api/exams/{id}/score-distribution',

        // Exam Endpoints
        GET_EXAMS: 'api/exams',
        GET_EXAM: 'api/exams/{id}',
        CREATE_EXAM: 'api/exams',
        UPDATE_EXAM: 'api/exams/{id}',
        DELETE_EXAM: 'api/exams/{id}',
        ACTIVATE_EXAM: 'api/exams/{id}/activate',
        DEACTIVATE_EXAM: 'api/exams/{id}/deactivate',
        GET_SCORE_DISTRIBUTION: 'api/exams/{id}/score-distribution',

        // Exam Codes
        GET_EXAM_CODES: 'api/exams/{examId}/codes',

        // Exam Attempts
        CREATE_EXAM_ATTEMPT: 'api/exam-attempts',
        GET_EXAM_ATTEMPTS: 'api/exam-attempts',   // nếu cần
        SAVE_ANSWERS: 'api/exam-attempts/{id}/answers',
        SUBMIT_ATTEMPT: 'api/exam-attempts/{id}/submit',
        GET_REMAINING_TIME: 'api/exam-attempts/{id}/remaining-time',

        // Exam Results
        GET_RESULT: 'api/exam-results/{attemptId}',
        
        // Progress History
        PROGRESS_HISTORY: 'api/progress/history',
    }
};

export default API_CONFIG;