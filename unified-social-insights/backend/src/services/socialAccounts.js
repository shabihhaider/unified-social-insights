const axios = require('axios');

// Configure axios defaults
axios.defaults.timeout = 10000; // 10 seconds timeout

/**
 * Validate required account parameters
 * @param {object} account 
 * @returns {boolean}
 */
const validateAccount = (account) => {
  if (!account || typeof account !== 'object') return false;
  return account.access_token && account.platform_account_id;
};

/**
 * Log API errors consistently
 * @param {string} service - Service name (Facebook/Instagram)
 * @param {Error} error - Error object
 */
const logApiError = (service, error) => {
  console.error(`[${service} API Error]:`, {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data?.error || 'No additional error data'
  });
};

/**
 * Fetch Facebook Page Analytics from Facebook Graph API
 * @param {object} account - social account db row
 * @returns {object} analytics data for dashboard
 */
exports.getFacebookPageAnalytics = async (account) => {
  if (!validateAccount(account)) {
    throw new Error('Invalid account: missing access token or platform account ID');
  }
  
  const { access_token, platform_account_id } = account;
  
  try {
    // Get basic page info
    const pageInfoUrl = `https://graph.facebook.com/v23.0/${platform_account_id}?fields=name,about,fan_count,followers_count,cover,category,location&access_token=${access_token}`;
    const { data: pageInfo } = await axios.get(pageInfoUrl);

    // Supported metrics for Facebook Page insights (daily values)
    const insightsMetrics = [
        'page_impressions',
        'page_views_total'
    ];

    const safeMetrics = insightsMetrics;  // all metrics in the list are allowed

    if (safeMetrics.length === 0) {
      throw new Error('No valid Facebook insights metrics to request.');
    }

    const insightsUrl = `https://graph.facebook.com/v23.0/${platform_account_id}/insights?metric=${safeMetrics.join(',')}&period=day&access_token=${access_token}`;
    //const insightsUrl = `https://graph.facebook.com/v23.0/${platform_account_id}/insights?metric=${safeMetrics.join(',')}&period=day&access_token=${access_token}`;
    let insights;
    try {
      const { data } = await axios.get(insightsUrl);
      insights = data;
    } catch (error) {
        logApiError('Facebook Analytics', error);
        return {
            summary: {},
            chartData: {},
            topPosts: [],
            demographics: {},
            error: error.response?.data?.error?.message || error.message,
            success: false
        };
    }

    // Track which metrics were returned by the API
    const metricsReturned = insights.data ? insights.data.map(m => m.name) : [];

    // Get recent posts (up to 10) with basic engagement data
    const postsUrl = `https://graph.facebook.com/v23.0/${platform_account_id}/posts?fields=id,message,created_time,full_picture,permalink_url,shares,comments.summary(true),likes.summary(true)&limit=10&access_token=${access_token}`;
    const { data: postsData } = await axios.get(postsUrl);

    // Get demographics data (fan countries and cities)
    const demographics = { countries: {}, cities: {} };
    try {
    const demographicsUrl = `https://graph.facebook.com/v23.0/${platform_account_id}/insights?metric=page_fans_country,page_fans_city&period=lifetime&access_token=${access_token}`;
    const { data: demoData } = await axios.get(demographicsUrl);
    
    // Handle empty data array properly
    if (demoData.data && demoData.data.length > 0) {
        const countryData = demoData.data.find(m => m.name === 'page_fans_country');
        const cityData = demoData.data.find(m => m.name === 'page_fans_city');
        if (countryData?.values?.[0]?.value) {
        demographics.countries = countryData.values[0].value;
        }
        if (cityData?.values?.[0]?.value) {
        demographics.cities = cityData.values[0].value;
        }
    }
    } catch (demoErr) {
    console.warn('Demographics data not available:', demoErr.response?.data?.error?.message || demoErr.message);
    }

    // Prepare chart data for each metric (daily values over time)
    const chartData = {};
    insights.data?.forEach(metric => {
      if (metric.values && metric.values.length > 0) {
        chartData[metric.name] = metric.values
          .filter(v => v.end_time && v.value !== undefined)
          .map(v => ({
            date: v.end_time.slice(0, 10),
            value: typeof v.value === 'object'
              ? Object.values(v.value).reduce((a, b) => a + b, 0) 
              : v.value
          }));
      }
    });

    // Simplify posts data with engagement counts
    const posts = (postsData.data || []).map(post => ({
      id: post.id,
      message: post.message || 'No message',
      date: post.created_time,
      picture: post.full_picture,
      permalink: post.permalink_url,
      engagement: {
        likes: post.likes?.summary?.total_count || 0,
        comments: post.comments?.summary?.total_count || 0,
        shares: post.shares?.count || 0
      }
    }));

    // Latest values for each insight metric (for summary)
    const latestMetrics = insights.data?.reduce((acc, metric) => {
      if (metric.values && metric.values.length > 0) {
        const latestValue = metric.values[metric.values.length - 1];
        acc[metric.name] = typeof latestValue.value === 'object'
          ? Object.values(latestValue.value).reduce((a, b) => a + b, 0)
          : (latestValue.value || 0);
      }
      return acc;
    }, {}) || {};

    return {
      pageInfo: {
        name: pageInfo.name,
        about: pageInfo.about,
        category: pageInfo.category,
        location: pageInfo.location,
        cover: pageInfo.cover?.source
      },
      summary: {
        totalFollowers: Number(pageInfo.fan_count ?? pageInfo.followers_count ?? 0),
        totalImpressions: Number(latestMetrics.page_impressions ?? 0),
        totalViews: Number(latestMetrics.page_views_total ?? 0),
        totalPosts: posts.length,
        totalEngagement: 0, // Set to 0 since page_engaged_users is not available
        // Remove fan adds/removes since they're not working
        // fansAdded: Number(latestMetrics.page_fan_adds_unique ?? 0),
        // fansRemoved: Number(latestMetrics.page_fan_removes_unique ?? 0),
        // fansChange: Number((latestMetrics.page_fan_adds_unique ?? 0) - (latestMetrics.page_fan_removes_unique ?? 0))
      },
      chartData,
      topPosts: posts,
      demographics,
      metricsAvailable: metricsReturned,
      success: true
    };

  } catch (error) {
    console.error('Facebook Analytics Error:', error.response?.data?.error || error.message);
    return {
      summary: {},
      chartData: {},
      topPosts: [],
      demographics: {},
      error: error.response?.data?.error?.message || error.message,
      success: false
    };
  }
};

/**
 * Fetch Instagram Business Analytics from Facebook Graph API
 * @param {object} account - social account db row
 * @returns {object} analytics data for dashboard
 */
exports.getInstagramBusinessAnalytics = async (account) => {
  if (!validateAccount(account)) {
    throw new Error('Invalid account: missing access token or platform account ID');
  }
  
  const { access_token, platform_account_id } = account;

  try {
    // Get basic Instagram account info
    const accountInfoUrl = `https://graph.facebook.com/v23.0/${platform_account_id}?fields=username,followers_count,media_count,profile_picture_url,name&access_token=${access_token}`;
    const { data: accountInfo } = await axios.get(accountInfoUrl);

    // Get Instagram account insights (daily total values for selected metrics)
    const insightsUrl = `https://graph.facebook.com/v23.0/${platform_account_id}/insights?metric=reach,profile_views,website_clicks,accounts_engaged,follows_and_unfollows&metric_type=total_value&period=day&access_token=${access_token}`;
    const { data: insights } = await axios.get(insightsUrl);

    // Get follower count trend over time (daily values)
    const followerUrl = `https://graph.facebook.com/v23.0/${platform_account_id}/insights?metric=follower_count&period=day&access_token=${access_token}`;
    const { data: followerData } = await axios.get(followerUrl);

    // Get recent media posts (basic info and engagement counts)
    const mediaUrl = `https://graph.facebook.com/v23.0/${platform_account_id}/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count&access_token=${access_token}`;
    const { data: mediaData } = await axios.get(mediaUrl);

    // Fetch detailed insights for up to 5 latest media posts
    const postsWithInsights = [];
    for (const media of (mediaData.data || []).slice(0, 5)) {
      try {
        const mediaInsightsUrl = `https://graph.facebook.com/v23.0/${media.id}/insights?metric=reach,likes,comments,saved,shares,total_interactions&access_token=${access_token}`;
        const { data: mediaInsights } = await axios.get(mediaInsightsUrl);
        const insightsObj = {};
        mediaInsights.data?.forEach(metric => {
          insightsObj[metric.name] = metric.values?.[0]?.value || 0;
        });
        postsWithInsights.push({
          id: media.id,
          caption: media.caption || '',
          type: media.media_type,
          url: media.media_url,
          permalink: media.permalink,
          timestamp: media.timestamp,
          likes: media.like_count || 0,
          comments: media.comments_count || 0,
          insights: insightsObj
        });
      } catch (mediaErr) {
        // If media insights fetch fails, include post without insights
        postsWithInsights.push({
          id: media.id,
          caption: media.caption || '',
          type: media.media_type,
          url: media.media_url,
          permalink: media.permalink,
          timestamp: media.timestamp,
          likes: media.like_count || 0,
          comments: media.comments_count || 0,
          insights: {}
        });
      }
    }

    // Build chart data for insights
    const chartData = {};
    // Follower count over time
    if (followerData.data?.[0]?.values) {
      chartData.follower_count = followerData.data[0].values
        .filter(v => v.end_time && v.value !== undefined)
        .map(v => ({
          date: v.end_time.slice(0, 10),
          value: v.value
        }));
    }
    // Latest values for other metrics (as single data points)
    insights.data?.forEach(metric => {
      if (metric.total_value?.value !== undefined) {
        chartData[metric.name] = [{
          date: new Date().toISOString().slice(0, 10),
          value: metric.total_value.value
        }];
      }
    });

    // Extract current values for summary metrics
    const currentMetrics = {};
    insights.data?.forEach(metric => {
      if (metric.total_value?.value !== undefined) {
        currentMetrics[metric.name] = metric.total_value.value;
      }
    });

    return {
      accountInfo: {
        username: accountInfo.username,
        name: accountInfo.name,
        profile_picture: accountInfo.profile_picture_url,
        followers_count: accountInfo.followers_count,
        media_count: accountInfo.media_count
      },
      summary: {
        totalFollowers: accountInfo.followers_count || 0,
        totalPosts: accountInfo.media_count || 0,
        totalReach: currentMetrics.reach || 0,
        totalImpressions: currentMetrics.impressions || 0,
        profileViews: currentMetrics.profile_views || 0,
        websiteClicks: currentMetrics.website_clicks || 0,
        accountsEngaged: currentMetrics.accounts_engaged || 0
        // New follows/unfollows can be derived from follower_count if needed
      },
      chartData,
      topPosts: postsWithInsights,
      demographics: {},
      success: true
    };

  } catch (error) {
    logApiError('Instagram Analytics', error);
    return {
        summary: {},
        chartData: {},
        topPosts: [],
        demographics: {},
        error: error.response?.data?.error?.message || error.message,
        success: false
    };
}
};
