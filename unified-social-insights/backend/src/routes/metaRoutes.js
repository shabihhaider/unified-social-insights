const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const meta = require('../controllers/metaController');

console.log('🔥 /api/meta mock router loaded');

router.get('/mock-pages', auth, meta.getMockPages);
router.get('/insights', auth, meta.getMockInsights);

module.exports = router;
