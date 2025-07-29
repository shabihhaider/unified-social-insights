// backend/src/routes/aiInsights.js (Updated)
const express = require('express');
const { body, param, query } = require('express-validator');
const requireAuth = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validation');
const AIInsightsController = require('../controllers/aiInsightsController');

const router = express.Router();
const controller = new AIInsightsController();

// Middleware
router.use(requireAuth);

// Validation
const validateAccountId = [
  param('accountId').isUUID().withMessage('Invalid account ID format')
];

const validateHistoryQuery = [
  query('days').optional().isInt({ min: 1, max: 365 }).withMessage('Days must be between 1 and 365')
];

const validateUserQuery = [
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

const validateBatchRequest = [
  body('account_ids')
    .isArray({ min: 1, max: 10 })
    .withMessage('account_ids must be an array with 1-10 items'),
  body('account_ids.*')
    .isUUID()
    .withMessage('Each account_id must be a valid UUID'),
  body('force_refresh')
    .optional()
    .isBoolean()
    .withMessage('force_refresh must be a boolean')
];

const validateGenerateRequest = [
  body('force_refresh')
    .optional()
    .isBoolean()
    .withMessage('force_refresh must be a boolean')
];

// Routes
router.get('/health', controller.getSystemHealth.bind(controller));

router.get('/user', 
  validateUserQuery, 
  validateRequest, 
  controller.getUserInsights.bind(controller)
);

router.get('/:accountId', 
  validateAccountId, 
  validateRequest, 
  controller.getLatestInsight.bind(controller)
);

router.get('/:accountId/status', 
  validateAccountId, 
  validateRequest, 
  controller.getInsightStatus.bind(controller)
);

router.post('/:accountId/generate', 
  [...validateAccountId, ...validateGenerateRequest], 
  validateRequest, 
  controller.triggerInsightGeneration.bind(controller)
);

router.post('/batch-process', 
  validateBatchRequest, 
  validateRequest, 
  controller.batchProcessInsights.bind(controller)
);

// Legacy route support
router.get('/:accountId/history', 
  [...validateAccountId, ...validateHistoryQuery], 
  validateRequest, 
  async (req, res) => {
    // Redirect to new insights endpoint with history flag
    const { accountId } = req.params;
    const days = parseInt(req.query.days) || 30;
    
    try {
      const insights = await AIInsight.getInsightsHistory(accountId, days);
      res.json({
        success: true,
        data: insights,
        period_days: days
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch insights history'
      });
    }
  }
);

// Add these routes after the existing ones

router.get('/:accountId/history', 
  [...validateAccountId, ...validateHistoryQuery], 
  validateRequest, 
  controller.getInsightHistory.bind(controller)
);

router.delete('/:accountId', 
  validateAccountId, 
  validateRequest, 
  controller.deleteInsight.bind(controller)
);

router.get('/admin/metrics', 
  query('days').optional().isInt({ min: 1, max: 90 }).withMessage('Days must be between 1 and 90'),
  validateRequest,
  controller.getProcessingMetrics.bind(controller)
);

router.get('/admin/pending', 
  controller.getAccountsNeedingProcessing.bind(controller)
);

module.exports = router;