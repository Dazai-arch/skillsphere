import React from 'react';

const cols = [
  { title: 'Platform',      links: ['Features', 'How it works', 'Opportunities', 'Pricing'] },
  { title: 'For Companies', links: ['Post a job', 'Discover talent', 'Hiring solutions', 'Enterprise'] },
  { title: 'Resources',     links: ['Blog', 'Help center', 'API docs', 'Changelog'] },
];

export default function Footer() {
  return (
    <footer className="relative border-t pt-16 pb-10 px-6 sm:px-10 lg:px-16" style={{ background: 'var(--footer-bg)', borderColor: 'var(--divider)' }}>
      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(6,182,212,0.2), transparent)' }} />

      <div className="w-full max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">

        {/* Brand */}
        <div className="col-span-2 sm:col-span-1 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="url(#fastro_aura)" opacity="0.15" />
              <circle cx="20" cy="20" r="16" stroke="url(#fastro_grad_1)" strokeWidth="1.5" />
              <path d="M20 2 V5 M20 38 V35 M2 20 H5 M38 20 H35 M7 7 L9.5 9.5 M33 33 L30.5 30.5 M7 33 L9.5 30.5 M33 7 L30.5 9.5" stroke="url(#fastro_grad_1)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="20" y1="5" x2="20" y2="35" stroke="url(#fastro_grad_2)" strokeWidth="1" strokeDasharray="3 3" />
              <ellipse cx="20" cy="20" rx="14" ry="6" stroke="url(#fastro_grad_2)" strokeWidth="1.5" transform="rotate(-30 20 20)" />
              <ellipse cx="20" cy="20" rx="14" ry="6" stroke="url(#fastro_grad_3)" strokeWidth="1.5" transform="rotate(30 20 20)" />
              <path d="M20 13 L21.5 18.5 L27 20 L21.5 21.5 L20 27 L18.5 21.5 L13 20 L18.5 18.5 Z" fill="white" />
              <circle cx="20" cy="20" r="2" fill="#22d3ee" />
              <circle cx="9" cy="14" r="2" fill="#a855f7" />
              <circle cx="31" cy="26" r="2" fill="#06b6d4" />
              <circle cx="10" cy="26" r="2.5" fill="#3b82f6" />
              <defs>
                <linearGradient id="fastro_aura" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#22d3ee" />
                  <stop offset="1" stopColor="#818cf8" />
                </linearGradient>
                <linearGradient id="fastro_grad_1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient id="fastro_grad_2" x1="40" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#22d3ee" />
                  <stop offset="1" stopColor="#6366f1" />
                </linearGradient>
                <linearGradient id="fastro_grad_3" x1="0" y1="40" x2="40" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#818cf8" />
                  <stop offset="1" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-base font-extrabold tracking-tight text-white">
              Skill<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Sphere</span>
            </span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed max-w-[240px]">
            Where Skills Meet Opportunities. AI-powered career intelligence for the next generation of talent.
          </p>
        </div>

        {/* Link cols */}
        {cols.map(col => (
          <div key={col.title} className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-gray-400 tracking-widest uppercase">{col.title}</h4>
            <ul className="flex flex-col gap-3">
              {col.links.map(link => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-300 transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="w-full max-w-[1400px] mx-auto pt-8 flex flex-wrap justify-between items-center gap-4" style={{ borderTop: '1px solid var(--divider)' }}>
        <p className="text-sm text-gray-600 mx-auto">© 2026 SkillSphere. All rights reserved.</p>
        <div className="flex gap-6">
          </div>
      </div>
    </footer>
  );
}
