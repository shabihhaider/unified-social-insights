const requireAuth = require('../middlewares/auth');

const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const meta = require('../controllers/metaController');

console.log('🔥 /api/meta mock router loaded');

// ✅ Middleware logging
router.use((req, res, next) => {
  console.log(`📦 Hit mockMeta route: ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Mock endpoints
router.get('/mock-pages', auth, meta.getMockPages);
router.get('/insights', auth, meta.getMockInsights);
router.get('/media', auth, meta.getMockMedia);

module.exports = router;
