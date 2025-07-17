import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Heart, 
  MessageCircle,
  Share2,
  Eye,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Instagram,
  Facebook,
  Clock,
  Target,
  Zap
} from 'lucide-react';

const Analytics = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('engagement');

  const timeframes = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 3 months' },
    { value: '1year', label: 'Last year' }
  ];

  const platforms = [
    { value: 'all', label: 'All Platforms' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' }
  ];

  // Mock analytics data
  const [analyticsData] = useState({
    summary: {
      totalFollowers: 15240,
      followersChange: 12.5,
      totalEngagement: 8945,
      engagementChange: -2.3,
      totalReach: 45600,
      reachChange: 8.7,
      totalImpressions: 67800,
      impressionsChange: 15.2,
      engagementRate: 5.8,
      engagementRateChange: 0.3
    },
    chartData: {
      followers: [
        { date: '2024-01-01', instagram: 12000, facebook: 2500 },
        { date: '2024-01-08', instagram: 12200, facebook: 2580 },
        { date: '2024-01-15', instagram: 12450, facebook: 2620 },
        { date: '2024-01-22', instagram: 12700, facebook: 2670 },
        { date: '2024-01-29', instagram: 12800, facebook: 2740 }
      ],
      engagement: [
        { date: '2024-01-01', likes: 1200, comments: 150, shares: 80 },
        { date: '2024-01-08', likes: 1350, comments: 180, shares: 95 },
        { date: '2024-01-15', likes: 1450, comments: 200, shares: 110 },
        { date: '2024-01-22', likes: 1300, comments: 160, shares: 85 },
        { date: '2024-01-29', likes: 1520, comments: 220, shares: 125 }
      ],
      reach: [
        { date: '2024-01-01', organic: 8500, paid: 2100 },
        { date: '2024-01-08', organic: 9200, paid: 2300 },
        { date: '2024-01-15', organic: 9800, paid: 2500 },
        { date: '2024-01-22', organic: 9100, paid: 2200 },
        { date: '2024-01-29', organic: 10200, paid: 2800 }
      ]
    },
    topPosts: [
      {
        id: 1,
        platform: 'instagram',
        content: 'Our latest product launch is here! 🚀 #innovation',
        image: null,
        likes: 1240,
        comments: 89,
        shares: 45,
        reach: 8900,
        impressions: 12500,
        engagementRate: 8.2,
        date: '2024-01-28'
      },
      {
        id: 2,
        platform: 'facebook',
        content: 'Behind the scenes: How we create amazing content',
        image: null,
        likes: 456,
        comments: 67,
        shares: 23,
        reach: 3400,
        impressions: 5600,
        engagementRate: 6.1,
        date: '2024-01-26'
      },
      {
        id: 3,
        platform: 'instagram',
        content: 'Tips for better social media engagement 💡',
        image: null,
        likes: 890,
        comments: 123,
        shares: 34,
        reach: 5600,
        impressions: 7800,
        engagementRate: 7.4,
        date: '2024-01-24'
      }
    ],
    demographics: {
      ageGroups: [
        { range: '18-24', percentage: 25 },
        { range: '25-34', percentage: 40 },
        { range: '35-44', percentage: 20 },
        { range: '45-54', percentage: 10 },
        { range: '55+', percentage: 5 }
      ],
      locations: [
        { country: 'United States', percentage: 35 },
        { country: 'United Kingdom', percentage: 15 },
        { country: 'Canada', percentage: 12 },
        { country: 'Australia', percentage: 8 },
        { country: 'Germany', percentage: 6 }
      ],
      interests: [
        { category: 'Technology', percentage: 45 },
        { category: 'Business', percentage: 30 },
        { category: 'Marketing', percentage: 25 },
        { category: 'Design', percentage: 20 },
        { category: 'Lifestyle', percentage: 15 }
      ]
    }
  });

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const StatCard = ({ title, value, change, icon: Icon, format = 'number' }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand hover:shadow-brand-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-brand-electric/10 rounded-lg">
          <Icon size={20} className="text-brand-electric" />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          change >= 0 
            ? 'bg-brand-lime/10 text-brand-lime' 
            : 'bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400'
        }`}>
          <TrendingUp size={12} className={change < 0 ? 'rotate-180' : ''} />
          {Math.abs(change)}%
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-brand-zinc dark:text-brand-frost mb-1">{title}</h3>
        <p className="text-2xl font-bold text-brand-void dark:text-brand-pure">
          {format === 'percentage' ? `${value}%` : value.toLocaleString()}
        </p>
      </div>
    </motion.div>
  );

  const PostCard = ({ post }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-lg p-4 border border-brand-frost/30 dark:border-brand-zinc/40"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 bg-brand-electric/10 rounded-lg flex items-center justify-center">
          {post.platform === 'instagram' ? (
            <Instagram size={14} className="text-brand-electric" />
          ) : (
            <Facebook size={14} className="text-brand-electric" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm text-brand-void dark:text-brand-pure line-clamp-2 mb-2">{post.content}</p>
          <div className="text-xs text-brand-zinc/60 dark:text-brand-frost/60">{post.date}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-brand-electric">{post.engagementRate}%</div>
          <div className="text-xs text-brand-zinc dark:text-brand-frost">Engagement</div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 text-center text-xs">
        <div>
          <div className="flex items-center justify-center gap-1 text-brand-zinc dark:text-brand-frost">
            <Heart size={10} />
            {post.likes}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1 text-brand-zinc dark:text-brand-frost">
            <MessageCircle size={10} />
            {post.comments}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1 text-brand-zinc dark:text-brand-frost">
            <Share2 size={10} />
            {post.shares}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1 text-brand-zinc dark:text-brand-frost">
            <Eye size={10} />
            {post.reach}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-electric/30 border-t-brand-electric rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 size={28} className="text-brand-electric" />
            <h1 className="text-3xl font-bold text-brand-void dark:text-brand-pure">Analytics</h1>
          </div>
          <p className="text-brand-zinc dark:text-brand-frost">
            Detailed performance metrics and insights for your social media accounts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-4 py-2 bg-brand-pure dark:bg-brand-carbon border border-brand-frost/30 dark:border-brand-zinc/40 rounded-lg text-brand-void dark:text-brand-pure focus:outline-none focus:ring-2 focus:ring-brand-electric"
          >
            {platforms.map(platform => (
              <option key={platform.value} value={platform.value}>{platform.label}</option>
            ))}
          </select>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-4 py-2 bg-brand-pure dark:bg-brand-carbon border border-brand-frost/30 dark:border-brand-zinc/40 rounded-lg text-brand-void dark:text-brand-pure focus:outline-none focus:ring-2 focus:ring-brand-electric"
          >
            {timeframes.map(tf => (
              <option key={tf.value} value={tf.value}>{tf.label}</option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-electric text-brand-pure rounded-lg hover:bg-brand-neon transition-all duration-200">
            <Download size={16} />
            <span className="text-sm font-medium">Export</span>
          </button>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Followers"
          value={analyticsData.summary.totalFollowers}
          change={analyticsData.summary.followersChange}
          icon={Users}
        />
        <StatCard
          title="Engagement"
          value={analyticsData.summary.totalEngagement}
          change={analyticsData.summary.engagementChange}
          icon={Heart}
        />
        <StatCard
          title="Reach"
          value={analyticsData.summary.totalReach}
          change={analyticsData.summary.reachChange}
          icon={Eye}
        />
        <StatCard
          title="Impressions"
          value={analyticsData.summary.totalImpressions}
          change={analyticsData.summary.impressionsChange}
          icon={BarChart3}
        />
        <StatCard
          title="Engagement Rate"
          value={analyticsData.summary.engagementRate}
          change={analyticsData.summary.engagementRateChange}
          icon={Target}
          format="percentage"
        />
      </div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-brand-void dark:text-brand-pure">Performance Trends</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveChart('engagement')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeChart === 'engagement'
                  ? 'bg-brand-electric text-brand-pure'
                  : 'bg-brand-frost/10 dark:bg-brand-carbon/30 text-brand-zinc dark:text-brand-frost hover:text-brand-electric'
              }`}
            >
              Engagement
            </button>
            <button
              onClick={() => setActiveChart('followers')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeChart === 'followers'
                  ? 'bg-brand-electric text-brand-pure'
                  : 'bg-brand-frost/10 dark:bg-brand-carbon/30 text-brand-zinc dark:text-brand-frost hover:text-brand-electric'
              }`}
            >
              Followers
            </button>
            <button
              onClick={() => setActiveChart('reach')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeChart === 'reach'
                  ? 'bg-brand-electric text-brand-pure'
                  : 'bg-brand-frost/10 dark:bg-brand-carbon/30 text-brand-zinc dark:text-brand-frost hover:text-brand-electric'
              }`}
            >
              Reach
            </button>
          </div>
        </div>
        
        {/* Chart Placeholder */}
        <div className="h-64 bg-brand-frost/10 dark:bg-brand-carbon/30 rounded-lg border border-brand-frost/20 dark:border-brand-zinc/30 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 size={48} className="text-brand-electric/50 mx-auto mb-3" />
            <p className="text-brand-zinc dark:text-brand-frost">
              {activeChart.charAt(0).toUpperCase() + activeChart.slice(1)} chart will be displayed here
            </p>
            <p className="text-sm text-brand-zinc/60 dark:text-brand-frost/60 mt-1">
              Integration with charting library required
            </p>
          </div>
        </div>
      </motion.div>

      {/* Top Posts & Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Posts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand"
        >
          <h2 className="text-xl font-bold text-brand-void dark:text-brand-pure mb-6">Top Performing Posts</h2>
          <div className="space-y-4">
            {analyticsData.topPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </motion.div>

        {/* Demographics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand"
        >
          <h2 className="text-xl font-bold text-brand-void dark:text-brand-pure mb-6">Audience Demographics</h2>
          
          <div className="space-y-6">
            {/* Age Groups */}
            <div>
              <h3 className="text-sm font-semibold text-brand-zinc dark:text-brand-frost mb-3">Age Groups</h3>
              <div className="space-y-2">
                {analyticsData.demographics.ageGroups.map((group, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-brand-zinc dark:text-brand-frost">{group.range}</span>
                    <div className="flex items-center gap-2 w-32">
                      <div className="flex-1 h-2 bg-brand-frost/20 dark:bg-brand-zinc/20 rounded-full">
                        <div 
                          className="h-2 bg-brand-electric rounded-full transition-all duration-500"
                          style={{ width: `${group.percentage * 2}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-brand-void dark:text-brand-pure w-8">
                        {group.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Locations */}
            <div>
              <h3 className="text-sm font-semibold text-brand-zinc dark:text-brand-frost mb-3">Top Locations</h3>
              <div className="space-y-2">
                {analyticsData.demographics.locations.slice(0, 5).map((location, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-brand-zinc dark:text-brand-frost">{location.country}</span>
                    <span className="text-sm font-medium text-brand-electric">{location.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <h3 className="text-sm font-semibold text-brand-zinc dark:text-brand-frost mb-3">Top Interests</h3>
              <div className="flex flex-wrap gap-2">
                {analyticsData.demographics.interests.map((interest, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-brand-electric/10 text-brand-electric text-sm font-medium rounded-full"
                  >
                    {interest.category} ({interest.percentage}%)
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;