const User           = require('./user.model');
const AppError       = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');

/* ════════════════════════════════════════════════
   GET /api/user/me
   Returns the authenticated user's full profile.
   req.user is already attached by authenticate().
════════════════════════════════════════════════ */
const getMe = async (req, res, next) => {
  try {
    // Re-fetch to get the latest data (req.user was set at token creation time)
    const user = await User
      .findById(req.user._id)
      .select('-refreshToken -clerkEmailAddressId -firebaseUid');

    if (!user) return next(new AppError('User not found.', 404));

    sendSuccess(res, { data: { user } });
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
    const { fullName, companyName, photoURL } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return next(new AppError('User not found.', 404));

    if (user.role === 'candidate' && fullName?.trim())
      user.fullName = fullName.trim();

    if (user.role === 'company' && companyName?.trim())
      user.companyName = companyName.trim();

    if (photoURL?.trim())
      user.photoURL = photoURL.trim();

    await user.save();

    sendSuccess(res, {
      message: 'Profile updated successfully.',
      data:    { user: user.toPublic() },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMe, updateMe };