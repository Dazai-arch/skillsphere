/**
 * src/profile/profile.routes.js
 *
 * Photo upload still goes through this server via multer (unchanged —
 * only the cert PDFs and other document uploads were slow enough on
 * Render's free tier to be worth moving to direct-to-Cloudinary).
 * Cert PDFs now upload straight from the browser using the signature
 * from GET /cert-signature; see profile.controller.js.
 */
const { Router } = require('express');
const multer     = require('multer');
// Handles both export shapes across versions of this package: v3+ exports
// { CloudinaryStorage }, v1/v2 export the class directly as module.exports.
const multerStorageCloudinary = require('multer-storage-cloudinary');
const CloudinaryStorage = multerStorageCloudinary.CloudinaryStorage || multerStorageCloudinary;
const cloudinary = require('../config/cloudinary');
const { authenticate, authorize } = require('../auth/auth.middleware');
const { getProfile, updateProfile, getCertSignature } = require('./profile.controller');

/* ── Storage for the profile photo only. Pushed to Cloudinary instead
   of local disk — Render's filesystem is wiped on every deploy/restart.
   Left as resource_type 'image' (the default), so Cloudinary
   auto-generates the public_id without the file extension baked in. ── */
const photoStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, _file) => ({
    folder:    'skillsphere/avatars',
    public_id: `${req.user?._id || 'anon'}-${Date.now()}`,
  }),
});

const upload = multer({
  storage: photoStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  },
});

const uploadFields = upload.fields([{ name: 'photo', maxCount: 1 }]);

const router = Router();

router.use(authenticate, authorize('candidate'));

router.get ('/',  getProfile);
router.get ('/cert-signature', getCertSignature);
router.patch('/', uploadFields, updateProfile);

module.exports = router;