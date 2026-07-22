import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../../context/JobsContext';
import { LogoMark } from '../../components/shared/Topbar';
import { Editor, EditorProvider, Toolbar, BtnBold, BtnItalic, BtnStrikeThrough, BtnLink, BtnBulletList, BtnNumberedList } from 'react-simple-wysiwyg';



const CustomSelect = ({ name, value, options, onChange, className = "w-full", placement = "bottom" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between cursor-pointer w-full bg-[var(--card-inner-bg)] hover:bg-[var(--bg-card)] border ${isOpen ? 'border-purple-500/60 ring-2 ring-purple-500/60' : 'border-[var(--border-card)]'} rounded-xl px-4 py-3.5 text-[var(--text-primary)] font-sans text-[0.95rem] transition-all`}
      >
        <span>{value}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-[var(--text-secondary)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isOpen && (
        <div className={`absolute left-0 z-[100] w-full bg-[var(--bg-panel)] border border-[var(--border-card)] rounded-xl shadow-2xl overflow-hidden py-1.5 ${placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
          <ul className="max-h-40 overflow-y-auto custom-scrollbar">
            {options.map((opt) => (
              <li 
                key={opt} 
                onClick={() => {
                  onChange({ target: { name, value: opt } });
                  setIsOpen(false);
                }}
                className={`px-4 py-3 cursor-pointer font-sans text-[0.95rem] transition-colors ${value === opt ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold' : 'text-[var(--text-primary)] hover:bg-[var(--card-inner-bg)] hover:text-purple-600 dark:hover:text-purple-400'}`}
              >
                {opt}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


/* ── Icons ── */




const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const STANDARD_PERKS = ['Health Insurance', 'Paid Time Off', '401(k) / PF Matching', 'Remote Work', 'Flexible Hours', 'Gym Membership', 'Free Lunch'];

export default function PostJobPage() {
  const navigate = useNavigate();
  const { saveDraft, publishJob } = useJobs();
  
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    title: '', department: '', location: '', workplaceType: 'Hybrid', employmentType: 'Full-time',
    openings: '1', applicationDeadline: '',
    minSalary: '', maxSalary: '', currency: 'INR', experienceLevel: 'Mid-Senior', educationLevel: 'No strict requirement',
    description: '',
    applicationMethod: 'email', applicationEmail: '', applicationUrl: '',
    requireResume: true, requireCoverLetter: false, visaSponsorship: false
  });

  const [skills, setSkills] = useState(['React', 'Node.js', 'System Design']);
  const [skillInput, setSkillInput] = useState('');

  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const SUGGESTED_SKILLS = ['React', 'Node.js', 'System Design', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'REST API', 'MongoDB', 'PostgreSQL', 'Redis', 'Figma', 'UI/UX', 'Product Management', 'Agile'];
  const filteredSkills = SUGGESTED_SKILLS.filter(s => s.toLowerCase().includes(skillInput.toLowerCase()) && !skills.includes(s));

  
  const [perks, setPerks] = useState(['Health Insurance', 'Remote Work']);
  const [questions, setQuestions] = useState([{ id: 1, text: 'How many years of React experience do you have?' }]);

  const [showDraftToast, setShowDraftToast] = useState(false);
  const [showPublishToast, setShowPublishToast] = useState(false);
  const [formError, setFormError] = useState('');


  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'minSalary' || name === 'maxSalary') {
      value = value.replace(/\D/g, '');
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const togglePerk = (p) => {
    if (perks.includes(p)) setPerks(perks.filter(perk => perk !== p));
    else setPerks([...perks, p]);
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = skillInput.trim();
      if (val && !skills.includes(val)) setSkills([...skills, val]);
      setSkillInput('');
    }
  };

  const removeSkill = (sk) => {
    setSkills(skills.filter(s => s !== sk));
  };

  const addQuestion = () => setQuestions([...questions, { id: Date.now(), text: '' }]);
  const updateQuestion = (id, text) => setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
  const removeQuestion = (id) => setQuestions(questions.filter(q => q.id !== id));

  const STEPS = [
    { id: 1, name: 'Basics' },
    { id: 2, name: 'Description & Skills' },
    { id: 3, name: 'Screening' }
  ];

  /* ── State Handlers ── */
  const handleSaveDraft = () => {
    saveDraft({
      ...formData,
      skills,
      perks,
      questions
    });
    setShowDraftToast(true);
    setTimeout(() => {
      setShowDraftToast(false);
    }, 3000);
  };

  const handleNextStep = () => {
    setFormError('');
    if (step === 1) {
      if (!formData.title || !formData.department || !formData.location || !formData.openings || !formData.minSalary || !formData.maxSalary) {
        setFormError('Please fill out all required fields in Basics & Compensation.');
        return;
      }
    } else if (step === 2) {
      if (!formData.description || formData.description.trim() === '' || formData.description === '<br>') {
        setFormError('Please provide a Job Description.');
        return;
      }
      if (skills.length === 0) {
        setFormError('Please add at least one required skill.');
        return;
      }
      if (perks.length === 0) {
        setFormError('Please select at least one benefit or perk.');
        return;
      }
    }
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setFormError('');
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublishJob = () => {
    setFormError('');
    if (formData.applicationMethod === 'email' && !formData.applicationEmail) {
      setFormError('Please provide an email address.');
      return;
    }
    if (formData.applicationMethod === 'url' && !formData.applicationUrl) {
      setFormError('Please provide a URL.');
      return;
    }

    publishJob({
      ...formData,
      skills,
      perks,
      questions
    });
    
    setShowPublishToast(true);
    setTimeout(() => {
      setShowPublishToast(false);
      // Reset form
      setFormData({
        title: '', department: '', location: '', workplaceType: 'Hybrid', employmentType: 'Full-time',
        openings: '1', applicationDeadline: '',
        minSalary: '', maxSalary: '', currency: 'INR', experienceLevel: 'Mid-Senior', educationLevel: 'No strict requirement',
        description: '',
        applicationMethod: 'email', applicationEmail: '', applicationUrl: '',
        requireResume: true, requireCoverLetter: false, visaSponsorship: false
      });
      setSkills(['React', 'Node.js', 'System Design']);
      setPerks(['Health Insurance', 'Remote Work']);
      setQuestions([{ id: 1, text: 'How many years of React experience do you have?' }]);
      setStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2500);
  };

  
  return (
    <>
      
      <div className="w-full  pt-2">
        
        {/* Publish Toast Notification */}
        {showPublishToast && (
          <div className="fixed top-24 right-6 sm:right-10 z-50 animate-[fade-in_0.3s_ease-out] bg-[var(--bg-card)] border border-[var(--border-card)] px-4 py-3 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-[var(--text-primary)] font-bold text-sm font-sans m-0 leading-tight">Job Successfully Posted!</h4>
              <p className="text-[var(--text-secondary)] text-xs font-sans m-0 mt-0.5">Redirecting to new listing...</p>
            </div>
          </div>
        )}
        
        {/* Draft Toast Notification */}
        {showDraftToast && (
          <div className="fixed top-24 right-6 sm:right-10 z-50 animate-[fade-in_0.3s_ease-out] bg-[var(--bg-card)] border border-[var(--border-card)] px-4 py-3 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-[var(--text-primary)] font-bold text-sm font-sans m-0 leading-tight">Draft Saved!</h4>
              <p className="text-[var(--text-secondary)] text-xs font-sans m-0 mt-0.5">Your progress has been safely stored.</p>
            </div>
          </div>
        )}

        {/* Stepper Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8">
            <div className="flex flex-col">
              <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] font-sans flex items-center gap-2">
                Post a Job
              </div>
              <p className="font-sans text-[0.95rem] text-[var(--text-secondary)] mt-1.5 font-medium">
                Attract top talent by providing clear and exciting details about the role.
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-500/20 rounded-full z-0"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full z-0 transition-all duration-500" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}></div>
            
            {STEPS.map((s) => (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                <button 
                  onClick={() => s.id < step && setStep(s.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-lg ${
                    step >= s.id 
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-[var(--text-primary)] shadow-purple-500/40 ring-4 ring-purple-500/20 scale-110' 
                      : 'bg-[#0f1629] border-2 border-[var(--border-card)] text-gray-500 dark:text-gray-500'
                  }`}
                >
                  {step > s.id ? <IconCheck /> : s.id}
                </button>
                <span className={`absolute -bottom-7 whitespace-nowrap text-xs font-semibold ${step >= s.id ? 'text-purple-600 dark:text-purple-300' : 'text-gray-500 dark:text-gray-500'}`}>
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: BASICS */}
        {step === 1 && (
          <div className="animate-[fade-in_0.3s_ease-out]">
            <section className="card-glass bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20 border-purple-200 dark:border-purple-500/30 rounded-2xl p-6 sm:p-8 mb-6 border shadow-[0_8px_30px_rgba(168,85,247,0.1)]">
              <h2 className="text-xl font-bold text-[var(--text-primary)] font-sans mb-6">Job Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2 font-sans">Job Title <span className="text-red-400">*</span></label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Senior Frontend Engineer" className="w-full bg-[var(--card-inner-bg)] hover:bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl px-4 py-3.5 text-[var(--text-primary)] font-sans text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/60 transition-all placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2 font-sans">Department <span className="text-red-400">*</span></label>
                  <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="e.g. Engineering" className="w-full bg-[var(--card-inner-bg)] hover:bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl px-4 py-3.5 text-[var(--text-primary)] font-sans text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/60 transition-all placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2 font-sans">Location <span className="text-red-400">*</span></label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Bengaluru, India" className="w-full bg-[var(--card-inner-bg)] hover:bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl px-4 py-3.5 text-[var(--text-primary)] font-sans text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/60 transition-all placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2 font-sans">Workplace Type</label>
                  <CustomSelect name="workplaceType" value={formData.workplaceType} onChange={handleChange} options={['On-site', 'Hybrid', 'Remote']} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2 font-sans">Employment Type</label>
                  <CustomSelect name="employmentType" value={formData.employmentType} onChange={handleChange} options={['Full-time', 'Part-time', 'Contract', 'Internship']} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2 font-sans">Number of Openings <span className="text-red-400">*</span></label>
                  <input type="number" name="openings" min="1" value={formData.openings} onChange={handleChange} className="w-full bg-[var(--card-inner-bg)] hover:bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl px-4 py-3.5 text-[var(--text-primary)] font-sans text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/60 transition-all placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2 font-sans">Application Deadline (Optional)</label>
                  <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} className="w-full bg-[var(--card-inner-bg)] hover:bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl px-4 py-3.5 text-[var(--text-primary)] font-sans text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/60 transition-all placeholder-gray-400" />
                </div>
              </div>
            </section>

            <section className="card-glass bg-gradient-to-br from-pink-500/20 via-rose-500/10 to-orange-500/20 border-rose-200 dark:border-rose-500/30 rounded-2xl p-6 sm:p-8 border shadow-[0_8px_30px_rgba(244,63,94,0.1)]">
              <h2 className="text-xl font-bold text-[var(--text-primary)] font-sans mb-6">Compensation & Seniority</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2 font-sans">Salary Range <span className="text-red-400">*</span></label>
                  <div className="flex items-center gap-2">
                    <CustomSelect name="currency" value={formData.currency} onChange={handleChange} options={['USD', 'EUR', 'GBP', 'INR', 'AUD']} className="w-24 shrink-0" />
                    <input type="number" name="minSalary" min="0" placeholder="Min" value={formData.minSalary} onChange={handleChange} className="flex-1 bg-[var(--card-inner-bg)] hover:bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl px-4 py-3.5 text-[var(--text-primary)] font-sans text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/60 transition-all placeholder-gray-400" />
                    <span className="text-orange-300 font-bold">-</span>
                    <input type="number" name="maxSalary" min="0" placeholder="Max" value={formData.maxSalary} onChange={handleChange} className="flex-1 bg-[var(--card-inner-bg)] hover:bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl px-4 py-3.5 text-[var(--text-primary)] font-sans text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/60 transition-all placeholder-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2 font-sans">Experience Level</label>
                  <CustomSelect name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} options={['Entry Level', 'Mid-Senior', 'Director', 'Executive']} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2 font-sans">Education Level</label>
                  <CustomSelect name="educationLevel" value={formData.educationLevel} onChange={handleChange} options={['No strict requirement', 'High School or equivalent', "Bachelor's Degree", "Master's Degree", "PhD or equivalent"]} />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* STEP 2: DESCRIPTION & SKILLS */}
        {step === 2 && (
          <div className="animate-[fade-in_0.3s_ease-out]">
            <section className="card-glass bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-teal-500/20 border-cyan-200 dark:border-cyan-500/30 rounded-2xl p-6 sm:p-8 mb-6 border shadow-[0_8px_30px_rgba(6,182,212,0.1)]">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)] font-sans">Job Description</h2>
              </div>

              
              
              <div className="wysiwyg-wrapper">
                <EditorProvider>
                  <Editor 
                    value={formData.description} 
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    containerProps={{ 
                      className: "bg-[var(--card-inner-bg)] border border-[var(--border-card)] rounded-xl text-[var(--text-primary)] w-full min-h-[300px] overflow-hidden" 
                    }}
                  >
                    <Toolbar className="flex items-center gap-2 bg-[var(--card-inner-bg)] border-b border-[var(--border-card)] p-2">
                      <BtnBold />
                      <BtnItalic />
                      <BtnStrikeThrough />
                      <div className="w-px h-6 bg-[var(--border-card)] mx-2"></div>
                      <BtnBulletList />
                      <BtnNumberedList />
                      <div className="w-px h-6 bg-[var(--border-card)] mx-2"></div>
                      <BtnLink />
                    </Toolbar>
                  </Editor>
                </EditorProvider>
              </div>


            </section>

            <section className="card-glass bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-lime-500/20 border-green-200 dark:border-green-500/30 rounded-2xl p-6 sm:p-8 border shadow-[0_8px_30px_rgba(16,185,129,0.1)]">
              <h2 className="text-xl font-bold text-green-100 font-sans mb-6">Skills & Perks</h2>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2 font-sans">Required Skills</label>
                <div className="relative w-full">
                  <div className="w-full bg-[var(--card-inner-bg)] border border-[var(--border-card)] rounded-xl px-4 py-3.5 flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-purple-500/60 transition-all">
                    {skills.map((sk) => (
                      <div key={sk} className="inline-flex items-center gap-1.5 bg-indigo-500 text-white px-3 py-1.5 rounded-full shadow-sm">
                        <span className="text-[0.85rem] font-medium">{sk}</span>
                        <button onClick={() => removeSkill(sk)} className="text-[var(--text-primary)] hover:text-white transition-colors scale-75"><IconX /></button>
                      </div>
                    ))}
                    <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleSkillKeyDown} onFocus={() => setShowSkillSuggestions(true)} onBlur={() => setTimeout(() => setShowSkillSuggestions(false), 200)} placeholder={skills.length === 0 ? "Type a skill e.g. React" : ""} className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-[var(--text-primary)] font-sans text-[0.95rem] px-2 py-1 placeholder-gray-400" />
                  </div>
                  {/* Dropdown */}
                  {showSkillSuggestions && skillInput && filteredSkills.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl shadow-xl overflow-hidden z-50 max-h-48 overflow-y-auto animate-[fade-in_0.2s_ease-out]">
                      {filteredSkills.map(sk => (
                        <div key={sk} onClick={() => {
                          setSkills([...skills, sk]);
                          setSkillInput('');
                          setShowSkillSuggestions(false);
                        }} className="px-4 py-2 hover:bg-[var(--card-inner-bg)] cursor-pointer text-[var(--text-primary)] transition-colors text-sm font-sans">
                          {sk}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3 font-sans">Benefits & Perks (Optional)</label>
                <div className="flex flex-wrap gap-2.5">
                  {STANDARD_PERKS.map(perk => {
                    const isSelected = perks.includes(perk);
                    return (
                      <button key={perk} onClick={() => togglePerk(perk)} className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${isSelected ? 'bg-indigo-500 text-white border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.3)]' : 'bg-[var(--card-inner-bg)] border-[var(--border-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]'}`}>
                        {isSelected ? '✓ ' : '+ '}{perk}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* STEP 3: SCREENING & SETTINGS */}
        {step === 3 && (
          <div className="animate-[fade-in_0.3s_ease-out]">
            <section className="card-glass bg-gradient-to-br from-fuchsia-500/20 via-purple-500/10 to-indigo-500/20 border-fuchsia-200 dark:border-fuchsia-500/30 rounded-2xl p-6 sm:p-8 mb-6 border shadow-[0_8px_30px_rgba(217,70,239,0.1)]">
              <h2 className="text-xl font-bold text-[var(--text-primary)] font-sans mb-2">Screening Questions</h2>
              <p className="text-[var(--text-secondary)] text-sm font-sans mb-6">Filter applicants instantly by adding must-have questions to your application process.</p>
              
              <div className="flex flex-col gap-4 mb-4">
                {questions.map((q, idx) => (
                  <div key={q.id} className="flex gap-3 items-start">
                    <span className="w-8 h-8 rounded bg-fuchsia-adaptive font-bold flex items-center justify-center shrink-0 shadow-inner">Q{idx + 1}</span>
                    <input type="text" value={q.text} onChange={(e) => updateQuestion(q.id, e.target.value)} placeholder="e.g. How many years of experience do you have with React?" className="flex-1 bg-[var(--card-inner-bg)] hover:bg-[var(--bg-card)] border border-[var(--border-card)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/60 transition-all placeholder-gray-400" />
                    <button onClick={() => removeQuestion(q.id)} className="w-10 h-10 rounded-lg border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:text-white hover:bg-red-500 hover:border-red-500 flex items-center justify-center shrink-0 transition-all backdrop-blur-md"><IconX /></button>
                  </div>
                ))}
              </div>
              <button onClick={addQuestion} className="flex items-center gap-2 text-fuchsia-adaptive font-bold font-sans text-sm transition-colors">
                <IconPlus /> Add another question
              </button>
            </section>

            <section className="card-glass bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-yellow-500/20 border-orange-200 dark:border-orange-500/30 rounded-2xl p-6 sm:p-8 border shadow-[0_8px_30px_rgba(249,115,22,0.1)]">
              <h2 className="text-xl font-bold text-[var(--text-primary)] font-sans mb-6">Application Settings</h2>
              
              <div className="mb-6 border-b border-orange-200 dark:border-orange-500/30 pb-6">
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3 font-sans">How would you like to receive applications?</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className={`flex-1 flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all backdrop-blur-md ${formData.applicationMethod === 'email' ? 'bg-orange-50 border-orange-400 dark:bg-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.15)]' : 'bg-[var(--card-inner-bg)] border-[var(--border-card)] hover:border-orange-400/50'}`}>
                    <input type="radio" name="applicationMethod" value="email" checked={formData.applicationMethod === 'email'} onChange={handleChange} className="w-4 h-4 accent-orange-500" />
                    <span className={`font-semibold font-sans ${formData.applicationMethod === 'email' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>By Email</span>
                  </label>
                  <label className={`flex-1 flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all backdrop-blur-md ${formData.applicationMethod === 'url' ? 'bg-orange-50 border-orange-400 dark:bg-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.15)]' : 'bg-[var(--card-inner-bg)] border-[var(--border-card)] hover:border-orange-400/50'}`}>
                    <input type="radio" name="applicationMethod" value="url" checked={formData.applicationMethod === 'url'} onChange={handleChange} className="w-4 h-4 accent-orange-500" />
                    <span className={`font-semibold font-sans ${formData.applicationMethod === 'url' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>External Website</span>
                  </label>
                </div>
                <div className="mt-4">
                  {formData.applicationMethod === 'email' ? (
                    <input type="email" name="applicationEmail" value={formData.applicationEmail} onChange={handleChange} placeholder="Email address to receive applications" className="w-full bg-[var(--card-inner-bg)] hover:bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl px-4 py-3.5 text-[var(--text-primary)] font-sans text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/60 transition-all placeholder-gray-400" />
                  ) : (
                    <input type="url" name="applicationUrl" value={formData.applicationUrl} onChange={handleChange} placeholder="https://careers.yourcompany.com/job-id" className="w-full bg-[var(--card-inner-bg)] hover:bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl px-4 py-3.5 text-[var(--text-primary)] font-sans text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/60 transition-all placeholder-gray-400" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3 font-sans">Required Documents</label>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5 rounded bg-[var(--card-inner-bg)] border border-[var(--border-card)] group-hover:border-orange-400 transition-colors backdrop-blur-md">
                      <input type="checkbox" name="requireResume" checked={formData.requireResume} onChange={(e) => setFormData(p => ({ ...p, requireResume: e.target.checked }))} className="peer opacity-0 absolute inset-0 cursor-pointer" />
                      <div className="pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity text-orange-400"><IconCheck /></div>
                    </div>
                    <span className="text-[var(--text-secondary)] font-sans text-sm">Require a Resume (Highly Recommended)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5 rounded bg-[var(--card-inner-bg)] border border-[var(--border-card)] group-hover:border-orange-400 transition-colors backdrop-blur-md">
                      <input type="checkbox" name="requireCoverLetter" checked={formData.requireCoverLetter} onChange={(e) => setFormData(p => ({ ...p, requireCoverLetter: e.target.checked }))} className="peer opacity-0 absolute inset-0 cursor-pointer" />
                      <div className="pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity text-orange-400"><IconCheck /></div>
                    </div>
                    <span className="text-[var(--text-secondary)] font-sans text-sm">Require a Cover Letter</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group mt-2">
                    <div className="relative flex items-center justify-center w-5 h-5 rounded bg-[var(--card-inner-bg)] border border-[var(--border-card)] group-hover:border-orange-400 transition-colors backdrop-blur-md">
                      <input type="checkbox" name="visaSponsorship" checked={formData.visaSponsorship} onChange={(e) => setFormData(p => ({ ...p, visaSponsorship: e.target.checked }))} className="peer opacity-0 absolute inset-0 cursor-pointer" />
                      <div className="pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity text-orange-400"><IconCheck /></div>
                    </div>
                    <span className="text-[var(--text-secondary)] font-sans text-sm">Offer Visa Sponsorship</span>
                  </label>
                </div>
              </div>

            </section>
          </div>
        )}

      </div>

      {/* Dynamic Action Bar */}
      <div className="mt-4 mb-8 p-4 sm:p-6 bg-[var(--bg-card)] rounded-xl border border-[var(--border-card)] flex items-center justify-between shadow-sm">
        <div>
          {step > 1 && (
            <button onClick={handlePrevStep} className="px-5 py-2.5 rounded-xl border border-[var(--border-card)] text-[var(--text-primary)] font-sans font-semibold hover:bg-gray-500/20 hover:text-[var(--text-primary)] transition-all shadow-md">
              Back
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          {formError && <span className="text-red-500 font-sans font-semibold text-sm animate-pulse mr-2">{formError}</span>}
          <button onClick={handleSaveDraft} className="hidden sm:block px-6 py-2.5 rounded-xl border border-[var(--border-card)] text-[var(--text-primary)] font-sans font-semibold hover:bg-[var(--card-inner-bg)] transition-all shadow-md">
            Save as Draft
          </button>
          {step < totalSteps ? (
            <button onClick={handleNextStep} className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-[var(--text-primary)] font-sans font-bold shadow-[0_4px_20px_rgba(168,85,247,0.4)] hover:shadow-[0_4px_25px_rgba(168,85,247,0.6)] hover:scale-[1.02] transition-all">
              Next Step
            </button>
          ) : (
            <button onClick={handlePublishJob} className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-[var(--text-primary)] font-sans font-bold shadow-[0_4px_20px_rgba(16,185,129,0.4)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.6)] hover:scale-[1.02] transition-all">
              Publish Job
            </button>
          )}
        </div>
      </div>

      {/* AI Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-gray-100 dark:bg-[#0f172a] border border-[#22d3ee]/50 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105 transition-transform z-50 hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]">
        <div className="scale-125">
          <LogoMark />
        </div>
      </button>

    </>
  );
}