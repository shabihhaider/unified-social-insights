// backend/src/services/aiIntegrationService.js
const axios = require('axios');
const AIInsight = require('../models/AIInsight');
const SocialAccount = require('../models/SocialAccount');


class AIIntegrationService {
  constructor() {
    this.aiEngineUrl = process.env.AI_ENGINE_URL || 'http://localhost:8000';
    this.timeout = 30000; // 30 seconds
    this.retryAttempts = 3;
    this.lastHealthCheck = null;
  this.lastHealthTimestamp = 0;
  }

  async processAccountInsights(accountId, forceRefresh = false) {
    try {
        console.log(`🤖 Processing insights for account: ${accountId}`);

        // Get account details
        const account = await SocialAccount.findById(accountId);
        if (!account) {
            throw new Error(`Account not found for ID: ${accountId}`);
        }

        // Guard for broken user reference
        const userId = account.user_id;
        if (!userId) {
        throw new Error(`SocialAccount ${accountId} has no user_id`);
        }

        // Check if we need to process (skip if recent insights exist and not forcing)
        if (!forceRefresh) {
            const existingInsight = await AIInsight.getByAccountId(accountId);
        if (existingInsight && this.isRecentInsight(existingInsight.created_at)) {
            console.log(`⏭️ Skipping ${accountId} - recent insights exist`);
            return existingInsight;
        }
        }

        // Update sync status
        if (accountId) {
            await SocialAccount.updateSyncStatus(accountId, 'error');
        }

        // Prepare data for AI engine
        const aiRequest = {
            account_id: accountId,
            user_id: account.user_id,
            platform: account.platform,
            username: account.username,
            data: this.prepareAccountData(account)
        };

        // Call AI engine
        const response = await this.callAIEngine('/process-insights', aiRequest);
        if (!response || typeof response !== 'object') {
            throw new Error('Invalid response from AI engine');
        }

        if (response.success && response.data) {
        console.log(`✅ Insights processed for ${accountId}`);
        await SocialAccount.updateSyncStatus(accountId, 'success');

        // Save the insights to database
        const savedInsight = await AIInsight.upsert({
            userId: account.user_id,
            accountId: accountId,
            platform: account.platform,
            insights: response.data.insights_preview || {},
            summary: response.data.summary,
            confidence_score: response.data.confidence_score || 1,
            processing_time: response.data.processing_time || 0,
            token_usage: response.data.token_usage || 0
        });

        console.log(`💾 Insights saved to database for ${accountId}`);
        return savedInsight;
        } else {
        throw new Error(response.message || 'AI processing failed');
        }

    } catch (error) {
        console.error(`❌ Error processing insights for ${accountId}:`, error.message);

        // Update sync status to error
        try {
        await SocialAccount.updateSyncStatus(accountId, 'error');
        } catch (updateError) {
        console.error('Failed to update sync status:', updateError.message);
        }

        throw error;
    }
    }

  async batchProcessInsights(accountIds, maxConcurrent = 3) {
    try {
      console.log(`🔄 Batch processing ${accountIds.length} accounts`);

      const results = [];
      const chunks = this.chunkArray(accountIds, maxConcurrent);

      for (const chunk of chunks) {
        const chunkPromises = chunk.map(accountId => 
          this.processAccountInsights(accountId).catch(error => ({
            accountId,
            error: error.message,
            success: false
          }))
        );

        const chunkResults = await Promise.all(chunkPromises);
        results.push(...chunkResults);

        // Brief pause between chunks to avoid overwhelming the system
        if (chunks.indexOf(chunk) < chunks.length - 1) {
          await this.sleep(1000);
        }
      }

      const successful = results.filter(r => r.success !== false).length;
      const failed = results.length - successful;

      console.log(`✅ Batch processing complete: ${successful} successful, ${failed} failed`);

      return {
        success: true,
        processed: results.length,
        successful,
        failed,
        results
      };

    } catch (error) {
      console.error('❌ Batch processing error:', error.message);
      throw error;
    }
  }

  async getInsightStatus(accountId) {
    try {
      const account = await SocialAccount.findById(accountId);
      if (!account) {
        return { status: 'not_found' };
      }

      const insight = await AIInsight.getByAccountId(accountId);
      
      return {
        status: account.sync_status,
        has_insights: !!insight,
        last_sync: account.last_sync_at,
        insight_age: insight ? this.getInsightAge(insight.created_at) : null,
        needs_refresh: insight ? !this.isRecentInsight(insight.created_at) : true
      };

    } catch (error) {
      console.error('❌ Error getting insight status:', error.message);
      return { status: 'error', error: error.message };
    }
  }

    async healthCheck() {
      const now = Date.now();
      if (this.lastHealthCheck && now - this.lastHealthTimestamp < 60_000) {
        return this.lastHealthCheck;
      }

      const response = await this.callAIEngine('/health', null, 'GET');
      const health = {
        ai_engine_healthy: response.healthy,
        ai_engine_status: response.status,
        integration_healthy: true
      };

      this.lastHealthCheck = health;
      this.lastHealthTimestamp = now;
      return health;
    }


  // Private methods
  async callAIEngine(endpoint, data = null, method = 'POST') {
    const config = {
      method,
      url: `${this.aiEngineUrl}${endpoint}`,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Backend-Integration/1.0'
      }
    };

    if (data && method !== 'GET') {
      config.data = data;
    }

    let lastError;
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        console.log(`🔄 AI Engine call attempt ${attempt}/${this.retryAttempts}: ${method} ${endpoint}`);
        
        const response = await axios(config);
        
        console.log(`✅ AI Engine response: ${response.status}`);
        if (!response?.data) {
        throw new Error('AI Engine returned no data');
        }
        console.log(`📦 Raw AI response data:`, JSON.stringify(response.data, null, 2));
        return response.data;

      } catch (error) {
        lastError = error;
        
        if (error.response) {
          console.error(`❌ AI Engine HTTP error ${error.response.status}:`, error.response.data);
          
          // Don't retry on client errors (4xx)
          if (error.response.status >= 400 && error.response.status < 500) {
            throw new Error(`AI Engine client error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
          }
        } else if (error.request) {
          console.error(`❌ AI Engine network error:`, error.message);
        } else {
          console.error(`❌ AI Engine request error:`, error.message);
        }

        // Wait before retry (exponential backoff)
        if (attempt < this.retryAttempts) {
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`⏳ Retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }

    throw new Error(`AI Engine call failed after ${this.retryAttempts} attempts: ${lastError.message}`);
  }

  prepareAccountData(account) {
    const metadata = account.metadata || {};
    
    return {
        profile: {
        username: account.username,
        display_name: account.display_name,
        followers_count: account.followers_count,
        following_count: account.following_count || 0,
        media_count: account.media_count || 0,
        platform_account_id: account.platform_account_id,
        account_type: account.account_type,
        verification_status: account.verification_status || 'unverified',
        biography: metadata.profile_data?.biography || '',
        website: metadata.profile_data?.website || '',
        ...metadata.profile_data
        },
        posts: (metadata.recent_posts || []).map(post => ({
        id: post.id,
        caption: post.caption,
        media_type: post.media_type,
        like_count: post.like_count || 0,
        comment_count: post.comment_count || 0,
        timestamp: post.timestamp,
        media_url: post.media_url
        })),
        stories: metadata.recent_stories || [],
        analytics: {
        reach: metadata.analytics?.reach || 0,
        impressions: metadata.analytics?.impressions || 0,
        ...metadata.analytics
        },
        engagement_history: metadata.engagement_history || [],
        hashtag_performance: metadata.hashtag_performance || {},
        last_sync: account.last_sync_at,
        permissions: account.permissions,
        account_age_days: this.calculateAccountAge(account.created_at)
    };
    }

    // Add helper method
    calculateAccountAge(createdAt) {
    if (!createdAt) return null;
    const accountDate = new Date(createdAt);
    const now = new Date();
    return Math.floor((now - accountDate) / (1000 * 60 * 60 * 24));
    }

  isRecentInsight(createdAt, maxAgeHours = 24) {
    if (!createdAt) return false;
    
    const insightDate = new Date(createdAt);
    const now = new Date();
    const ageHours = (now - insightDate) / (1000 * 60 * 60);
    
    return ageHours < maxAgeHours;
  }

  getInsightAge(createdAt) {
    if (!createdAt) return null;
    
    const insightDate = new Date(createdAt);
    const now = new Date();
    const ageMinutes = Math.floor((now - insightDate) / (1000 * 60));
    
    if (ageMinutes < 60) {
      return `${ageMinutes} minutes ago`;
    } else if (ageMinutes < 1440) {
      return `${Math.floor(ageMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(ageMinutes / 1440)} days ago`;
    }
  }

  chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Background job for processing insights
class InsightProcessor {
  constructor() {
    this.aiService = new AIIntegrationService();
    this.isProcessing = false;
    this.processingInterval = 5 * 60 * 1000; // 5 minutes
  }

  async start() {
    if (this.isProcessing) {
      console.log('⚠️ Insight processor already running');
      return;
    }

    console.log('🚀 Starting automatic insight processor');
    this.isProcessing = true;

    // Process immediately on start
    this.processScheduledInsights();

    // Set up recurring processing
    this.intervalId = setInterval(() => {
      this.processScheduledInsights();
    }, this.processingInterval);
  }

  async stop() {
    if (!this.isProcessing) return;

    console.log('🔄 Stopping insight processor');
    this.isProcessing = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async processScheduledInsights() {
    try {
      console.log('🔄 Processing scheduled insights...');

      // Get active accounts that need processing
      const accounts = await SocialAccount.findAllActiveAccounts();
      //const accounts = await SocialAccount.findByUserId(null); // Get all active accounts
      const needsProcessing = [];

      for (const account of accounts) {
        if (!account.is_active) continue;

        const status = await this.aiService.getInsightStatus(account.id);
        if (status.needs_refresh || status.status === 'pending') {
          needsProcessing.push(account.id);
        }
      }

      if (needsProcessing.length === 0) {
        console.log('✅ No accounts need insight processing');
        return;
      }

      console.log(`📊 Processing insights for ${needsProcessing.length} accounts`);

      // Process in batches
      await this.aiService.batchProcessInsights(needsProcessing, 2);

      console.log('✅ Scheduled insight processing complete');

    } catch (error) {
      console.error('❌ Scheduled insight processing error:', error.message);
    }
  }

  // Add after the healthCheck method
    async getInsightHistory(accountId, days = 30) {
    try {
        const history = await AIInsight.getInsightsHistory(accountId, days);
        return {
        success: true,
        data: history,
        period_days: days,
        total_insights: history.length
        };
    } catch (error) {
        console.error('❌ Error fetching insight history:', error.message);
        throw error;
    }
    }

    async deleteInsight(accountId) {
    try {
        const deleted = await AIInsight.deleteByAccountId(accountId);
        if (deleted) {
        console.log(`🗑️ Insights deleted for account ${accountId}`);
        // Update account sync status
        await SocialAccount.updateSyncStatus(accountId, 'pending');
        }
        return { success: deleted };
    } catch (error) {
        console.error('❌ Error deleting insight:', error.message);
        throw error;
    }
    }

    async getAccountsNeedingInsights() {
    try {
        const accounts = await AIInsight.findAccountsNeedingInsights();
        return accounts.map(account => ({
        id: account.id,
        username: account.username,
        platform: account.platform,
        last_sync: account.last_sync_at,
        needs_processing: true
        }));
    } catch (error) {
        console.error('❌ Error finding accounts needing insights:', error.message);
        throw error;
    }
    }

    async validateAIEngineConnection() {
    try {
        const response = await this.callAIEngine('/health', null, 'GET');
        return {
        connected: true,
        response_time: response.response_time || 'unknown',
        ai_engine_version: response.version || 'unknown',
        status: response.status
        };
    } catch (error) {
        return {
        connected: false,
        error: error.message,
        last_attempt: new Date().toISOString()
        };
    }
    }

    // Enhanced metrics collection
    async getProcessingMetrics(days = 7) {
    try {
        const query = `
        SELECT 
            platform,
            COUNT(*) as total_processed,
            AVG(confidence_score) as avg_confidence,
            AVG(processing_time) as avg_processing_time,
            AVG(token_usage) as avg_token_usage,
            DATE_TRUNC('day', created_at) as processing_date
        FROM ai_insights 
        WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '${days} days'
        GROUP BY platform, DATE_TRUNC('day', created_at)
        ORDER BY processing_date DESC
        `;
        
        const result = await AIInsight.query(query);
        return {
        success: true,
        period_days: days,
        metrics: result.rows
        };
    } catch (error) {
        console.error('❌ Error fetching processing metrics:', error.message);
        throw error;
    }
    }
}

// Export singleton instances
const aiIntegrationService = new AIIntegrationService();
const insightProcessor = new InsightProcessor();

module.exports = {
  AIIntegrationService,
  InsightProcessor,
  aiIntegrationService,
  insightProcessor
};