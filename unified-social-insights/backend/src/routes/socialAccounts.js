const express = require('express');
const requireAuth = require('../middlewares/auth');
const router = express.Router();
const SocialAccountsController = require('../controllers/socialAccountsController');
const authenticateToken = require('../middlewares/auth');

// Apply authentication to all routes
router.use(authenticateToken);

// GET /api/social-accounts - Get all connected accounts
router.get('/', SocialAccountsController.getAccounts);
router.get('/social-accounts', requireAuth, SocialAccountsController.getAccounts);

// POST /api/social-accounts - Connect new account
router.post('/', SocialAccountsController.connectAccount);

// PUT /api/social-accounts/:accountId/toggle - Toggle account active status
router.put('/:accountId/toggle', SocialAccountsController.toggleAccount);

// POST /api/social-accounts/:accountId/refresh - Refresh account data
router.post('/:accountId/refresh', SocialAccountsController.refreshAccount);

// DELETE /api/social-accounts/:accountId - Delete/disconnect account
router.delete('/:accountId', SocialAccountsController.deleteAccount);


module.exports = router;