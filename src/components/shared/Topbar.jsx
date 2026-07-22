import React from 'react';
import useTheme from '../../hooks/useTheme';
import { SkillSphereLogo, Logo } from './Logo';

export const LogoMark = Logo;

const IconBell = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IconSun = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);
const IconMoon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

export default function Topbar({ role = 'Candidate', pageTitle = 'Dashboard' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="shrink-0 relative h-14 flex items-center justify-between px-4 sm:px-6 border-b border-[var(--divider)] bg-[var(--bg-nav)] backdrop-blur-md z-[300] gap-2 sm:gap-4">
      {/* Left: Branding */}
      <div className="flex-1 flex items-center gap-2 sm:gap-3">
        <SkillSphereLogo size={28} layout="row" fontSize="1.05rem" />
      </div>

      {/* Centre: Status Pill */}
      <div className="hidden sm:flex items-center justify-center">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-200 font-sans text-xs font-medium tracking-wide light-online-badge">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] light-online-dot"></span>
          Online
        </span>
      </div>

      {/* Right: actions */}
      <div className="flex-1 flex items-center justify-end gap-2">
        <button 
          id="topbar-notifications" 
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-lg border border-white/5 bg-gray-500/5 text-gray-500 flex items-center justify-center cursor-pointer transition-all hover:bg-gray-500/10 hover:text-white hover:border-gray-500/20"
        >
          <IconBell />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 border-[1.5px] border-[var(--bg-nav)]" />
        </button>
        <button 
          id="topbar-theme-toggle" 
          onClick={toggleTheme} 
          aria-label="Toggle theme"
          className="relative w-9 h-9 rounded-lg border border-white/5 bg-gray-500/5 text-gray-500 flex items-center justify-center cursor-pointer transition-all hover:bg-gray-500/10 hover:text-white hover:border-gray-500/20"
        >
          {isDark ? <IconSun /> : <IconMoon />}
        </button>
      </div>
    </header>
  );
}