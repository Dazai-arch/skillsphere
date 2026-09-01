/**
 * src/job/job.controller.js
 * req.user is already the company account, attached by authenticate().
 *
 * create/update are hit with multipart/form-data (so the two optional
 * PDF attachments can ride along): the JSON job fields arrive as a
 * single stringified `data` field, and files arrive on req.files via
 * the upload.fields() middleware in job.routes.js.
 */
const jobService      = require('./job.service');
const { sendSuccess } = require('../utils/response');
const AppError         = require('../utils/AppError');
const { signUpload, buildPublicId } = require('../utils/cloudinarySign');

/* GET /api/jobs/resume-signature?ext=pdf
   Authorizes a direct browser → Cloudinary upload for a resume, so the
   file bytes never pass through this server (same reasoning as the
   avatar-signature endpoint in user.controller.js — this was the slow
   two-hop path on Render's free tier). */
const getResumeSignature = async (req, res, next) => {
  try {
    const ext = (req.query.ext || 'pdf').toString().toLowerCase();
    const isPdf = ext === 'pdf';

    // PDFs upload as resource_type 'image' with a q_auto transformation
    // so Cloudinary actually compresses them; DOC/DOCX resumes stay
    // 'raw' (untouched) since Cloudinary can't transform those.
    const publicId = buildPublicId(req.user._id, 'resume', isPdf ? undefined : ext);
    const signed = signUpload({
      folder: 'skillsphere/resumes',
      publicId,
      transformation: isPdf ? 'q_auto' : undefined,
    });

    sendSuccess(res, { data: { ...signed, resourceType: isPdf ? 'image' : 'raw' } });
  } catch (err) {
    next(err);
  }
};

/* GET /api/jobs/attachment-signature?type=jobDescriptionPdf&ext=pdf
   Same idea, for the two optional job-posting PDF attachments. */
const getAttachmentSignature = async (req, res, next) => {
  try {
    const type = (req.query.type || 'attachment').toString();
    const ext  = (req.query.ext || 'pdf').toString().toLowerCase();
    const isPdf = ext === 'pdf';

    const publicId = buildPublicId(req.user._id, type, isPdf ? undefined : ext);
    const signed = signUpload({
      folder: 'skillsphere/job-attachments',
      publicId,
      transformation: isPdf ? 'q_auto' : undefined,
    });

    sendSuccess(res, { data: { ...signed, resourceType: isPdf ? 'image' : 'raw' } });
  } catch (err) {
    next(err);
  }
};

const parseBody = (req) => {
  if (typeof req.body.data === 'string') {
    try {
      return JSON.parse(req.body.data);
    } catch {
      throw new AppError('Invalid job data payload.', 400);
    }
  }
  return req.body;
};

/* GET /api/jobs?status=draft|active|closed */
const listJobs = async (req, res, next) => {
  try {
    const jobs = await jobService.listForCompany(req.user._id, req.query.status);
    sendSuccess(res, { data: { jobs } });
  } catch (err) {
    next(err);
  }
};

/* GET /api/jobs/:id */
const getJob = async (req, res, next) => {
  try {
    const job = await jobService.getOne(req.user._id, req.params.id);
    sendSuccess(res, { data: { job } });
  } catch (err) {
    next(err);
  }
};

/* POST /api/jobs — body.status: 'draft' (default) | 'active' */
const createJob = async (req, res, next) => {
  try {
    const body = parseBody(req);
    const job = await jobService.create(req.user._id, body);
    sendSuccess(res, {
      statusCode: 201,
      message:    job.status === 'active' ? 'Job published successfully.' : 'Draft saved.',
      data:       { job },
    });
  } catch (err) {
    next(err);
  }
};

/* PATCH /api/jobs/:id — same body shape as create; status transitions here too */
const updateJob = async (req, res, next) => {
  try {
    const body = parseBody(req);
    const job = await jobService.update(req.user._id, req.params.id, body);
    sendSuccess(res, {
      message: job.status === 'active' ? 'Job published successfully.' : 'Job updated.',
      data:    { job },
    });
  } catch (err) {
    next(err);
  }
};

/* DELETE /api/jobs/:id */
const deleteJob = async (req, res, next) => {
  try {
    await jobService.remove(req.user._id, req.params.id);
    sendSuccess(res, { message: 'Job deleted.' });
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════════════
   CANDIDATE-FACING
══════════════════════════════════════════════════ */

/* GET /api/jobs/public?q=&employmentType=&workplaceType=&location= */
const listPublicJobs = async (req, res, next) => {
  try {
    const jobs = await jobService.listPublic(req.user._id, req.query);
    sendSuccess(res, { data: { jobs } });
  } catch (err) {
    next(err);
  }
};

/* GET /api/jobs/public/:id */
const getPublicJob = async (req, res, next) => {
  try {
    const job = await jobService.getPublicOne(req.user._id, req.params.id);
    sendSuccess(res, { data: { job } });
  } catch (err) {
    next(err);
  }
};

/* POST /api/jobs/:id/apply — JSON body, resume already uploaded to Cloudinary */
const applyJob = async (req, res, next) => {
  try {
    const job  = await jobService.applyToJob(req.user, req.params.id, req.body);
    sendSuccess(res, { statusCode: 201, message: 'Application submitted successfully.', data: { job } });
  } catch (err) {
    next(err);
  }
};

/* GET /api/jobs/recommended */
const listRecommendedJobs = async (req, res, next) => {
  try {
    const jobs = await jobService.listRecommended(req.user._id);
    sendSuccess(res, { data: { jobs } });
  } catch (err) {
    next(err);
  }
};

/* GET /api/jobs/applications/mine */
const listMyApplications = async (req, res, next) => {
  try {
    const jobs = await jobService.listMyApplications(req.user._id);
    sendSuccess(res, { data: { jobs } });
  } catch (err) {
    next(err);
  }
};

/* POST /api/jobs/:id/bookmark — toggles on/off, persisted on the user doc */
const toggleBookmark = async (req, res, next) => {
  try {
    const result = await jobService.toggleBookmark(req.user._id, req.params.id);
    sendSuccess(res, {
      message: result.bookmarked ? 'Job bookmarked.' : 'Bookmark removed.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

/* GET /api/jobs/bookmarked */
const listBookmarkedJobs = async (req, res, next) => {
  try {
    const jobs = await jobService.listBookmarked(req.user._id);
    sendSuccess(res, { data: { jobs } });
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════════════
   COMPANY-FACING — APPLICANT PIPELINE
══════════════════════════════════════════════════ */

/* GET /api/jobs/:id/applicants */
const listApplicants = async (req, res, next) => {
  try {
    const result = await jobService.listApplicants(req.user._id, req.params.id);
    sendSuccess(res, { data: result });
  } catch (err) {
    next(err);
  }
};

/* GET /api/jobs/:id/applicants/:candidateId/profile */
const getApplicantProfile = async (req, res, next) => {
  try {
    const profile = await jobService.getApplicantProfile(req.user._id, req.params.id, req.params.candidateId);
    sendSuccess(res, { data: { profile } });
  } catch (err) {
    next(err);
  }
};

/* PATCH /api/jobs/:id/applicants/:candidateId/status — Body: { status } */
const updateApplicantStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const result = await jobService.updateApplicantStatus(
      req.user._id, req.params.id, req.params.candidateId, status
    );
    sendSuccess(res, { message: 'Applicant status updated.', data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listJobs, getJob, createJob, updateJob, deleteJob,
  listPublicJobs, getPublicJob, applyJob, listMyApplications, listRecommendedJobs,
  toggleBookmark, listBookmarkedJobs,
  listApplicants, getApplicantProfile, updateApplicantStatus,
  getResumeSignature, getAttachmentSignature,
};