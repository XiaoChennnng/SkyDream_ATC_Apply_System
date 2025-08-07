import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/layout';
import { LoginPage } from '@/pages/login';
import { RegisterPage } from '@/pages/register';
import { HomePage } from '@/pages/home';
import { ProfilePage } from '@/pages/profile';
import { ApplicationPage } from '@/pages/application';
import { ApplicationsReviewPage } from '@/pages/applications-review';
import { ActivityPage } from '@/pages/activity';
import { ExamPage } from '@/pages/exam';
import { ExamsManagementPage } from '@/pages/exams-management';
import { ActivitiesManagementPage } from '@/pages/activities-management';
import { AccountManagementPage } from '@/pages/account-management';
import { CreditSystemPage } from '@/pages/credit-system';
import { SystemManagementPage } from '@/pages/system-management';
import { ProtectedRoute } from '@/components/protected-route';
import { AuthProvider } from '@/contexts/auth-provider';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            
            <Route path="profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            <Route path="application" element={
              <ProtectedRoute requiredRole={['applicant']}>
                <ApplicationPage />
              </ProtectedRoute>
            } />
            
            <Route path="exam" element={
              <ProtectedRoute requiredRole={['applicant']}>
                <ExamPage />
              </ProtectedRoute>
            } />
            
            <Route path="activity" element={
              <ProtectedRoute requiredRole={['applicant']}>
                <ActivityPage />
              </ProtectedRoute>
            } />
            
            <Route path="applications-review" element={
              <ProtectedRoute requiredRole={['teacher', 'admin']}>
                <ApplicationsReviewPage />
              </ProtectedRoute>
            } />
            
            <Route path="exams-management" element={
              <ProtectedRoute requiredRole={['teacher', 'admin']}>
                <ExamsManagementPage />
              </ProtectedRoute>
            } />
            
            <Route path="activities-management" element={
              <ProtectedRoute requiredRole={['teacher', 'admin']}>
                <ActivitiesManagementPage />
              </ProtectedRoute>
            } />
            
            <Route path="credit-system" element={
              <ProtectedRoute requiredRole={['teacher', 'admin']}>
                <CreditSystemPage />
              </ProtectedRoute>
            } />
            
            <Route path="account-management" element={
              <ProtectedRoute requiredRole={['admin']}>
                <AccountManagementPage />
              </ProtectedRoute>
            } />
            
            <Route path="system-management" element={
              <ProtectedRoute requiredRole={['admin']}>
                <SystemManagementPage />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;