// backend/src/controllers/aiInsightsController.js (Updated)
const { aiIntegrationService } = require('../services/aiIntegrationService');
const AIInsight = require('../models/AIInsight');
const SocialAccount = require('../models/SocialAccount');

class AIInsightsController {
  async getLatestInsight(req, res) {
    try {
        const { accountId } = req.params;
        const userId = req.user.id;

        // Try to find social account by ID first, then by user_id
        let account = await SocialAccount.findById(accountId);
        
        if (!account) {
        // If not found by ID, try to find by user_id (in case accountId is actually user_id)
        const accounts = await SocialAccount.findByUserId(userId);
        account = accounts.find(acc => acc.id === accountId) || accounts[0]; // Use first account if exact match not found
        }

        if (!account || account.user_id !== userId) {
        return res.status(403).json({
            success: false,
            message: 'No social account found or access denied'
        });
        }

        // Use the actual account ID from the found record
        const actualAccountId = account.id;

        // Get insight status
        const status = await aiIntegrationService.getInsightStatus(actualAccountId);
        
        // If no insights exist or they're too old, trigger processing
        if (status.needs_refresh) {
        // Trigger background processing
        aiIntegrationService.processAccountInsights(actualAccountId).catch(error => {
            console.error(`Background insight processing failed for ${actualAccountId}:`, error.message);
        });
        
        return res.json({
            success: true,
            message: 'Insights are being generated. Please check back in a few moments.',
            status: 'processing',
            account_id: actualAccountId
        });
        }

        const insight = await AIInsight.getByAccountId(actualAccountId);
        
        if (!insight) {
        return res.status(404).json({ 
            success: false, 
            message: 'No AI insights available yet. Processing has been triggered.' 
        });
        }

        return res.json({ 
        success: true, 
        data: {
            id: insight.id,
            summary: insight.summary,
            insights: insight.insights,
            confidence_score: insight.confidence_score,
            processing_time: insight.processing_time,
            created_at: insight.created_at,
            updated_at: insight.updated_at,
            status: status.status,
            age: status.insight_age
        }
        });

    } catch (error) {
        console.error('❌ AI Insight fetch error:', error.message);
        return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch AI insights',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
    }

  async triggerInsightGeneration(req, res) {
    try {
        const { accountId } = req.params;
        const userId = req.user.id;
        const forceRefresh = req.body.force_refresh || false;

        // Try to find social account by ID first, then by user_id
        let account = await SocialAccount.findById(accountId);
        
        if (!account) {
        // If not found by ID, try to find by user_id (in case accountId is actually user_id)
        const accounts = await SocialAccount.findByUserId(userId);
        account = accounts.find(acc => acc.id === accountId) || accounts[0]; // Use first account if exact match not found
        }

        if (!account || account.user_id !== userId) {
        return res.status(403).json({
            success: false,
            message: 'No social account found or access denied'
        });
        }

        // Use the actual account ID from the found record
        const actualAccountId = account.id;

        // Check current status
        const status = await aiIntegrationService.getInsightStatus(actualAccountId);
        
        if (status.status === 'syncing' && !forceRefresh) {
        return res.json({
            success: true,
            message: 'Insights are already being processed',
            status: 'processing',
            account_id: actualAccountId
        });
        }

        // Trigger processing
        const result = await aiIntegrationService.processAccountInsights(actualAccountId, forceRefresh);

        return res.json({
          success: true,
          message: 'Insights generated successfully',
          status: 'completed',
          account_id: actualAccountId,
          data: {
            id: result.id,
            summary: result.summary,
            confidence_score: result.confidence_score,
            created_at: result.created_at
          }
        });
    } catch (error) {
        console.error('❌ Insight generation error:', error.message);
        return res.status(500).json({
        success: false,
        message: 'Failed to generate insights',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
    }

  async batchProcessInsights(req, res) {
    try {
      const userId = req.user.id;
      const { account_ids, force_refresh = false } = req.body;

      if (!account_ids || !Array.isArray(account_ids)) {
        return res.status(400).json({
          success: false,
          message: 'account_ids must be an array'
        });
      }

      if (account_ids.length > 10) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 10 accounts can be processed at once'
        });
      }

      // Verify all accounts belong to user
      const accounts = await Promise.all(
        account_ids.map(id => SocialAccount.findById(id))
      );

      const invalidAccounts = accounts.filter(acc => !acc || acc.user_id !== userId);
      if (invalidAccounts.length > 0) {
        return res.status(403).json({
          success: false,
          message: 'One or more accounts not found or access denied'
        });
      }

      // Process insights
      const result = await aiIntegrationService.batchProcessInsights(account_ids);

      return res.json({
        success: true,
        message: `Batch processing completed: ${result.successful} successful, ${result.failed} failed`,
        data: result
      });

    } catch (error) {
      console.error('❌ Batch processing error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Batch processing failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getInsightStatus(req, res) {
    try {
        const { accountId } = req.params;
        const userId = req.user.id;

        // Try to find social account by ID first, then by user_id
        let account = await SocialAccount.findById(accountId);
        
        if (!account) {
        // If not found by ID, try to find by user_id (in case accountId is actually user_id)
        const accounts = await SocialAccount.findByUserId(userId);
        account = accounts.find(acc => acc.id === accountId) || accounts[0]; // Use first account if exact match not found
        }

        if (!account || account.user_id !== userId) {
        return res.status(403).json({
            success: false,
            message: 'No social account found or access denied'
        });
        }

        // Use the actual account ID from the found record
        const actualAccountId = account.id;
        const status = await aiIntegrationService.getInsightStatus(actualAccountId);

        if (!status || !status.status) {
          return res.json({
            success: true,
            data: {
              status: 'unknown',
              has_insights: false,
              needs_refresh: true
            }
          });
        }

        return res.json({
        success: true,
        data: status
        });

    } catch (error) {
        console.error('❌ Status check error:', error.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to check insight status',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
    }

  async getUserInsights(req, res) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 10;

      const insights = await AIInsight.getByUserId(userId, limit);

      // Add status information for each insight
      const enrichedInsights = await Promise.all(
        insights.map(async (insight) => {
          const status = await aiIntegrationService.getInsightStatus(insight.account_id);
          return {
            ...insight,
            status: status.status,
            age: status.insight_age,
            needs_refresh: status.needs_refresh
          };
        })
      );

      return res.json({
        success: true,
        data: enrichedInsights,
        count: enrichedInsights.length
      });

    } catch (error) {
      console.error('❌ User insights fetch error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user insights'
      });
    }
  }

  async getSystemHealth(req, res) {
    try {
      const health = await aiIntegrationService.healthCheck();
      
      return res.json({
        success: true,
        data: health,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Health check error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Health check failed',
        error: error.message
      });
    }
  }

  // Add these methods to the AIInsightsController class
  async getInsightHistory(req, res) {
    try {
        const { accountId } = req.params;
        const userId = req.user.id;
        const days = parseInt(req.query.days) || 30;

        // Verify account ownership
        const account = await SocialAccount.findById(accountId);
        if (!account || account.user_id !== userId) {
        return res.status(403).json({
            success: false,
            message: 'Account not found or access denied'
        });
        }

        const history = await aiIntegrationService.getInsightHistory(accountId, days);

        return res.json({
        success: true,
        data: history.data,
        period_days: days,
        total_insights: history.total_insights
        });

    } catch (error) {
        console.error('❌ Insight history fetch error:', error.message);
        return res.status(500).json({
        success: false,
        message: 'Failed to fetch insight history'
        });
    }
    }

    async deleteInsight(req, res) {
    try {
        const { accountId } = req.params;
        const userId = req.user.id;

        // Verify account ownership
        const account = await SocialAccount.findById(accountId);
        if (!account || account.user_id !== userId) {
        return res.status(403).json({
            success: false,
            message: 'Account not found or access denied'
        });
        }

        const result = await aiIntegrationService.deleteInsight(accountId);

        return res.json({
        success: result.success,
        message: result.success ? 'Insight deleted successfully' : 'No insight found to delete'
        });

    } catch (error) {
        console.error('❌ Delete insight error:', error.message);
        return res.status(500).json({
        success: false,
        message: 'Failed to delete insight'
        });
    }
    }

    async getProcessingMetrics(req, res) {
    try {
        const days = parseInt(req.query.days) || 7;
        const metrics = await aiIntegrationService.getProcessingMetrics(days);

        return res.json({
        success: true,
        data: metrics.metrics,
        period_days: days
        });

    } catch (error) {
        console.error('❌ Metrics fetch error:', error.message);
        return res.status(500).json({
        success: false,
        message: 'Failed to fetch processing metrics'
        });
    }
    }

    async getAccountsNeedingProcessing(req, res) {
    try {
        const accounts = await aiIntegrationService.getAccountsNeedingInsights();

        return res.json({
        success: true,
        data: accounts,
        count: accounts.length
        });

    } catch (error) {
        console.error('❌ Accounts needing processing error:', error.message);
        return res.status(500).json({
        success: false,
        message: 'Failed to fetch accounts needing processing'
        });
    }
    }
}

module.exports = AIInsightsController;