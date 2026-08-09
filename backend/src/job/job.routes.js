/**
 * src/job/job.routes.js
 *
 * Every file upload (resumes, job attachments) now goes straight from
 * the browser to Cloudinary using a short-lived signature from the
 * *-signature routes below — no multer, no file ever touches this
 * server. See job.controller.js for the signing logic and
 * job.service.js for where the resulting URLs get saved.
 */
const { Router } = require('express');
const { authenticate, authorize } = require('../auth/auth.middleware');
const controller  = require('./job.controller');

const router = Router();

/* ── Candidate-facing routes ──
   Registered before the company-only `router.use` guard below, so each
   one attaches its own authenticate/authorize('candidate') instead of
   inheriting the company guard. Path shapes (/public, /public/:id,
   /:id/apply, /applications/mine) never collide with the single-segment
   company routes registered afterwards. ── */
router.get(
  '/public',
  authenticate, authorize('candidate'),
  controller.listPublicJobs
);
router.get(
  '/recommended',
  authenticate, authorize('candidate'),
  controller.listRecommendedJobs
);
router.get(
  '/public/:id',
  authenticate, authorize('candidate'),
  controller.getPublicJob
);
router.get(
  '/resume-signature',
  authenticate, authorize('candidate'),
  controller.getResumeSignature
);
router.post(
  '/applications/:id/apply',
  authenticate, authorize('candidate'),
  controller.applyJob
);
router.get(
  '/applications/mine',
  authenticate, authorize('candidate'),
  controller.listMyApplications
);
router.get(
  '/bookmarked',
  authenticate, authorize('candidate'),
  controller.listBookmarkedJobs
);
router.post(
  '/:id/bookmark',
  authenticate, authorize('candidate'),
  controller.toggleBookmark
);

// Every remaining job-posting route belongs to a company managing its own listings.
router.use(authenticate, authorize('company'));

router.get   ('/attachment-signature', controller.getAttachmentSignature);
router.get   ('/',    controller.listJobs);
router.post  ('/',    controller.createJob);
router.get   ('/:id', controller.getJob);
router.patch ('/:id', controller.updateJob);
router.delete('/:id', controller.deleteJob);

/* ── Applicant pipeline (viewing/managing candidates who applied) ── */
router.get  ('/:id/applicants',                      controller.listApplicants);
router.get  ('/:id/applicants/:candidateId/profile',  controller.getApplicantProfile);
router.patch('/:id/applicants/:candidateId/status',   controller.updateApplicantStatus);

module.exports = router;