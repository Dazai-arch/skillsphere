import React from 'react';
import AnimatedSection from './AnimatedSection';

const features = [
  {
    title: 'AI Match Scoring',
    description: 'Multi-dimensional scoring across skills, culture, trajectory and role fit — each backed by a verified source or clearly AI-estimated.',
    accent: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/8',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>
      </svg>
    )
  },
  {
    title: 'Auto Pipeline Sorting',
    description: 'Every incoming application is scored and placed in the right stage automatically. Zero manual triaging required.',
    accent: 'text-purple-400 border-purple-500/20 bg-purple-500/8',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h7"/>
      </svg>
    )
  },
  {
    title: 'Live Candidate Feed',
    description: 'New candidates surface in real time from your sourcing channels — all pre-ranked before your team sees them.',
    accent: 'text-lime-400 border-lime-500/20 bg-lime-500/8',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
      </svg>
    )
  },
  {
    title: 'Role DNA Profiles',
    description: 'Define exactly what great looks like for each role. Our AI maps these requirements to real candidate signals.',
    accent: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/8',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
      </svg>
    )
  },
  {
    title: 'Hiring Analytics',
    description: 'Time-to-hire, source quality, offer acceptance rates — all in one unified dashboard designed for speed.',
    accent: 'text-purple-400 border-purple-500/20 bg-purple-500/8',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
    )
  },
  {
    title: 'ATS Integrations',
    description: 'Sync seamlessly with Greenhouse, Lever, Ashby or Workday to keep your existing workflow intact.',
    accent: 'text-lime-400 border-lime-500/20 bg-lime-500/8',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
      </svg>
    )
  }
];

export default function Features() {
  return (
    <section id="features" className="relative py-12 sm:py-20 px-6 sm:px-10 lg:px-16 overflow-hidden">
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[800px] h-[350px] blur-[110px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, var(--glow-4), transparent)' }} />

      <div className="w-full max-w-[1400px] mx-auto relative z-10">

        {/* Header */}
        <AnimatedSection className="mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-lime-500/25 bg-lime-500/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-lime-400" />
            <span className="text-xs font-semibold text-lime-400 tracking-widest uppercase">Features</span>
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[1.05] text-white mb-6">
            Everything you need to<br/>hire without friction.
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl leading-relaxed">
            Built for modern talent teams who need to move fast without sacrificing quality or candidate experience.
          </p>
        </AnimatedSection>

        {/* Grid — 2 cols on mobile, 3 on lg */}
        <AnimatedSection className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {features.map(f => (
            <div
              key={f.title}
              className="card-glass rounded-3xl p-6 sm:p-7 flex flex-col gap-5 hover:scale-[1.01] transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${f.accent}`}>
                {f.icon}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2.5">{f.title}</h3>
                <p className="text-sm sm:text-base text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </AnimatedSection>

      </div>
    </section>
  );
}
