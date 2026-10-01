import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import CourseView from './pages/CourseView';
import LessonView from './pages/LessonView';
import DownloadsPage from './pages/DownloadsPage';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherCourses from './pages/TeacherCourses';
import TeacherCourseManage from './pages/TeacherCourseManage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          
          <Route path="/student" element={<Layout userType="student" />}>
            <Route index element={<StudentDashboard />} />
            <Route path="courses" element={<StudentDashboard />} /> {/* Simplified for demo */}
            <Route path="course/:id" element={<CourseView />} />
            <Route path="lesson/:id" element={<LessonView />} />
            <Route path="downloads" element={<DownloadsPage />} />
          </Route>

          <Route path="/teacher" element={<Layout userType="teacher" />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="courses" element={<TeacherCourses />} />
            <Route path="courses/:id" element={<TeacherCourseManage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
