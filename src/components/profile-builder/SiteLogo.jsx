import React from 'react';

/* ─── Homepage-matching Logo mark ───
   Same SVG as homepage Navbar / AuthLayout — kept in sync so the
   brand mark looks identical everywhere in the app. */
function Logo({ size = 34 }) {
  const id = React.useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id={`la${id}`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee"/><stop offset="1" stopColor="#818cf8"/>
        </linearGradient>
        <linearGradient id={`lb${id}`} x1="40" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f472b6"/><stop offset="1" stopColor="#a78bfa"/>
        </linearGradient>
        <radialGradient id={`rc${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="19" fill={`url(#rc${id})`}/>
      <path d="M20 4 A16 16 0 0 1 36 20" stroke={`url(#la${id})`} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M20 36 A16 16 0 0 1 4 20"  stroke={`url(#lb${id})`} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <circle cx="20" cy="20" r="10" stroke="rgba(99,102,241,0.2)" strokeWidth="1" fill="none"/>
      <circle cx="20" cy="4"  r="2.5" fill="#22d3ee"/>
      <circle cx="36" cy="20" r="2"   fill="#818cf8"/>
      <circle cx="20" cy="36" r="2.5" fill="#f472b6"/>
      <circle cx="4"  cy="20" r="2"   fill="#a78bfa"/>
      <line x1="20" y1="12" x2="20" y2="28" stroke="rgba(99,102,241,0.2)" strokeWidth="1"/>
      <line x1="12" y1="20" x2="28" y2="20" stroke="rgba(99,102,241,0.2)" strokeWidth="1"/>
      <circle cx="20" cy="20" r="4" fill={`url(#la${id})`}/>
      <circle cx="20" cy="20" r="2" fill="white"/>
    </svg>
  );
}

export default function SiteLogo() {
  return (
    <div className="pb-logo-row">
      <Logo size={34} />
      <span className="pb-logo-text">Skill<span>Sphere</span></span>
    </div>
  );
}