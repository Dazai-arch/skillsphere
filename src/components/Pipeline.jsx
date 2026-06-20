import React from 'react';
import AnimatedSection from './AnimatedSection';

const columns = [
  { title: 'SOURCED',    accentFrom: 'from-cyan-500',    accentTo: 'to-blue-500' },
  { title: 'SCREENING',  accentFrom: 'from-emerald-500', accentTo: 'to-cyan-500' },
  { title: 'INTERVIEW',  accentFrom: 'from-lime-500',    accentTo: 'to-emerald-500' },
  { title: 'OFFER SENT', accentFrom: 'from-purple-500',  accentTo: 'to-indigo-500' },
];

const stats = [
  { value: '0%',  label: 'Match accuracy' },
  { value: '0x',  label: 'Faster to offer' },
  { value: '0',   label: 'Hires made' },
];

export default function Pipeline() {
  return (
    <section id="pipeline" className="relative py-12 sm:py-20 px-6 sm:px-10 lg:px-16 overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] blur-[110px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, var(--glow-2), transparent)' }} />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] blur-[110px] rounded-full pointer-events-none -translate-x-1/4" style={{ background: 'radial-gradient(ellipse, var(--glow-3), transparent)' }} />

      <div className="w-full max-w-[1400px] mx-auto relative z-10">

        {/* Stats Row */}
        <AnimatedSection className="flex flex-wrap gap-4 mb-12 sm:mb-24">
          {stats.map(s => (
            <div key={s.label} className="card-glass rounded-2xl px-8 py-6 flex flex-col gap-1.5 min-w-[150px]">
              <span className="text-3xl sm:text-4xl font-extrabold shimmer-text">{s.value}</span>
              <span className="text-sm text-gray-500 font-medium">{s.label}</span>
            </div>
          ))}
        </AnimatedSection>

        {/* Header */}
        <AnimatedSection className="mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/25 bg-cyan-500/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-xs font-semibold text-cyan-400 tracking-widest uppercase">Pipeline</span>
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[1.05] text-white mb-5">
            Your pipeline, ranked<br/>and ready.
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl leading-relaxed">
            Every candidate auto-sorted by AI match score. Advance or dismiss at a glance — your decision, accelerated.
          </p>
        </AnimatedSection>

        {/* Kanban — 2 cols on mobile, 4 on desktop */}
        <AnimatedSection className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {columns.map(col => (
            <div key={col.title} className="card-glass rounded-3xl p-5 flex flex-col gap-3 min-h-[320px]">
              {/* Column header */}
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-gray-500 tracking-widest">{col.title}</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r ${col.accentFrom} ${col.accentTo} text-black`}>
                  0
                </span>
              </div>

              {/* Empty state */}
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-6">
                <div className="w-10 h-10 rounded-2xl border-2 border-dashed flex items-center justify-center opacity-25" style={{ borderColor: 'var(--border-hover)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-500">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
                  </svg>
                </div>
                <p className="text-xs text-gray-600 text-center leading-relaxed">
                  Candidates will<br/>appear here
                </p>
              </div>
            </div>
          ))}
        </AnimatedSection>

      </div>
    </section>
  );
}