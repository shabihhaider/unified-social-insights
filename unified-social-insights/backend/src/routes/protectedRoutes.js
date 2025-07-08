const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const requireRole = require('../middlewares/requireRole');

// ✅ Free or above (everyone with an account)
router.get('/free-resource', authMiddleware, requireRole(['free', 'pro', 'business', 'agency']), (req, res) => {
  res.json({ message: 'Hello Free user or higher!' });
});

// ✅ Pro or above
router.get('/pro-resource', authMiddleware, requireRole(['pro', 'business', 'agency']), (req, res) => {
  res.json({ message: 'Welcome Pro, Business, or Agency user.' });
});

// ✅ Business or agency only
router.get('/business-resource', authMiddleware, requireRole(['business', 'agency']), (req, res) => {
  res.json({ message: 'Welcome Business or Agency only.' });
});

// ✅ Agency only
router.get('/agency-resource', authMiddleware, requireRole(['agency']), (req, res) => {
  res.json({ message: 'Top-tier Agency access granted.' });
});

module.exports = router;
