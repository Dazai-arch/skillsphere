import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import ChatInterface from './ChatInterface';
import { LogoMark } from '../shared/Topbar';

export default function GlobalChatbot({ role = 'candidate' }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // DashboardLayout wraps every page in `overflow-hidden` containers (for
  // the sidebar/topbar scroll boundaries). Fixed-position elements still
  // get visually clipped by an overflow-hidden ancestor in every major
  // browser, which was cutting off/mispositioning the chat panel. Porting
  // the whole widget straight onto document.body sidesteps that ancestor
  // chain entirely, so `fixed` here is truly relative to the viewport.
  return createPortal(
    <div ref={wrapperRef}>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center transition-all z-[9999] shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] border border-[#22d3ee]/50 cursor-pointer ${
          isOpen 
            ? 'bg-[var(--bg-card)] border-[var(--border-hover)] scale-90 opacity-0 pointer-events-none' 
            : 'bg-[var(--bg-card)] hover:scale-105 opacity-100'
        }`}
        aria-label="Open AI Assistant"
      >
        <div className="scale-125">
          <LogoMark />
        </div>
      </button>

      {/* Chat Interface Modal — always a floating widget, anchored to the
          bottom-right corner with a small margin on every screen size.
          It never takes over the full page; on narrow viewports its own
          width/height (set in ChatInterface) simply shrinks to fit.
          z-[10000] keeps it above every other overlay in the app (the
          topbar is z-[300], other modals top out at z-[9999]). */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[10000] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <ChatInterface role={role} onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>,
    document.body
  );
}