import React from 'react';
import { Link } from 'react-router-dom';
import useTheme from '../../hooks/useTheme';

/* ─── Homepage-matching Logo ─── */
export function Logo({ size = 36 }) {
  const id = React.useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id={`la${id}`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee"/><stop offset="1" stopColor="#818cf8"/>
        </linearGradient>
        <linearGradient id={`lb${id}`} x1="40" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f472b6"/><stop offset="1" stopColor="#a78bfa"/>
        </linearGradient>
        <radialGradient id={`rc${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="19" fill={`url(#rc${id})`}/>
      <path d="M20 4 A16 16 0 0 1 36 20" stroke={`url(#la${id})`} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M20 36 A16 16 0 0 1 4 20"  stroke={`url(#lb${id})`} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <circle cx="20" cy="20" r="10" stroke="rgba(99,102,241,0.2)" strokeWidth="1" fill="none"/>
      <circle cx="20" cy="4"  r="2.5" fill="#22d3ee"/>
      <circle cx="36" cy="20" r="2"   fill="#818cf8"/>
      <circle cx="20" cy="36" r="2.5" fill="#f472b6"/>
      <circle cx="4"  cy="20" r="2"   fill="#a78bfa"/>
      <line x1="20" y1="12" x2="20" y2="28" stroke="rgba(99,102,241,0.2)" strokeWidth="1"/>
      <line x1="12" y1="20" x2="28" y2="20" stroke="rgba(99,102,241,0.2)" strokeWidth="1"/>
      <circle cx="20" cy="20" r="4" fill={`url(#la${id})`}/>
      <circle cx="20" cy="20" r="2" fill="white"/>
    </svg>
  );
}

/* ─── SkillSphere wordmark ─── */
export function SkillSphereLogo({ size = 36 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.45rem' }}>
      <Logo size={size} />
      <span style={{
        fontSize: size > 30 ? '1.2rem' : '1rem',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        color: 'var(--text-primary)',
        fontFamily: "'Outfit', system-ui, sans-serif",
      }}>
        Skill<span style={{
          backgroundImage: 'linear-gradient(90deg,#22d3ee,#818cf8,#f472b6,#22d3ee)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'shimmer 4s linear infinite',
        }}>Sphere</span>
      </span>
    </div>
  );
}

/* ─── Theme toggle ─── */
function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="auth-theme-toggle"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

/* ─── Full-page auth layout — inherits homepage background ─── */
export default function AuthLayout({ children, backTo = '/', backLabel = 'Back to Home' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="auth-root">
      {/* Top bar */}
      <div className="auth-topbar">
        <Link to={backTo} className="auth-back-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {backLabel}
        </Link>
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </div>

      {/* Centered card */}
      <div className="auth-center">
        <div className="auth-card">
          {/* Homepage logo */}
          <div className="auth-logo-block">
            <SkillSphereLogo size={40} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}