import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './styles/modern-design.css';

import HomePage from "./pages/HomePage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import TeacherDashboard from "./pages/teacher/TeacherDashboard.jsx";
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import ExamTaking from "./pages/ExamTaking.jsx";
import Students from "./pages/Students.jsx";
import Teachers from "./pages/Teachers.jsx";
import Courses from "./pages/Courses.jsx";
import EnglishPractice from "./pages/EnglishPractice.jsx";
import Profile from "./pages/Profile.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { AdminRoute, TeacherRoute, StudentRoute } from "./components/ProtectedRoute.jsx";
import { isAuthenticated, getUserRole } from "./utils/auth";

// Route dành cho mọi user đã đăng nhập (bất kỳ role nào)
function AuthRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Component để redirect user đã đăng nhập về dashboard tương ứng
function LoginRoute() {
  if (isAuthenticated()) {
    const role = getUserRole();
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'teacher') return <Navigate to="/teacher" replace />;
    if (role === 'student') return <Navigate to="/student" replace />;
  }
  return <Login />;
}

function RegisterRoute() {
  if (isAuthenticated()) {
    const role = getUserRole();
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'teacher') return <Navigate to="/teacher" replace />;
    if (role === 'student') return <Navigate to="/student" replace />;
  }
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginRoute />} />
            <Route path="/register" element={<RegisterRoute />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={
              <AuthRoute>
                <Profile />
              </AuthRoute>
            } />
            
            {/* Protected routes - Admin only */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/students" element={
              <AdminRoute>
                <Students />
              </AdminRoute>
            } />
            <Route path="/teachers" element={
              <AdminRoute>
                <Teachers />
              </AdminRoute>
            } />
            
            {/* Protected routes - Teacher and Admin */}
            <Route path="/teacher" element={
              <TeacherRoute>
                <TeacherDashboard />
              </TeacherRoute>
            } />
            <Route path="/courses" element={
              <TeacherRoute>
                <Courses />
              </TeacherRoute>
            } />
            
            {/* Protected routes - Student only */}
            <Route path="/student" element={
              <StudentRoute>
                <StudentDashboard />
              </StudentRoute>
            } />
            <Route path="/exam/:examId" element={
              <StudentRoute>
                <ExamTaking />
              </StudentRoute>
            } />
            <Route path="/english-practice" element={
              <StudentRoute>
                <EnglishPractice />
              </StudentRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
