import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  TrendingUp, 
  TrendingDown,
  Clock, 
  Calendar,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Target,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  BrainCircuit,
  BarChart3,
  Camera,
  Video,
  Image as ImageIcon,
  RefreshCw
} from 'lucide-react';

const Insights = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7days');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const timeframes = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 3 months' }
  ];

  // Mock AI insights data
  const [aiInsights] = useState({
    overallScore: 85,
    weeklyTrend: 'improving',
    keyInsights: [
      {
        type: 'opportunity',
        title: 'Optimal Posting Time Discovered',
        description: 'Your audience is 40% more active between 2:00 PM - 4:00 PM on weekdays.',
        impact: 'high',
        metric: '+40% potential reach',
        icon: Clock,
        actionable: true,
        recommendation: 'Schedule your next 3 posts during this window to maximize engagement.'
      },
      {
        type: 'warning',
        title: 'Engagement Drop Detected',
        description: 'Your engagement rate decreased by 15% this week compared to last week.',
        impact: 'medium',
        metric: '-15% engagement',
        icon: TrendingDown,
        actionable: true,
        recommendation: 'Try posting more video content - it performs 60% better for your audience.'
      },
      {
        type: 'success',
        title: 'Content Format Winner',
        description: 'Video posts are performing exceptionally well with 3.2x higher engagement.',
        impact: 'high',
        metric: '+320% engagement',
        icon: Video,
        actionable: true,
        recommendation: 'Increase video content ratio to 40% of your posts for optimal results.'
      },
      {
        type: 'insight',
        title: 'Audience Growth Pattern',
        description: 'Your follower growth spikes on Tuesdays and Thursdays.',
        impact: 'medium',
        metric: '+25% growth days',
        icon: Users,
        actionable: true,
        recommendation: 'Launch new campaigns or important announcements on these high-growth days.'
      }
    ],
    contentAnalysis: {
      bestPerforming: 'Video content',
      improvementArea: 'Image posts',
      optimalFrequency: '2-3 posts per day',
      topHashtags: ['#socialmedia', '#digitalmarketing', '#contentcreator'],
      engagementPatterns: {
        bestDays: ['Tuesday', 'Thursday'],
        bestTimes: ['2:00 PM', '7:00 PM'],
        worstTimes: ['6:00 AM', '11:00 PM']
      }
    },
    predictions: [
      {
        title: 'Follower Milestone',
        description: 'You\'re likely to reach 20K followers by next month',
        confidence: 89,
        timeframe: '28 days',
        type: 'growth'
      },
      {
        title: 'Viral Content Opportunity',
        description: 'Tuesday 2 PM posts have 70% chance of high engagement',
        confidence: 76,
        timeframe: 'Next Tuesday',
        type: 'engagement'
      },
      {
        title: 'Audience Interest Shift',
        description: 'Your audience is showing increased interest in educational content',
        confidence: 82,
        timeframe: 'Current trend',
        type: 'content'
      }
    ]
  });

  const [performanceMetrics] = useState([
    {
      metric: 'Engagement Rate',
      current: 5.8,
      previous: 6.7,
      trend: 'down',
      target: 7.0,
      unit: '%'
    },
    {
      metric: 'Reach Growth',
      current: 12.5,
      previous: 8.3,
      trend: 'up',
      target: 15.0,
      unit: '%'
    },
    {
      metric: 'Follower Quality Score',
      current: 8.4,
      previous: 8.1,
      trend: 'up',
      target: 9.0,
      unit: '/10'
    },
    {
      metric: 'Content Consistency',
      current: 85,
      previous: 78,
      trend: 'up',
      target: 90,
      unit: '%'
    }
  ]);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return { icon: Lightbulb, color: 'text-brand-lime' };
      case 'warning': return { icon: AlertTriangle, color: 'text-brand-amber' };
      case 'success': return { icon: CheckCircle2, color: 'text-brand-lime' };
      default: return { icon: Sparkles, color: 'text-brand-electric' };
    }
  };

  const getImpactBadge = (impact: string) => {
    const styles = {
      high: 'bg-brand-electric/10 text-brand-electric',
      medium: 'bg-brand-amber/10 text-brand-amber',
      low: 'bg-brand-zinc/10 text-brand-zinc'
    };
    return styles[impact as keyof typeof styles] || styles.medium;
  };

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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BrainCircuit size={28} className="text-brand-electric" />
            <h1 className="text-3xl font-bold text-brand-void dark:text-brand-pure">
              AI Insights
            </h1>
          </div>
          <p className="text-brand-zinc dark:text-brand-frost">
            Discover AI-powered recommendations to boost your social media performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
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
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-brand-electric text-brand-pure rounded-lg hover:bg-brand-neon transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>
      </motion.div>

      {/* AI Score Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-brand-electric/10 to-brand-neon/10 dark:from-brand-carbon/60 dark:to-brand-zinc/40 rounded-xl p-6 border border-brand-electric/20 dark:border-brand-zinc/30"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-electric/20 rounded-xl">
              <Sparkles size={24} className="text-brand-electric" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-void dark:text-brand-pure">AI Performance Score</h2>
              <p className="text-sm text-brand-zinc dark:text-brand-frost">Overall social media health</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-brand-electric">{aiInsights.overallScore}/100</div>
            <div className="flex items-center gap-1 text-sm text-brand-lime">
              <TrendingUp size={14} />
              <span>Improving</span>
            </div>
          </div>
        </div>
        <div className="w-full bg-brand-frost/20 dark:bg-brand-zinc/20 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-brand-electric to-brand-neon h-3 rounded-full transition-all duration-1000"
            style={{ width: `${aiInsights.overallScore}%` }}
          ></div>
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {performanceMetrics.map((metric, index) => (
          <div
            key={index}
            className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-brand-zinc dark:text-brand-frost">{metric.metric}</h3>
              {metric.trend === 'up' ? (
                <ArrowUpRight size={16} className="text-brand-lime" />
              ) : (
                <ArrowDownRight size={16} className="text-error-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-brand-void dark:text-brand-pure">
                {metric.current}{metric.unit}
              </div>
              <div className="text-xs text-brand-zinc/60 dark:text-brand-frost/60">
                Target: {metric.target}{metric.unit}
              </div>
              <div className="w-full bg-brand-frost/20 dark:bg-brand-zinc/20 rounded-full h-2">
                <div 
                  className="bg-brand-electric h-2 rounded-full"
                  style={{ width: `${(metric.current / metric.target) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Key Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand"
      >
        <h2 className="text-xl font-bold text-brand-void dark:text-brand-pure mb-6">Key AI Insights</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {aiInsights.keyInsights.map((insight, index) => {
            const { icon: Icon, color } = getInsightIcon(insight.type);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-brand-frost/10 dark:bg-brand-carbon/30 rounded-lg border border-brand-frost/20 dark:border-brand-zinc/30"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-brand-electric/10 rounded-lg">
                    <Icon size={18} className={color} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-brand-void dark:text-brand-pure">{insight.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactBadge(insight.impact)}`}>
                        {insight.impact} impact
                      </span>
                    </div>
                    <p className="text-sm text-brand-zinc dark:text-brand-frost mb-2">{insight.description}</p>
                    <div className="text-sm font-medium text-brand-electric mb-3">{insight.metric}</div>
                    {insight.recommendation && (
                      <div className="p-3 bg-brand-electric/5 rounded-lg border border-brand-electric/20">
                        <p className="text-sm text-brand-void dark:text-brand-pure font-medium">
                          💡 Recommendation: {insight.recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* AI Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand"
      >
        <h2 className="text-xl font-bold text-brand-void dark:text-brand-pure mb-6">AI Predictions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiInsights.predictions.map((prediction, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-brand-frost/10 dark:bg-brand-carbon/30 rounded-lg border border-brand-frost/20 dark:border-brand-zinc/30"
            >
              <div className="flex items-center gap-2 mb-3">
                <Target size={16} className="text-brand-electric" />
                <h3 className="font-semibold text-brand-void dark:text-brand-pure">{prediction.title}</h3>
              </div>
              <p className="text-sm text-brand-zinc dark:text-brand-frost mb-3">{prediction.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-brand-zinc dark:text-brand-frost">Confidence</span>
                  <span className="font-medium text-brand-electric">{prediction.confidence}%</span>
                </div>
                <div className="w-full bg-brand-frost/20 dark:bg-brand-zinc/20 rounded-full h-2">
                  <div 
                    className="bg-brand-electric h-2 rounded-full"
                    style={{ width: `${prediction.confidence}%` }}
                  ></div>
                </div>
                <div className="text-xs text-brand-zinc/60 dark:text-brand-frost/60">
                  Timeframe: {prediction.timeframe}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Content Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand"
      >
        <h2 className="text-xl font-bold text-brand-void dark:text-brand-pure mb-6">Content Performance Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-brand-void dark:text-brand-pure">Best Performing Content</h3>
            <div className="flex items-center gap-3 p-3 bg-brand-lime/10 rounded-lg">
              <Video size={20} className="text-brand-lime" />
              <div>
                <div className="font-medium text-brand-void dark:text-brand-pure">Video Content</div>
                <div className="text-sm text-brand-zinc dark:text-brand-frost">3.2x higher engagement</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-brand-void dark:text-brand-pure">Optimal Posting Times</h3>
            <div className="space-y-2">
              {aiInsights.contentAnalysis.engagementPatterns.bestTimes.map((time, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-brand-electric/10 rounded-lg">
                  <Clock size={16} className="text-brand-electric" />
                  <span className="text-sm font-medium text-brand-void dark:text-brand-pure">{time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-brand-void dark:text-brand-pure">Top Hashtags</h3>
            <div className="flex flex-wrap gap-2">
              {aiInsights.contentAnalysis.topHashtags.map((hashtag, index) => (
                <span key={index} className="px-3 py-1 bg-brand-neon/10 text-brand-neon text-sm font-medium rounded-full">
                  {hashtag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Insights;