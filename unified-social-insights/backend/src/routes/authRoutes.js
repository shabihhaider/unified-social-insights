// backend/src/routes/authRoutes.js

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const facebookController = require('../controllers/facebookController');
const auth = require('../middlewares/auth');

console.log("🔥 /api/auth router loaded");

// 🔍 Middleware for logging each request
router.use((req, res, next) => {
  console.log(`📦 Hit /api/auth: ${req.method} ${req.url}`);
  next();
});

// ✅ Public Auth Endpoints
router.post('/register', authController.registerUser);
router.post('/email-login', authController.emailLogin);

// ✅ Facebook OAuth (for Page and IG access)
router.get('/facebook', facebookController.redirectToFacebook);           // Step 1: Redirect user to Facebook login
router.get('/facebook/callback', facebookController.facebookCallback);   // Step 2: Handle redirect and store tokens

// ✅ Protected Endpoint - used to test and verify JWT
router.get('/me', auth, (req, res) => {
  console.log("✅ /me route accessed. Decoded user:", req.user);
  res.status(200).json({
    success: true,
    message: 'Authenticated user info',
    user: req.user
  });
});

module.exports = router;
