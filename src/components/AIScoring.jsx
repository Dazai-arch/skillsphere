import React from 'react';
import AnimatedSection from './AnimatedSection';

const scores = [
  { label: 'Technical Skills',     value: 0, gradient: 'from-cyan-400 to-blue-500' },
  { label: 'Career Trajectory',    value: 0, gradient: 'from-blue-500 to-emerald-400' },
  { label: 'Culture Alignment',    value: 0, gradient: 'from-emerald-400 to-cyan-500' },
  { label: 'Role Fit',             value: 0, gradient: 'from-blue-500 to-purple-500' },
  { label: 'Interview Likelihood', value: 0, gradient: 'from-lime-400 to-emerald-500' },
];

export default function AIScoring() {
  return (
    <section id="aiscoring" className="relative py-12 sm:py-20 px-6 sm:px-10 lg:px-16 overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] blur-[110px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, var(--glow-3), transparent)' }} />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] blur-[90px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, var(--glow-4), transparent)' }} />

      <div className="w-full max-w-[1400px] mx-auto relative z-10 grid lg:grid-cols-2 gap-16 xl:gap-28 items-center">

        {/* Left — Radial visualizer */}
        <AnimatedSection className="flex items-center justify-center relative h-[460px]">

          {/* Faint outer rings */}
          <div className="absolute w-[400px] h-[400px] rounded-full border opacity-10" style={{ borderColor: 'var(--border-hover)' }} />
          <div className="absolute w-[310px] h-[310px] rounded-full border opacity-15" style={{ borderColor: 'var(--border-hover)' }} />

          {/* Spinning orbit ring */}
          <div className="absolute w-[270px] h-[270px] rounded-full border border-cyan-500/20 animate-[spin_18s_linear_infinite]">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.9)]" />
          </div>

          {/* Center circle */}
          <div className="relative w-[190px] h-[190px] rounded-full border border-cyan-500/15 shadow-[0_0_70px_rgba(6,182,212,0.15)] flex flex-col items-center justify-center z-10" style={{ background: 'var(--bg-page)' }}>
            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 leading-none">—</span>
            <span className="text-xs font-bold text-gray-500 tracking-[0.22em] mt-2">MATCH</span>
          </div>

          {/* Floating skill badge placeholders */}
          {[
            { label: 'Skills',        pos: 'top-[80px] left-[15px]',   color: 'text-cyan-400 border-cyan-500/25 bg-cyan-500/8' },
            { label: 'Experience',    pos: 'top-[80px] right-[15px]',  color: 'text-purple-400 border-purple-500/25 bg-purple-500/8' },
            { label: 'Leadership',    pos: 'bottom-[95px] left-[20px]', color: 'text-lime-400 border-lime-500/25 bg-lime-500/8' },
            { label: 'System Design', pos: 'bottom-[95px] right-[10px]', color: 'text-cyan-400 border-cyan-500/25 bg-cyan-500/8' },
          ].map(b => (
            <div key={b.label} className={`absolute ${b.pos} ${b.color} border backdrop-blur-md text-sm font-bold px-3.5 py-2 rounded-xl shadow-lg`}>
              {b.label}
            </div>
          ))}
        </AnimatedSection>

        {/* Right — Scores */}
        <AnimatedSection className="flex flex-col">
          <div className="inline-flex self-start items-center gap-2 px-4 py-2 rounded-full border border-purple-500/25 bg-purple-500/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="text-xs font-semibold text-purple-400 tracking-widest uppercase">AI Scoring</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-5xl xl:text-7xl font-extrabold tracking-tight leading-[1.05] text-white mb-5">
            Scores that actually<br/>mean something.
          </h2>

          <p className="text-gray-400 text-lg sm:text-xl leading-relaxed mb-8 sm:mb-12 max-w-xl">
            Multi-dimensional scoring across skills, trajectory, culture fit and role alignment — each backed by a verified source or clearly labeled as AI-estimated.
          </p>

          {/* Score bars */}
          <div className="space-y-6">
            {scores.map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-sm font-semibold mb-2.5">
                  <span className="text-gray-300">{s.label}</span>
                  <span className="text-cyan-400">{s.value > 0 ? `${s.value}%` : '—'}</span>
                </div>
                <div className="w-full h-[6px] rounded-full overflow-hidden" style={{ background: 'var(--border-card)' }}>
                  <div
                    className={`h-full bg-gradient-to-r ${s.gradient} rounded-full`}
                    style={{ width: `${s.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-600 mt-10 tracking-wide">Connect to backend to populate candidate scores</p>
        </AnimatedSection>

      </div>
    </section>
  );
}
