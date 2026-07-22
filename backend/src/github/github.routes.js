/**
 * src/github/github.routes.js
 */
const { Router } = require('express');
const { authenticate, authorize } = require('../auth/auth.middleware');
const { getMyRepos } = require('./github.controller');

const router = Router();

router.use(authenticate, authorize('candidate'));

router.get('/repos', getMyRepos);

module.exports = router;