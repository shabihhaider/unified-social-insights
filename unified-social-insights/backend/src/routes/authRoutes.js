const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const auth = require('../middlewares/auth'); // 🔐 JWT middleware

console.log("🔥 /api/auth router loaded");

// 🔍 Log every route hit in /api/auth
router.use((req, res, next) => {
  console.log("📦 Hit authRoutes path:", req.method, req.url);
  next();
});

// ✅ Public Routes
router.post('/register', authController.registerUser);
router.post('/email-login', authController.emailLogin);

// 🌐 Facebook OAuth (Optional)
router.get('/facebook', authController.initiateFacebookOAuth);
router.get('/facebook/callback', authController.handleFacebookOAuth);

// 🔐 Protected Route
router.get('/me', auth, (req, res) => {
  console.log("✅ /me route hit. Decoded user:", req.user);
  res.status(200).json({
    success: true,
    message: 'Protected route accessed!',
    user: req.user
  });
});

module.exports = router;
