import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Zap,
  AlertCircle,
  TrendingDown, 
} from 'lucide-react';
// import { 
//   ResponsiveContainer, 
//   LineChart, 
//   Line, 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip 
// } from 'recharts';
//import socialAccountsAPI from '../services/socialAccounts'; // Adjust path as needed
import { socialAccountsAPI } from '../../services/socialAccounts';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



// Types
interface PageInfo {
  name: string;
  about?: string;
  category?: string;
  location?: any;
  cover?: string;
}

interface AccountInfo {
  username: string;
  name: string;
  profile_picture?: string;
  followers_count: number;
  media_count: number;
}

interface AnalyticsData {
  summary: {
    totalFollowers: number;
    totalEngagement?: number;
    totalImpressions?: number;  // Made optional to match backend
    totalViews?: number;        // Made optional to match backend
    totalVideoViews?: number;
    totalPosts: number;
    fansChange?: number;        // Made optional to match backend
    engagementRate?: number;
    totalReach?: number;
    websiteClicks?: number;
    accountsEngaged?: number;
    profileViews?: number;
  };
  chartData: Record<string, Array<{ date: string; value: number }>>;
  topPosts: Array<{
    id: string;
    message?: string;
    caption?: string;
    date?: string;
    timestamp?: string;
    picture?: string;
    url?: string;
    permalink?: string;
    insights: Record<string, number>;
    likes?: number;
    comments?: number;
    shares?: number;
    type?: string;
    platform?: string;
    engagement?: {
      likes: number;
      comments: number;
      shares: number;
    };
    engagementCount?: number; // Add this for type safety
  }>;
  demographics: {
    countries: Record<string, number>;
    gender_age?: Record<string, number>;  // Made optional
    cities?: Record<string, number>;
  };
  pageInfo?: PageInfo;
  accountInfo?: AccountInfo;
  warning?: string;
}

interface SocialAccount {
  id: string;
  platform: 'instagram' | 'facebook';
  username: string;
  displayName: string;
  profileImage: string | null;
  followers: number;
  accountType: string;
  isActive: boolean;
  lastSync: string;
  syncStatus: 'success' | 'error' | 'syncing' | 'pending';
}

interface AccountAnalytics {
  accountId: string;
  data: AnalyticsData | null;
  error: string | null;
  isLoading: boolean;
  lastUpdated: Date | null;
}

const Analytics = () => {
  // State
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [activeChart, setActiveChart] = useState('engagement');
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<Record<string, AccountAnalytics>>({});
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<Record<string, number>>({});

  // Constants
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

  const formatNumber = (val: any) => {
    if (typeof val === 'number') return val.toLocaleString();
    if (typeof val === 'string' && !isNaN(Number(val))) return Number(val).toLocaleString();
    return '0';
  };

  // Load accounts
  const loadAccounts = useCallback(async () => {
    try {
      setAccountsLoading(true);
      setError(null);
      const response = await socialAccountsAPI.getAccounts();
      
      if (response.success && response.accounts) {
        const activeAccounts = response.accounts.filter(account => account.isActive);
        setAccounts(activeAccounts);
      } else {
        throw new Error(response.error || 'Failed to load accounts');
      }
    } catch (err) {
      console.error('Error loading accounts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load accounts');
      setAccounts([]);
    } finally {
      setAccountsLoading(false);
    }
  }, []);

  // Load analytics for a specific account
  const loadAccountAnalytics = useCallback(async (accountId: string) => {
    setAnalyticsData(prev => ({
      ...prev,
      [accountId]: { ...prev[accountId], isLoading: true, error: null }
    }));

    try {
      const response = await socialAccountsAPI.getAccountAnalytics(accountId, {
        timeframe: selectedTimeframe
      });

      if (response.success && response.data) {
        const safeData: AnalyticsData = {
          ...response.data,
          summary: {
            totalFollowers: response.data.summary?.totalFollowers ?? 0,
            totalEngagement: response.data.summary?.totalEngagement ?? 0,
            totalImpressions: response.data.summary?.totalImpressions ?? 0,
            totalViews: response.data.summary?.totalViews ?? 0,
            totalVideoViews: response.data.summary?.totalVideoViews ?? 0,
            totalPosts: response.data.summary?.totalPosts ?? 0,
            fansChange: response.data.summary?.fansChange ?? 0,
            engagementRate: response.data.summary?.engagementRate ?? 0,
            totalReach: response.data.summary?.totalReach ?? 0,
            websiteClicks: response.data.summary?.websiteClicks ?? 0,
            accountsEngaged: response.data.summary?.accountsEngaged ?? 0,
            profileViews: response.data.summary?.profileViews ?? 0,
          },
          // Ensure other properties have defaults
          topPosts: response.data.topPosts ?? [],
          chartData: response.data.chartData ?? {},
          demographics: {
            countries: response.data.demographics?.countries ?? {},
            gender_age: response.data.demographics?.gender_age ?? {},
            cities: response.data.demographics?.cities ?? {}
          }
        };

        setAnalyticsData(prev => ({
          ...prev,
          [accountId]: {
            accountId,
            data: safeData,
            error: null,
            isLoading: false,
            lastUpdated: new Date(),
          }
        }));
      }
    else {
        throw new Error(response.error || 'Failed to load analytics');
      }
    } catch (err) {
      console.error(`Error loading analytics for account ${accountId}:`, err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics';
      
      // Add retry logic
      const currentRetries = retryCount[accountId] || 0;
      if (currentRetries < 3) {
        setRetryCount(prev => ({ ...prev, [accountId]: currentRetries + 1 }));
        // Retry after delay
        setTimeout(() => {
          loadAccountAnalytics(accountId);
        }, 1000 * (currentRetries + 1));
        return;
      }
      
      setAnalyticsData(prev => ({
        ...prev,
        [accountId]: {
          accountId,
          data: null,
          error: errorMessage,
          isLoading: false,
          lastUpdated: null
        }
      }));
    }
  }, [selectedTimeframe]);

  // Load analytics for all accounts
  const loadAllAnalytics = useCallback(async () => {
    const filteredAccounts = accounts.filter(account => 
      selectedPlatform === 'all' || account.platform === selectedPlatform
    );

    // Load analytics for each account
    await Promise.allSettled(
      filteredAccounts.map(account => loadAccountAnalytics(account.id))
    );
  }, [accounts, selectedPlatform, loadAccountAnalytics]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadAccounts();
      // Analytics will be loaded automatically via useEffect
    } finally {
      setRefreshing(false);
    }
  }, [loadAccounts]);

  // Aggregate analytics data
  const aggregatedData = useMemo(() => {
    const filteredAccounts = accounts.filter(account => 
      selectedPlatform === 'all' || account.platform === selectedPlatform
    );

    const validAnalytics = filteredAccounts
      .map(account => analyticsData[account.id])
      .filter(analytics => analytics?.data && !analytics.error);

    if (validAnalytics.length === 0) {
      return null;
    }

    // Aggregate summary data
    const summary = validAnalytics.reduce((acc, analytics) => {
      const data = analytics.data!;
      return {
        totalFollowers: acc.totalFollowers + (data.summary.totalFollowers || 0),
        totalEngagement: acc.totalEngagement + (data.summary.totalEngagement || 0),
        totalImpressions: acc.totalImpressions + (data.summary.totalImpressions || 0),
        totalViews: acc.totalViews + (data.summary.totalViews || 0),
        totalVideoViews: acc.totalVideoViews + (data.summary.totalVideoViews || 0),
        totalPosts: acc.totalPosts + (data.summary.totalPosts || 0),
        fansChange: acc.fansChange + (data.summary.fansChange || 0)
      };
    }, {
      totalFollowers: 0,
      totalEngagement: 0,
      totalImpressions: 0,
      totalViews: 0,
      totalVideoViews: 0,
      totalPosts: 0,
      fansChange: 0
    });

    // Calculate engagement rate
    const engagementRate = summary.totalFollowers > 0 
      ? (summary.totalEngagement / summary.totalFollowers) * 100 
      : 0;

    // Aggregate top posts
    const allPosts = validAnalytics.flatMap(analytics => 
      (analytics.data?.topPosts ?? []).map(post => {
        const account = accounts.find(acc => acc.id === analytics.accountId);
        const platform = account?.platform || 'unknown';
        
        // Calculate engagement based on platform
        let engagementCount = 0;
        if (platform === 'facebook') {
          engagementCount = (post.engagement?.likes ?? 0) + 
                          (post.engagement?.comments ?? 0) + 
                          (post.engagement?.shares ?? 0);
        } else if (platform === 'instagram') {
          engagementCount = (post.likes ?? 0) + (post.comments ?? 0);
        }
        
        return {
          ...post,
          platform,
          engagementCount
        };
      })
    ).sort((a, b) => (b.engagementCount || 0) - (a.engagementCount || 0)).slice(0, 5);

    // Aggregate demographics
    const demographics = {
      countries: {},
      gender_age: {}
    } as { countries: Record<string, number>; gender_age: Record<string, number> };

    validAnalytics.forEach(analytics => {
      const data = analytics.data!;
      
      // Merge countries
      Object.entries(data.demographics.countries || {}).forEach(([country, count]) => {
        demographics.countries[country] = (demographics.countries[country] || 0) + count;
      });

      // Merge gender_age
      Object.entries(data.demographics.gender_age || {}).forEach(([key, count]) => {
        demographics.gender_age[key] = (demographics.gender_age[key] || 0) + count;
      });
    });

    return {
      summary: { ...summary, engagementRate },
      topPosts: allPosts,
      demographics,
      accountCount: validAnalytics.length
    };
  }, [accounts, analyticsData, selectedPlatform]);

  const getChartData = useMemo(() => {
  console.log('Chart Debug - Start:', {
    aggregatedData: !!aggregatedData,
    selectedPlatform,
    activeChart,
    accountsCount: accounts.length
  });

  if (!aggregatedData) {
    console.log('Chart Debug - No aggregated data');
    return [];
  }

  const filteredAccounts = accounts.filter(
    (account) => selectedPlatform === 'all' || account.platform === selectedPlatform
  );

  console.log('Chart Debug - Filtered accounts:', filteredAccounts.length);

  const validAnalytics = filteredAccounts
    .map((account) => analyticsData[account.id])
    .filter((analytics) => analytics?.data && !analytics.error);

  console.log('Chart Debug - Valid analytics:', validAnalytics.length);

  if (validAnalytics.length === 0) {
    console.log('Chart Debug - No valid analytics data');
    return [];
  }

  // Rest of your existing getMetricKey function...
  const getMetricKey = (account: SocialAccount, type: string): string | null => {
    const platformKeys: Record<string, Record<string, string>> = {
      facebook: {
        engagement: 'page_engaged_users',
        followers: 'page_fans',
        impressions: 'page_impressions'
      },
      instagram: {
        engagement: 'accounts_engaged',
        followers: 'follower_count',
        impressions: 'reach'
      }
    };
    
    const platformConfig = platformKeys[account.platform];
    if (!platformConfig) return null;
    
    return platformConfig[type] || null;
  };

  const chartDataMap = new Map<string, number>();
  
  validAnalytics.forEach((analytics) => {
    const account = accounts.find(a => a.id === analytics.accountId);
    if (!account) return;
    
    const metricKey = getMetricKey(account, activeChart);
    console.log('Chart Debug - Metric key for', account.username, ':', metricKey);
    
    if (!metricKey) return;
    
    const chartData = analytics.data!.chartData[metricKey] || [];
    console.log('Chart Debug - Chart data for', account.username, ':', chartData.length, 'points');
    
    chartData.forEach((point: { date: string; value: number }) => {
      const existing = chartDataMap.get(point.date) || 0;
      chartDataMap.set(point.date, existing + (point.value || 0));
    });
  });

  const finalData = Array.from(chartDataMap.entries())
    .map(([date, value]) => ({ 
      date, 
      value: Math.max(0, value)
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30);

  console.log('Chart Debug - Final chart data:', finalData.length, 'points');
  return finalData;
}, [aggregatedData, activeChart, accounts, analyticsData, selectedPlatform]);

  const getChartTitle = (chartType: string): string => {
    switch (chartType) {
      case 'engagement':
        return 'Engagement Trends';
      case 'followers':
        return 'Follower Growth';
      case 'impressions':
        return 'Impression Trends';
      default:
        return 'Performance Trends';
    }
  };

  const getChartDescription = (chartType: string, dataLength: number): string => {
    if (dataLength === 0) {
      return `No ${chartType} data available for the selected timeframe`;
    }
    return `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} data over ${dataLength} data points`;
  };

  const hasChartVariation = (data: { value: number }[]) => {
    if (data.length < 2) return false;
    const first = data[0]?.value;
    return data.some((point) => point.value !== first);
  };

  // Centralized loading state management
  const loadingStates = useMemo(() => {
    const accountIds = accounts
      .filter(account => selectedPlatform === 'all' || account.platform === selectedPlatform)
      .map(account => account.id);
    
    return {
      isAnyLoading: accountsLoading || Object.values(analyticsData).some(data => data?.isLoading),
      loadingAccounts: accountIds.filter(id => analyticsData[id]?.isLoading),
      errorAccounts: accountIds.filter(id => analyticsData[id]?.error),
      successAccounts: accountIds.filter(id => analyticsData[id]?.data && !analyticsData[id]?.error)
    };
  }, [accountsLoading, analyticsData, accounts, selectedPlatform]);

  // Effects
  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  useEffect(() => {
    if (accounts.length > 0) {
      loadAllAnalytics();
    }
  }, [accounts, loadAllAnalytics]);

  // Check if any data is loading
  const isLoading = accountsLoading || Object.values(analyticsData).some(data => data?.isLoading);

  // Check if there are any errors
  const hasErrors = Object.values(analyticsData).some(data => data?.error);
  const errorMessages = Object.values(analyticsData)
    .filter(data => data?.error)
    .map(data => data!.error)
    .filter((error): error is string => error !== null); // Type guard to ensure only strings

  // Components
  const StatCard = React.memo(({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    format = 'number', 
    isLoading = false 
  }: {
    title: string;
    value: number;
    change?: number;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    format?: 'number' | 'percentage';
    isLoading?: boolean;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand hover:shadow-brand-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-brand-electric/10 rounded-lg">
          <Icon size={20} className="text-brand-electric" />
        </div>
        {typeof change === 'number' && !isNaN(change) && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            change >= 0 
              ? 'bg-brand-lime/10 text-brand-lime' 
              : 'bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400'
          }`}>
            {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-brand-zinc dark:text-brand-frost mb-1">{title}</h3>
        {isLoading ? (
          <div className="h-8 bg-brand-frost/20 dark:bg-brand-zinc/20 rounded animate-pulse"></div>
        ) : (
          <p className="text-2xl font-bold text-brand-void dark:text-brand-pure">
            {format === 'percentage' ? `${(value || 0).toFixed(1)}%` : formatNumber(value || 0)}
          </p>
        )}
      </div>
    </motion.div>
  ));

  const PostCard = ({ post, platform }: { 
    post: AnalyticsData['topPosts'][0]; 
    platform: string 
  }) => {
    // Handle different post formats from Facebook vs Instagram
    const likes = platform === 'facebook' 
      ? (post.engagement?.likes ?? 0)
      : (post.likes ?? 0);
      
    const comments = platform === 'facebook'
      ? (post.engagement?.comments ?? 0) 
      : (post.comments ?? 0);
      
    const shares = platform === 'facebook'
      ? (post.engagement?.shares ?? 0)
      : 0;
      
    const reach = post.insights?.post_impressions || 
                  post.insights?.reach || 
                  post.insights?.post_reactions_like_total || 0;
                  
    const totalEngagement = likes + comments + shares;
    const message = post.message || post.caption || 'No message available';
    const date = post.date || post.timestamp;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-4 border border-brand-frost/30 dark:border-brand-zinc/40"
      >
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 bg-brand-electric/10 rounded-lg flex items-center justify-center">
            {platform === 'instagram' ? (
              <Instagram size={14} className="text-brand-electric" />
            ) : (
              <Facebook size={14} className="text-brand-electric" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm text-brand-void dark:text-brand-pure line-clamp-2 mb-2">
              {message}
            </p>
            <div className="text-xs text-brand-zinc/60 dark:text-brand-frost/60">
              {date ? new Date(date).toLocaleDateString() : 'No date'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-brand-electric">
              {formatNumber(totalEngagement)}
            </div>
            <div className="text-xs text-brand-zinc dark:text-brand-frost">Engagement</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center text-xs">
          <div>
            <div className="flex items-center justify-center gap-1 text-brand-zinc dark:text-brand-frost">
              <Heart size={10} />
              {formatNumber(likes)}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-brand-zinc dark:text-brand-frost">
              <MessageCircle size={10} />
              {formatNumber(comments)}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-brand-zinc dark:text-brand-frost">
              <Eye size={10} />
              {formatNumber(reach)}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-12">
      <BarChart3 size={48} className="text-brand-electric/50 mx-auto mb-4" />
      <p className="text-brand-zinc dark:text-brand-frost text-lg mb-2">{message}</p>
      <button
        onClick={refreshData}
        className="flex items-center gap-2 mx-auto px-4 py-2 bg-brand-electric text-brand-pure rounded-lg hover:bg-brand-neon transition-colors"
      >
        <RefreshCw size={16} />
        Refresh
      </button>
    </div>
  );

  const ErrorState = ({ errors }: { errors: string[] }) => (
    <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle size={20} className="text-error-600 dark:text-error-400" />
        <h3 className="font-semibold text-error-800 dark:text-error-200">
          Analytics Loading Issues ({errors.length})
        </h3>
      </div>
      <ul className="text-sm text-error-700 dark:text-error-300 space-y-1">
        {errors.slice(0, 3).map((error, index) => (
          <li key={index}>• {error}</li>
        ))}
        {errors.length > 3 && (
          <li className="text-error-600 dark:text-error-400">
            ...and {errors.length - 3} more errors
          </li>
        )}
      </ul>
      <button
        onClick={refreshData}
        className="mt-3 flex items-center gap-2 px-3 py-1 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors text-sm"
      >
        <RefreshCw size={14} />
        Retry Failed Accounts
      </button>
    </div>
  );

  // Render loading state
  if (accountsLoading) {
    return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-brand-electric/30 border-t-brand-electric rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-brand-zinc dark:text-brand-frost">Loading your social accounts...</p>
      </div>
    </div>
  );
  }

  // Render empty state
  if (accounts.length === 0 && !error) {
    return <EmptyState message="No active social accounts found. Connect your accounts to view analytics." />;
  }

  // Render error state
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={48} className="text-error-500 mx-auto mb-4" />
        <p className="text-error-600 dark:text-error-400 text-lg mb-4">{error}</p>
        <button
          onClick={refreshData}
          className="flex items-center gap-2 mx-auto px-4 py-2 bg-brand-electric text-brand-pure rounded-lg hover:bg-brand-neon transition-colors"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
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
            Performance metrics for {aggregatedData?.accountCount || 0} active social media account{(aggregatedData?.accountCount || 0) !== 1 ? 's' : ''}.
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
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-brand-electric text-brand-pure rounded-lg hover:bg-brand-neon transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span className="text-sm font-medium">
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </span>
          </button>
        </div>
      </motion.div>

      {/* Error Messages */}
      {hasErrors && <ErrorState errors={errorMessages} />}

      {/* Show warning if any account has a warning */}
      {Object.values(analyticsData).some(a => a?.data?.warning) && (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-800 text-yellow-900 dark:text-yellow-200 rounded-lg p-4 mb-4 flex items-center gap-2">
          <AlertCircle size={20} className="text-yellow-700 dark:text-yellow-200" />
          <span>
            {
              Object.values(analyticsData)
                .map(a => a?.data?.warning)
                .filter(Boolean)
                .join(' | ')
            }
          </span>
        </div>
      )}

      {/* Summary Stats */}
      {aggregatedData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            title="Total Followers"
            value={aggregatedData.summary.totalFollowers || 0}
            change={aggregatedData.summary.fansChange}
            icon={Users}
            isLoading={loadingStates.isAnyLoading}
          />
          <StatCard
            title="Engagement"
            value={aggregatedData.summary.totalEngagement || 0}
            icon={Heart}
            isLoading={loadingStates.isAnyLoading}
          />
          <StatCard
            title="Impressions"
            value={aggregatedData.summary.totalImpressions || 0}
            icon={Eye}
            isLoading={loadingStates.isAnyLoading}
          />
          <StatCard
            title="Total Posts"
            value={aggregatedData.summary.totalPosts || 0}
            icon={BarChart3}
            isLoading={loadingStates.isAnyLoading}
          />
          <StatCard
            title="Engagement Rate"
            value={aggregatedData.summary.engagementRate || 0}
            icon={Target}
            format="percentage"
            isLoading={loadingStates.isAnyLoading}
          />
        </div>
      )}

      {/* Chart Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-brand-void dark:text-brand-pure">
            {getChartTitle(activeChart)}
          </h2>
          <div className="flex items-center gap-2">
            {['engagement', 'followers', 'impressions'].map((chartType) => (
              <button
                key={chartType}
                onClick={() => setActiveChart(chartType)}
                className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 ${
                  activeChart === chartType
                    ? 'bg-brand-electric text-brand-pure'
                    : 'bg-brand-frost/10 dark:bg-brand-zinc/10 text-brand-zinc dark:text-brand-frost hover:bg-brand-frost/20 dark:hover:bg-brand-zinc/20'
                }`}
              >
                {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <p className="text-sm text-brand-zinc dark:text-brand-frost mb-4">
          {getChartDescription(activeChart, getChartData.length)}
        </p>
        
        {/* Chart Implementation */}
        <div className="h-64 relative">
          {getChartData.length > 1 && hasChartVariation(getChartData) ? (
            <div className="w-full h-full">
              <div className="relative h-full">
                <svg className="w-full h-full" viewBox="0 0 800 200">
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="80" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 80 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-brand-frost/20 dark:text-brand-zinc/20"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Chart line */}
                  {(() => {
                    if (getChartData.length < 2) return null;
                    
                    const values = getChartData.map(d => d.value);
                    const maxValue = Math.max(...values);
                    const minValue = Math.min(...values);
                    const valueRange = maxValue - minValue || 1;
                    
                    const points = getChartData.map((point, index) => {
                      const x = (index / (getChartData.length - 1)) * 750 + 25;
                      const y = 175 - ((point.value - minValue) / valueRange) * 150;
                      return `${x},${y}`;
                    }).join(' ');
                    
                    return (
                      <g>
                        {/* Area fill */}
                        <path
                          d={`M 25,175 ${points} L 775,175 Z`}
                          fill="currentColor"
                          className="text-brand-electric/10"
                        />
                        {/* Line */}
                        <polyline
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          points={points}
                          className="text-brand-electric"
                        />
                        {/* Data points */}
                        {getChartData.map((point, index) => {
                          const x = (index / (getChartData.length - 1)) * 750 + 25;
                          const y = 175 - ((point.value - minValue) / valueRange) * 150;
                          return (
                            <circle
                              key={index}
                              cx={x}
                              cy={y}
                              r="4"
                              fill="currentColor"
                              className="text-brand-electric"
                            />
                          );
                        })}
                      </g>
                    );
                  })()}
                </svg>
                
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2 -ml-16">
                  {(() => {
                    if (getChartData.length === 0) return null;
                    
                    const values = getChartData.map(d => d.value);
                    const maxValue = Math.max(...values);
                    const minValue = Math.min(...values);
                    const valueRange = maxValue - minValue || 1;
                    const steps = 5;
                    
                    return Array.from({ length: steps }, (_, i) => {
                      const value = maxValue - (i * valueRange / (steps - 1));
                      return (
                        <div key={i} className="text-xs text-brand-zinc dark:text-brand-frost text-right">
                          {formatNumber(Math.round(Math.max(0, value)))}
                        </div>
                      );
                    });
                  })()}
                </div>
                
                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 w-full flex justify-between px-6 -mb-8">
                  {getChartData.length > 0 && (
                    <>
                      <div className="text-xs text-brand-zinc dark:text-brand-frost">
                        {new Date(getChartData[0].date).toLocaleDateString(undefined, { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      {getChartData.length > 1 && (
                        <div className="text-xs text-brand-zinc dark:text-brand-frost">
                          {new Date(getChartData[getChartData.length - 1].date).toLocaleDateString(undefined, { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
          <div className="h-full bg-brand-frost/10 dark:bg-brand-carbon/30 rounded-lg border border-brand-frost/20 dark:border-brand-zinc/30 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 size={48} className="text-brand-electric/50 mx-auto mb-3" />
              <p className="text-brand-zinc dark:text-brand-frost text-lg mb-2">
                {getChartData.length <= 1
                  ? 'Not enough data to draw trend'
                  : 'No variation detected in chart values'}
              </p>
              <p className="text-sm text-brand-zinc/60 dark:text-brand-frost/60">
                Try refreshing data or choose another metric.
              </p>
              {!loadingStates.isAnyLoading && (
                <button
                  onClick={refreshData}
                  className="mt-3 flex items-center gap-2 mx-auto px-4 py-2 bg-brand-electric text-brand-pure rounded-lg hover:bg-brand-neon transition-colors text-sm"
                >
                  <RefreshCw size={16} />
                  Refresh Data
                </button>
              )}
            </div>
          </div>
        )}
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
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-brand-frost/10 dark:bg-brand-zinc/10 rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-brand-frost/20 dark:bg-brand-zinc/20 rounded mb-2"></div>
                  <div className="h-3 bg-brand-frost/20 dark:bg-brand-zinc/20 rounded w-3/4"></div>
                </div>
              ))
            ) : aggregatedData?.topPosts.length ? (
              aggregatedData.topPosts.map((post, index) => (
                <PostCard key={`${post.id}-${index}`} post={post} platform={post.platform} />
              ))
            ) : (
              <div className="text-center py-8 text-brand-zinc dark:text-brand-frost">
                No posts data available
              </div>
            )}
          </div>
        </motion.div>

        {/* Demographics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand"
        >
          <h2 className="text-xl font-bold text-brand-void dark:text-brand-pure mb-6">Audience Demographics</h2>
          
          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="h-4 bg-brand-frost/20 dark:bg-brand-zinc/20 rounded w-1/3 mb-2"></div>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-3 bg-brand-frost/20 dark:bg-brand-zinc/20 rounded"></div>
                  ))}
                </div>
              ))}
            </div>
          ) : aggregatedData ? (
            <div className="space-y-6">
              {/* Top Countries */}
              <div>
                <h3 className="text-sm font-semibold text-brand-zinc dark:text-brand-frost mb-3">Top Countries</h3>
                <div className="space-y-2">
                  {Object.entries(aggregatedData.demographics.countries)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([country, count], index) => {
                      const total = Object.values(aggregatedData.demographics.countries).reduce((a, b) => a + b, 0);
                      const percentage = total > 0 ? (count / total) * 100 : 0;
                      
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-brand-zinc dark:text-brand-frost">{country}</span>
                          <div className="flex items-center gap-2 w-32">
                            <div className="flex-1 h-2 bg-brand-frost/20 dark:bg-brand-zinc/20 rounded-full">
                              <div 
                                className="h-2 bg-brand-electric rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(percentage * 2, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-brand-void dark:text-brand-pure w-8">
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Gender & Age Groups */}
              <div>
                <h3 className="text-sm font-semibold text-brand-zinc dark:text-brand-frost mb-3">Demographics</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(aggregatedData.demographics.gender_age)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 6)
                    .map(([demographic, count], index) => {
                      const total = Object.values(aggregatedData.demographics.gender_age).reduce((a, b) => a + b, 0);
                      const percentage = total > 0 ? (count / total) * 100 : 0;
                      
                      return (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-brand-electric/10 text-brand-electric text-sm font-medium rounded-full"
                        >
                          {demographic.replace('U.', '').replace('F.', '').replace('M.', '')} ({percentage.toFixed(0)}%)
                        </span>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-brand-zinc dark:text-brand-frost">
              No demographic data available
            </div>
          )}
        </motion.div>
      </div>

      {/* Account Performance Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand"
      >
        <h2 className="text-xl font-bold text-brand-void dark:text-brand-pure mb-6">Account Performance</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {accounts
            .filter(account => selectedPlatform === 'all' || account.platform === selectedPlatform)
            .map(account => {
              const analytics = analyticsData[account.id];
              const isAccountLoading = analytics?.isLoading;
              const hasAccountError = analytics?.error;
              const accountData = analytics?.data;

              return (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-brand-frost/5 dark:bg-brand-carbon/30 rounded-lg p-4 border border-brand-frost/20 dark:border-brand-zinc/30"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-brand-electric/10 rounded-lg flex items-center justify-center">
                      {account.platform === 'instagram' ? (
                        <Instagram size={16} className="text-brand-electric" />
                      ) : (
                        <Facebook size={16} className="text-brand-electric" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-brand-void dark:text-brand-pure">
                        {account.displayName || account.username}
                      </h3>
                      <p className="text-sm text-brand-zinc dark:text-brand-frost">
                        @{account.username}
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      account.syncStatus === 'success' 
                        ? 'bg-brand-lime' 
                        : account.syncStatus === 'error' 
                        ? 'bg-error-500' 
                        : account.syncStatus === 'syncing' 
                        ? 'bg-brand-electric animate-pulse' 
                        : 'bg-brand-zinc/30'
                    }`} />
                  </div>

                  {isAccountLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-4 bg-brand-frost/20 dark:bg-brand-zinc/20 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : hasAccountError ? (
                    <div className="text-center py-4">
                      <AlertCircle size={32} className="text-error-500 mx-auto mb-2" />
                      <p className="text-sm text-error-600 dark:text-error-400 mb-2">
                        Failed to load data
                      </p>
                      <button
                        onClick={() => loadAccountAnalytics(account.id)}
                        className="text-xs px-3 py-1 bg-brand-electric text-brand-pure rounded hover:bg-brand-neon transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  ) : accountData ? (
                    <div className="space-y-3">
                      {/* Account Info Display - Add after the account header div */}
                      {accountData?.pageInfo && (
                        <div className="mb-3 p-2 bg-brand-frost/5 dark:bg-brand-carbon/20 rounded text-xs text-brand-zinc dark:text-brand-frost">
                          <div className="font-semibold">{accountData.pageInfo.name}</div>
                          {accountData.pageInfo.category && (
                            <div className="text-brand-zinc/70 dark:text-brand-frost/70">
                              {accountData.pageInfo.category}
                            </div>
                          )}
                          {accountData.pageInfo.about && (
                            <div className="mt-1 line-clamp-2">{accountData.pageInfo.about}</div>
                          )}
                        </div>
                      )}

                      {accountData?.accountInfo && (
                        <div className="mb-3 p-2 bg-brand-frost/5 dark:bg-brand-carbon/20 rounded text-xs text-brand-zinc dark:text-brand-frost">
                          <div className="font-semibold">{accountData.accountInfo.name}</div>
                          <div className="text-brand-zinc/70 dark:text-brand-frost/70">
                            @{accountData.accountInfo.username}
                          </div>
                          <div className="mt-1">
                            Followers: {formatNumber(accountData.accountInfo.followers_count)}
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-brand-zinc dark:text-brand-frost">Followers</span>
                        <span className="font-semibold text-brand-void dark:text-brand-pure">
                          {formatNumber(accountData.summary.totalFollowers)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-brand-zinc dark:text-brand-frost">Engagement</span>
                        <span className="font-semibold text-brand-void dark:text-brand-pure">
                          {formatNumber(accountData.summary.totalEngagement)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-brand-zinc dark:text-brand-frost">Posts</span>
                        <span className="font-semibold text-brand-void dark:text-brand-pure">
                          {accountData.summary.totalPosts}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-brand-zinc dark:text-brand-frost">Impressions</span>
                        <span className="font-semibold text-brand-void dark:text-brand-pure">
                          {formatNumber(accountData.summary.totalImpressions)}
                        </span>
                      </div>
                      {analytics?.lastUpdated ? (
                        <div className="pt-2 border-t border-brand-frost/20 dark:border-brand-zinc/30">
                          <div className="flex items-center gap-1 text-xs text-brand-zinc/60 dark:text-brand-frost/60">
                            <Clock size={10} />
                            Updated {(() => {
                              try {
                                return new Date(analytics.lastUpdated).toLocaleTimeString();
                              } catch {
                                return 'Invalid Date';
                              }
                            })()}
                          </div>
                        </div>
                      ) : (
                        <div className="pt-2 border-t border-brand-frost/20 dark:border-brand-zinc/30">
                          <div className="flex items-center gap-1 text-xs text-brand-zinc/60 dark:text-brand-frost/60">
                            <Clock size={10} />
                            Updated: N/A
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-brand-zinc dark:text-brand-frost text-sm">
                      No data available
                    </div>
                  )}

                  {accountData?.warning && (
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-800 text-yellow-900 dark:text-yellow-200 rounded p-2 mt-2 flex items-center gap-2 text-xs">
                      <AlertCircle size={14} className="text-yellow-700 dark:text-yellow-200" />
                      {accountData.warning}
                    </div>
                  )}
                </motion.div>
              );
            })}
        </div>

        {accounts.filter(account => selectedPlatform === 'all' || account.platform === selectedPlatform).length === 0 && (
          <div className="text-center py-8">
            <Users size={48} className="text-brand-zinc/30 mx-auto mb-4" />
            <p className="text-brand-zinc dark:text-brand-frost">
              No accounts found for the selected platform.
            </p>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-brand-electric/5 to-brand-neon/5 dark:from-brand-electric/10 dark:to-brand-neon/10 rounded-xl p-6 border border-brand-electric/20"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-brand-void dark:text-brand-pure mb-1">
              Want deeper insights?
            </h3>
            <p className="text-brand-zinc dark:text-brand-frost">
              Export your data or set up automated reporting to track your progress over time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-brand-pure dark:bg-brand-carbon border border-brand-frost/30 dark:border-brand-zinc/40 rounded-lg text-brand-void dark:text-brand-pure hover:bg-brand-frost/10 dark:hover:bg-brand-zinc/10 transition-all duration-200"
              onClick={() => {
                // TODO: Implement export functionality
                console.log('Export analytics data');
              }}
            >
              <Download size={16} />
              Export Data
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-brand-electric text-brand-pure rounded-lg hover:bg-brand-neon transition-all duration-200"
              onClick={() => {
                // TODO: Implement automated reporting setup
                console.log('Setup automated reporting');
              }}
            >
              <Zap size={16} />
              Setup Reports
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;