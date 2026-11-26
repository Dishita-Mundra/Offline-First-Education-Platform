/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OfflineProvider } from './context/OfflineContext';
import AdminDashboard from './dashboards/AdminDashboard';
import StudentDashboard from './dashboards/StudentDashboard';
import TeacherDashboard from './dashboards/TeacherDashboard';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import ParentReportPage from './pages/ParentReportPage';
import type { UserRole } from './types/curriculum';

function ProtectedRoute({ allowedRoles, children }: { allowedRoles: UserRole[]; children: ReactNode }) {
  const { firebaseUser, adminToken, profile, loading, needsOnboarding } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFBFD] flex items-center justify-center text-sm font-medium text-[#0F2744]">
        Loading Indo American School Portal...
      </div>
    );
  }

  const hasAdminSession = Boolean(adminToken && profile?.role === 'admin');
  if (!firebaseUser && !hasAdminSession) {
    return <Navigate to="/login" replace />;
  }

  if (needsOnboarding || !profile) {
    return <Navigate to="/register" replace />;
  }

  if (!allowedRoles.includes(profile.role)) {
    const home =
      profile.role === 'admin' ? '/admin' : profile.role === 'teacher' ? '/teacher' : '/student';
    return <Navigate to={home} replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <OfflineProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<AuthPage mode="login" />} />
              <Route path="/admin-login" element={<AuthPage mode="login" initialPortal="admin" />} />
              <Route path="/register" element={<AuthPage mode="register" />} />
              <Route path="/parent-report/:reportId" element={<ParentReportPage />} />

              <Route
                path="/student/*"
                element={
                  <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/*"
                element={
                  <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </OfflineProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

