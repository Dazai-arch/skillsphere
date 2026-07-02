<<<<<<< Updated upstream
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
=======
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { getAccessToken, getMe } from './services/api';
>>>>>>> Stashed changes

import Homepage          from './pages/homepage';
import SignInPage        from './pages/SignInPage';
import GetStartedPage    from './pages/GetStartedPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfileBuilderPage from './pages/profile-builder/ProfileBuilderPage';

/* ══════════════════════════════════════════════════
   useAuth — fetches current user once on mount.
   Returns { user, loading }.
   user is null if not signed in.
══════════════════════════════════════════════════ */
function useAuth() {
  const [user, setUser]       = useState(undefined); // undefined = still loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getAccessToken()) { setUser(null); setLoading(false); return; }
    getMe()
      .then(u => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}

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
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#0f0f1a' }}>
      <div style={{ width:36, height:36, border:'3px solid #6366f1', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
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
  const [count, setCount] = useState(0)

  return (
<<<<<<< Updated upstream
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
=======
    <BrowserRouter>
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

        {/* Dashboard stubs — replace with real components later */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <div style={{ color:'white', padding:40 }}>Dashboard coming soon</div>
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
>>>>>>> Stashed changes
}

export default App
