const SocialAccount = require('../models/SocialAccount');
const axios = require('axios');
const { getFacebookPageAnalytics, getInstagramBusinessAnalytics } = require('../services/socialAccounts');

class SocialAccountsController {
  // Get all social accounts for the authenticated user
  static async getAccounts(req, res) {
    try {
      const userId = req.user.id;
      console.log("GET ACCOUNTS FOR USER:", req.user.id);
      const accounts = await SocialAccount.findByUserId(userId);
      console.log("ACCOUNTS FOUND:", accounts);
      
      // Transform data to match frontend expectations
      const transformedAccounts = accounts.map(account => ({
        id: account.id,
        platform: account.platform,
        username: account.username,
        displayName: account.display_name,
        profileImage: account.profile_image_url,
        followers: account.followers_count,
        accountType: account.account_type,
        isActive: account.is_active,
        lastSync: formatTimestamp(account.last_sync_at),
        syncStatus: account.sync_status,
        permissions: account.permissions,
        connectedAt: account.created_at.toISOString().split('T')[0],
        metrics: {
          posts: account.metadata?.posts_count || 0,
          engagement: account.metadata?.engagement_rate || 0,
          reach: account.metadata?.reach || 0
        }
      }));

      res.json({
        success: true,
        accounts: transformedAccounts
      });
    } catch (error) {
      console.error('Error fetching social accounts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch social accounts'
      });
    }
  }

  // Toggle account active status
  static async toggleAccount(req, res) {
    try {
      const { accountId } = req.params;
      const { isActive } = req.body;
      const userId = req.user.id;

      // Verify account belongs to user
      const account = await SocialAccount.findById(accountId);
      if (!account || account.user_id !== userId) {
        return res.status(404).json({
          success: false,
          error: 'Account not found'
        });
      }

      const updatedAccount = await SocialAccount.updateActiveStatus(accountId, isActive);
      
      res.json({
        success: true,
        account: updatedAccount
      });
    } catch (error) {
      console.error('Error toggling account status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update account status'
      });
    }
  }

  // Delete/disconnect account
  static async deleteAccount(req, res) {
    try {
      const { accountId } = req.params;
      const userId = req.user.id;

      // Verify account belongs to user
      const account = await SocialAccount.findById(accountId);
      if (!account || account.user_id !== userId) {
        return res.status(404).json({
          success: false,
          error: 'Account not found'
        });
      }

      await SocialAccount.delete(accountId);
      
      res.json({
        success: true,
        message: 'Account disconnected successfully'
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to disconnect account'
      });
    }
  }

  // Refresh account data
  static async refreshAccount(req, res) {
    try {
      const { accountId } = req.params;
      const userId = req.user.id;

      // Verify account belongs to user
      const account = await SocialAccount.findById(accountId);
      if (!account || account.user_id !== userId) {
        return res.status(404).json({
          success: false,
          error: 'Account not found'
        });
      }

      // Update sync status to 'syncing'
      await SocialAccount.updateSyncStatus(accountId, 'syncing');

      // Trigger background sync (you can implement a queue here later)
      // For now, we'll just update the sync time
      setTimeout(async () => {
        try {
          await SocialAccount.updateSyncStatus(accountId, 'success');
        } catch (error) {
          await SocialAccount.updateSyncStatus(accountId, 'error');
        }
      }, 2000);

      res.json({
        success: true,
        message: 'Account refresh initiated'
      });
    } catch (error) {
      console.error('Error refreshing account:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to refresh account'
      });
    }
  }

  // Connect new Facebook/Instagram account
  static async connectAccount(req, res) {
    try {
      const { platform, accessToken, pageData } = req.body;
      const userId = req.user.id;

      if (!platform || !accessToken) {
        return res.status(400).json({
          success: false,
          error: 'Platform and access token are required'
        });
      }

      let accountData;

      if (platform === 'facebook' && pageData) {
        // Facebook Page connection
        accountData = {
          user_id: userId,
          platform: 'facebook',
          platform_account_id: pageData.page_id,
          username: pageData.page_name,
          display_name: pageData.page_name,
          access_token: pageData.page_token,
          account_type: 'page',
          permissions: ['pages_read_engagement', 'pages_show_list'],
          metadata: {
            instagram_account_id: pageData.instagram_account_id
          }
        };
      } else if (platform === 'instagram' && pageData) {
        // Instagram Business Account connection
        accountData = {
          user_id: userId,
          platform: 'instagram',
          platform_account_id: pageData.instagram_account_id,
          username: `@${pageData.page_name.toLowerCase().replace(/\s+/g, '')}`,
          display_name: pageData.page_name,
          access_token: pageData.page_token,
          account_type: 'business',
          permissions: ['instagram_basic', 'pages_read_engagement'],
          metadata: {
            page_id: pageData.page_id
          }
        };
      } else {
        return res.status(400).json({
          success: false,
          error: 'Invalid platform or missing page data'
        });
      }

      // Try to fetch basic profile info to validate token
      try {
        if (platform === 'facebook') {
          const response = await axios.get(`https://graph.facebook.com/v18.0/${pageData.page_id}?fields=name,followers_count&access_token=${pageData.page_token}`);
          accountData.followers_count = response.data.followers_count || 0;
        } else if (platform === 'instagram') {
          const response = await axios.get(`https://graph.facebook.com/v18.0/${pageData.instagram_account_id}?fields=username,followers_count,profile_picture_url&access_token=${pageData.page_token}`);
          accountData.username = `@${response.data.username}`;
          accountData.followers_count = response.data.followers_count || 0;
          accountData.profile_image_url = response.data.profile_picture_url;
        }
      } catch (apiError) {
        console.warn('Could not fetch additional profile data:', apiError.message);
      }

      const newAccount = await SocialAccount.create(accountData);

      res.json({
        success: true,
        message: 'Account connected successfully',
        account: newAccount
      });
    } catch (error) {
      console.error('Error connecting account:', error);
      if (error.message === 'Account already connected') {
        return res.status(409).json({
          success: false,
          error: 'This account is already connected'
        });
      }
      res.status(500).json({
        success: false,
        error: 'Failed to connect account'
      });
    }
  }
  
  static async getAccountAnalytics(req, res) {
    const { accountId } = req.params;
    const userId = req.user?.id;
    console.log('getAccountAnalytics called for:', { accountId, userId });
    
    try {
        // Find the social account for this user and accountId
        const account = await SocialAccount.findById(accountId);
        
        if (!account || account.user_id !== userId) {
        return res.status(404).json({ success: false, error: 'Account not found' });
        }
        
        console.log('Account found:', { platform: account.platform, id: account.id });
        
        // Get analytics for this account
        let analytics;
        if (account.platform === 'facebook') {
        analytics = await getFacebookPageAnalytics(account);
        } else if (account.platform === 'instagram') {
        analytics = await getInstagramBusinessAnalytics(account);
        } else {
        return res.status(400).json({ success: false, error: 'Unsupported platform' });
        }

        // Check if analytics fetch was successful
        if (!analytics.success) {
        return res.status(500).json({ 
            success: false, 
            error: analytics.error || 'Failed to fetch analytics data'
        });
        }

        // Prepare response payload with analytics data
        const responsePayload = {
        success: true,
        data: {
            summary: analytics.summary || {},
            chartData: analytics.chartData || {},
            topPosts: analytics.topPosts || [],
            demographics: analytics.demographics || {},
            pageInfo: analytics.pageInfo, // Facebook specific
            accountInfo: analytics.accountInfo // Instagram specific
        }
        };

        // Add metrics info and warning if available
        if (analytics.metricsAvailable) {
        responsePayload.metricsAvailable = analytics.metricsAvailable;
        }
        if (analytics.metricsUnavailable) {
        responsePayload.metricsUnavailable = analytics.metricsUnavailable;
        }
        if (analytics.warning) {
        responsePayload.warning = analytics.warning;
        }

        res.json(responsePayload);
        
    } catch (err) {
        console.error('[getAccountAnalytics] Error:', err.message);
        
        // Handle specific error cases
        if (err.message === 'Missing access token or platform account ID') {
        return res.status(400).json({ 
            success: false, 
            error: 'Account configuration incomplete. Please reconnect your social media account.' 
        });
        }
        
        res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch analytics' 
        });
    }
    }
}

// Helper function to format timestamps
function formatTimestamp(timestamp) {
  if (!timestamp) return 'Never';
  
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  
  return then.toLocaleDateString();
}

module.exports = SocialAccountsController;