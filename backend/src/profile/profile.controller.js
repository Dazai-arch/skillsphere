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

/* ── PATCH /api/profile (autosave + final submit) ── */
const updateProfile = async (req, res, next) => {
  try {
    const body = JSON.parse(req.body.data || '{}');
    const { isComplete, ...rest } = body;

    const update = { ...rest, lastAutosavedAt: new Date() };

    // Always load the existing `personal` subdocument — needed both to
    // merge a photo-only save on top of it (see below) and to know the
    // previous photoUrl so we can clean up the old file when it's being
    // replaced or removed.
    const existing = await Profile.findOne({ userId: req.user._id }).select('personal').lean();
    const previousPhotoUrl = existing?.personal?.photoUrl || '';

    // Handle photo upload — merge into the `personal` object itself,
    // don't set a dotted 'personal.photoUrl' path alongside the whole
    // `personal` object (Mongo rejects writing to a parent + child path
    // in the same $set).
    //
    // IMPORTANT: a photo-only save (no `personal` in the request body,
    // e.g. just changing the avatar) used to overwrite the whole
    // `personal` subdocument with just { photoUrl }, silently wiping
    // fullName/title/etc. Load the existing document first so we always
    // merge on top of what's actually saved, not just what this request sent.
    if (req.files?.photo?.[0]) {
      update.personal = {
        ...(existing?.personal || {}),
        ...(update.personal || {}),
        // `req.files.photo[0].path` is set by multer-storage-cloudinary
        // to the asset's full https secure_url.
        photoUrl: req.files.photo[0].path,
      };
    } else if (update.personal && !update.personal.photoUrl) {
      // Candidate explicitly removed their photo — the frontend sends
      // back the full `personal` object with photoUrl cleared. Make
      // sure that actually lands as '' rather than being dropped.
      update.personal = { ...update.personal, photoUrl: '' };
    }

    // Clean up the old file on disk whenever this request changes the
    // photo (new upload replacing one, or an explicit removal), so
    // /uploads doesn't accumulate orphaned files.
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

module.exports = { getProfile, updateProfile, getCertSignature };