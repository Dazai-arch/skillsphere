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

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        window.location.href = '/signin';
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
        window.location.href = '/signin';
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

/**
 * Signup step 1 — send OTP to verify the email address.
 * No return value needed; backend just sends the email.
 */
export const sendSignupOtp = async (email) => {
  await api.post('/auth/signup/send-otp', { email });
};

/**
 * Signup step 2 — verify the OTP.
 * Body: { email, code }  (no clerkEmailAddressId)
 */
export const verifySignupOtp = async ({ email, code }) => {
  const { data } = await api.post('/auth/signup/verify-otp', { email, code });
  return data.data;
};

/**
 * Signup step 3 — create Firebase user + MongoDB record.
 * Returns { user, accessToken, refreshToken }
 */
export const signup = async ({ email, password, role, fullName, companyName }) => {
  const { data } = await api.post('/auth/signup', {
    email, password, role, fullName, companyName,
  });
  setTokens(data.data);
  return data.data;
};

/**
 * Email/password signin via Firebase ID token.
 * Returns { user, accessToken, refreshToken }
 */
export const signin = async ({ idToken, role }) => {
  const { data } = await api.post('/auth/signin', { idToken, role });
  setTokens(data.data);
  return data.data;
};

/**
 * OAuth signin (Google / GitHub).
 * Returns { user, accessToken, refreshToken }
 */
export const oauthSignin = async ({ idToken, provider, role, fullName, companyName }) => {
  const { data } = await api.post('/auth/oauth', {
    idToken, provider, role, fullName, companyName,
  });
  setTokens(data.data);
  return data.data;
};

/** Step 1 — send OTP email for forgot password. */
export const sendForgotPasswordOtp = async (email) => {
  await api.post('/auth/forgot-password/send-otp', { email });
};

/** Step 2 — verify OTP. Returns { resetToken } */
export const verifyForgotPasswordOtp = async ({ email, code }) => {
  const { data } = await api.post('/auth/forgot-password/verify-otp', { email, code });
  return data.data;
};

/** Step 3 — reset password using the resetToken from step 2. */
export const resetPassword = async ({ resetToken, newPassword }) => {
  const { data } = await api.post('/auth/forgot-password/reset', {
    resetToken, newPassword,
  });
  return data;
};

/** Signout — clears tokens locally and revokes refresh token on server. */
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

/* ── PROFILE ── */
export const getProfile = async () => {
  const { data } = await api.get('/profile');
  return data.data.profile;
};

export const saveProfile = async (profileData, photoFile = null, certFiles = {}, isComplete = false) => {
  const form = new FormData();
  form.append('data', JSON.stringify({ ...profileData, isComplete }));
  if (photoFile) form.append('photo', photoFile);
  Object.entries(certFiles).forEach(([idx, file]) => {
    if (file) form.append(`certPdf_${idx}`, file);
  });
  const { data } = await api.patch('/profile', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data.profile;
};

/* ══════════════════════════════════════════════════
   CAREER ROADMAP
══════════════════════════════════════════════════ */

/**
 * Fetches the signed-in candidate's saved roadmaps.
 * Returns { current, previous } — either may be null if the
 * user has never generated a roadmap yet / has no previous one.
 */
export const getRoadmap = async () => {
  const { data } = await api.get('/roadmap');
  return data.data;
};

/**
 * Generates a fresh roadmap for the given target role.
 * Backend rotates current -> previous (discarding the old previous)
 * and the new roadmap becomes current. Returns { current, previous }.
 * This calls an LLM server-side, so it can take several seconds —
 * callers should show a generating/loading state.
 */
export const generateRoadmap = async (targetRole) => {
  const { data } = await api.post('/roadmap/generate', { targetRole });
  return data.data;
};

/**
 * Swaps current <-> previous. 404s (thrown as an error) if there's
 * no previous roadmap saved. Calling it twice in a row flips back,
 * so it doubles as undo/redo.
 */
export const loadPreviousRoadmap = async () => {
  const { data } = await api.post('/roadmap/load-previous');
  return data.data;
};

/* ══════════════════════════════════════════════════
   JOBS
══════════════════════════════════════════════════ */

/**
 * Recommended jobs for the dashboard's "Recommended for you" row.
 * No jobs/matching endpoint exists on the backend yet — this call
 * will simply 404 until one does. Callers should treat any failure
 * as "no recommendations yet" rather than a real error, so once a
 * real /jobs/recommended route is added on the backend, this starts
 * returning real data with zero changes needed on the frontend.
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
   GITHUB
══════════════════════════════════════════════════ */

/**
 * Fetches the signed-in candidate's top GitHub repos through our own
 * backend (which attaches a server-side token), instead of calling
 * api.github.com directly from the browser — that was capped at
 * 60 requests/hour per IP; this raises it to 5,000/hour.
 * Returns { repos, reason? } — reason is one of 'no-username',
 * 'not-found', or 'fetch-failed' when repos comes back empty.
 */
export const getGithubRepos = async () => {
  try {
    const { data } = await api.get('/github/repos');
    return data.data;
  } catch {
    return { repos: [], reason: 'fetch-failed' };
  }
};

export default api;