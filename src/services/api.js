/**
 * src/services/api.js
 * Central axios instance + auth API calls.
 * All token storage and refresh logic lives here.
 */

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/* ── Axios instance ─────────────────────────────── */
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

/* ── Token helpers ──────────────────────────────── */
export const getAccessToken  = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');

const setTokens = ({ accessToken, refreshToken }) => {
  localStorage.setItem('accessToken',  accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

/* ── Request interceptor: attach Bearer token ───── */
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ── Response interceptor: auto-refresh on 401 ─── */
let isRefreshing = false;
let failedQueue  = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  );
  failedQueue = [];
};

// Reassigning window.location.href to the *same* URL still forces a full
// page reload in most browsers — so if a 401 fires while already sitting
// on /signin (e.g. an unauthenticated background call, like a context
// fetching data before the user is confirmed signed in), the old
// unconditional redirect would reload the page, which reruns every
// provider's mount-time fetch, 401s again, redirects again: an infinite
// reload loop. This guard makes the redirect a no-op once we're already there.
const redirectToSignin = () => {
  if (window.location.pathname !== '/signin') {
    window.location.href = '/signin';
  }
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        redirectToSignin();
        return Promise.reject(err);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      original._retry = true;
      isRefreshing    = true;

      try {
        const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefresh } = data.data;
        setTokens({ accessToken, refreshToken: newRefresh });
        processQueue(null, accessToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearTokens();
        redirectToSignin();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

/* ══════════════════════════════════════════════════
   AUTH API
══════════════════════════════════════════════════ */

export const sendSignupOtp = async (email) => {
  await api.post('/auth/signup/send-otp', { email });
};

export const verifySignupOtp = async ({ email, code }) => {
  const { data } = await api.post('/auth/signup/verify-otp', { email, code });
  return data.data;
};

export const signup = async ({ email, password, role, fullName, companyName }) => {
  const { data } = await api.post('/auth/signup', {
    email, password, role, fullName, companyName,
  });
  setTokens(data.data);
  return data.data;
};

export const signin = async ({ idToken, role }) => {
  const { data } = await api.post('/auth/signin', { idToken, role });
  setTokens(data.data);
  return data.data;
};

export const oauthSignin = async ({ idToken, provider, role, fullName, companyName }) => {
  const { data } = await api.post('/auth/oauth', {
    idToken, provider, role, fullName, companyName,
  });
  setTokens(data.data);
  return data.data;
};

export const sendForgotPasswordOtp = async (email) => {
  await api.post('/auth/forgot-password/send-otp', { email });
};

export const verifyForgotPasswordOtp = async ({ email, code }) => {
  const { data } = await api.post('/auth/forgot-password/verify-otp', { email, code });
  return data.data;
};

export const resetPassword = async ({ resetToken, newPassword }) => {
  const { data } = await api.post('/auth/forgot-password/reset', {
    resetToken, newPassword,
  });
  return data;
};

export const signout = async () => {
  const refreshToken = getRefreshToken();
  clearTokens();
  if (refreshToken) {
    try { await api.post('/auth/signout', { refreshToken }); } catch { /* already out */ }
  }
};

/* ══════════════════════════════════════════════════
   USER API
══════════════════════════════════════════════════ */

export const getMe = async () => {
  const { data } = await api.get('/user/me');
  return data.data.user;
};

export const updateMe = async (fields) => {
  const { data } = await api.patch('/user/me', fields);
  return data.data.user;
};

/**
 * Uploads/replaces the signed-in user's avatar (candidate headshot or
 * company logo — both are just User.photoURL). Accepts a File from an
 * <input type="file">.
 *
 * This goes straight from the browser to Cloudinary using a short-lived
 * signature from our own backend, instead of sending the file through
 * our server first — that two-hop path (browser → Render → Cloudinary)
 * was the main reason uploads felt slow, especially on Render's
 * free-tier bandwidth. Direct upload means the transfer speed is only
 * ever bottlenecked by the user's own connection to Cloudinary.
 */
export const uploadUserPhoto = async (file) => {
  // 1. Ask our backend to authorize this upload (short-lived signature,
  //    doesn't touch the file at all — just proves we're allowed to
  //    upload to this folder under this account).
  const { data: sigData } = await api.get('/user/me/photo-signature');
  const { signature, timestamp, folder, publicId, apiKey, cloudName } = sigData.data;

  // 2. Upload the file directly to Cloudinary. Must include exactly the
  //    same params that were signed (folder, public_id, timestamp) or
  //    Cloudinary rejects it as a signature mismatch.
  const cloudForm = new FormData();
  cloudForm.append('file', file);
  cloudForm.append('api_key', apiKey);
  cloudForm.append('timestamp', timestamp);
  cloudForm.append('signature', signature);
  cloudForm.append('folder', folder);
  cloudForm.append('public_id', publicId);

  const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: cloudForm,
  });
  const cloudData = await cloudRes.json();
  if (!cloudRes.ok) {
    throw new Error(cloudData?.error?.message || 'Photo upload to Cloudinary failed.');
  }

  // 3. Tell our backend the resulting URL so it can save it on the user.
  const { data } = await api.post('/user/me/photo', { photoURL: cloudData.secure_url });
  return data.data.user;
};

/** Removes the current avatar/logo — the UI then falls back to initials. */
export const removeUserPhoto = async () => {
  const { data } = await api.delete('/user/me/photo');
  return data.data.user;
};

export const deleteAccount = async (confirmText) => {
  const { data } = await api.delete('/user/me', { data: { confirmText } });
  clearTokens();
  return data;
};

/* ── PROFILE ── */
/**
 * Uploads a file straight to Cloudinary from the browser, bypassing our
 * backend entirely for the file bytes — only the resulting URL gets
 * sent to our server. `signatureEndpoint` is one of our own API paths
 * that returns a short-lived signed upload authorization (e.g.
 * '/jobs/resume-signature', '/profile/cert-signature',
 * '/jobs/attachment-signature?type=jobDescriptionPdf').
 *
 * Images upload to Cloudinary's `image/upload` endpoint; everything
 * else (PDFs, DOC/DOCX) goes to `raw/upload` — Cloudinary treats these
 * as fundamentally different asset types and rejects a mismatched one.
 */
const uploadFileToCloudinary = async (file, signatureEndpoint) => {
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  const sep = signatureEndpoint.includes('?') ? '&' : '?';
  const { data: sigData } = await api.get(`${signatureEndpoint}${sep}ext=${encodeURIComponent(ext)}`);
  const { signature, timestamp, folder, publicId, apiKey, cloudName } = sigData.data;

  // TEMP DEBUG — remove once the upload-preset issue is diagnosed.
  console.log('[cloudinary signature debug]', { signature, timestamp, folder, publicId, apiKey, cloudName });

  const resourceType = file.type.startsWith('image/') ? 'image' : 'raw';

  const cloudForm = new FormData();
  cloudForm.append('file', file);
  cloudForm.append('api_key', apiKey);
  cloudForm.append('timestamp', timestamp);
  cloudForm.append('signature', signature);
  cloudForm.append('folder', folder);
  cloudForm.append('public_id', publicId);

  // TEMP DEBUG — remove once the upload-preset issue is diagnosed.
  for (const [k, v] of cloudForm.entries()) {
    console.log('[cloudinary formdata]', k, v instanceof File ? `File(${v.name})` : v);
  }
  console.log('[cloudinary upload url]', `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: 'POST',
    body: cloudForm,
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.error?.message || 'File upload failed.');
  }
  return { url: result.secure_url, originalName: file.name };
};

export const getProfile = async () => {
  const { data } = await api.get('/profile');
  return data.data.profile;
};

export const saveProfile = async (profileData, photoFile = null, certFiles = {}, isComplete = false) => {
  // Cert PDFs upload straight to Cloudinary first — only the resulting
  // URL rides along in the JSON payload below. Photo upload is
  // unchanged (still goes through our server as multipart), since it's
  // small enough that the extra hop isn't the bottleneck certs/resumes
  // were.
  const certEntries = Object.entries(certFiles).filter(([, file]) => file);
  const uploadedCerts = await Promise.all(
    certEntries.map(([idx, file]) => uploadFileToCloudinary(file, '/profile/cert-signature').then((res) => [idx, res]))
  );
  const certsWithUrls = { ...profileData };
  if (uploadedCerts.length && Array.isArray(certsWithUrls.certs)) {
    certsWithUrls.certs = [...certsWithUrls.certs];
    uploadedCerts.forEach(([idx, { url }]) => {
      const i = Number(idx);
      if (certsWithUrls.certs[i]) {
        certsWithUrls.certs[i] = { ...certsWithUrls.certs[i], certPdfUrl: url };
      }
    });
  }

  const form = new FormData();
  form.append('data', JSON.stringify({ ...certsWithUrls, isComplete }));
  if (photoFile) form.append('photo', photoFile);
  // IMPORTANT: don't set 'Content-Type': 'multipart/form-data' manually.
  // A FormData body needs a boundary in that header (e.g.
  // "multipart/form-data; boundary=----abc123"), which only the browser
  // can generate. Setting the header ourselves — even to the "right"
  // string — blocks axios/the browser from ever adding that boundary,
  // so the server's multipart parser (multer) can't split the request
  // into fields/files and every upload silently fails. Explicitly
  // clearing the header (this instance defaults to 'application/json')
  // lets the browser set the correct one itself.
  const { data } = await api.patch('/profile', form, {
    headers: { 'Content-Type': undefined },
  });
  return data.data.profile;
};

/* ══════════════════════════════════════════════════
   CAREER ROADMAP
══════════════════════════════════════════════════ */

export const getRoadmap = async () => {
  const { data } = await api.get('/roadmap');
  return data.data;
};

export const generateRoadmap = async (targetRole) => {
  const { data } = await api.post('/roadmap/generate', { targetRole });
  return data.data;
};

export const loadPreviousRoadmap = async () => {
  const { data } = await api.post('/roadmap/load-previous');
  return data.data;
};

/* ══════════════════════════════════════════════════
   COMPANY DASHBOARD
══════════════════════════════════════════════════ */

/**
 * Everything the Company Dashboard shows: stats, applicants-over-time
 * chart, hiring funnel, recent applicants, and AI-recommended
 * candidates. The AI picks are cached server-side (see
 * dashboard.service.js) to protect Gemini's free-tier quota — pass
 * `refresh: true` to request a fresh pass instead of the cache (the
 * backend still enforces its own minimum interval either way, so this
 * is safe to wire to a "Refresh" button).
 */
export const getCompanyDashboard = async ({ refresh = false } = {}) => {
  const { data } = await api.get('/dashboard', { params: refresh ? { refresh: 'true' } : undefined });
  return data.data;
};

/* ══════════════════════════════════════════════════
   CANDIDATE INSIGHTS
══════════════════════════════════════════════════ */

/**
 * Everything the Insights page shows: status stat cards, top-roles
 * donut chart, recent applications, upcoming schedule, and the full
 * bucketed applications list (used for the click-through modal).
 * `range` matches InsightsPage.jsx's date dropdown: '7d' | '30d' |
 * 'month' | 'year' | 'all' | 'custom' (custom needs startDate/endDate,
 * both ISO date strings).
 */
export const getCandidateInsights = async ({ range = 'all', startDate, endDate } = {}) => {
  const { data } = await api.get('/dashboard/insights', {
    params: { range, startDate, endDate },
  });
  return data.data;
};

/* ══════════════════════════════════════════════════
   JOBS (company side — posting & managing listings)
══════════════════════════════════════════════════ */

/**
 * Lists the signed-in company's own job postings.
 * `status` is optional: 'draft' | 'active' | 'closed'. Omit for all.
 */
export const getMyJobs = async (status) => {
  const { data } = await api.get('/jobs', { params: status ? { status } : undefined });
  return data.data.jobs;
};

export const getJob = async (id) => {
  const { data } = await api.get(`/jobs/${id}`);
  return data.data.job;
};

/**
 * Jobs are sent as plain JSON now — the two optional PDF attachments
 * (job description, company brochure) upload straight to Cloudinary
 * first, and only their resulting URLs ride along in the body.
 * `files` is an optional { jobDescriptionPdf, companyBrochurePdf } map
 * of File objects — only pass the ones the user actually picked.
 */
const buildJobPayload = async (jobData, files = {}) => {
  const attachments = {};
  if (files.jobDescriptionPdf) {
    attachments.jobDescriptionPdf = await uploadFileToCloudinary(
      files.jobDescriptionPdf, '/jobs/attachment-signature?type=jobDescriptionPdf'
    );
  }
  if (files.companyBrochurePdf) {
    attachments.companyBrochurePdf = await uploadFileToCloudinary(
      files.companyBrochurePdf, '/jobs/attachment-signature?type=companyBrochurePdf'
    );
  }
  return Object.keys(attachments).length ? { ...jobData, attachments } : jobData;
};

/**
 * Creates a new job posting. `jobData.status` controls whether it's
 * saved as a 'draft' (default, partial data OK) or 'active' (backend
 * validates the listing is complete before publishing).
 */
export const createJob = async (jobData, files = {}) => {
  const payload = await buildJobPayload(jobData, files);
  const { data } = await api.post('/jobs', payload);
  return data.data.job;
};

/**
 * Updates an existing job — same body shape as createJob. Also used
 * to transition status (e.g. publish a draft by sending status: 'active',
 * or close an active listing by sending status: 'closed').
 */
export const updateJob = async (id, jobData, files = {}) => {
  const payload = await buildJobPayload(jobData, files);
  const { data } = await api.patch(`/jobs/${id}`, payload);
  return data.data.job;
};

export const deleteJob = async (id) => {
  const { data } = await api.delete(`/jobs/${id}`);
  return data;
};

/**
 * Recommended jobs for the candidate dashboard's "Recommended for you"
 * row. No public/candidate-facing job listing endpoint exists on the
 * backend yet — this call will 404 until one does. Treat any failure
 * as "no recommendations yet" rather than a real error.
 */
export const getRecommendedJobs = async () => {
  try {
    const { data } = await api.get('/jobs/recommended');
    return data.data.jobs || [];
  } catch {
    return [];
  }
};

/* ══════════════════════════════════════════════════
   JOBS (candidate side — browse, search & apply)
══════════════════════════════════════════════════ */

/**
 * Searches/browses every active job listing.
 * `filters` is optional: { q, employmentType, workplaceType, location }
 */
export const searchJobs = async (filters = {}) => {
  const params = {};
  Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
  const { data } = await api.get('/jobs/public', { params });
  return data.data.jobs;
};

export const getPublicJob = async (id) => {
  const { data } = await api.get(`/jobs/public/${id}`);
  return data.data.job;
};

/**
 * Submits an application. `payload` carries the employer-question
 * answers plus `consent` (bool) and `shareProfileAsResume` (bool).
 * `resumeFile` is optional — pass it when the candidate uploaded their
 * own resume instead of sharing their SkillSphere profile. It uploads
 * straight to Cloudinary first; only the resulting URL is sent here.
 */
export const applyToJob = async (jobId, payload, resumeFile = null) => {
  let body = payload;
  if (resumeFile) {
    const resume = await uploadFileToCloudinary(resumeFile, '/jobs/resume-signature');
    body = { ...payload, resume };
  }
  const { data } = await api.post(`/jobs/applications/${jobId}/apply`, body);
  return data.data.job;
};

export const getMyApplications = async () => {
  const { data } = await api.get('/jobs/applications/mine');
  return data.data.jobs;
};

/**
 * Toggles a bookmark for one job on/off, persisted on the candidate's
 * account (User.bookmarkedJobs) — survives refresh/re-login, unlike the
 * old component-only state.
 */
export const toggleJobBookmark = async (jobId) => {
  const { data } = await api.post(`/jobs/${jobId}/bookmark`);
  return data.data; // { jobId, bookmarked }
};

/** Full job objects for every job the candidate has bookmarked. */
export const getBookmarkedJobs = async () => {
  const { data } = await api.get('/jobs/bookmarked');
  return data.data.jobs;
};

/* ══════════════════════════════════════════════════
   JOBS (company side — applicant pipeline)
══════════════════════════════════════════════════ */

/** Returns { job, applicants } for one of the company's own job postings. */
export const getJobApplicants = async (jobId) => {
  const { data } = await api.get(`/jobs/${jobId}/applicants`);
  return data.data;
};

/**
 * Fetches an applicant's full SkillSphere profile. Only valid when that
 * applicant applied with resumeSource "profile" — otherwise use their
 * resumeUrl (a resume file) instead, already present on the applicant object.
 */
export const getApplicantProfile = async (jobId, candidateId) => {
  const { data } = await api.get(`/jobs/${jobId}/applicants/${candidateId}/profile`);
  return data.data.profile;
};

/** status: 'new' | 'reviewed' | 'shortlisted' | 'interview' | 'hired' | 'rejected' */
export const updateApplicantStatus = async (jobId, candidateId, status) => {
  const { data } = await api.patch(`/jobs/${jobId}/applicants/${candidateId}/status`, { status });
  return data.data;
};

/* ══════════════════════════════════════════════════
   CANDIDATES (company side — discovery/search across
   every candidate on the platform, independent of any
   specific job application)
══════════════════════════════════════════════════ */

/**
 * Searches/browses candidates who've opted in to recruiter visibility.
 * `filters`: { search, skills: string[], location: string[],
 *              experience: string[] (bucket labels), sortBy, page, limit }
 * Returns { candidates, pagination: { total, page, limit, pages } }.
 */
export const searchCandidates = async (filters = {}) => {
  const params = {};
  if (filters.search) params.search = filters.search;
  if (filters.skills?.length) params.skills = filters.skills.join(',');
  if (filters.location?.length) params.location = filters.location.join(',');
  if (filters.experience?.length) params.experience = filters.experience.join(',');
  if (filters.sortBy) params.sortBy = filters.sortBy;
  params.page = filters.page || 1;
  params.limit = filters.limit || 10;

  const { data } = await api.get('/candidates', { params });
  return data.data;
};

/** Fetches one candidate's full SkillSphere profile for the "View Profile" popup. */
export const getCandidateProfile = async (candidateId) => {
  const { data } = await api.get(`/candidates/${candidateId}`);
  return data.data.profile;
};

/* ══════════════════════════════════════════════════
   GITHUB
══════════════════════════════════════════════════ */

export const getGithubRepos = async () => {
  try {
    const { data } = await api.get('/github/repos');
    return data.data;
  } catch {
    return { repos: [], reason: 'fetch-failed' };
  }
};

export const refreshGithubRepos = async () => {
  try {
    const { data } = await api.post('/github/repos/refresh');
    return data.data;
  } catch {
    return { repos: [], reason: 'fetch-failed' };
  }
};

/* ══════════════════════════════════════════════════
   NOTIFICATIONS (shared shape for candidates & companies)
══════════════════════════════════════════════════ */

/** Fetches the signed-in user's notifications. `category` matches the
 *  CATEGORIES filter list in NotificationPanel.jsx ('All' fetches everything). */
export const getNotifications = async ({ category, page = 1, limit = 30 } = {}) => {
  const { data } = await api.get('/notifications', { params: { category, page, limit } });
  return data.data; // { notifications, unreadCount, pagination }
};

export const getUnreadNotificationCount = async () => {
  const { data } = await api.get('/notifications/unread-count');
  return data.data.unreadCount;
};

export const markNotificationRead = async (id) => {
  const { data } = await api.patch(`/notifications/${id}/read`);
  return data.data.notification;
};

export const markAllNotificationsRead = async () => {
  await api.patch('/notifications/read-all');
};

/* ══════════════════════════════════════════════════
   CHATBOT (candidate & company assistants)
══════════════════════════════════════════════════ */

/**
 * Sends one message to the signed-in user's AI assistant. The backend
 * picks the candidate/company prompt and API key from the JWT's role —
 * `role` is never sent from the client. `history` is the running
 * conversation as [{ role: 'user'|'assistant', content }]; only the
 * last 10 exchanges are actually used server-side.
 */
export const sendChatMessage = async (message, history = []) => {
  const { data } = await api.post('/chatbot', { message, history });
  return data.data.reply;
};

export default api;