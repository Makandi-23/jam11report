import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { I18nProvider } from './contexts/I18nContext';
import AdminLayout from './components/layout/AdminLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminReportsPage from './pages/AdminReportsPage';
import AdminWardInsightsPage from './pages/AdminWardInsightsPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import AdminResidentsPage from './pages/AdminResidentsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import ProfilePage from './pages/ProfilePage';
import ReportsPage from './pages/ReportsPage';
import ReportDetailsPage from './pages/ReportDetailsPage';
import ReportNewPage from './pages/ReportNewPage';
import ContactPage from './pages/ContactPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import AdminAnnouncementsPage from './pages/AdminAnnouncementsPage';
import MyReportsPage from './pages/MyReportsPage';
import SuspensionAlert from './components/SuspensionAlert';
import DepartmentDashboard from './components/DepartmentDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pale flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pale flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    // 🆕 ENHANCED REDIRECT LOGIC WITH DEPARTMENT SUPPORT
    if (user.role === 'admin') {
      if (user.department === 'all') {
        return <Navigate to="/admin" replace />; // Super Admin
      } else {
        return <Navigate to="/admin/department" replace />; // Department Admin
      }
    }
    return <Navigate to="/dashboard" replace />; // Regular user
  }

  return <>{children}</>;
};
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={
        <PublicRoute>
          <LandingPage />
        </PublicRoute>
      } />
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboardPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
         <Route path="department" element={<DepartmentDashboard />} /> {/* 🆕 ADD THIS LINE */}
        <Route path="map" element={<AdminWardInsightsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="residents" element={<AdminResidentsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="announcements" element={<AdminAnnouncementsPage />} />
      </Route>

      <Route path="/reports" element={
        <ProtectedRoute>
          <ReportsPage />
        </ProtectedRoute>
      } />
      <Route path="/reports/:id" element={
        <ProtectedRoute>
          <ReportDetailsPage />
        </ProtectedRoute>
      } />
      <Route path="/my-reports" element={
        <ProtectedRoute>
          <MyReportsPage />
        </ProtectedRoute>
      } />
      <Route path="/report" element={
        <ProtectedRoute>
          <ReportNewPage />
        </ProtectedRoute>
      } />
      <Route path="/contact" element={
        <ProtectedRoute>
          <ContactPage />
        </ProtectedRoute>
      } />
      <Route path="/announcements" element={
        <ProtectedRoute>
          <AnnouncementsPage />
        </ProtectedRoute>
      } />
      <Route path="*" element={
        <div className="min-h-screen bg-pale flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-gray-600 mb-8">Page not found</p>
            <a href="/" className="btn-primary">Go Home</a>
          </div>
        </div>
      } />
    </Routes>
  );
};

function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <SuspensionAlert />
        
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </I18nProvider>
    
  );
}

export default App;