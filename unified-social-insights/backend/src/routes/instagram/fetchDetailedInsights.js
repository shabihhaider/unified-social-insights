// routes/instagram/fetchDetailedInsights.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

const fetchFromGraph = async (url, token) => {
  const fullUrl = url.includes('?')
    ? `https://graph.facebook.com/v19.0/${url}&access_token=${token}`
    : `https://graph.facebook.com/v19.0/${url}?access_token=${token}`;
  const res = await axios.get(fullUrl);
  return res.data;
};

// Helper function to calculate engagement rate
const calculateEngagementRate = (likes, comments, reach) => {
  if (!reach || reach === 0) return 0;
  return ((likes + comments) / reach * 100).toFixed(2);
};

// Helper function to analyze posting patterns
const analyzePostingTimes = (posts) => {
  const hourCounts = {};
  const dayCounts = {};
  
  posts.forEach(post => {
    const date = new Date(post.timestamp);
    const hour = date.getHours();
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  
  const bestHour = Object.keys(hourCounts).reduce((a, b) => 
    hourCounts[a] > hourCounts[b] ? a : b
  );
  
  const bestDay = Object.keys(dayCounts).reduce((a, b) => 
    dayCounts[a] > dayCounts[b] ? a : b
  );
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  return {
    bestHour: parseInt(bestHour),
    bestDay: dayNames[parseInt(bestDay)],
    hourDistribution: hourCounts,
    dayDistribution: dayCounts
  };
};

// Helper function to analyze content performance
const analyzeContentPerformance = (posts) => {
  const mediaTypes = {};
  const performance = {};
  
  posts.forEach(post => {
    const type = post.media_type || 'IMAGE';
    const engagement = (post.like_count || 0) + (post.comments_count || 0);
    
    if (!mediaTypes[type]) {
      mediaTypes[type] = {
        count: 0,
        totalEngagement: 0,
        totalLikes: 0,
        totalComments: 0
      };
    }
    
    mediaTypes[type].count++;
    mediaTypes[type].totalEngagement += engagement;
    mediaTypes[type].totalLikes += (post.like_count || 0);
    mediaTypes[type].totalComments += (post.comments_count || 0);
  });
  
  // Calculate averages
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

// Helper function to calculate growth trends
const calculateGrowthTrends = (metrics) => {
  const trends = {};
  
  metrics.forEach(metric => {
    if (metric.values && metric.values.length > 1) {
      const values = metric.values.map(v => v.value);
      const recent = values.slice(-7); // Last 7 days
      const previous = values.slice(-14, -7); // Previous 7 days
      
      if (recent.length > 0 && previous.length > 0) {
        const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length;
        const growthRate = previousAvg !== 0 ? 
          ((recentAvg - previousAvg) / previousAvg * 100).toFixed(2) : 0;
        
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

router.post('/api/instagram/fetch-detailed-insights', async (req, res) => {
  const { instagram_account_id, access_token, user_id } = req.body;
  
  if (!instagram_account_id || !access_token || !user_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    // 1. Profile Info (Enhanced)
    const profile = await fetchFromGraph(
      `${instagram_account_id}?fields=name,username,profile_picture_url,followers_count,follows_count,media_count,biography,website`,
      access_token
    );
    
    // 2. Comprehensive Metrics (Extended timeframe and metrics)
    const metricsToFetch = [
      'reach',
      'impressions', 
      'profile_views',
      'website_clicks'
    ];
    
    const insightsPromises = metricsToFetch.map(metric => 
      fetchFromGraph(
        `${instagram_account_id}/insights?metric=${metric}&period=day&metric_type=total_value`,
        access_token
      ).catch(err => {
        console.warn(`Failed to fetch ${metric}:`, err.message);
        return { data: [] };
      })
    );
    
    const insightsResults = await Promise.all(insightsPromises);
    const allMetrics = insightsResults
    .filter(r => Array.isArray(r.data))
    .flatMap(result => result.data);

    
    // 3. Extended Media Analysis (More posts for better insights)
    const mediaResponse = await fetchFromGraph(
      `${instagram_account_id}/media?fields=id,media_url,caption,timestamp,like_count,comments_count,media_type,permalink&limit=25`,
      access_token
    );
    
    // 4. Media Insights for top posts
    const mediaInsights = [];
    for (const post of mediaResponse.data.slice(0, 10)) {
      try {
        const postInsights = await fetchFromGraph(
          `${post.id}/insights?metric=reach,impressions,engagement`,
          access_token
        );
        mediaInsights.push({
          ...post,
          insights: postInsights.data,
          engagement_rate: calculateEngagementRate(
            post.like_count || 0, 
            post.comments_count || 0, 
            postInsights.data.find(i => i.name === 'reach')?.values[0]?.value || 1
          )
        });
      } catch (err) {
        // If insights fail, still include the post without insights
        mediaInsights.push({
          ...post,
          insights: [],
          engagement_rate: 0
        });
      }
    }
    
    // 5. Calculate Advanced Analytics
    const growthTrends = calculateGrowthTrends(allMetrics);
    const postingAnalysis = analyzePostingTimes(mediaResponse.data);
    const contentPerformance = analyzeContentPerformance(mediaResponse.data);
    
    // 6. Generate AI-Ready Insights Summary
    const totalReach = allMetrics
      .find(m => m.name === 'reach')?.values
      ?.reduce((sum, v) => sum + v.value, 0) || 0;
    
    const totalImpressions = allMetrics
      .find(m => m.name === 'impressions')?.values
      ?.reduce((sum, v) => sum + v.value, 0) || 0;
    
    const avgEngagementRate = mediaInsights.length > 0 
      ? (mediaInsights.reduce((sum, post) => sum + parseFloat(post.engagement_rate), 0) / mediaInsights.length).toFixed(2)
      : 0;
    
    // 7. Performance Alerts
    const alerts = [];
    if (growthTrends.reach && growthTrends.reach.growthRate < -10) {
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
    
    const formatted = {
      profile: {
        ...profile,
        engagement_rate: avgEngagementRate,
        reach_to_follower_ratio: profile.followers_count > 0 
          ? (totalReach / profile.followers_count * 100).toFixed(2) 
          : 0
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
          avg_likes_per_post: mediaResponse.data.length > 0 
            ? (mediaResponse.data.reduce((sum, post) => sum + (post.like_count || 0), 0) / mediaResponse.data.length).toFixed(0)
            : 0,
          avg_comments_per_post: mediaResponse.data.length > 0 
            ? (mediaResponse.data.reduce((sum, post) => sum + (post.comments_count || 0), 0) / mediaResponse.data.length).toFixed(0)
            : 0
        }
      },
      top_posts: mediaInsights.slice(0, 5),
      all_posts: mediaResponse.data,
      alerts: alerts,
      recommendations: {
        best_posting_time: `${postingAnalysis.bestHour}:00 on ${postingAnalysis.bestDay}`,
        top_content_type: Object.keys(contentPerformance).reduce((a, b) => 
          contentPerformance[a]?.avgEngagement > contentPerformance[b]?.avgEngagement ? a : b
        ),
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