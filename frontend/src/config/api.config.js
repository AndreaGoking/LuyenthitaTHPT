// src/config/api.config.js
const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'https://localhost:7001',

    ENDPOINTS: {
        // Auth Endpoints
        LOGIN: 'api/auth/login',
        LOGOUT: 'api/auth/logout',
        REGISTER: 'api/auth/register',
        REFRESH_TOKEN: 'api/auth/refresh-token',

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

        // Exam Endpoints (thêm sau)
        GET_EXAM_TEMPLATES: 'api/exam-templates',
        GET_MATRIX_RULES: 'api/matrix-rules',
        GET_SCHEDULED_EXAMS: 'api/scheduled-exams',
        GET_QUESTIONS: 'api/questions',
        GET_ADMIN_STATISTICS: 'api/admin/statistics',
    }
};

export default API_CONFIG;