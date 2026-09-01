/**
 * src/utils/cloudinarySign.js
 *
 * Shared helper for authorizing direct browser → Cloudinary uploads.
 * Used by every "get me a signature" endpoint (avatar, resume, cert
 * PDFs, job attachments) so the signing logic — and the list of which
 * params actually get signed — lives in exactly one place.
 *
 * By default only { timestamp, folder, public_id } are signed. Cloudinary
 * requires whatever the browser sends to match these exactly, or it
 * rejects the upload as a signature mismatch — that's what stops a
 * client from uploading into a folder/public_id we didn't authorize.
 *
 * An optional `transformation` (e.g. 'q_auto:good,f_auto') can also be
 * signed — this is what lets Cloudinary compress the asset itself at
 * upload time instead of storing it byte-for-byte. If passed, the
 * browser must send that exact same transformation string back or the
 * signature won't match, same as folder/public_id.
 */
const cloudinary = require('../config/cloudinary');

const signUpload = ({ folder, publicId, transformation }) => {
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { timestamp, folder, public_id: publicId };
  if (transformation) paramsToSign.transformation = transformation;

  const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

  return {
    signature,
    timestamp,
    folder,
    publicId,
    transformation,
    apiKey:    process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  };
};

// Keeps uploaded filenames from colliding, and — for raw resource types
// (PDFs) — Cloudinary needs the extension baked into public_id itself,
// since raw assets don't get one auto-appended the way images do.
const buildPublicId = (userId, label, ext) => {
  const safeExt = (ext || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const base = `${userId || 'anon'}-${label}-${Date.now()}`;
  return safeExt ? `${base}.${safeExt}` : base;
};

module.exports = { signUpload, buildPublicId };