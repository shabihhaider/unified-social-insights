// backend/src/routes/socialAccounts.js

const express = require('express');
const requireAuth = require('../middlewares/auth');
const SocialAccountsController = require('../controllers/socialAccountsController');

const router = express.Router();

// ✅ Protect all routes with JWT middleware
router.use(requireAuth);

// 📄 GET all connected social accounts for the logged-in user
router.get('/', SocialAccountsController.getAccounts);

// 🔗 Connect or re-connect a social account (if needed)
router.post('/', SocialAccountsController.connectAccount);

// 🔄 Toggle active/inactive status
router.put('/:accountId/toggle', SocialAccountsController.toggleAccount);

// 🔁 Refresh/re-fetch latest account data from platform (Facebook/IG)
router.post('/:accountId/refresh', SocialAccountsController.refreshAccount);

// ❌ Disconnect account (soft delete or real delete)
router.delete('/:accountId', SocialAccountsController.deleteAccount);

// 📊 Get analytics data for a specific connected account
router.get('/:accountId/analytics', SocialAccountsController.getAccountAnalytics);

module.exports = router;
