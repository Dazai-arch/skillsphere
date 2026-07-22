import React, { useState } from 'react';
import { LogoMark } from '../../components/shared/Topbar';
import ApplicationModal from '../../components/modals/ApplicationModal';
import { useJobs } from '../../context/JobsContext';

/* ==========================================================================
   ICONS
   ========================================================================== */
const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconMapPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconUsers = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconBookmark = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconSparkles = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);

/* ==========================================================================
   MOCK DATA
   ========================================================================== */
const JOBS_DATA = [
  {
    id: 1,
    role: 'Senior Frontend Engineer',
    company: 'Stripe',
    logo: '💳', 
    match: 94,
    description: 'Build the next generation of payment dashboards used by millions of businesses.',
    tags: ['React', 'TypeScript', 'GraphQL', 'Design Systems'],
    location: 'Remote - US',
    time: '2 days ago',
    applicants: 142,
    salary: '$165k – $210k',
    status: 'Shortlisted', 
    type: 'Full-time'
  },
  {
    id: 2,
    role: 'Full-Stack Engineer',
    company: 'Vercel',
    logo: '▲',
    match: 89,
    description: 'Ship the frontend cloud. Work across our dashboard, CLI, and edge runtime.',
    tags: ['Next.js', 'Node.js', 'PostgreSQL', 'Edge'],
    location: 'Remote - Global',
    time: '5 hours ago',
    applicants: 88,
    salary: '$150k – $190k',
    status: 'Under Review',
    type: 'Full-time'
  },
  {
    id: 3,
    role: 'Product Engineer',
    company: 'Notion',
    logo: '📝',
    match: 86,
    description: 'Blend design and engineering to craft delightful productivity tools.',
    tags: ['React', 'TypeScript', 'Rust', 'WASM'],
    location: 'Remote - US',
    time: '3 days ago',
    applicants: 201,
    salary: '$155k – $200k',
    status: null, // Not applied
    type: 'Contract'
  },
  {
    id: 4,
    role: 'Platform Engineer',
    company: 'Linear',
    logo: '📐',
    match: 81,
    description: 'Own the infrastructure powering the issue tracker engineers love.',
    tags: ['TypeScript', 'Go', 'Kubernetes', 'AWS'],
    location: 'San Francisco, CA',
    time: '1 day ago',
    applicants: 56,
    salary: '$170k – $220k',
    status: 'Applied',
    type: 'Full-time'
  },
  {
    id: 5,
    role: 'DevOps Engineer',
    company: 'GitHub',
    logo: '🐙',
    match: 72,
    description: 'Keep the world\'s largest developer platform fast, safe, and reliable.',
    tags: ['Kubernetes', 'Terraform', 'AWS', 'Go'],
    location: 'Remote - Global',
    time: '4 days ago',
    applicants: 310,
    salary: '$140k – $180k',
    status: null,
    type: 'Full-time'
  },
  {
    id: 6,
    role: 'ML Engineer',
    company: 'Hugging Face',
    logo: '🤗',
    match: 63,
    description: 'Push the boundaries of open-source machine learning at scale.',
    tags: ['Python', 'PyTorch', 'Transformers', 'CUDA'],
    location: 'Paris, France',
    time: '6 days ago',
    applicants: 89,
    salary: '$130k – $170k',
    status: null,
    type: 'Full-time'
  }
];

/* ==========================================================================
   COMPONENTS
   ========================================================================== */
function CircularProgress({ match }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (match / 100) * circumference;
  
  // Color logic based on screenshot
  let colorClass = 'text-green-400';
  if (match < 80) colorClass = 'text-yellow-400';
  if (match < 70) colorClass = 'text-orange-400';

  return (
    <div className="relative flex items-center justify-center w-12 h-12">
      <svg className="transform -rotate-90 w-12 h-12">
        {/* Background circle */}
        <circle cx="24" cy="24" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-700" />
        {/* Progress circle */}
        <circle 
          cx="24" cy="24" r={radius} 
          stroke="currentColor" strokeWidth="4" fill="transparent" 
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} 
          className={`${colorClass} transition-all duration-1000 ease-out`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute font-sans text-[0.7rem] font-bold text-white">{match}%</span>
    </div>
  );
}

function JobCard({ job, isAppliedTab, isBookmarked, toggleBookmark }) {
  const [showModal, setShowModal] = useState(false);

  // Determine status pill styling
  const statusStyles = {
    'Shortlisted': 'text-green-400 bg-green-500/10 border-green-500/20',
    'Under Review': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    'Applied': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
  };

  return (
    <div className="job-card flex flex-col bg-[#0f172a]/60 border border-white/5 rounded-2xl p-5 hover:bg-[#151f38] hover:border-white/10 transition-all duration-300 shadow-lg group">
      
      {/* Top Row: Logo, Title, Match */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl shadow-inner border border-white/5">
            {job.logo}
          </div>
          <div>
            <h3 className="font-sans text-[1.05rem] font-bold text-white tracking-wide">{job.role}</h3>
            <p className="font-sans text-[0.9rem] text-gray-400 font-medium">{job.company}</p>
          </div>
        </div>
        {!isAppliedTab && <CircularProgress match={job.match} />}
      </div>

      {/* Description */}
      <p className="font-sans text-[0.85rem] text-gray-400 leading-relaxed mb-4 flex-1">
        {job.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.tags.map(tag => (
          <span key={tag} className="px-2.5 py-1 rounded-md bg-white/5 text-gray-300 font-sans text-[0.75rem] font-medium tracking-wide">
            {tag}
          </span>
        ))}
      </div>

      {/* Meta info (Location, Time, Applicants) */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5 text-[0.75rem] font-sans text-gray-400 font-medium">
        <div className="flex items-center gap-1.5"><IconMapPin /> {job.location}</div>
        <div className="flex items-center gap-1.5"><IconClock /> {job.time}</div>
        <div className="flex items-center gap-1.5"><IconUsers /> {job.applicants} applied</div>
      </div>

      {/* Bottom Row: Salary & Actions */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
        <span className="font-sans text-[0.95rem] font-bold text-cyan-400 tracking-wide drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
          {job.salary}
        </span>
        
        <div className="flex items-center gap-3">
          {isAppliedTab ? (
            <div className={`px-3 py-1.5 rounded-full font-sans text-[0.75rem] font-bold tracking-widest uppercase border ${statusStyles[job.status] || 'text-gray-400 bg-gray-500/10 border-gray-500/20'}`}>
              {job.status}
            </div>
          ) : (
            <>
              <button 
                onClick={() => toggleBookmark(job.id)}
                className={`p-2 rounded-lg transition-all ${isBookmarked ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                aria-label="Bookmark"
              >
                <IconBookmark filled={isBookmarked} />
              </button>
              <button 
                onClick={() => setShowModal(true)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-sans text-[0.85rem] font-bold shadow-[0_4px_14px_rgba(34,211,238,0.3)] hover:shadow-[0_6px_20px_rgba(34,211,238,0.4)] transition-all active:scale-95"
              >
                Apply
              </button>
            </>
          )}
        </div>
      </div>
      <ApplicationModal isOpen={showModal} onClose={() => setShowModal(false)} job={job} />
    </div>
  );
}

/* ==========================================================================
   MAIN PAGE
   ========================================================================== */
export default function JobsPage() {
  const { publishedJobs } = useJobs();
  const [activeTab, setActiveTab] = useState('matched'); // 'matched', 'applications', 'bookmarked'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [bookmarkedIds, setBookmarkedIds] = useState([1, 4]); // Pre-populate with some mock bookmarks

  const toggleBookmark = (id) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  // Combine mock data with dynamically published jobs
  const dynamicJobs = publishedJobs.map(job => ({
    id: job.id,
    role: job.title,
    company: 'Your Company', // Mocked since company profile isn't fully integrated yet
    logo: '🏢',
    match: 95,
    description: job.description?.substring(0, 100) + '...',
    tags: job.skills || [],
    location: job.location || 'Remote',
    time: 'Just now',
    applicants: 0,
    salary: job.minSalary && job.maxSalary ? `${job.currency} ${job.minSalary} - ${job.maxSalary}` : 'Competitive',
    status: null,
    type: job.employmentType || 'Full-time'
  }));

  const allJobs = [...dynamicJobs, ...JOBS_DATA];

  // Filter jobs based on active tab and search
  const filteredJobs = allJobs.filter(job => {
    // 1. Tab filtering
    if (activeTab === 'applications' && !job.status) return false;
    if (activeTab === 'bookmarked' && !bookmarkedIds.includes(job.id)) return false;
    
    // 2. Type filtering
    if (activeFilter !== 'All') {
      if (activeFilter === 'Remote' && !job.location.toLowerCase().includes('remote')) return false;
      if (activeFilter === 'Full-time' && job.type !== 'Full-time') return false;
      if (activeFilter === 'Contract' && job.type !== 'Contract') return false;
    }

    // 3. Search filtering
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        job.role.toLowerCase().includes(q) || 
        job.company.toLowerCase().includes(q) || 
        job.tags.some(t => t.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    return true;
  });

  const appliedCount = allJobs.filter(j => j.status).length;
  const bookmarkedCount = bookmarkedIds.length;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 relative mt-5">
        
        {/* Header & Tabs */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans flex items-center gap-2 tracking-tight leading-tight mb-2">
            Opportunity Hub
          </h1>
          <p className="job-subtitle font-sans text-[0.9rem] text-gray-400 mb-4 tracking-wide">Jobs matched to your verified skills, ranked by fit.</p>
          
          <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-1">
            <button 
              onClick={() => setActiveTab('matched')}
              className={`px-4 py-2 font-sans text-[0.9rem] font-semibold transition-all ${activeTab === 'matched' ? 'text-white border-b-2 border-indigo-400 bg-white/5 rounded-t-lg' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Matched jobs
            </button>
            <button 
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2 font-sans text-[0.9rem] font-semibold transition-all ${activeTab === 'applications' ? 'text-white border-b-2 border-indigo-400 bg-white/5 rounded-t-lg' : 'text-gray-400 hover:text-gray-200'}`}
            >
              My applications ({appliedCount})
            </button>
            <button 
              onClick={() => setActiveTab('bookmarked')}
              className={`px-4 py-2 font-sans text-[0.9rem] font-semibold transition-all ${activeTab === 'bookmarked' ? 'text-white border-b-2 border-indigo-400 bg-white/5 rounded-t-lg' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Bookmarked ({bookmarkedCount})
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <IconSearch />
            </div>
            <input 
              type="text" 
              placeholder="Search by role, company or skill..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="job-search-input w-full bg-[#0f172a]/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-[0.95rem] text-white font-sans focus:outline-none focus:border-indigo-500/50 focus:bg-[#0f172a]/80 transition-all shadow-inner placeholder:text-gray-500"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2 pb-1">
            {[
              { name: 'All', active: 'bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)] filter-pill-active-all', inactive: 'bg-transparent text-gray-400 hover:bg-indigo-500/10 hover:text-indigo-400' },
              { name: 'Full-time', active: 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)] filter-pill-active-fulltime', inactive: 'bg-transparent text-gray-400 hover:bg-emerald-500/10 hover:text-emerald-400' },
              { name: 'Remote', active: 'bg-cyan-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)] filter-pill-active-remote', inactive: 'bg-transparent text-gray-400 hover:bg-cyan-500/10 hover:text-cyan-400' },
              { name: 'Contract', active: 'bg-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.4)] filter-pill-active-contract', inactive: 'bg-transparent text-gray-400 hover:bg-orange-500/10 hover:text-orange-400' }
            ].map(filter => (
              <button 
                key={filter.name}
                onClick={() => setActiveFilter(filter.name)}
                className={`shrink-0 px-4 py-1.5 rounded-full font-sans text-[0.8rem] font-bold transition-all ${activeFilter === filter.name ? filter.active : filter.inactive}`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>

        {/* Job Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
            {filteredJobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                isAppliedTab={activeTab === 'applications'} 
                isBookmarked={bookmarkedIds.includes(job.id)}
                toggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-500 mb-4">
              <IconSearch />
            </div>
            <h3 className="font-sans text-lg font-semibold text-white mb-1">No jobs found</h3>
            <p className="font-sans text-[0.9rem] text-gray-400">Try adjusting your filters or search query.</p>
          </div>
        )}

        {/* Floating Action Button */}
        <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#0f172a] border border-[#22d3ee]/50 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105 transition-transform z-50 hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]">
          <div className="scale-125">
            <LogoMark />
          </div>
        </button>

      </div>
  );
}