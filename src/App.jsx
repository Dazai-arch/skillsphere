import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Homepage          from './pages/home/HomePage';
import SignInPage        from './pages/auth/SignInPage';
import GetStartedPage    from './pages/auth/GetStartedPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ProfileBuilderPage    from './pages/profile-builder/ProfileBuilderPage';
import StudentDashboardPage from './pages/user/StudentDashboardPage';
import CareerRoadmapPage   from './pages/user/CareerRoadmapPage';
import ProfilePage         from './pages/user/ProfilePage';
import JobsPage            from './pages/user/JobsPage';
import CompanyDashboardPage from './pages/company/CompanyDashboardPage';
import CompanyProfilePage   from './pages/company/CompanyProfilePage';
import PostJobPage          from './pages/company/PostJobPage';
import CandidateLayout      from './layouts/CandidateLayout';
import CompanyLayout        from './layouts/CompanyLayout';
import { JobsProvider }     from './context/JobsContext';

/* ══════════════════════════════════════════════════
   ProtectedRoute
   — Not signed in           → /signin
   — Signed in, candidate,
     profile not completed   → /profile-builder
   — Signed in, company      → children (company dashboard)
   — Signed in, candidate,
     profile complete        → children (candidate dashboard)
══════════════════════════════════════════════════ */
function ProtectedRoute({ children, requireRole }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div style={{ position: 'relative', zIndex: 9999, display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg-page)' }}>
      <div style={{ width:36, height:36, border:'3px solid var(--border-card)', borderTopColor:'var(--text-primary)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!user) return <Navigate to="/signin" replace />;

  // Candidate who hasn't completed profile → force profile builder
  // (skip this check if we're already ON the profile builder, or we'll
  // redirect to ourselves forever and never render the page)
  if (user.role === 'candidate' && !user.profileCompleted && location.pathname !== '/profile-builder') {
    return <Navigate to="/profile-builder" replace />;
  }

  // Role guard (optional — pass requireRole="company" to company-only routes)
  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

/* ══════════════════════════════════════════════════
   GuestRoute — redirects signed-in users away from
   auth pages (signin, get-started, forgot-password).
══════════════════════════════════════════════════ */
function GuestRoute({ children }) {
  return children;
}

/* ══════════════════════════════════════════════════
   APP
══════════════════════════════════════════════════ */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <JobsProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Homepage />} />

          {/* Auth pages — redirect away if already signed in */}
          <Route path="/signin"          element={<GuestRoute><SignInPage /></GuestRoute>} />
          <Route path="/get-started"     element={<GuestRoute><GetStartedPage /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />

          {/* Profile builder — candidates only, before dashboard */}
          <Route path="/profile-builder" element={
            <ProtectedRoute>
              <ProfileBuilderPage />
            </ProtectedRoute>
          } />

          {/* Candidate area — Sidebar/Topbar mount once via CandidateLayout
              and stay mounted while these child pages swap via <Outlet/> */}
          <Route element={
            <ProtectedRoute requireRole="candidate">
              <CandidateLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard/candidate" element={<StudentDashboardPage />} />
            <Route path="/roadmap"             element={<CareerRoadmapPage />} />
            <Route path="/jobs"                element={<JobsPage />} />
            <Route path="/profile"             element={<ProfilePage />} />
          </Route>

          {/* Company area — same persistent-layout pattern */}
          <Route element={
            <ProtectedRoute requireRole="company">
              <CompanyLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard/company" element={<CompanyDashboardPage />} />
            <Route path="/company-profile"   element={<CompanyProfilePage />} />
            <Route path="/postings"          element={<PostJobPage />} />
          </Route>

        </Routes>
      </JobsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;