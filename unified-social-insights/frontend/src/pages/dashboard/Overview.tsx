import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Heart, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Eye,
  Share2,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  RefreshCw,
  Zap,
  Target,
  Award,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Overview = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual API calls
  const [accountData, setAccountData] = useState({
    connectedAccounts: 2,
    totalFollowers: 15240,
    followersGrowth: 12.5,
    totalEngagement: 8945,
    engagementGrowth: -2.3,
    totalReach: 45600,
    reachGrowth: 8.7,
    totalImpressions: 67800,
    impressionsGrowth: 15.2
  });

  const [connectedAccounts] = useState([
    {
      id: 1,
      platform: 'instagram',
      username: '@yourhandle',
      followers: 12500,
      isActive: true,
      lastSync: '2 min ago',
      profileImage: null
    },
    {
      id: 2,
      platform: 'facebook',
      username: 'Your Page',
      followers: 2740,
      isActive: true,
      lastSync: '5 min ago',
      profileImage: null
    }
  ]);

  const [recentPosts] = useState([
    {
      id: 1,
      platform: 'instagram',
      content: 'Check out our latest product launch! 🚀',
      likes: 245,
      comments: 23,
      shares: 12,
      reach: 1250,
      timestamp: '2 hours ago',
      performance: 'high'
    },
    {
      id: 2,
      platform: 'facebook',
      content: 'Behind the scenes of our team meeting',
      likes: 89,
      comments: 7,
      shares: 5,
      reach: 580,
      timestamp: '6 hours ago',
      performance: 'medium'
    },
    {
      id: 3,
      platform: 'instagram',
      content: 'Tips for better social media engagement',
      likes: 156,
      comments: 34,
      shares: 8,
      reach: 920,
      timestamp: '1 day ago',
      performance: 'high'
    }
  ]);

  const [insights] = useState([
    {
      title: 'Best posting time',
      value: '2:00 PM - 4:00 PM',
      description: 'Your audience is most active during these hours',
      icon: Clock,
      type: 'info'
    },
    {
      title: 'Engagement rate',
      value: '5.8%',
      description: '0.3% higher than last week',
      icon: Heart,
      type: 'positive'
    },
    {
      title: 'Content suggestion',
      value: 'Video posts',
      description: 'Performing 40% better than images',
      icon: Zap,
      type: 'suggestion'
    }
  ]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 2000);
  };

  const StatCard = ({ title, value, growth, icon: Icon, subtitle }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand hover:shadow-brand-lg transition-all duration-300 group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-brand-electric/10 rounded-lg">
              <Icon size={20} className="text-brand-electric" />
            </div>
            <h3 className="text-sm font-medium text-brand-zinc dark:text-brand-frost">{title}</h3>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-brand-void dark:text-brand-pure">{value.toLocaleString()}</p>
            {subtitle && (
              <p className="text-xs text-brand-zinc/60 dark:text-brand-frost/60">{subtitle}</p>
            )}
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          growth >= 0 
            ? 'bg-brand-lime/10 text-brand-lime' 
            : 'bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400'
        }`}>
          {growth >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(growth)}%
        </div>
      </div>
    </motion.div>
  );

  const AccountCard = ({ account }: any) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-4 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand hover:shadow-brand-lg transition-all duration-300"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 bg-brand-electric/10 rounded-xl flex items-center justify-center">
            {account.platform === 'instagram' ? (
              <Instagram size={20} className="text-brand-electric" />
            ) : (
              <Facebook size={20} className="text-brand-electric" />
            )}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-brand-pure dark:border-brand-carbon ${
            account.isActive ? 'bg-brand-lime' : 'bg-brand-zinc'
          }`}></div>
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-brand-void dark:text-brand-pure">{account.username}</h4>
          <p className="text-sm text-brand-zinc dark:text-brand-frost">{account.followers.toLocaleString()} followers</p>
          <p className="text-xs text-brand-zinc/60 dark:text-brand-frost/60">Synced {account.lastSync}</p>
        </div>
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
          <p className="text-sm text-brand-void dark:text-brand-pure line-clamp-2">{post.content}</p>
          <p className="text-xs text-brand-zinc/60 dark:text-brand-frost/60 mt-1">{post.timestamp}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          post.performance === 'high' 
            ? 'bg-brand-lime/10 text-brand-lime' 
            : post.performance === 'medium'
            ? 'bg-brand-amber/10 text-brand-amber'
            : 'bg-brand-zinc/10 text-brand-zinc'
        }`}>
          {post.performance}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 text-center">
        <div>
          <div className="flex items-center justify-center gap-1 text-xs text-brand-zinc dark:text-brand-frost">
            <Heart size={12} />
            {post.likes}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1 text-xs text-brand-zinc dark:text-brand-frost">
            <MessageCircle size={12} />
            {post.comments}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1 text-xs text-brand-zinc dark:text-brand-frost">
            <Share2 size={12} />
            {post.shares}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1 text-xs text-brand-zinc dark:text-brand-frost">
            <Eye size={12} />
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-brand-void dark:text-brand-pure mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-brand-zinc dark:text-brand-frost">
            Here's what's happening with your social media presence today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-brand-pure dark:bg-brand-carbon border border-brand-frost/30 dark:border-brand-zinc/40 rounded-lg hover:bg-brand-frost/10 dark:hover:bg-brand-carbon/80 transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md text-brand-void dark:text-brand-pure"
          >
            <RefreshCw size={16} className={`${refreshing ? 'animate-spin' : ''} text-brand-electric`} />
            <span className="text-sm font-medium">Refresh</span>
          </button>
          <button
            onClick={() => navigate('/dashboard/accounts')}
            className="flex items-center gap-2 px-4 py-2 bg-brand-electric text-brand-pure rounded-lg hover:bg-brand-neon transition-all duration-200 shadow-electric-glow hover:shadow-electric-glow hover:scale-105"
          >
            <Plus size={16} />
            <span className="text-sm font-medium">Connect Account</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Followers"
          value={accountData.totalFollowers}
          growth={accountData.followersGrowth}
          icon={Users}
          subtitle="Across all platforms"
        />
        <StatCard
          title="Engagement"
          value={accountData.totalEngagement}
          growth={accountData.engagementGrowth}
          icon={Heart}
          subtitle="Likes, comments, shares"
        />
        <StatCard
          title="Reach"
          value={accountData.totalReach}
          growth={accountData.reachGrowth}
          icon={Eye}
          subtitle="Unique accounts reached"
        />
        <StatCard
          title="Impressions"
          value={accountData.totalImpressions}
          growth={accountData.impressionsGrowth}
          icon={BarChart3}
          subtitle="Total content views"
        />
      </div>

      {/* Connected Accounts & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connected Accounts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-brand-void dark:text-brand-pure">Connected Accounts</h2>
              <span className="px-2 py-1 bg-brand-electric/10 text-brand-electric text-xs font-medium rounded-full">
                {connectedAccounts.length} active
              </span>
            </div>
            <div className="space-y-3">
              {connectedAccounts.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
              <button
                onClick={() => navigate('/dashboard/accounts')}
                className="w-full p-4 border-2 border-dashed border-brand-frost/30 dark:border-brand-zinc/40 rounded-xl text-brand-zinc dark:text-brand-frost hover:border-brand-electric hover:text-brand-electric transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                <span className="text-sm font-medium">Add Account</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-brand-electric" />
                <h2 className="text-lg font-semibold text-brand-void dark:text-brand-pure">AI Insights</h2>
              </div>
              <button
                onClick={() => navigate('/dashboard/insights')}
                className="text-brand-electric hover:text-brand-neon text-sm font-medium transition-colors duration-200"
              >
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-brand-frost/10 dark:bg-brand-carbon/30 rounded-lg border border-brand-frost/20 dark:border-brand-zinc/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <insight.icon size={16} className={`${
                      insight.type === 'positive' ? 'text-brand-lime' :
                      insight.type === 'suggestion' ? 'text-brand-electric' :
                      'text-brand-neon'
                    }`} />
                    <h3 className="text-sm font-medium text-brand-void dark:text-brand-pure">{insight.title}</h3>
                  </div>
                  <p className="text-lg font-semibold text-brand-electric mb-1">{insight.value}</p>
                  <p className="text-xs text-brand-zinc/60 dark:text-brand-frost/60">{insight.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Posts Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-brand-void dark:text-brand-pure">Recent Posts Performance</h2>
          <button
            onClick={() => navigate('/dashboard/analytics')}
            className="text-brand-electric hover:text-brand-neon text-sm font-medium transition-colors duration-200"
          >
            View Analytics
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand"
      >
        <h2 className="text-lg font-semibold text-brand-void dark:text-brand-pure mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/dashboard/reports')}
            className="flex items-center gap-3 p-4 bg-brand-frost/10 dark:bg-brand-carbon/30 rounded-lg border border-brand-frost/20 dark:border-brand-zinc/30 hover:bg-brand-electric/10 hover:border-brand-electric/30 transition-all duration-200 group"
          >
            <div className="p-2 bg-brand-electric/10 rounded-lg group-hover:bg-brand-electric/20 transition-colors duration-200">
              <BarChart3 size={16} className="text-brand-electric" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-medium text-brand-void dark:text-brand-pure">Generate Report</h3>
              <p className="text-xs text-brand-zinc/60 dark:text-brand-frost/60">Export analytics</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/dashboard/insights')}
            className="flex items-center gap-3 p-4 bg-brand-frost/10 dark:bg-brand-carbon/30 rounded-lg border border-brand-frost/20 dark:border-brand-zinc/30 hover:bg-brand-electric/10 hover:border-brand-electric/30 transition-all duration-200 group"
          >
            <div className="p-2 bg-brand-electric/10 rounded-lg group-hover:bg-brand-electric/20 transition-colors duration-200">
              <Zap size={16} className="text-brand-electric" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-medium text-brand-void dark:text-brand-pure">AI Recommendations</h3>
              <p className="text-xs text-brand-zinc/60 dark:text-brand-frost/60">Get insights</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/dashboard/analytics')}
            className="flex items-center gap-3 p-4 bg-brand-frost/10 dark:bg-brand-carbon/30 rounded-lg border border-brand-frost/20 dark:border-brand-zinc/30 hover:bg-brand-electric/10 hover:border-brand-electric/30 transition-all duration-200 group"
          >
            <div className="p-2 bg-brand-electric/10 rounded-lg group-hover:bg-brand-electric/20 transition-colors duration-200">
              <TrendingUp size={16} className="text-brand-electric" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-medium text-brand-void dark:text-brand-pure">View Trends</h3>
              <p className="text-xs text-brand-zinc/60 dark:text-brand-frost/60">Track growth</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/dashboard/settings')}
            className="flex items-center gap-3 p-4 bg-brand-frost/10 dark:bg-brand-carbon/30 rounded-lg border border-brand-frost/20 dark:border-brand-zinc/30 hover:bg-brand-electric/10 hover:border-brand-electric/30 transition-all duration-200 group"
          >
            <div className="p-2 bg-brand-electric/10 rounded-lg group-hover:bg-brand-electric/20 transition-colors duration-200">
              <Calendar size={16} className="text-brand-electric" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-medium text-brand-void dark:text-brand-pure">Schedule Posts</h3>
              <p className="text-xs text-brand-zinc/60 dark:text-brand-frost/60">Coming soon</p>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Performance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-brand-electric/5 to-brand-neon/5 dark:from-brand-carbon/60 dark:to-brand-zinc/40 rounded-xl p-6 border border-brand-electric/20 dark:border-brand-zinc/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <Award size={24} className="text-brand-electric" />
          <div>
            <h2 className="text-lg font-semibold text-brand-void dark:text-brand-pure">This Week's Highlights</h2>
            <p className="text-sm text-brand-zinc dark:text-brand-frost">Your social media performance summary</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-electric mb-1">245</div>
            <div className="text-sm text-brand-zinc dark:text-brand-frost">New followers this week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-electric mb-1">1.2K</div>
            <div className="text-sm text-brand-zinc dark:text-brand-frost">Total engagements</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-electric mb-1">5.8%</div>
            <div className="text-sm text-brand-zinc dark:text-brand-frost">Average engagement rate</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Overview;