const express    = require('express');
const helmet     = require('helmet');
const cors       = require('cors');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const path       = require('path');

const authRoutes    = require('./auth/auth.routes');
const userRoutes    = require('./user/user.routes');
const profileRoutes = require('./profile/profile.routes');
const githubRoutes  = require('./github/github.routes');
const roadmapRoutes = require('./roadmap/roadmap.routes');
const AppError      = require('./utils/AppError');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

/* ── Serve uploaded files ── */
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/* ── Rate limiters ── */
const globalLimiter = rateLimit({ windowMs: 15*60*1000, max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' } });
const authLimiter = rateLimit({ windowMs: 15*60*1000, max: 20,
  message: { success: false, message: 'Too many auth attempts, please try again later.' } });

app.use(globalLimiter);

app.get('/health', (_req, res) => res.json({ success: true, message: 'SkillSphere API is running ✅' }));

app.use('/api/auth',    authLimiter, authRoutes);
app.use('/api/user',    userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/github',  githubRoutes);
app.use('/api/roadmap', roadmapRoutes);

app.use((req, _res, next) => next(new AppError(`Route ${req.originalUrl} not found.`, 404)));

app.use((err, _req, res, _next) => {
  console.error(`[Error] ${err.message}`);
  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal server error.' });
});

module.exports = app;