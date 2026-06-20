import React, { useState, useEffect } from 'react';

const links = [
  { label: 'Pipeline', href: '#pipeline' },
  { label: 'AI Scoring', href: '#aiscoring' },
  { label: 'Features', href: '#features' },
  { label: 'Candidates', href: '#candidates' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Auto-detect and listen to OS theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    
    const applyTheme = (e) => {
      const isLight = e.matches;
      setIsDark(!isLight);
      document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
    };

    // Apply initially
    applyTheme(mediaQuery);

    // Listen for OS changes (e.g. pulling down control center and switching to light mode)
    mediaQuery.addEventListener('change', applyTheme);
    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[1200px] z-50">

      {/* ── Main pill ── */}
      <div
        className="backdrop-blur-xl border rounded-3xl py-4 px-6 sm:px-10 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
        style={{ background: 'var(--bg-nav)', borderColor: 'var(--border-card)' }}
      >
        {/* ── Logo ── */}
        <div className="flex items-center gap-3 shrink-0">
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="url(#astro_aura)" opacity="0.15" />
            <circle cx="20" cy="20" r="16" stroke="url(#astro_grad_1)" strokeWidth="1.5" />
            <path d="M20 2 V5 M20 38 V35 M2 20 H5 M38 20 H35 M7 7 L9.5 9.5 M33 33 L30.5 30.5 M7 33 L9.5 30.5 M33 7 L30.5 9.5" stroke="url(#astro_grad_1)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="20" y1="5" x2="20" y2="35" stroke="url(#astro_grad_2)" strokeWidth="1" strokeDasharray="3 3" />
            <ellipse cx="20" cy="20" rx="14" ry="6" stroke="url(#astro_grad_2)" strokeWidth="1.5" transform="rotate(-30 20 20)" />
            <ellipse cx="20" cy="20" rx="14" ry="6" stroke="url(#astro_grad_3)" strokeWidth="1.5" transform="rotate(30 20 20)" />
            <path d="M20 13 L21.5 18.5 L27 20 L21.5 21.5 L20 27 L18.5 21.5 L13 20 L18.5 18.5 Z" fill="white" />
            <circle cx="20" cy="20" r="2" fill="#22d3ee" />
            <circle cx="9" cy="14" r="2" fill="#a855f7" />
            <circle cx="31" cy="26" r="2" fill="#06b6d4" />
            <circle cx="10" cy="26" r="2.5" fill="#3b82f6" />
            <defs>
              <linearGradient id="astro_aura" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22d3ee" />
                <stop offset="1" stopColor="#818cf8" />
              </linearGradient>
              <linearGradient id="astro_grad_1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="astro_grad_2" x1="40" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22d3ee" />
                <stop offset="1" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="astro_grad_3" x1="0" y1="40" x2="40" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818cf8" />
                <stop offset="1" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Skill<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Sphere</span>
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-9">
          {links.map(l => (
            <a
              key={l.label}
              href={l.href}
              className="text-base font-semibold text-gray-400 hover:text-white transition-colors duration-200 relative group"
            >
              {l.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="text-gray-400 hover:text-cyan-400 transition-colors p-1.5 rounded-lg"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          <button className="hidden sm:block text-base font-semibold text-gray-300 px-5 py-2.5 rounded-full transition-all duration-300 hover:text-white hover:bg-gradient-to-r hover:from-violet-500 hover:to-blue-600">
            Sign in
          </button>
          <button className="hidden sm:block bg-cyan-400 text-black text-base font-bold px-6 py-2.5 rounded-full hover:bg-cyan-300 transition-colors duration-200 shadow-lg shadow-cyan-400/30">
            Get Started
          </button>

          {/* Hamburger (mobile only) */}
          <button
            className="md:hidden p-1.5 text-gray-400 text-md hover:text-white transition-colors"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

     {/* ── Mobile dropdown ── */}
      {menuOpen && (
        <div
          className="mobile-menu md:hidden mt-2 rounded-2xl border p-5 shadow-2xl"
          style={{ background: 'var(--bg-page)', borderColor: 'var(--border-card)' }}
        >
          <div className="flex flex-col gap-1">
            {links.map(l => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                // ADDED text-center HERE
                className="text-center text-base font-medium text-gray-400 hover:text-white py-2.5 px-3 rounded-xl hover:bg-white/5 transition-all"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="border-t mt-3 pt-4 flex flex-col gap-3" style={{ borderColor: 'var(--border-card)' }}>
            {/* CHANGED text-left TO text-center HERE */}
            <button className="w-full text-center text-base font-semibold text-gray-300 py-2.5 px-3 rounded-xl transition-all duration-300 hover:text-white hover:bg-gradient-to-r hover:from-violet-500 hover:to-blue-600">
              Sign in
            </button>
            <button className="w-full bg-cyan-400 text-black text-base font-bold py-3 px-3 rounded-xl hover:bg-cyan-300 transition-colors duration-200 text-center shadow-lg shadow-cyan-400/30">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}