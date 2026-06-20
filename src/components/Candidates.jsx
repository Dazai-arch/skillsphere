import React from 'react';
import AnimatedSection from './AnimatedSection';

// Empty placeholder slots — will be filled from backend
const slots = [
  { accentFrom: 'from-cyan-400',   accentTo: 'to-blue-500',    badge: '✓ VERIFIED SOURCE', badgeColor: 'text-cyan-400 border-cyan-500/25 bg-cyan-500/8' },
  { accentFrom: 'from-purple-400', accentTo: 'to-pink-500',    badge: '⌛ IN REVIEW',       badgeColor: 'text-purple-400 border-purple-500/25 bg-purple-500/8' },
  { accentFrom: 'from-lime-400',   accentTo: 'to-emerald-500', badge: '✦ AI RANKED',        badgeColor: 'text-lime-400 border-lime-500/25 bg-lime-500/8' },
  { accentFrom: 'from-blue-400',   accentTo: 'to-indigo-500',  badge: '▲ TOP MATCH',        badgeColor: 'text-blue-400 border-blue-500/25 bg-blue-500/8' },
];

export default function Candidates() {
  return (
    <section id="candidates" className="relative py-12 sm:py-20 px-6 sm:px-10 lg:px-16 overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[600px] h-[500px] blur-[110px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, var(--glow-5), transparent)' }} />

      <div className="w-full max-w-[1400px] mx-auto relative z-10">

        <AnimatedSection className="mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/25 bg-cyan-500/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-xs font-semibold text-cyan-400 tracking-widest uppercase">Candidates</span>
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[1.05] text-white mb-6">
            The people who'll change<br/>everything.
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl leading-relaxed">
            Each card will be a complete picture — AI score, stage and fit at a glance. Connect to backend to start seeing candidates.
          </p>
        </AnimatedSection>

        {/* Placeholder grid — 2 per row on mobile, 4 on large */}
        <AnimatedSection className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {slots.map((s, i) => (
            <div key={i} className="card-glass rounded-3xl p-6 flex flex-col relative overflow-hidden min-h-[240px]">
              {/* Gradient top accent */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${s.accentFrom} ${s.accentTo}`} />

              {/* Avatar placeholder */}
              <div className={`w-12 h-12 rounded-full border-2 border-dashed bg-gradient-to-br ${s.accentFrom} ${s.accentTo} opacity-20 mb-5 mt-1`} />

              {/* Badge */}
              <span className={`self-start text-xs font-bold border px-3 py-1 rounded-lg tracking-wide mb-5 ${s.badgeColor}`}>
                {s.badge}
              </span>

              {/* Name + role placeholders */}
              <div className="space-y-2 mb-auto">
                <div className="h-3.5 rounded-full w-3/4 opacity-20" style={{ background: 'var(--text-secondary)' }} />
                <div className="h-2.5 rounded-full w-1/2 opacity-15" style={{ background: 'var(--text-secondary)' }} />
              </div>

              {/* Match bar placeholder */}
              <div className="mt-6">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-gray-500">AI Match</span>
                  <span className="text-gray-600">—</span>
                </div>
                <div className="w-full h-[4px] rounded-full opacity-20" style={{ background: 'var(--border-hover)' }} />
              </div>
            </div>
          ))}
        </AnimatedSection>

        <p className="text-center text-sm text-gray-600 mt-8">
          Candidate profiles will populate once connected to backend
        </p>
      </div>
    </section>
  );
}
