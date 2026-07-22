import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LogoMark } from '../../components/shared/Topbar';

/* ─── Inline SVG Icons ─── */
const IconUser = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconGraduationCap = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const IconBriefcase = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const IconRocket = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>;
const IconWrench = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
const IconAward = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>;
const IconTrophy = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
const IconUsers = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconHeart = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IconBookOpen = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const IconStar = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconSettings = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1-1-1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconMapPin = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconCamera = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const IconEdit2 = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;
const IconClose = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconPlus = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconCheck = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconMic = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>;
const IconSparkle2 = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>;
const IconChevronRight = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IconChevronLeft = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;

const THEMES = {
  indigo: { bg: 'bg-indigo-500', bgHover: 'hover:bg-indigo-600', shadow: 'shadow-indigo-500/20', textMuted: 'text-indigo-400/80', blob: 'bg-indigo-500/5', btnBg: 'bg-indigo-500/10', btnHover: 'hover:bg-indigo-500/20', btnBorder: 'border-indigo-500/30', focus: 'focus:border-indigo-500/50' },
  emerald: { bg: 'bg-emerald-500', bgHover: 'hover:bg-emerald-600', shadow: 'shadow-emerald-500/20', textMuted: 'text-emerald-400/80', blob: 'bg-emerald-500/5', btnBg: 'bg-emerald-500/10', btnHover: 'hover:bg-emerald-500/20', btnBorder: 'border-emerald-500/30', focus: 'focus:border-emerald-500/50' },
  sky: { bg: 'bg-sky-500', bgHover: 'hover:bg-sky-600', shadow: 'shadow-sky-500/20', textMuted: 'text-sky-400/80', blob: 'bg-sky-500/5', btnBg: 'bg-sky-500/10', btnHover: 'hover:bg-sky-500/20', btnBorder: 'border-sky-500/30', focus: 'focus:border-sky-500/50' },
  blue: { bg: 'bg-blue-500', bgHover: 'hover:bg-blue-600', shadow: 'shadow-blue-500/20', textMuted: 'text-blue-400/80', blob: 'bg-blue-500/5', btnBg: 'bg-blue-500/10', btnHover: 'hover:bg-blue-500/20', btnBorder: 'border-blue-500/30', focus: 'focus:border-blue-500/50' },
  purple: { bg: 'bg-purple-500', bgHover: 'hover:bg-purple-600', shadow: 'shadow-purple-500/20', textMuted: 'text-purple-400/80', blob: 'bg-purple-500/5', btnBg: 'bg-purple-500/10', btnHover: 'hover:bg-purple-500/20', btnBorder: 'border-purple-500/30', focus: 'focus:border-purple-500/50' },
  cyan: { bg: 'bg-cyan-500', bgHover: 'hover:bg-cyan-600', shadow: 'shadow-cyan-500/20', textMuted: 'text-cyan-400/80', blob: 'bg-cyan-500/5', btnBg: 'bg-cyan-500/10', btnHover: 'hover:bg-cyan-500/20', btnBorder: 'border-cyan-500/30', focus: 'focus:border-cyan-500/50' },
  violet: { bg: 'bg-violet-500', bgHover: 'hover:bg-violet-600', shadow: 'shadow-violet-500/20', textMuted: 'text-violet-400/80', blob: 'bg-violet-500/5', btnBg: 'bg-violet-500/10', btnHover: 'hover:bg-violet-500/20', btnBorder: 'border-violet-500/30', focus: 'focus:border-violet-500/50' },
  fuchsia: { bg: 'bg-fuchsia-500', bgHover: 'hover:bg-fuchsia-600', shadow: 'shadow-fuchsia-500/20', textMuted: 'text-fuchsia-400/80', blob: 'bg-fuchsia-500/5', btnBg: 'bg-fuchsia-500/10', btnHover: 'hover:bg-fuchsia-500/20', btnBorder: 'border-fuchsia-500/30', focus: 'focus:border-fuchsia-500/50' },
  rose: { bg: 'bg-rose-500', bgHover: 'hover:bg-rose-600', shadow: 'shadow-rose-500/20', textMuted: 'text-rose-400/80', blob: 'bg-rose-500/5', btnBg: 'bg-rose-500/10', btnHover: 'hover:bg-rose-500/20', btnBorder: 'border-rose-500/30', focus: 'focus:border-rose-500/50' },
  teal: { bg: 'bg-teal-500', bgHover: 'hover:bg-teal-600', shadow: 'shadow-teal-500/20', textMuted: 'text-teal-400/80', blob: 'bg-teal-500/5', btnBg: 'bg-teal-500/10', btnHover: 'hover:bg-teal-500/20', btnBorder: 'border-teal-500/30', focus: 'focus:border-teal-500/50' },
  slate: { bg: 'bg-slate-500', bgHover: 'hover:bg-slate-600', shadow: 'shadow-slate-500/20', textMuted: 'text-slate-400/80', blob: 'bg-slate-500/5', btnBg: 'bg-slate-500/10', btnHover: 'hover:bg-slate-500/20', btnBorder: 'border-slate-500/30', focus: 'focus:border-slate-500/50' }
};

/* ─── Profile Data Structure ─── */
const PROFILE_SECTIONS = [
  { id: 'personal', title: 'Personal info', icon: IconUser, baseColor: 'indigo', color: 'text-indigo-400', glow: 'shadow-[0_0_15px_rgba(99,102,241,0.2)]' },
  { id: 'address', title: 'Address', icon: IconMapPin, baseColor: 'emerald', color: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(52,211,153,0.2)]' },
  { id: 'education', title: 'Education', icon: IconGraduationCap, baseColor: 'sky', color: 'text-sky-400', glow: 'shadow-[0_0_15px_rgba(56,189,248,0.2)]' },
  { id: 'experience', title: 'Experience', icon: IconBriefcase, baseColor: 'blue', color: 'text-blue-400', glow: 'shadow-[0_0_15px_rgba(96,165,250,0.2)]' },
  { id: 'projects', title: 'Projects', icon: IconRocket, baseColor: 'purple', color: 'text-purple-400', glow: 'shadow-[0_0_15px_rgba(192,132,252,0.2)]' },
  { id: 'skills', title: 'Technical skills', icon: IconWrench, baseColor: 'cyan', color: 'text-cyan-400', glow: 'shadow-[0_0_15px_rgba(34,211,238,0.2)]' },
  { id: 'certifications', title: 'Certifications', icon: IconAward, baseColor: 'violet', color: 'text-violet-400', glow: 'shadow-[0_0_15px_rgba(167,139,250,0.2)]' },
  { id: 'awards', title: 'Awards', icon: IconTrophy, baseColor: 'fuchsia', color: 'text-fuchsia-400', glow: 'shadow-[0_0_15px_rgba(232,121,249,0.2)]' },
  { id: 'leadership', title: 'Leadership', icon: IconUsers, baseColor: 'indigo', color: 'text-indigo-400', glow: 'shadow-[0_0_15px_rgba(99,102,241,0.2)]' },
  { id: 'volunteer', title: 'Volunteer', icon: IconHeart, baseColor: 'rose', color: 'text-rose-400', glow: 'shadow-[0_0_15px_rgba(251,113,133,0.2)]' },
  { id: 'publications', title: 'Publications', icon: IconBookOpen, baseColor: 'blue', color: 'text-blue-400', glow: 'shadow-[0_0_15px_rgba(96,165,250,0.2)]' },
  { id: 'achievements', title: 'Achievements', icon: IconStar, baseColor: 'teal', color: 'text-teal-400', glow: 'shadow-[0_0_15px_rgba(45,212,191,0.2)]' }
];

/* ─── Dynamic Form Configuration ─── */
const FORM_CONFIGS = {
  personal: {
    type: 'single',
    fields: [
      { name: 'Full Name', default: 'Aarav Mehta' },
      { name: 'Role / Headline', default: 'Full-Stack Developer' },
      { name: 'Location', default: 'Bengaluru, India' },
      { name: 'Email Address', default: 'aarav.mehta@skillsphere.io' },
      { name: 'Phone Number', default: '+91 98765 43210' },
    ]
  },
  address: {
    type: 'single',
    fields: [
      { name: 'Country', default: 'India', options: ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Singapore', 'Other'] },
      { name: 'City', default: 'Bengaluru' },
      { name: 'Postal Code', default: '560001' }
    ]
  },
  education: {
    type: 'list', itemLabel: 'Education',
    fields: [
      { name: 'School / University', default: 'National Institute of Technology' },
      { name: 'Degree', default: 'B.Tech in Computer Science', options: ['High School', 'Associate Degree', 'B.Tech in Computer Science', 'Bachelor of Science', 'Bachelor of Arts', 'Master of Science', 'MBA', 'Ph.D', 'Other'] },
      { name: 'Start Year', default: '2018', options: Array.from({length: 51}, (_, i) => String(2025 - i)) },
      { name: 'End Year', default: '2022', options: ['Present', ...Array.from({length: 56}, (_, i) => String(2030 - i))] }
    ]
  },
  experience: {
    type: 'list', itemLabel: 'Experience',
    fields: [
      { name: 'Company', default: 'TechCorp Solutions' },
      { name: 'Job Title', default: 'Frontend Engineer' },
      { name: 'Start Date', default: 'Jun 2022' },
      { name: 'End Date', default: 'Present' },
      { name: 'Description', default: 'Led the migration to Next.js...' }
    ]
  },
  projects: {
    type: 'list', itemLabel: 'Project',
    fields: [
      { name: 'Project Name', default: 'Sphere AI Dashboard' },
      { name: 'Link', default: 'https://github.com/aarav/sphere' },
      { name: 'Tech Stack', default: 'React, Tailwind, Node.js' },
      { name: 'Description', default: 'A responsive dashboard for tracking metrics' }
    ]
  },
  skills: {
    type: 'list', itemLabel: 'Skill Category',
    fields: [
      { name: 'Category Name', default: 'Languages', options: ['Languages', 'Frameworks', 'Databases', 'Cloud & DevOps', 'Tools', 'Soft Skills', 'Other'] },
      { name: 'Skills (comma separated)', default: 'TypeScript, JavaScript, Python, Java, SQL' }
    ]
  },
  certifications: {
    type: 'list', itemLabel: 'Certification',
    fields: [
      { name: 'Certification Name', default: 'AWS Certified Solutions Architect' },
      { name: 'Issuing Organization', default: 'Amazon Web Services' },
      { name: 'Issue Date', default: 'Aug 2023' },
      { name: 'Credential URL', default: 'https://aws.amazon.com/verify' }
    ]
  },
  awards: {
    type: 'list', itemLabel: 'Award',
    fields: [
      { name: 'Award Title', default: 'Best Developer 2023' },
      { name: 'Issuer', default: 'TechCorp' },
      { name: 'Date', default: 'Dec 2023' }
    ]
  },
  leadership: {
    type: 'list', itemLabel: 'Leadership Role',
    fields: [
      { name: 'Role', default: 'Team Lead' },
      { name: 'Organization', default: 'TechCorp Frontend Team' },
      { name: 'Duration', default: 'Jan 2023 - Present' }
    ]
  },
  volunteer: {
    type: 'list', itemLabel: 'Volunteer Work',
    fields: [
      { name: 'Role', default: 'Mentor' },
      { name: 'Organization', default: 'Code for India' },
      { name: 'Duration', default: '2021 - 2022' }
    ]
  },
  publications: {
    type: 'list', itemLabel: 'Publication',
    fields: [
      { name: 'Title', default: 'Scaling Real-Time Dashboards on the Edge' },
      { name: 'Conference / journal', default: 'Dev.to Engineering Blog' },
      { name: 'Year', default: '2023' },
      { name: 'Publication link', default: 'https://dev.to/aaravmehta/scaling-realtime-dashboards' }
    ]
  },
  achievements: {
    type: 'list', itemLabel: 'Achievement',
    fields: [
      { name: 'Achievement / Highlight', default: 'Top 10% in HackerRank Algorithms' }
    ]
  }
};

const CustomSelect = ({ value, options, onChange, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-[0.9rem] text-white font-sans flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all shadow-inner"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate pr-2">{value || 'Select an option'}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-[#0f172a]/95 backdrop-blur-md border border-white/10 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-[100] overflow-hidden max-h-36 overflow-y-auto no-scrollbar">
          {options.map(opt => (
            <div 
              key={opt}
              className={`px-4 py-2.5 text-[0.9rem] font-sans cursor-pointer transition-colors ${value === opt ? `${theme.btnBg} ${theme.color}` : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProfileSectionContent = ({ sectionId, isEditing, setIsEditing }) => {
  const config = FORM_CONFIGS[sectionId];
  const sectionInfo = PROFILE_SECTIONS.find(s => s.id === sectionId);
  const theme = THEMES[sectionInfo.baseColor] || THEMES.indigo;
  const [items, setItems] = useState([]);
  const [backupItems, setBackupItems] = useState([]);

  // Load section data
  useEffect(() => {
    if (isEditing) return; // Prevent overwriting if they are currently editing somehow
    const defaultItems = [
      { ...config.fields.reduce((acc, field) => ({ ...acc, [field.name]: field.default }), {}), _id: Math.random().toString(36).substr(2, 9) }
    ];
    setItems(defaultItems);
    setBackupItems(defaultItems);
  }, [sectionId, config]);

  const handleAddItem = () => {
    const newItem = { ...config.fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}), _id: Math.random().toString(36).substr(2, 9) };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleChange = (index, fieldName, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [fieldName]: value };
    setItems(newItems);
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      // Save
      setBackupItems(items);
      setIsEditing(false);
    } else {
      // Enter edit mode
      setBackupItems(items);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setItems(backupItems);
    setIsEditing(false);
  };

  return (
    <div className="w-full card-glass rounded-2xl p-6 md:p-8 animate-in fade-in duration-300 relative group">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <div className={`absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 ${theme.blob} rounded-full blur-[60px] transition-all duration-700`}></div>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-white/5 border border-white/10 shadow-sm ${sectionInfo.color}`}>
            <sectionInfo.icon />
          </div>
          <h3 className="font-sans text-[1.1rem] font-semibold text-gray-300 tracking-wide">
            {sectionInfo.title}
          </h3>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {isEditing && (
            <button 
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg bg-transparent border border-white/10 text-gray-400 font-sans text-[0.8rem] font-semibold hover:bg-white/5 hover:text-white transition-all"
            >
              Cancel
            </button>
          )}
          <button 
            onClick={handleToggleEdit}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme.bg} text-white font-sans text-[0.85rem] font-semibold ${theme.bgHover} transition-all shadow-md ${theme.shadow} active:scale-95`}
          >
            {isEditing ? 'Save changes' : 'Edit'} {isEditing ? <IconCheck /> : <IconEdit2 />}
          </button>
        </div>
      </div>
      
      <div className="relative z-10">
        {config.type === 'list' ? (
          <div className="flex flex-col gap-6">
            {items.map((item, index) => (
              <div key={item._id} className="relative bg-white/5 border border-white/5 rounded-xl p-5 md:p-6 hover:bg-white/[0.07] hover:border-white/10 transition-all">
                {items.length > 1 && (
                  <div className="absolute -top-3 left-6 bg-[var(--bg-card)] px-3 text-[0.7rem] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    {config.itemLabel} {index + 1}
                  </div>
                )}
                {items.length > 1 && isEditing && (
                  <button onClick={() => handleRemoveItem(index)} className="absolute -top-3.5 right-6 text-red-400 hover:text-white flex items-center justify-center bg-[var(--bg-card)] hover:bg-red-500/20 rounded-full w-7 h-7 transition-colors border border-red-500/30 z-10 shadow-sm">
                    <IconClose />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-6">
                  {config.fields.map(field => (
                    <div key={field.name} className={`flex flex-col gap-1.5 ${field.name.toLowerCase().includes('description') ? 'md:col-span-2' : ''} ${!isEditing ? 'bg-white/[0.02] border border-white/5 p-4 rounded-xl' : ''}`}>
                      <label className={`font-sans text-[0.75rem] font-semibold uppercase tracking-widest ${!isEditing ? theme.textMuted : 'text-gray-400'}`}>{field.name}</label>
                      {isEditing ? (
                        field.name.toLowerCase().includes('description') ? (
                          <textarea 
                            value={item[field.name]}
                            onChange={(e) => handleChange(index, field.name, e.target.value)}
                            rows={3}
                            className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-[0.9rem] text-white font-sans focus:outline-none ${theme.focus} focus:bg-white/10 transition-all resize-none shadow-inner`}
                          />
                        ) : field.options ? (
                          <CustomSelect
                            value={item[field.name]}
                            options={field.options}
                            onChange={(val) => handleChange(index, field.name, val)}
                            theme={theme}
                          />
                        ) : (
                          <input 
                            type="text" 
                            value={item[field.name]}
                            onChange={(e) => handleChange(index, field.name, e.target.value)}
                            className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-[0.9rem] text-white font-sans focus:outline-none ${theme.focus} focus:bg-white/10 transition-all shadow-inner`}
                          />
                        )
                      ) : (
                        <p className="font-sans text-[0.95rem] font-medium text-gray-300 leading-relaxed">{item[field.name] || '—'}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {isEditing && (
              <button onClick={handleAddItem} className={`self-start flex items-center gap-2 font-sans text-[0.85rem] font-semibold ${sectionInfo.color} ${theme.btnBg} ${theme.btnHover} border ${theme.btnBorder} px-5 py-2.5 rounded-lg transition-all shadow-sm`}>
                <IconPlus /> Add {config.itemLabel.toLowerCase()}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-6">
            {config.fields.map(field => (
              <div key={field.name} className={`flex flex-col gap-1.5 ${!isEditing ? 'bg-white/[0.02] border border-white/5 p-4 rounded-xl' : ''}`}>
                <label className={`font-sans text-[0.75rem] font-semibold uppercase tracking-widest ${!isEditing ? theme.textMuted : 'text-gray-400'}`}>{field.name}</label>
                {isEditing ? (
                  field.options ? (
                    <CustomSelect
                      value={items[0]?.[field.name] || ''}
                      options={field.options}
                      onChange={(val) => handleChange(0, field.name, val)}
                      theme={theme}
                    />
                  ) : (
                    <input 
                      type="text" 
                      value={items[0]?.[field.name] || ''}
                      onChange={(e) => handleChange(0, field.name, e.target.value)}
                      className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-[0.9rem] text-white font-sans focus:outline-none ${theme.focus} focus:bg-white/10 transition-all shadow-inner`} 
                    />
                  )
                ) : (
                   <p className="font-sans text-[0.95rem] font-medium text-gray-300">{items[0]?.[field.name] || '—'}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const fileInputRef = useRef(null);
  const chipsContainerRef = useRef(null);

  const checkScroll = useCallback(() => {
    if (chipsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = chipsContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  }, []);

  useEffect(() => {
    // Small delay to ensure DOM is fully laid out before initial check
    const timeoutId = setTimeout(checkScroll, 100);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkScroll);
    };
  }, [searchQuery, checkScroll]);

  const handlePhotoClick = () => fileInputRef.current?.click();
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() !== '') {
      const firstMatch = PROFILE_SECTIONS.find(sec => sec.title.toLowerCase().includes(query.toLowerCase()));
      if (firstMatch && !isEditing) {
        setActiveSection(firstMatch.id);
        
        // Scroll the active chip into view, centering it if possible
        setTimeout(() => {
          const chipElement = document.getElementById(`chip-${firstMatch.id}`);
          if (chipElement && chipsContainerRef.current) {
            const container = chipsContainerRef.current;
            const scrollLeft = chipElement.offsetLeft - container.offsetLeft - (container.clientWidth / 2) + (chipElement.clientWidth / 2);
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
          }
        }, 50);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-12">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-4 mt-0">
          <div className="flex flex-col">
            <div className="mb-1 min-h-[20px]"></div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-sans flex items-center gap-2 tracking-tight leading-tight">
              My Profile
            </div>
            <p className="font-sans text-[0.95rem] text-gray-400 mt-1.5 font-medium">
              Manage your personal information and verified skills.
            </p>
          </div>
          <div className="font-sans text-[0.8rem] text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 font-semibold tracking-widest uppercase">
            82% Complete
          </div>
        </div>

        {/* Top Profile Banner - Glassmorphic */}
        <div className="w-full card-glass rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden group">
          {/* Decorative glowing blobs */}
          <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          
          <div className="relative z-10 shrink-0 group/avatar cursor-pointer" onClick={handlePhotoClick}>
            <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*" />
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)] overflow-hidden border border-white/20 transition-transform duration-300 group-hover/avatar:scale-105">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="font-sans text-3xl sm:text-4xl font-black text-white tracking-widest drop-shadow-md">AM</span>
              )}
            </div>
            <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[var(--bg-card)] flex items-center justify-center text-cyan-400 border border-cyan-500/30 shadow-[0_4px_12px_rgba(34,211,238,0.2)] hover:bg-cyan-500/20 hover:text-cyan-300 transition-all z-20">
              <IconCamera />
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center sm:items-start gap-1 mt-2 text-center sm:text-left flex-1">
            <h2 className="font-sans text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">Aarav Mehta</h2>
            <p className="font-sans text-[0.95rem] text-indigo-300 font-semibold tracking-wide">Full-Stack Developer</p>
            <p className="font-sans text-[0.85rem] text-gray-400 mt-1 flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="text-gray-500"><IconMapPin /></span> Bengaluru, India
            </p>
          </div>
          
          <div className="relative z-10 hidden lg:flex flex-col items-end gap-2 self-center mr-2">
             <div className="text-right">
               <div className="font-sans text-[0.75rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</div>
               <div className="flex items-center gap-2 font-sans text-[0.85rem] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div> Available
               </div>
             </div>
          </div>
        </div>

        {/* YouTube-style Search & Filter Navigation (Desktop) & Dropdown (Mobile) */}
        
        {/* Mobile Custom Grid Menu (2 chips per row) */}
        <div className="w-full sm:hidden flex flex-col gap-3 mb-6 mt-2 relative z-20">
          <div className="flex items-center gap-3">
            {/* Search Input for Mobile */}
            <div className="flex flex-1 items-center gap-2 px-3 py-2.5 rounded-xl font-sans text-[0.95rem] font-medium transition-all duration-300 bg-[var(--bg-nav)] text-[var(--text-primary)] focus-within:bg-[var(--bg-card-hover)] border border-[var(--border-card)] focus-within:border-[var(--border-hover)] cursor-text">
               <span className="text-[var(--text-secondary)]"><IconSearch /></span>
               <input 
                 type="text"
                 value={searchQuery}
                 onChange={handleSearchChange}
                 placeholder="Search options..."
                 className="bg-transparent border-none outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)] w-full transition-all duration-300 font-medium"
               />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 w-full">
            {PROFILE_SECTIONS.map(section => {
              const isActive = activeSection === section.id;
              const isDisabled = isEditing && !isActive;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    if (!isEditing) setActiveSection(section.id);
                  }}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-lg font-sans text-[0.8rem] font-bold transition-all duration-300 w-full overflow-hidden ${
                    isActive 
                      ? `${THEMES[section.baseColor]?.bg || 'bg-indigo-500'} text-white ${THEMES[section.baseColor]?.bgHover || 'hover:bg-indigo-600'} shadow-md` 
                      : `bg-[var(--bg-nav)] text-[var(--text-primary)] border border-[var(--border-card)] ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--bg-card-hover)]'}`
                  }`}
                >
                  <span className={`transition-colors duration-300 scale-90 shrink-0 ${isActive ? 'text-white' : section.color || 'text-gray-400'}`}>
                    <section.icon />
                  </span>
                  <span className="truncate">{section.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Search & Chips Container */}
        <div className="hidden sm:flex w-full items-center gap-4 mb-6 mt-2">
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-sans text-[0.85rem] font-medium transition-all duration-300 shrink-0 bg-[var(--bg-nav)] text-[var(--text-primary)] focus-within:bg-[var(--bg-card-hover)] border border-[var(--border-card)] focus-within:border-[var(--border-hover)] cursor-text">
             <span className="text-[var(--text-secondary)]"><IconSearch /></span>
             <input 
               type="text"
               value={searchQuery}
               onChange={handleSearchChange}
               placeholder="Search..."
               className="bg-transparent border-none outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)] w-[160px] focus:w-[200px] md:w-[200px] md:focus:w-[250px] transition-all duration-300 font-medium"
             />
          </div>

          <div className="hidden sm:block w-px h-6 bg-[var(--border-card)] shrink-0 mx-1"></div>

          {/* Chips Container */}
          <div className="relative flex-1 flex items-center overflow-hidden w-full group">
            {/* Scroll Left Arrow */}
            {canScrollLeft && (
              <button 
                onClick={() => { chipsContainerRef.current?.scrollBy({ left: -250, behavior: 'smooth' }); }}
                className="absolute left-0 w-8 h-8 rounded-full bg-[var(--bg-card)] border border-[var(--border-card)] shadow-[10px_0_15px_var(--bg-page)] items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors z-10 hidden md:flex shrink-0 opacity-0 group-hover:opacity-100">
                <IconChevronLeft />
              </button>
            )}
            
            <div ref={chipsContainerRef} onScroll={checkScroll} id="pb-chips-container" className="flex overflow-x-auto no-scrollbar items-center gap-3 py-1 w-full scroll-smooth px-1" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)' }}>
              
              {PROFILE_SECTIONS.map(section => {
                const isActive = activeSection === section.id;
                const isDisabled = isEditing && !isActive;
                return (
                  <button
                    key={section.id}
                    id={`chip-${section.id}`}
                    onClick={() => {
                      if (!isEditing) setActiveSection(section.id);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-sans text-[0.85rem] font-bold transition-all duration-300 shrink-0 ${
                      isActive 
                        ? `${THEMES[section.baseColor]?.bg || 'bg-indigo-500'} text-white ${THEMES[section.baseColor]?.bgHover || 'hover:bg-indigo-600'} shadow-md ${THEMES[section.baseColor]?.shadow || ''}` 
                        : `bg-[var(--bg-nav)] text-[var(--text-primary)] border border-transparent ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--bg-card-hover)]'}`
                    }`}
                  >
                    <span className={`transition-colors duration-300 scale-90 ${isActive ? 'text-white' : section.color || 'text-gray-400'}`}>
                      <section.icon />
                    </span>
                    {section.title}
                  </button>
                );
              })}
            </div>
            
            {/* Scroll Right Arrow */}
            {canScrollRight && (
              <button 
                onClick={() => { chipsContainerRef.current?.scrollBy({ left: 250, behavior: 'smooth' }); }}
                className="absolute right-0 w-8 h-8 rounded-full bg-[var(--bg-card)] border border-[var(--border-card)] shadow-[-10px_0_15px_var(--bg-page)] items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors z-10 hidden md:flex shrink-0 opacity-0 group-hover:opacity-100">
                <IconChevronRight />
              </button>
            )}
          </div>
        </div>

        {/* Active Section Form */}
        <div className="w-full pb-0">
          <ProfileSectionContent 
            sectionId={activeSection} 
            isEditing={isEditing} 
            setIsEditing={setIsEditing} 
          />
        </div>

        {/* Floating AI Button */}
        <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#0f172a] border border-[#22d3ee]/50 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105 transition-transform z-50 hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]">
          <div className="scale-125">
            <LogoMark />
          </div>
        </button>
      </div>
  );
}