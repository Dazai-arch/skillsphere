/**
 * src/profile/profile.routes.js
 *
 * Every file upload (photo, cert PDFs) now goes straight from the
 * browser to Cloudinary using a short-lived signature from the
 * *-signature routes below — no multer, no file ever touches this
 * server. See profile.controller.js for the signing logic.
 */
const { Router } = require('express');
const { authenticate, authorize } = require('../auth/auth.middleware');
const { getProfile, updateProfile, getCertSignature, getPhotoSignature } = require('./profile.controller');

const router = Router();

router.use(authenticate, authorize('candidate'));

router.get  ('/',  getProfile);
router.get  ('/cert-signature',  getCertSignature);
router.get  ('/photo-signature', getPhotoSignature);
router.patch('/', updateProfile);

module.exports = router;