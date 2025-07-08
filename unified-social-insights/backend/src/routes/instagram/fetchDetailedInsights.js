const requireAuth = require('../../middlewares/auth');

const express = require('express');
const router = express.Router();
const axios = require('axios');

// Utility: Graph API fetcher with token
const fetchFromGraph = async (url, token) => {
  const fullUrl = url.includes('?')
    ? `https://graph.facebook.com/v19.0/${url}&access_token=${token}`
    : `https://graph.facebook.com/v19.0/${url}?access_token=${token}`;
  try {
    const res = await axios.get(fullUrl);
    if (!res.data) throw new Error(`Empty response from: ${fullUrl}`);
    return res.data;
  } catch (err) {
    console.error(`❌ Error in fetchFromGraph(${fullUrl}):`, err.message);
    throw err;
  }
};

// Helpers
const calculateEngagementRate = (likes, comments, reach) =>
  !reach || reach === 0 ? 0 : ((likes + comments) / reach * 100).toFixed(2);

const analyzePostingTimes = (posts) => {
  const hourCounts = {}, dayCounts = {};
  posts.forEach(post => {
    const date = new Date(post.timestamp);
    const hour = date.getHours(), day = date.getDay();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  const bestHour = Object.keys(hourCounts).reduce((a, b) => hourCounts[a] > hourCounts[b] ? a : b);
  const bestDay = Object.keys(dayCounts).reduce((a, b) => dayCounts[a] > dayCounts[b] ? a : b);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return {
    bestHour: parseInt(bestHour),
    bestDay: dayNames[parseInt(bestDay)],
    hourDistribution: hourCounts,
    dayDistribution: dayCounts
  };
};

const analyzeContentPerformance = (posts) => {
  const mediaTypes = {}, performance = {};
  posts.forEach(post => {
    const type = post.media_type || 'IMAGE';
    const engagement = (post.like_count || 0) + (post.comments_count || 0);
    if (!mediaTypes[type]) {
      mediaTypes[type] = { count: 0, totalEngagement: 0, totalLikes: 0, totalComments: 0 };
    }
    mediaTypes[type].count++;
    mediaTypes[type].totalEngagement += engagement;
    mediaTypes[type].totalLikes += post.like_count || 0;
    mediaTypes[type].totalComments += post.comments_count || 0;
  });
  Object.keys(mediaTypes).forEach(type => {
    const data = mediaTypes[type];
    performance[type] = {
      count: data.count,
      avgEngagement: (data.totalEngagement / data.count).toFixed(2),
      avgLikes: (data.totalLikes / data.count).toFixed(2),
      avgComments: (data.totalComments / data.count).toFixed(2)
    };
  });
  return performance;
};

const calculateGrowthTrends = (metrics) => {
  const trends = {};
  metrics.forEach(metric => {
    if (metric.values && metric.values.length > 1) {
      const values = metric.values.map(v => v.value);
      const recent = values.slice(-7), previous = values.slice(-14, -7);
      if (recent.length > 0 && previous.length > 0) {
        const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length;
        const growthRate = previousAvg !== 0
          ? ((recentAvg - previousAvg) / previousAvg * 100).toFixed(2)
          : 0;
        trends[metric.name] = {
          current: recentAvg.toFixed(0),
          previous: previousAvg.toFixed(0),
          growthRate: parseFloat(growthRate),
          trend: growthRate > 0 ? 'up' : growthRate < 0 ? 'down' : 'stable'
        };
      }
    }
  });
  return trends;
};

// POST route
router.post('/api/instagram/fetch-detailed-insights', async (req, res) => {
  const { instagram_account_id, access_token, user_id, range = 7, compare = false } = req.body;
  const rangeInt = parseInt(range);

  if (!instagram_account_id || !access_token || !user_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Fetch IG Profile
    const profile = await fetchFromGraph(
      `${instagram_account_id}?fields=name,username,profile_picture_url,followers_count,follows_count,media_count,biography,website`,
      access_token
    );

    // 2. Fetch connected Facebook Page info
    let pageInfo = null;
    try {
      const connectedPage = await fetchFromGraph(
        `${instagram_account_id}?fields=connected_page`,
        access_token
      );
      const pageId = connectedPage?.connected_page?.id;
      if (pageId) {
        const pageAccess = await fetchFromGraph(`${pageId}?fields=access_token`, access_token);
        const pageAccessToken = pageAccess.access_token;
        const pageDetails = await fetchFromGraph(`${pageId}?fields=name,category,picture`, pageAccessToken);
        pageInfo = {
          id: pageId,
          name: pageDetails.name,
          category: pageDetails.category,
          picture: pageDetails.picture?.data?.url
        };
      }
    } catch (err) {
      console.warn('⚠️ Could not fetch connected Facebook Page details:', err.message);
    }

    // 3. Metrics
    const metricsToFetch = ['reach', 'impressions', 'profile_views', 'website_clicks'];
    const currentPromises = metricsToFetch.map(metric =>
      fetchFromGraph(`${instagram_account_id}/insights?metric=${metric}&period=day`, access_token)
        .catch(err => {
          console.warn(`Failed to fetch ${metric}:`, err.message);
          return { data: [] };
        })
    );

    let previousMetrics = [];
    if (compare) {
      const previousPromises = metricsToFetch.map(metric =>
        fetchFromGraph(`${instagram_account_id}/insights?metric=${metric}&period=day`, access_token)
          .then(res => res?.data?.map(m => ({ ...m, name: `${m.name}_prev` })) || [])
          .catch(err => {
            console.warn(`Failed to fetch previous ${metric}:`, err.message);
            return [];
          })
      );
      previousMetrics = (await Promise.all(previousPromises)).flat();
    }

    const currentResults = await Promise.all(currentPromises);
    const allMetrics = [];

    currentResults.forEach(result => {
      const metricData = result?.data?.[0];
      if (metricData && Array.isArray(metricData.values)) {
        allMetrics.push({
          name: metricData.name,
          values: metricData.values.slice(-rangeInt)
        });
      }
    });

    previousMetrics.forEach(metric => {
      if (metric?.name && Array.isArray(metric.values)) {
        allMetrics.push({
          name: metric.name,
          values: metric.values.slice(-rangeInt)
        });
      }
    });

    // 4. Media + Post Insights
    const mediaResponse = await fetchFromGraph(
      `${instagram_account_id}/media?fields=id,media_url,caption,timestamp,like_count,comments_count,media_type,permalink&limit=25`,
      access_token
    );

    const mediaInsights = [];
    for (const post of mediaResponse.data.slice(0, 10)) {
      try {
        const postInsights = await fetchFromGraph(`${post.id}/insights?metric=reach,impressions,engagement`, access_token);
        mediaInsights.push({
          ...post,
          insights: postInsights.data,
          engagement_rate: calculateEngagementRate(
            post.like_count || 0,
            post.comments_count || 0,
            postInsights.data.find(i => i.name === 'reach')?.values?.[0]?.value || 1
          )
        });
      } catch {
        mediaInsights.push({ ...post, insights: [], engagement_rate: 0 });
      }
    }

    // 5. Analytics & Alerts
    const growthTrends = calculateGrowthTrends(allMetrics);
    const postingAnalysis = analyzePostingTimes(mediaResponse.data);
    const contentPerformance = analyzeContentPerformance(mediaResponse.data);

    const totalReach = allMetrics.find(m => m.name === 'reach')?.values?.reduce((sum, v) => sum + v.value, 0) || 0;
    const totalImpressions = allMetrics.find(m => m.name === 'impressions')?.values?.reduce((sum, v) => sum + v.value, 0) || 0;
    const avgEngagementRate = mediaInsights.length > 0
      ? (mediaInsights.reduce((sum, post) => sum + parseFloat(post.engagement_rate), 0) / mediaInsights.length).toFixed(2)
      : 0;

    const alerts = [];
    if (growthTrends.reach?.growthRate < -10) {
      alerts.push({
        type: 'warning',
        message: `Reach has decreased by ${Math.abs(growthTrends.reach.growthRate)}% in the last week`,
        metric: 'reach'
      });
    }
    if (parseFloat(avgEngagementRate) < 1.0) {
      alerts.push({
        type: 'info',
        message: 'Engagement rate is below 1%. Consider posting more engaging content.',
        metric: 'engagement'
      });
    }

    // 6. Final Response Format
    const formatted = {
      profile: {
        ...profile,
        engagement_rate: avgEngagementRate,
        reach_to_follower_ratio: profile.followers_count > 0
          ? (totalReach / profile.followers_count * 100).toFixed(2)
          : 0,
        page_info: pageInfo
      },
      metrics: allMetrics,
      analytics: {
        growth_trends: growthTrends,
        posting_analysis: postingAnalysis,
        content_performance: contentPerformance,
        summary: {
          total_reach: totalReach,
          total_impressions: totalImpressions,
          avg_engagement_rate: avgEngagementRate,
          total_posts: mediaResponse.data.length,
          avg_likes_per_post: (mediaResponse.data.reduce((sum, post) => sum + (post.like_count || 0), 0) / mediaResponse.data.length).toFixed(0),
          avg_comments_per_post: (mediaResponse.data.reduce((sum, post) => sum + (post.comments_count || 0), 0) / mediaResponse.data.length).toFixed(0)
        }
      },
      top_posts: mediaInsights.slice(0, 5),
      all_posts: mediaResponse.data,
      alerts,
      recommendations: {
        best_posting_time: `${postingAnalysis.bestHour}:00 on ${postingAnalysis.bestDay}`,
        top_content_type: Object.keys(contentPerformance).reduce((a, b) =>
          contentPerformance[a]?.avgEngagement > contentPerformance[b]?.avgEngagement ? a : b),
        engagement_status: parseFloat(avgEngagementRate) > 3 ? 'excellent' :
                           parseFloat(avgEngagementRate) > 1 ? 'good' : 'needs_improvement'
      }
    };

    return res.json({
      data: formatted,
      timestamp: new Date().toISOString(),
      account_id: instagram_account_id
    });

  } catch (err) {
    console.error('🔥 fetch-detailed-insights error:', {
      message: err.message,
      data: err.response?.data,
      url: err.config?.url,
    });
    return res.status(500).json({
      error: 'Failed to fetch detailed insights',
      details: err.response?.data || err.message
    });
  }
});

module.exports = router;
