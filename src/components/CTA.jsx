import React from 'react';
import AnimatedSection from './AnimatedSection';

export default function CTA() {
  return (
    <section className="relative py-16 sm:py-24 px-6 sm:px-10 lg:px-16 overflow-hidden">
      {/* Background bloom */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[900px] h-[900px] blur-[130px] rounded-full" style={{ background: 'radial-gradient(ellipse, var(--glow-2) 0%, var(--glow-4) 40%, transparent 70%)' }} />
      </div>
      {/* Top line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(6,182,212,0.4), transparent)' }} />

      <div className="w-full max-w-[1000px] mx-auto text-center relative z-10">

        <AnimatedSection>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-lime-500/25 bg-lime-500/5 mb-9">
            <span className="text-base"></span>
            <span className="text-xs font-semibold text-lime-400 tracking-widest uppercase">Get Started</span>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[1.05] text-white mb-7">
            Ready to turn skills<br/>
            into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
              opportunities?
            </span>
          </h2>
        </AnimatedSection>

        <AnimatedSection>
          <p className="text-gray-400 text-lg sm:text-xl md:text-2xl leading-relaxed mb-10 sm:mb-14 max-w-2xl mx-auto">
            Join a growing community of professionals and talent teams using SkillSphere to hire and grow on proven ability.
          </p>
        </AnimatedSection>

        <AnimatedSection className="flex flex-wrap justify-center gap-4 mb-6">
          <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-4 rounded-xl font-semibold text-base shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/45 hover:scale-[1.02] transition-all duration-200 flex items-center gap-2.5">
            Start for Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </AnimatedSection>

        <AnimatedSection>
          <p className="text-sm text-gray-600 tracking-wide">No credit card · 5-min setup · Cancel anytime</p>
        </AnimatedSection>

      </div>
    </section>
  );
}
