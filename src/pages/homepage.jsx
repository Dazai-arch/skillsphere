import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Pipeline from '../components/Pipeline';
import AIScoring from '../components/AIScoring';
import Features from '../components/Features';
import Candidates from '../components/Candidates';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function Homepage() {
  return (
    <div className="min-h-screen font-sans selection:bg-cyan-500/30">
      <Navbar />
      
      <main>
        <Hero />
        <Pipeline />
        <AIScoring />
        <Features />
        <Candidates />
        <CTA />
      </main>
      
      <Footer />
    </div>
  );
}
