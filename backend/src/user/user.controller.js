const User            = require('./user.model');
const Profile         = require('../profile/profile.model');
const AppError        = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const { deleteUploadedFile } = require('../utils/fileCleanup');
const cloudinary      = require('../config/cloudinary');

/* ════════════════════════════════════════════════
   GET /api/user/me
   Returns the authenticated user's full profile.
   req.user is already attached by authenticate().
════════════════════════════════════════════════ */
const getMe = async (req, res, next) => {
  try {
    // Re-fetch to get the latest data (req.user was set at token creation time)
    const user = await User.findById(req.user._id);

    if (!user) return next(new AppError('User not found.', 404));

    // Use the same toPublic() shape as signin/signup/oauth so the frontend
    // always gets a consistent { id, displayName, profileCompleted, ... }
    // object no matter which endpoint it called. Previously this returned
    // the raw Mongoose doc, so `displayName` (a virtual) was silently
    // missing and every dashboard reload showed stale/incorrect data.
    sendSuccess(res, { data: { user: user.toPublic() } });
  } catch (err) {
    next(err);
  }
};

/* ════════════════════════════════════════════════
   PATCH /api/user/me
   Update display name or photo for the signed-in user.
   Body: { fullName?, companyName?, photoURL? }
════════════════════════════════════════════════ */
const updateMe = async (req, res, next) => {
  try {
    const { fullName, companyName, photoURL, socialLinks } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return next(new AppError('User not found.', 404));

    if (user.role === 'candidate' && fullName?.trim())
      user.fullName = fullName.trim();

    if (user.role === 'company' && companyName?.trim())
      user.companyName = companyName.trim();

    if (photoURL?.trim())
      user.photoURL = photoURL.trim();

    // Merge onto the existing subdocument so saving just the LinkedIn
    // field (say) doesn't blank out a Twitter link that was already
    // there — same "load what's there first" rule as the profile
    // controller's photo/cert merges.
    if (socialLinks && typeof socialLinks === 'object') {
      user.socialLinks = {
        linkedin: socialLinks.linkedin?.trim() ?? user.socialLinks?.linkedin ?? '',
        twitter:  socialLinks.twitter?.trim()  ?? user.socialLinks?.twitter  ?? '',
      };
    }

    await user.save();

    sendSuccess(res, {
      message: 'Profile updated successfully.',
      data:    { user: user.toPublic() },
    });
  } catch (err) {
    next(err);
  }
};

/* ════════════════════════════════════════════════
   GET /api/user/me/photo-signature
   Authorizes a direct browser → Cloudinary upload. The browser used to
   send the raw file through this server, which then re-uploaded it to
   Cloudinary — a slow two-hop path, especially over Render's free-tier
   bandwidth. Now the server only ever signs a short-lived upload
   request; the actual file bytes go straight from the browser to
   Cloudinary and never touch this server at all.
════════════════════════════════════════════════ */
const getPhotoSignature = async (req, res, next) => {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const folder     = 'skillsphere/avatars';
    const public_id   = `${req.user._id}-${Date.now()}`;

    // Only these params (plus the secret) go into the signature —
    // whatever the client sends to Cloudinary must match exactly, or
    // Cloudinary rejects the upload. Keeps the client from being able
    // to smuggle in a different folder/public_id than the one we meant.
    // `transformation` is signed too so Cloudinary compresses (and
    // picks the best delivery format) at upload time rather than
    // storing the photo untouched.
    const transformation = 'q_auto:good,f_auto';
    const paramsToSign = { timestamp, folder, public_id, transformation };
    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

    sendSuccess(res, {
      data: {
        signature,
        timestamp,
        folder,
        publicId: public_id,
        transformation,
        resourceType: 'image',
        apiKey:   process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ════════════════════════════════════════════════
   POST /api/user/me/photo
   Saves the avatar URL after the browser has already uploaded the
   file directly to Cloudinary using the signature above. No file
   passes through this server — just the resulting secure_url.
════════════════════════════════════════════════ */
const uploadPhoto = async (req, res, next) => {
  try {
    const { photoURL } = req.body;
    if (!photoURL || typeof photoURL !== 'string' || !photoURL.startsWith('https://res.cloudinary.com/')) {
      return next(new AppError('A valid Cloudinary photo URL is required.', 400));
    }

    const user = await User.findById(req.user._id);
    if (!user) return next(new AppError('User not found.', 404));

    const previousPhotoUrl = user.photoURL || '';
    user.photoURL = photoURL;
    await user.save();

    // Clean up the file this one just replaced (if it was one of ours —
    // deleteUploadedFile() ignores external/OAuth avatar URLs).
    if (previousPhotoUrl && previousPhotoUrl !== user.photoURL) {
      deleteUploadedFile(previousPhotoUrl);
    }

    sendSuccess(res, {
      message: 'Photo updated successfully.',
      data:    { user: user.toPublic() },
    });
  } catch (err) {
    next(err);
  }
};

/* ════════════════════════════════════════════════
   DELETE /api/user/me/photo
   Removes the current avatar/logo entirely — the frontend then falls
   back to the initials placeholder, same as a brand-new account that
   never uploaded one.
════════════════════════════════════════════════ */
const removePhoto = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return next(new AppError('User not found.', 404));

    const previousPhotoUrl = user.photoURL || '';
    user.photoURL = null;
    await user.save();

    deleteUploadedFile(previousPhotoUrl);

    sendSuccess(res, {
      message: 'Photo removed.',
      data:    { user: user.toPublic() },
    });
  } catch (err) {
    next(err);
  }
};

/* ════════════════════════════════════════════════
   DELETE /api/user/me
   Permanently deletes the signed-in user's account.
   Body: { confirmText }  — must be exactly "DELETE".
   The frontend also gates this behind a checkbox + typed
   confirmation, but the backend re-checks it too so the
   endpoint can never be hit by accident (e.g. a stray
   script or a replayed request) without the same intent.
════════════════════════════════════════════════ */
const deleteMe = async (req, res, next) => {
  try {
    if (req.body?.confirmText !== 'DELETE') {
      return next(new AppError('Type DELETE to confirm account deletion.', 400));
    }

    const user = await User.findById(req.user._id);
    if (!user) return next(new AppError('User not found.', 404));

    // Best-effort: remove the candidate's profile doc too, so deleting
    // the account doesn't leave an orphaned profile behind. Missing/absent
    // profile (e.g. company accounts) is fine — findOneAndDelete just
    // resolves to null rather than throwing.
    try {
      await Profile.findOneAndDelete({ userId: user._id });
    } catch (profileErr) {
      console.error(`[Account deletion] Could not remove profile for user ${user._id}:`, profileErr.message);
    }

    await User.findByIdAndDelete(user._id);

    sendSuccess(res, { message: 'Account deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMe, updateMe, deleteMe, uploadPhoto, removePhoto, getPhotoSignature };