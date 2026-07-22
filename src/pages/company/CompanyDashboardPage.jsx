import React, { useState, useRef } from 'react';
import { LogoMark } from '../../components/shared/Topbar';

/* --- Shared Icons --- */
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconBriefcase = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);
const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconUserCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/>
  </svg>
);
const IconLineChart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const IconSparkles = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v18m9-9H3m15.36-6.36L5.64 19.64M19.64 19.64L5.64 5.64"/>
  </svg>
);
const IconLocation = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const COMPANY_STATS = [
  { icon: <IconBriefcase />, value: '12', label: 'Active jobs', delta: '+3', color: '#818cf8', glow: 'rgba(99,102,241,0.18)', bgIcon: 'rgba(99,102,241,0.12)' },
  { icon: <IconUsers />, value: '312', label: 'Total applicants', delta: '+58', color: '#22d3ee', glow: 'rgba(6,182,212,0.18)', bgIcon: 'rgba(6,182,212,0.12)' },
  { icon: <IconUserCheck />, value: '64', label: 'Shortlisted', delta: '+12', color: '#a78bfa', glow: 'rgba(167,139,250,0.18)', bgIcon: 'rgba(167,139,250,0.12)' },
  { icon: <IconLineChart />, value: '18d', label: 'Avg. time-to-hire', delta: '-6d', color: '#34d399', glow: 'rgba(52,211,153,0.18)', bgIcon: 'rgba(52,211,153,0.12)' },
];

const ApplicantsChart = () => {
  const [hoverX, setHoverX] = useState(null);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    setHoverX(percent);
  };

  const handleMouseLeave = () => {
    setHoverX(null);
  };

  // Base mock curve path interpolation for the tooltip value
  // Simulates the path d="M0,150 C200,100 300,180 500,120 C700,60 850,20 1000,50"
  // Roughly starts low, goes up, dips a bit, then goes high.
  const getApplicantsAtPercent = (p) => {
    return Math.round(150 + Math.sin(p * Math.PI) * 100 - Math.cos(p * Math.PI * 2) * 50 + p * 200);
  };
  
  const currentApplicants = hoverX !== null ? getApplicantsAtPercent(hoverX) : null;

  return (
    <div 
      className="flex-1 relative w-full h-full mt-2 cursor-crosshair group"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <svg viewBox="0 0 1000 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a3e635" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#a3e635" stopOpacity="0.0"/>
          </linearGradient>
        </defs>
        <path d="M0,150 C200,100 300,180 500,120 C700,60 850,20 1000,50 L1000,200 L0,200 Z" fill="url(#chartGrad)"/>
        <path d="M0,150 C200,100 300,180 500,120 C700,60 850,20 1000,50" fill="none" stroke="#a3e635" strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke"/>
        
        {hoverX !== null && (
          <line 
            x1={hoverX * 1000} 
            y1="0" 
            x2={hoverX * 1000} 
            y2="200" 
            stroke="#a3e635" 
            strokeWidth="2"
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
            className="pointer-events-none opacity-80"
          />
        )}
      </svg>

      {hoverX !== null && (
        <div 
          className="absolute top-0 -translate-x-1/2 pointer-events-none bg-[#0f172a] border border-[#a3e635]/50 px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(163,230,53,0.3)] transition-all duration-75 z-10"
          style={{ left: `${hoverX * 100}%`, marginTop: '-20px' }}
        >
          <div className="text-[#a3e635] font-sans font-bold text-sm text-center">
            {currentApplicants}
          </div>
          <div className="text-gray-400 font-sans text-[0.65rem] uppercase text-center tracking-wider">
            Applicants
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-8 pb-1 text-gray-500 font-sans text-[0.75rem] pointer-events-none">
        <span>W2</span>
        <span>W3</span>
        <span>W4</span>
        <span>W5</span>
        <span>W6</span>
      </div>
    </div>
  );
};

export default function CompanyDashboardPage() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-10">
        <div className="flex flex-col">
          <div className="font-sans text-[0.9rem] font-bold text-indigo-400 mb-1 flex items-center gap-2">
            {getGreeting()}, Recruiter <span className="inline-block animate-[wave_2.5s_infinite] origin-[70%_70%] text-base">👋</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-sans flex items-center gap-2">
            Dashboard
          </div>
          <p className="font-sans text-[0.95rem] text-gray-400 mt-1.5 font-medium">Hire on verified skills. Here's your pipeline at a glance.</p>
        </div>
        <div className="flex-shrink-0">
          <button className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold font-sans text-[0.9rem] py-2.5 px-4.5 rounded-xl shadow-lg shadow-indigo-500/20">
            <IconPlus /> Post a job
          </button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {COMPANY_STATS.map((s, i) => (
          <div key={i} className="relative flex flex-col items-center justify-center p-6 card-glass rounded-2xl transition-all duration-300 hover:-translate-y-1 group/statcard" style={{ '--card-glow': s.glow }}>
            {s.delta && (
              <span className="absolute top-4 right-4 text-[0.7rem] font-bold px-1.5 py-0.5 rounded flex items-center font-sans" style={{ color: s.color, background: s.bgIcon }}>
                {s.delta.startsWith('-') ? '↓ ' : '↑ '}{s.delta.replace('-', '')}
              </span>
            )}
            <div className="flex items-center justify-center w-12 h-12 rounded-xl mb-3 shadow-[0_4px_12px_var(--card-glow)] transition-transform duration-300 group-hover/statcard:scale-110 group-hover/statcard:-rotate-3" style={{ background: s.bgIcon, color: s.color }}>
              {s.icon}
            </div>
            <div className="font-sans text-[1.8rem] font-extrabold tracking-tight mb-1 transition-all duration-300 group-hover/statcard:drop-shadow-[0_0_12px_var(--card-glow)]" style={{ color: s.color }}>
              {s.value}
            </div>
            <div className="font-sans text-[0.8rem] font-medium text-gray-400 uppercase tracking-[0.06em]">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
        {/* Applicants over time */}
        <div className="lg:col-span-3 card-glass rounded-2xl p-6 flex flex-col h-[320px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-sans text-[1.05rem] font-semibold text-white">Applicants over time</h3>
            <span className="font-sans text-[0.75rem] font-bold text-[#84cc16]">+128% this quarter</span>
          </div>
          <ApplicantsChart />
        </div>

        {/* Hiring funnel */}
        <div className="card-glass rounded-2xl p-6 flex flex-col h-[320px]">
          <h3 className="font-sans text-[1.05rem] font-semibold text-white mb-6">Hiring funnel</h3>
          <div className="flex-1 relative w-full flex justify-center items-center overflow-hidden">
            <svg viewBox="0 0 340 270" className="w-full h-full max-h-[220px] max-w-[100%] object-contain overflow-visible">
              {/* Applied */}
              <polygon points="0,0 300,0 232,60 68,60" fill="#06b6d4" />
              <text x="250" y="60" fill="currentColor" className="text-gray-400 font-medium" fontSize="13" fontFamily="sans-serif" dominantBaseline="middle">Applied</text>
              
              {/* Reviewed */}
              <polygon points="68,60 232,60 195,115 105,115" fill="#8b5cf6" />
              <text x="212" y="115" fill="currentColor" className="text-gray-400 font-medium" fontSize="13" fontFamily="sans-serif" dominantBaseline="middle">Reviewed</text>
              
              {/* Shortlisted */}
              <polygon points="105,115 195,115 175,165 125,165" fill="#65a30d" />
              <text x="192" y="165" fill="currentColor" className="text-gray-400 font-medium" fontSize="13" fontFamily="sans-serif" dominantBaseline="middle">Shortlisted</text>

              {/* Interview */}
              <polygon points="125,165 175,165 160,215 140,215" fill="#38bdf8" />
              <text x="177" y="215" fill="currentColor" className="text-gray-400 font-medium" fontSize="13" fontFamily="sans-serif" dominantBaseline="middle">Interview</text>

              {/* Hired */}
              <polygon points="140,215 160,215 150,270 150,270" fill="#c084fc" />
              <text x="167" y="245" fill="currentColor" className="text-gray-400 font-medium" fontSize="13" fontFamily="sans-serif" dominantBaseline="middle">Hired</text>
            </svg>
          </div>
        </div>
      </div>

      {/* ── AI Recommended Candidates ── */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans text-[1.25rem] font-bold text-white">AI recommended candidates</h2>
          <button className="text-[#a78bfa] font-sans text-[0.85rem] font-semibold hover:text-[#c4b5fd] ">Discover more →</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Candidate 1 */}
          <div className="card-glass rounded-2xl p-6 ">
            <div className="flex items-start justify-between mb-5">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#38bdf8] flex items-center justify-center text-[#0f172a] font-bold text-lg shrink-0">AM</div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-[1rem] font-semibold text-white">Aarav Mehta</span>
                    <span className="flex items-center gap-1 bg-[#8b5cf6]/20 text-[#c4b5fd] font-sans text-[0.65rem] font-semibold px-1.5 py-0.5 rounded border border-[#8b5cf6]/30 uppercase tracking-wider"><IconSparkles /> AI pick</span>
                  </div>
                  <span className="font-sans text-[0.85rem] text-gray-400 mt-0.5">Full-Stack Developer</span>
                  <span className="flex items-center gap-1 font-sans text-[0.75rem] text-gray-500 mt-1"><IconLocation /> Bengaluru, India</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-sans text-[1.1rem] font-bold text-[#38bdf8]">82%</span>
                <span className="font-sans text-[0.7rem] text-gray-500">readiness</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="font-sans text-[0.75rem] text-gray-300 bg-white/5 px-2.5 py-1 rounded">React</span>
              <span className="font-sans text-[0.75rem] text-gray-300 bg-white/5 px-2.5 py-1 rounded">TypeScript</span>
              <span className="font-sans text-[0.75rem] text-gray-300 bg-white/5 px-2.5 py-1 rounded">Node.js</span>
            </div>
            <div className="flex items-center gap-4 font-sans text-[0.75rem] text-gray-400 mb-6">
              <span className="flex items-center gap-1.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> 14 projects</span>
              <span className="flex items-center gap-1.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> 2 certs</span>
              <span className="flex items-center gap-1.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> 4y exp</span>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6] text-white font-sans text-[0.85rem] font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity">View profile</button>
              <button className="flex-1 bg-transparent border border-white/10 text-white font-sans text-[0.85rem] font-semibold py-2 rounded-lg hover:bg-white/5 ">Shortlist</button>
            </div>
          </div>

          {/* Candidate 2 */}
          <div className="card-glass rounded-2xl p-6 ">
            <div className="flex items-start justify-between mb-5">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#818cf8] flex items-center justify-center text-[#0f172a] font-bold text-lg shrink-0">SR</div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-[1rem] font-semibold text-white">Sofia Rossi</span>
                    <span className="flex items-center gap-1 bg-[#8b5cf6]/20 text-[#c4b5fd] font-sans text-[0.65rem] font-semibold px-1.5 py-0.5 rounded border border-[#8b5cf6]/30 uppercase tracking-wider"><IconSparkles /> AI pick</span>
                  </div>
                  <span className="font-sans text-[0.85rem] text-gray-400 mt-0.5">Frontend Engineer</span>
                  <span className="flex items-center gap-1 font-sans text-[0.75rem] text-gray-500 mt-1"><IconLocation /> Milan, Italy</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-sans text-[1.1rem] font-bold text-[#818cf8]">91%</span>
                <span className="font-sans text-[0.7rem] text-gray-500">readiness</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="font-sans text-[0.75rem] text-gray-300 bg-white/5 px-2.5 py-1 rounded">React</span>
              <span className="font-sans text-[0.75rem] text-gray-300 bg-white/5 px-2.5 py-1 rounded">Design Systems</span>
              <span className="font-sans text-[0.75rem] text-gray-300 bg-white/5 px-2.5 py-1 rounded">Figma</span>
            </div>
            <div className="flex items-center gap-4 font-sans text-[0.75rem] text-gray-400 mb-6">
              <span className="flex items-center gap-1.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> 22 projects</span>
              <span className="flex items-center gap-1.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> 2 certs</span>
              <span className="flex items-center gap-1.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> 6y exp</span>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6] text-white font-sans text-[0.85rem] font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity">View profile</button>
              <button className="flex-1 bg-transparent border border-white/10 text-white font-sans text-[0.85rem] font-semibold py-2 rounded-lg hover:bg-white/5 ">Shortlist</button>
            </div>
          </div>

          {/* Candidate 3 */}
          <div className="card-glass rounded-2xl p-6 ">
            <div className="flex items-start justify-between mb-5">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#60a5fa] flex items-center justify-center text-[#0f172a] font-bold text-lg shrink-0">ML</div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-[1rem] font-semibold text-white">Mei Lin</span>
                    <span className="flex items-center gap-1 bg-[#8b5cf6]/20 text-[#c4b5fd] font-sans text-[0.65rem] font-semibold px-1.5 py-0.5 rounded border border-[#8b5cf6]/30 uppercase tracking-wider"><IconSparkles /> AI pick</span>
                  </div>
                  <span className="font-sans text-[0.85rem] text-gray-400 mt-0.5">ML Engineer</span>
                  <span className="flex items-center gap-1 font-sans text-[0.75rem] text-gray-500 mt-1"><IconLocation /> Singapore</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-sans text-[1.1rem] font-bold text-[#60a5fa]">88%</span>
                <span className="font-sans text-[0.7rem] text-gray-500">readiness</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="font-sans text-[0.75rem] text-gray-300 bg-white/5 px-2.5 py-1 rounded">Python</span>
              <span className="font-sans text-[0.75rem] text-gray-300 bg-white/5 px-2.5 py-1 rounded">PyTorch</span>
              <span className="font-sans text-[0.75rem] text-gray-300 bg-white/5 px-2.5 py-1 rounded">MLOps</span>
            </div>
            <div className="flex items-center gap-4 font-sans text-[0.75rem] text-gray-400 mb-6">
              <span className="flex items-center gap-1.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> 16 projects</span>
              <span className="flex items-center gap-1.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> 2 certs</span>
              <span className="flex items-center gap-1.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> 7y exp</span>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6] text-white font-sans text-[0.85rem] font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity">View profile</button>
              <button className="flex-1 bg-transparent border border-white/10 text-white font-sans text-[0.85rem] font-semibold py-2 rounded-lg hover:bg-white/5 ">Shortlist</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Applicants ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans text-[1.25rem] font-bold text-white">Recent applicants</h2>
          <button className="text-[#a78bfa] font-sans text-[0.85rem] font-semibold hover:text-[#c4b5fd] ">View pipeline</button>
        </div>
        
        <div className="card-glass rounded-2xl p-2 ">
          
          {/* Row 1 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border-b border-white/5">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-full bg-[#38bdf8] flex items-center justify-center text-[#0f172a] font-bold text-sm shrink-0">AM</div>
              <div className="flex flex-col">
                <span className="font-sans text-[0.95rem] font-semibold text-white">Aarav Mehta</span>
                <span className="font-sans text-[0.8rem] text-gray-400">Full-Stack Developer · applied for Senior Frontend Engineer</span>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-8 sm:w-auto w-full pl-14 sm:pl-0 mt-2 sm:mt-0">
              <span className="font-sans text-[1rem] font-bold text-[#38bdf8]">82%</span>
              <span className="font-sans text-[0.85rem] font-medium text-gray-300 w-24 text-right">Applied</span>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border-b border-white/5">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-full bg-[#818cf8] flex items-center justify-center text-[#0f172a] font-bold text-sm shrink-0">SR</div>
              <div className="flex flex-col">
                <span className="font-sans text-[0.95rem] font-semibold text-white">Sofia Rossi</span>
                <span className="font-sans text-[0.8rem] text-gray-400">Frontend Engineer · applied for Full-Stack Engineer</span>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-8 sm:w-auto w-full pl-14 sm:pl-0 mt-2 sm:mt-0">
              <span className="font-sans text-[1rem] font-bold text-[#818cf8]">91%</span>
              <span className="font-sans text-[0.85rem] font-medium text-gray-300 w-24 text-right">Under Review</span>
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 ">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-full bg-[#38bdf8] flex items-center justify-center text-[#0f172a] font-bold text-sm shrink-0">DO</div>
              <div className="flex flex-col">
                <span className="font-sans text-[0.95rem] font-semibold text-white">Daniel Okafor</span>
                <span className="font-sans text-[0.8rem] text-gray-400">Backend Engineer · applied for Platform Engineer</span>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-8 sm:w-auto w-full pl-14 sm:pl-0 mt-2 sm:mt-0">
              <span className="font-sans text-[1rem] font-bold text-[#38bdf8]">78%</span>
              <span className="font-sans text-[0.85rem] font-medium text-gray-300 w-24 text-right">Shortlisted</span>
            </div>
          </div>

        </div>
      </div>

      {/* Floating AI Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#0f172a] border border-[#22d3ee]/50 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105 transition-transform z-50 hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]">
        <div className="scale-125">
          <LogoMark />
        </div>
      </button>
    </>
  );
}