const { Router }                    = require('express');
const controller                    = require('./user.controller');
const { authenticate, authorize }   = require('../auth/auth.middleware');

const router = Router();

// All user routes require a valid JWT
router.use(authenticate);

/* ── Profile ──────────────────────────────────── */
router.get   ('/me', controller.getMe);
router.patch ('/me', controller.updateMe);
router.delete('/me', controller.deleteMe);

/* ── Avatar / company logo upload ──
   Two-step direct-upload flow instead of proxying the file through this
   server: the browser first calls GET /me/photo-signature to get a
   signed, short-lived authorization; it then uploads the file straight
   to Cloudinary using that signature; only the resulting URL comes back
   here to be saved on the user record. */
router.get   ('/me/photo-signature', controller.getPhotoSignature);
router.post  ('/me/photo', controller.uploadPhoto);
router.delete('/me/photo', controller.removePhoto);

/* ── Role-gated route stubs ───────────────────────
   Uncomment and add controllers as you build out
   the rest of the app.

   // Company: view candidate list
   router.get('/candidates', authorize('company'), candidateController.list);

   // Candidate: browse job listings
   router.get('/jobs', authorize('candidate'), jobController.list);

   // Candidate: apply to a job
   router.post('/jobs/:id/apply', authorize('candidate'), jobController.apply);
─────────────────────────────────────────────────── */

module.exports = router;