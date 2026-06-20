import React from 'react';
import AnimatedSection from './AnimatedSection';

export default function Hero() {
  return (
    <section className="relative pt-28 sm:pt-32 pb-12 sm:pb-20 px-6 sm:px-10 lg:px-16 min-h-screen flex items-center overflow-hidden">

      {/* Background glows */}
      <div className="absolute top-1/4 left-0 w-[700px] h-[700px] blur-[130px] rounded-full -translate-x-1/3 pointer-events-none" style={{ background: 'var(--glow-1)' }} />
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] blur-[130px] rounded-full translate-x-1/3 pointer-events-none" style={{ background: 'var(--glow-2)' }} />

      <div className="w-full max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 xl:gap-24 items-center relative z-10">

        {/* ── Left ── */}
        <AnimatedSection>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/25 bg-emerald-500/5 mb-9">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400 tracking-widest uppercase">
              AI-Powered Career Intelligence
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-4xl md:text-5xl xl:text-8xl font-extrabold tracking-tight leading-[1.03] mb-8 text-white">
            Build a career<br/>
            that{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-500">
              raises the
            </span>
            <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-500 via-indigo-400 to-purple-500">
              bar.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl">
            SkillSphere reads thousands of signals across your real work — code, projects and assessments — and matches you to the right opportunities on proven ability.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-7 py-4 rounded-xl font-semibold text-base shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/45 hover:scale-[1.02] transition-all duration-200 flex items-center gap-2.5">
              View Your Dashboard
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </AnimatedSection>

        {/* ── Right — Empty Match Card (backend placeholder) ── */}
        <AnimatedSection className="relative">
          <div className="absolute inset-[-15%] blur-3xl rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, var(--glow-1), transparent)' }} />

          <div className="relative gradient-border p-0.5 rounded-3xl">
            <div className="rounded-3xl p-7" style={{ background: 'var(--bg-card)' }}>

              {/* Card Header */}
              <div className="flex justify-between items-center mb-7">
                <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Top AI Matches</span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
              </div>

              {/* Empty placeholder rows */}
              <div className="space-y-5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4 opacity-30">
                    <div className="w-10 h-10 shrink-0 rounded-full border-2" style={{ borderColor: 'var(--border-card)' }} />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 rounded-full w-2/3" style={{ background: 'var(--border-card)' }} />
                      <div className="h-2 rounded-full w-1/2" style={{ background: 'var(--border-card)' }} />
                      <div className="w-full h-[3px] rounded-full" style={{ background: 'var(--border-card)' }} />
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-center text-sm text-gray-500 py-4 mt-2">
                Candidate data will appear when connected to backend
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4 pt-5" style={{ borderTop: '1px solid var(--divider)' }}>
                {[
                  { label: '✓ VERIFIED SOURCE', color: 'text-cyan-400 border-cyan-500/25 bg-cyan-500/8' },
                  { label: '✦ AI RANKED',        color: 'text-purple-400 border-purple-500/25 bg-purple-500/8' },
                  { label: '▲ TOP MATCH',         color: 'text-lime-400 border-lime-500/25 bg-lime-500/8' },
                ].map(t => (
                  <span key={t.label} className={`text-xs font-bold border px-3 py-1 rounded-lg tracking-wide ${t.color}`}>
                    {t.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

      </div>
    </section>
  );
}