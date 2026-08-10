/**
 * src/profile/profile.controller.js
 */
const Profile   = require('./profile.model');
const User      = require('../user/user.model');
const AppError  = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const { deleteUploadedFile } = require('../utils/fileCleanup');
const { signUpload, buildPublicId } = require('../utils/cloudinarySign');
const path      = require('path');

/* GET /api/profile/cert-signature?ext=pdf
   Authorizes a direct browser → Cloudinary upload for a certification
   PDF, so the file never passes through this server (same pattern as
   the resume/avatar/job-attachment signature endpoints). */
const getCertSignature = async (req, res, next) => {
  try {
    const ext = (req.query.ext || 'pdf').toString();
    const publicId = buildPublicId(req.user._id, 'cert', ext);
    const signed = signUpload({ folder: 'skillsphere/certs', publicId });
    sendSuccess(res, { data: signed });
  } catch (err) {
    next(err);
  }
};

/* ── GET /api/profile ── */
const getProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await Profile.create({ userId: req.user._id });
    }
    sendSuccess(res, { data: { profile } });
  } catch (err) { next(err); }
};

/* GET /api/profile/photo-signature?ext=jpg
   Same direct-to-Cloudinary pattern as cert-signature above, now used
   for the profile photo too — this used to go through multer on this
   server, which was the slow two-hop path (same root cause as the
   avatar and resume fixes earlier). */
const getPhotoSignature = async (req, res, next) => {
  try {
    const ext = (req.query.ext || 'jpg').toString();
    const publicId = buildPublicId(req.user._id, 'profile-photo', ext);
    const signed = signUpload({ folder: 'skillsphere/avatars', publicId });
    sendSuccess(res, { data: signed });
  } catch (err) {
    next(err);
  }
};

/* ── PATCH /api/profile (autosave + final submit) ── */
const updateProfile = async (req, res, next) => {
  try {
    const body = req.body || {};
    const { isComplete, ...rest } = body;

    const update = { ...rest, lastAutosavedAt: new Date() };

    // Always load the existing `personal` subdocument — needed both to
    // merge a photo-only save on top of it (see below) and to know the
    // previous photoUrl so we can clean up the old file when it's being
    // replaced or removed.
    const existing = await Profile.findOne({ userId: req.user._id }).select('personal').lean();
    const previousPhotoUrl = existing?.personal?.photoUrl || '';

    // The photo (like every other `personal` field) now arrives already
    // set in `update.personal` — the frontend uploads it straight to
    // Cloudinary first, then sends the resulting URL merged into
    // `personal` here. We still merge onto the existing doc defensively
    // in case a caller ever sends a partial `personal` object, since
    // Mongo would otherwise wipe fullName/title/etc. on a photo-only save.
    if (update.personal) {
      update.personal = { ...(existing?.personal || {}), ...update.personal };
    }

    // Clean up the old file whenever this request changes the photo
    // (new upload replacing one, or an explicit removal), so Cloudinary
    // doesn't accumulate orphaned assets.
    if (update.personal && previousPhotoUrl && previousPhotoUrl !== update.personal.photoUrl) {
      deleteUploadedFile(previousPhotoUrl);
    }

    // Cert PDFs now arrive with `certPdfUrl` already set on each cert
    // object in `update.certs` — the frontend uploads them straight to
    // Cloudinary (via GET /api/profile/cert-signature) before this
    // request is even sent, so there's nothing to extract from files here.

    // If this is a final submit mark complete and update user flag
    if (isComplete === true) {
      update.isComplete = true;
      update.consent = {
        storage:   body.consent?.storage   ?? false,
        recruiter: body.consent?.recruiter ?? false,
      };
      await User.findByIdAndUpdate(req.user._id, { profileCompleted: true });
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: update },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    sendSuccess(res, { message: isComplete ? 'Profile completed.' : 'Draft saved.', data: { profile } });
  } catch (err) { next(err); }
};

module.exports = { getProfile, updateProfile, getCertSignature, getPhotoSignature };