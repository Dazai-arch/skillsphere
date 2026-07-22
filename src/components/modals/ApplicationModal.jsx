import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

const IconCheck = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default function ApplicationModal({ isOpen, onClose, job }) {
  const [step, setStep] = useState(1);
  const [consent, setConsent] = useState(false);

  // Form states for step 2
  const [phone, setPhone] = useState('');
  const [relocate, setRelocate] = useState(null);
  const [noticePeriod, setNoticePeriod] = useState('Immediate Joiner');
  const [pitch, setPitch] = useState('');
  const [topChoice, setTopChoice] = useState(false);
  const [followCompany, setFollowCompany] = useState(true);
  const [resumeName, setResumeName] = useState('');

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const noticeOptions = ['Immediate Joiner', '15 Days', '30 Days', '60+ Days'];

  const handleSubmit = () => {
    const newErrors = {};
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (relocate === null) newErrors.relocate = 'Please answer this question';
    if (!pitch.trim()) newErrors.pitch = 'Cover letter is required';
    if (!resumeName) newErrors.resumeName = 'Please upload a resume';
    if (!followCompany) newErrors.followCompany = 'Please tick this box';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(3); // Success state
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4" onClick={() => {
      onClose();
      // Reset state for next open
      setTimeout(() => { setStep(1); setConsent(false); setErrors({}); }, 300);
    }}>
      <div className={`relative w-full transition-all duration-300 ${step === 1 ? 'max-w-[540px] bg-[var(--bg-card)] dark:bg-[#0b101e]' : step === 3 ? 'max-w-[440px] bg-[var(--bg-card)] dark:bg-[#050810]' : 'max-w-[740px] bg-[var(--bg-card)] dark:bg-[#0f1629]'} rounded-2xl flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.6)] border border-[var(--border-card)] overflow-hidden max-h-[90vh]`} onClick={e => { e.stopPropagation(); setIsDropdownOpen(false); }}>
        
        {/* STEP 1: CONFIRMATION */}
        {step === 1 && (
          <div className="p-6 md:p-8 flex flex-col overflow-y-auto no-scrollbar">
            <button className="absolute top-4 right-4 bg-transparent border-none text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-xl font-bold cursor-pointer" onClick={() => {
              onClose();
              setTimeout(() => { setStep(1); setConsent(false); }, 300);
            }}>✕</button>
            
            <div className="flex items-center gap-3 mb-2">
              <IconShield className="text-indigo-400" />
              <h2 className="font-sans text-[1.1rem] font-bold text-[var(--text-heading)]">Confirm your application</h2>
            </div>
            
            <p className="font-sans text-[0.85rem] text-[var(--text-secondary)] leading-relaxed mb-6">
              Review the details we'll share with <strong className="text-[var(--text-primary)]">{job?.company}</strong> for the <strong className="text-[var(--text-primary)]">{job?.role}</strong> role.
            </p>
            
            <div className="bg-[var(--bg-panel)] border border-[var(--border-card)] rounded-xl p-4 flex flex-col gap-3 mb-6">
              <span className="font-sans text-[0.7rem] font-bold text-[var(--text-muted)] tracking-widest uppercase mb-1">DETAILS TO VERIFY</span>
              <div className="flex items-center justify-between font-sans text-[0.85rem]">
                <span className="text-[var(--text-secondary)]">Name</span>
                <span className="text-[var(--text-primary)] font-semibold">Aarav Mehta</span>
              </div>
              <div className="flex items-center justify-between font-sans text-[0.85rem]">
                <span className="text-[var(--text-secondary)]">Email</span>
                <span className="text-[var(--text-primary)] font-semibold">aarav.mehta@skillsphere.io</span>
              </div>
              <div className="flex items-center justify-between font-sans text-[0.85rem]">
                <span className="text-[var(--text-secondary)]">Target role</span>
                <span className="text-[var(--text-primary)] font-semibold">Senior Full-Stack Engineer</span>
              </div>
              <div className="flex items-center justify-between font-sans text-[0.85rem]">
                <span className="text-[var(--text-secondary)]">Experience</span>
                <span className="text-[var(--text-primary)] font-semibold">4 Years</span>
              </div>
            </div>
            
            <label className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer mb-6 transition-all duration-300 ${consent ? 'border-indigo-500 bg-indigo-500/10' : 'border-[var(--border-card)] bg-[var(--bg-nav)] hover:border-[var(--border-hover)]'}`}>
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="hidden" />
              <div className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 relative flex items-center justify-center transition-all ${consent ? 'border-indigo-500 bg-indigo-500' : 'border-[var(--text-muted)]'}`}>
                {consent && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
              </div>
              <span className="font-sans text-[0.85rem] text-[var(--text-secondary)] leading-relaxed select-none">
                I confirm these details are accurate and consent to share my verified profile with this company.
              </span>
            </label>
            
            <div className="flex items-start gap-3 text-amber-500 font-sans text-[0.8rem] bg-amber-500/10 rounded-lg p-3.5 mb-8 border border-amber-500/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span className="leading-tight">Once submitted, this application <strong className="font-semibold text-amber-400">cannot be cancelled or withdrawn</strong>.</span>
            </div>
            
            <div className="flex items-center justify-between gap-3 mt-auto pt-2">
              <Link to={`/company/${job?.id}`} className="font-sans text-[0.85rem] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors" onClick={onClose}>
                View {job?.company} profile
              </Link>
              <button 
                className="font-sans text-[0.85rem] font-semibold text-white bg-indigo-500 rounded-lg px-6 py-2.5 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all active:scale-95 cursor-pointer" 
                disabled={!consent} 
                onClick={() => setStep(2)}
              >
                Proceed
              </button>
            </div>
          </div>
        )}
        
        {/* STEP 2: FORM */}
        {step === 2 && (
          <div className="flex flex-col h-full max-h-[85vh]">
            <div className="px-6 py-5 border-b border-[var(--border-card)] flex items-center justify-between shrink-0">
              <h2 className="font-sans text-[1.1rem] font-bold text-[var(--text-heading)] truncate pr-4">Apply to {job?.company}</h2>
              <button className="bg-transparent border-none text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0 text-xl font-bold cursor-pointer" onClick={() => {
                onClose();
                setTimeout(() => { setStep(1); setConsent(false); setErrors({}); }, 300);
              }}>✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto no-scrollbar flex flex-col gap-6">
              
              {/* Contact Info */}
              <div>
                <h3 className="font-sans text-[0.95rem] font-bold text-[var(--text-heading)] mb-4">Contact info</h3>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                    A
                  </div>
                  <div>
                    <div className="font-sans font-bold text-[0.95rem] text-[var(--text-primary)]">Aarav Mehta</div>
                    <div className="font-sans text-[0.8rem] text-[var(--text-secondary)] mt-0.5">Bengaluru, Karnataka, India</div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-[0.8rem] text-[var(--text-secondary)]">Mobile Number*</label>
                  <div className={`flex items-center w-full sm:w-[300px] bg-transparent border rounded-lg overflow-hidden transition-colors ${errors.phone ? 'border-red-500 bg-red-500/5' : 'border-[var(--border-card)] focus-within:border-indigo-500'}`}>
                    <div className="bg-[var(--bg-nav)] px-3 py-2 border-r border-[var(--border-card)] font-sans text-[0.9rem] text-[var(--text-secondary)] select-none">
                      +91
                    </div>
                    <input 
                      type="tel"
                      maxLength="10"
                      value={phone}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        setPhone(val);
                        setErrors(p => ({ ...p, phone: null }));
                      }}
                      placeholder="10-digit number"
                      className="w-full bg-transparent px-3 py-2 font-sans text-[0.9rem] text-[var(--text-primary)] outline-none"
                    />
                  </div>
                  {errors.phone && <span className="font-sans text-[0.75rem] text-red-500">{errors.phone}</span>}
                </div>
              </div>
              
              <div className="w-full h-px bg-[var(--border-card)]"></div>

              {/* Employer Questions */}
              <div>
                <h3 className="font-sans text-[0.95rem] font-bold text-[var(--text-heading)] mb-4">Employer questions</h3>
                
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-[0.85rem] text-[var(--text-primary)]">Are you willing to relocate to anywhere in India for this role?*</label>
                    <div className="flex items-center gap-4 mt-1">
                       <label className="flex items-center gap-2 cursor-pointer">
                         <input type="radio" name="relocate" value="yes" checked={relocate === 'yes'} onChange={() => { setRelocate('yes'); setErrors(p => ({ ...p, relocate: null })); }} className="w-4 h-4 text-indigo-600 border-[var(--border-card)] focus:ring-indigo-500 bg-[var(--bg-nav)]" />
                         <span className="font-sans text-[0.85rem] text-[var(--text-primary)]">Yes</span>
                       </label>
                       <label className="flex items-center gap-2 cursor-pointer">
                         <input type="radio" name="relocate" value="no" checked={relocate === 'no'} onChange={() => { setRelocate('no'); setErrors(p => ({ ...p, relocate: null })); }} className="w-4 h-4 text-indigo-600 border-[var(--border-card)] focus:ring-indigo-500 bg-[var(--bg-nav)]" />
                         <span className="font-sans text-[0.85rem] text-[var(--text-primary)]">No</span>
                       </label>
                    </div>
                    {errors.relocate && <span className="font-sans text-[0.75rem] text-red-500">{errors.relocate}</span>}
                  </div>

                  <div className="flex flex-col gap-2 relative">
                    <label className="font-sans text-[0.85rem] text-[var(--text-primary)]">What is your current notice period?*</label>
                    <div 
                      className="w-full sm:w-[220px] bg-[var(--bg-nav)] border border-[var(--border-card)] rounded-lg px-3 py-2 font-sans text-[0.9rem] text-[var(--text-primary)] cursor-pointer flex justify-between items-center transition-colors hover:border-indigo-500/50"
                      onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
                    >
                      {noticePeriod}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                    {isDropdownOpen && (
                      <div className="absolute top-[100%] left-0 w-full sm:w-[220px] mt-2 bg-[var(--bg-panel)] border border-[var(--border-card)] rounded-lg shadow-xl overflow-hidden z-[10]">
                        {noticeOptions.map(opt => (
                          <div 
                            key={opt}
                            className="px-4 py-2.5 font-sans text-[0.85rem] text-[var(--text-primary)] hover:bg-indigo-500 hover:text-white cursor-pointer transition-colors"
                            onClick={() => { setNoticePeriod(opt); setIsDropdownOpen(false); }}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="w-full h-px bg-[var(--border-card)]"></div>
              
              {/* Top choice job */}
              <div>
                <h3 className="font-sans text-[0.95rem] font-bold text-[var(--text-heading)] mb-1">Top choice job</h3>
                <p className="font-sans text-[0.85rem] text-[var(--text-secondary)] mb-4">
                  Stand out to the employer by letting them know that this is a top choice job for you.
                </p>
                
                <label className="flex items-center gap-3 cursor-pointer w-fit">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" checked={topChoice} onChange={e => setTopChoice(e.target.checked)} className="peer appearance-none w-[18px] h-[18px] border border-[var(--border-card)] rounded-sm bg-[var(--bg-card)] checked:bg-indigo-600 checked:border-indigo-600 transition-colors" />
                    <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="font-sans text-[0.85rem] text-[var(--text-primary)]">Mark job as a top choice job</span>
                </label>
              </div>

              <div className="w-full h-px bg-[var(--border-card)]"></div>
              
              {/* Stand Out */}
              <div>
                <div className="flex items-center gap-1.5 mb-1 text-indigo-400 font-bold text-[0.65rem] tracking-widest uppercase">
                   <div className="w-[10px] h-[10px] bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-sm"></div>
                   LEVEL UP
                </div>
                <h3 className="font-sans text-[0.95rem] font-bold text-[var(--text-heading)] mb-1">Stand out to the employer</h3>
                <p className="font-sans text-[0.85rem] text-[var(--text-secondary)] mb-4">
                  Highlight your expertise by sharing a relevant project and a brief pitch about why you're a great fit.
                </p>
                
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-[0.85rem] text-[var(--text-primary)] font-medium">Cover letter (short)*</label>
                    <textarea 
                      rows="4"
                      value={pitch}
                      onChange={e => { setPitch(e.target.value); setErrors(p => ({ ...p, pitch: null })); }}
                      placeholder="Briefly describe your relevant experience..."
                      className={`w-full bg-transparent border rounded-lg px-3 py-2 font-sans text-[0.9rem] text-[var(--text-primary)] focus:border-indigo-500 outline-none placeholder-[var(--text-muted)] resize-none transition-colors ${errors.pitch ? 'border-red-500 bg-red-500/5' : 'border-[var(--border-card)]'}`}
                    ></textarea>
                    {errors.pitch && <span className="font-sans text-[0.75rem] text-red-500">{errors.pitch}</span>}
                  </div>
                </div>
              </div>
              
              <div className="w-full h-px bg-[var(--border-card)]"></div>
              
              {/* Resume */}
              <div>
                <p className="font-sans text-[0.85rem] text-[var(--text-primary)] mb-3">
                  Be sure to include an updated resume in DOC, DOCX or PDF format (less than 2MB).*
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <label className={`px-4 py-1.5 border-2 ${errors.resumeName ? 'border-red-500 text-red-500 hover:bg-red-500/10' : 'border-indigo-500 text-indigo-500 hover:bg-indigo-500/10 hover:border-indigo-600 hover:text-indigo-600'} rounded-full font-sans font-semibold text-[0.9rem] cursor-pointer transition-colors`}>
                      Upload resume
                      <input type="file" className="hidden" accept=".doc,.docx,.pdf" onChange={e => {
                        if (e.target.files?.[0]) {
                          setResumeName(e.target.files[0].name);
                          setErrors(p => ({ ...p, resumeName: null }));
                        }
                      }} />
                    </label>
                    {resumeName && <span className="font-sans text-[0.8rem] text-[var(--text-primary)] truncate max-w-[200px] font-medium">{resumeName}</span>}
                  </div>
                  {errors.resumeName && <span className="font-sans text-[0.75rem] text-red-500">{errors.resumeName}</span>}
                </div>
              </div>
              
              <div className="w-full h-px bg-[var(--border-card)]"></div>
              
              {/* Follow Company */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer w-fit">
                  <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                    <input type="checkbox" checked={followCompany} onChange={e => { setFollowCompany(e.target.checked); setErrors(p => ({...p, followCompany: null})); }} className={`peer appearance-none w-[18px] h-[18px] border rounded bg-[var(--bg-card)] checked:bg-emerald-600 checked:border-emerald-600 transition-colors ${errors.followCompany ? 'border-red-500' : 'border-[var(--border-card)]'}`} />
                    <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className={`font-sans text-[0.85rem] leading-relaxed ${errors.followCompany ? 'text-red-400' : 'text-[var(--text-secondary)]'}`}>
                    Follow <strong className="text-[var(--text-primary)]">{job?.company}</strong> to stay up to date with their page.
                  </span>
                </label>
                {errors.followCompany && <div className="font-sans text-[0.75rem] text-red-500 mt-1">{errors.followCompany}</div>}
              </div>
              
            </div>
            
            <div className="px-6 py-4 border-t border-[var(--border-card)] flex justify-end shrink-0 bg-[var(--bg-card)]">
               <button 
                 className="font-sans text-[0.95rem] font-bold text-white bg-[#0a66c2] hover:bg-[#004182] rounded-full px-5 py-2 transition-colors active:scale-95 shadow-md cursor-pointer"
                 onClick={handleSubmit}
               >
                 Submit application
               </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 3 && (
          <div className="p-10 flex flex-col items-center justify-center text-center animate-fade-in relative">
            <button className="absolute top-4 right-4 bg-transparent border-none text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-xl font-bold cursor-pointer" onClick={() => {
              onClose();
              setTimeout(() => { setStep(1); setConsent(false); setErrors({}); }, 300);
            }}>✕</button>

            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
              <div className="text-emerald-500">
                <IconCheck />
              </div>
            </div>
            <h2 className="font-sans text-[1.4rem] font-bold text-[var(--text-heading)] mb-2">Application Submitted!</h2>
            <p className="font-sans text-[0.95rem] text-[var(--text-secondary)] leading-relaxed mb-8">
              Your application for the <strong className="text-[var(--text-primary)]">{job?.role}</strong> position at <strong className="text-[var(--text-primary)]">{job?.company}</strong> has been sent successfully. Best of luck!
            </p>
            <button 
              className="font-sans text-[0.95rem] font-bold text-[var(--bg-page)] bg-[var(--text-primary)] hover:bg-white rounded-full px-8 py-2.5 transition-colors active:scale-95 shadow-md cursor-pointer w-full"
              onClick={() => {
                onClose();
                setTimeout(() => { setStep(1); setConsent(false); setErrors({}); }, 300);
              }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
