/**
 * src/github/github.controller.js
 */
const githubService  = require('./github.service');
const Profile         = require('../profile/profile.model');
const { sendSuccess }  = require('../utils/response');

/* ════════════════════════════════════════════════
   GET /api/github/repos
   Always uses the signed-in candidate's own profile —
   no username is ever accepted from the client, so
   there's no way to make this endpoint fetch on behalf
   of an arbitrary GitHub account.

   Soft-fails on purpose: missing/invalid GitHub link,
   account not found, or an upstream GitHub error all
   come back as { repos: [], reason } with a 200, so the
   frontend just renders its existing empty states
   instead of a hard error banner.
════════════════════════════════════════════════ */
const getMyRepos = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    const githubUrl = profile?.personal?.github;

    if (!githubUrl) {
      return sendSuccess(res, { data: { repos: [], reason: 'no-username' } });
    }

    const repos = await githubService.getTopRepos(githubUrl);
    sendSuccess(res, { data: { repos } });
  } catch (err) {
    if (err.statusCode === 404) {
      return sendSuccess(res, { data: { repos: [], reason: 'not-found' } });
    }
    if (err.statusCode === 400) {
      return sendSuccess(res, { data: { repos: [], reason: 'no-username' } });
    }
    console.error('[GitHub] getMyRepos error:', err.message);
    sendSuccess(res, { data: { repos: [], reason: 'fetch-failed' } });
  }
};

module.exports = { getMyRepos };