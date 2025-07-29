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
  RefreshCw,
  Download
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { aiInsightsAPI, AIInsight, InsightStatus } from '../../services/aiInsights';
import { useAuth } from '../../context/AuthContext';

function getEngagementTier(rate: number): string {
  if (rate >= 5) return 'Excellent';
  if (rate >= 2) return 'Average';
  return 'Poor';
}

const Insights = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7days');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [insightStatus, setInsightStatus] = useState<InsightStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  // TODO: Replace with actual account ID from context/props
  const { user } = useAuth();
  const accountId = user?.instagram_account_id || user?.id;

  const timeframes = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 3 months' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-brand-lime';
    if (score >= 40) return 'text-brand-amber';
    return 'text-error-500';
  };

  const getScoreText = (score: number) => {
    if (score >= 70) return 'Excellent';
    if (score >= 40) return 'Good';
    return 'Needs Improvement';
  };

  // Load AI insights data
  const loadInsights = async () => {
    if (!accountId) {
      setError('No account ID available');
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const [insight, status] = await Promise.all([
        aiInsightsAPI.getInsightByAccountId(accountId),
        aiInsightsAPI.getInsightStatus(accountId)
      ]);
      
      setAiInsight(insight);
      setInsightStatus(status);
      
      if (!insight && status?.needs_refresh) {
        await aiInsightsAPI.triggerInsightGeneration(accountId);
        setTimeout(() => {
          if (!aiInsight) loadInsights();
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load insights');
      console.error('Error loading insights:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      loadInsights();
    }
  }, [accountId, selectedTimeframe]);

  const handleRefresh = async () => {
    if (!accountId) {
      setError('No account ID available');
      return;
    }

    setRefreshing(true);
    try {
      await aiInsightsAPI.triggerInsightGeneration(accountId, true);
      setTimeout(loadInsights, 2000);
    } catch (err) {
      console.error('Error refreshing insights:', err);
    } finally {
      setRefreshing(false);
    }
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
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BrainCircuit size={28} className="text-brand-electric" />
              <div className="h-8 bg-brand-frost/20 dark:bg-brand-zinc/20 rounded w-48 animate-pulse"></div>
            </div>
            <div className="h-4 bg-brand-frost/20 dark:bg-brand-zinc/20 rounded w-96 animate-pulse"></div>
          </div>
        </div>
        
        {/* Main content skeleton */}
        <div className="space-y-6">
          <div className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40">
            <div className="h-6 bg-brand-frost/20 dark:bg-brand-zinc/20 rounded w-32 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-4 bg-brand-frost/20 dark:bg-brand-zinc/20 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <div>
          <AlertTriangle size={48} className="text-error-500 mx-auto mb-4" />
          <p className="text-brand-zinc dark:text-brand-frost mb-4">{error}</p>
          <button
            onClick={loadInsights}
            className="px-4 py-2 bg-brand-electric text-brand-pure rounded-lg hover:bg-brand-neon transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!aiInsight && insightStatus?.status === 'syncing') {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <div>
          <div className="w-8 h-8 border-2 border-brand-electric/30 border-t-brand-electric rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-zinc dark:text-brand-frost">
            Generating AI insights... This may take a few moments.
          </p>
        </div>
      </div>
    );
  }

  if (!aiInsight) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <div>
          <BrainCircuit size={48} className="text-brand-zinc mx-auto mb-4" />
          <p className="text-brand-zinc dark:text-brand-frost mb-4">
            No AI insights available yet.
          </p>
          <button
            onClick={() => handleRefresh()}
            className="px-4 py-2 bg-brand-electric text-brand-pure rounded-lg hover:bg-brand-neon transition-colors"
          >
            Generate Insights
          </button>
        </div>
      </div>
    );
  }

  const insights = aiInsight.insights;
  // Provide fallback values for better user experience
  const overallScore = insights.overallScore || 0;
  const weeklyTrend = insights.weeklyTrend || 'stable';
  const keyInsights = insights.keyInsights || [];
  const performanceMetrics = insights.performanceMetrics || [];
  const predictions = insights.predictions || [];
  const contentAnalysis = insights.contentAnalysis;

  // Add debugging to see what data we have
  console.log('AI Insight Data:', {
    overallScore,
    weeklyTrend,
    keyInsightsCount: keyInsights.length,
    hasContentAnalysis: !!contentAnalysis,
    summary: aiInsight.summary
  });

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
          {insightStatus?.insight_age && (
            <p className="text-sm text-brand-zinc/60 dark:text-brand-frost/60 mt-1">
              Last updated: {insightStatus.insight_age}
            </p>
          )}
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
              <p className="text-sm text-brand-zinc dark:text-brand-frost">
                Overall social media health (Confidence: {Math.round(aiInsight.confidence_score * 100)}%)
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-brand-electric">{overallScore}/100</div>
            <div className="flex items-center gap-1 text-sm text-brand-lime">
              {weeklyTrend === 'improving' ? <TrendingUp size={14} /> : 
               weeklyTrend === 'declining' ? <TrendingDown size={14} /> :
               <span className="w-3 h-0.5 bg-brand-zinc rounded-full"></span>}
              <span className="capitalize">{weeklyTrend}</span>
            </div>
          </div>
        </div>
        <div className="w-full bg-brand-frost/20 dark:bg-brand-zinc/20 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-brand-electric to-brand-neon h-3 rounded-full transition-all duration-1000"
            style={{ width: `${Math.max(overallScore, 5)}%` }}
          ></div>
        </div>
      </motion.div>

      {/* Processing & System Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-brand-electric/20 rounded-xl">
              <Clock size={20} className="text-brand-electric" />
            </div>
            <div>
              <h3 className="font-semibold text-brand-void dark:text-brand-pure">Processing Time</h3>
              <p className="text-sm text-brand-zinc dark:text-brand-frost">Analysis duration</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-brand-electric">
            {typeof aiInsight.processing_time === 'number'
            ? aiInsight.processing_time.toFixed(3) + 's'
            : '—'}
          </div>
        </div>

        <div className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-brand-electric/20 rounded-xl">
              <Zap size={20} className="text-brand-electric" />
            </div>
            <div>
              <h3 className="font-semibold text-brand-void dark:text-brand-pure">AI Confidence</h3>
              <p className="text-sm text-brand-zinc dark:text-brand-frost">Analysis reliability</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-brand-electric">
              {Math.round(aiInsight.confidence_score * 100)}%
            </div>
            <div className="w-full bg-brand-frost/20 dark:bg-brand-zinc/20 rounded-full h-2">
              <div 
                className="bg-brand-electric h-2 rounded-full transition-all duration-500"
                style={{ width: `${aiInsight.confidence_score * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-brand-electric/20 rounded-xl">
              <BarChart3 size={20} className="text-brand-electric" />
            </div>
            <div>
              <h3 className="font-semibold text-brand-void dark:text-brand-pure">Analysis Status</h3>
              <p className="text-sm text-brand-zinc dark:text-brand-frost">Current state</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              aiInsight.status === 'active' ? 'bg-brand-lime' :
              aiInsight.status === 'pending' ? 'bg-brand-amber' :
              'bg-error-500'
            }`} />
            <span className="text-lg font-semibold text-brand-void dark:text-brand-pure capitalize">
              {aiInsight.status}
            </span>
          </div>
          {aiInsight.age && (
            <div className="mt-2 text-sm text-brand-zinc/60 dark:text-brand-frost/60">
              Generated {aiInsight.age}
            </div>
          )}
        </div>
      </motion.div>

      {/* Performance Metrics */}
      {performanceMetrics.length > 0 && (
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
                    style={{ width: `${Math.min((metric.current / metric.target) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* AI Recommendations Section - Fixed to use contentAnalysis */}
      {contentAnalysis?.recommendations && contentAnalysis.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white dark:bg-brand-carbon/60 rounded-xl p-6 shadow-md border border-brand-muted"
        >
          <h3 className="text-lg font-semibold mb-3 text-brand-void dark:text-brand-pure">📌 Personalized AI Recommendations</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-brand-graphite dark:text-brand-light">
            {contentAnalysis.recommendations.map((tip: string, i: number) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Content Analysis - Posting Frequency */}
      {contentAnalysis?.posting_frequency && (
        <div className="mt-4 text-sm text-brand-muted dark:text-brand-light">
          <p>📅 You've been posting <strong>{contentAnalysis.posting_frequency.posts_per_week}</strong> times per week, which is considered <strong>{contentAnalysis.posting_frequency.consistency}</strong> consistency.</p>
        </div>
      )}

      {/* Optimal Posting Times */}
      {contentAnalysis?.optimal_posting_times?.optimal_hours && contentAnalysis.optimal_posting_times.optimal_hours.length > 0 && (
        <div className="mt-2 text-sm text-brand-muted dark:text-brand-light">
          <p>⏰ Suggested best posting times (hours in UTC): <strong>
            {contentAnalysis.optimal_posting_times.optimal_hours.map((h: any) => h.hour).join(', ')}
          </strong></p>
        </div>
      )}

      {/* Engagement Analysis Section - Fixed to use contentAnalysis */}
      {contentAnalysis?.engagement_analysis && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white dark:bg-brand-carbon/60 rounded-xl p-6 shadow-md border border-brand-muted"
        >
          <h3 className="text-lg font-semibold mb-3 text-brand-void dark:text-brand-pure">
            📊 Engagement Overview
          </h3>

          {/* Tier Badge */}
          <p className="text-sm text-brand-muted dark:text-brand-light mb-2">
            Engagement rate: <strong>{contentAnalysis.engagement_analysis.engagement_rate}%</strong>{' '}
            <span className="ml-2 inline-block px-2 py-1 rounded-md text-xs font-medium bg-brand-frost/20 text-brand-frost">
              {getEngagementTier(contentAnalysis.engagement_analysis.engagement_rate)}
            </span>
          </p>

          {/* Alert if too low */}
          {contentAnalysis.engagement_analysis.engagement_rate < 1 && (
            <p className="text-sm text-red-600 font-semibold mb-3">
              ⚠️ Very low engagement! You should post more often, use better hashtags, and try Reels or Stories to boost interaction.
            </p>
          )}

          {/* Bar Chart */}
          {Array.isArray(contentAnalysis?.optimal_posting_times?.optimal_hours) && (
            <div className="mt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={contentAnalysis?.optimal_posting_times?.optimal_hours || []}
                  margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" label={{ value: 'Hour (UTC)', position: 'insideBottom', offset: -10 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      )}

      {/* Engagement Summary + Tier + Warnings - Fixed to use contentAnalysis */}
      {contentAnalysis?.engagement_analysis && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white dark:bg-brand-carbon/60 rounded-xl p-6 shadow-md border border-brand-muted"
        >
          <h3 className="text-lg font-semibold mb-3 text-brand-void dark:text-brand-pure">
            📊 Engagement Overview
          </h3>

          <p className="text-sm text-brand-muted dark:text-brand-light mb-2">
            Engagement rate: <strong>{contentAnalysis.engagement_analysis.engagement_rate}%</strong>
            <span className="ml-2 inline-block px-2 py-1 rounded-md text-xs font-medium bg-brand-frost/20 text-brand-frost">
              {getEngagementTier(contentAnalysis.engagement_analysis.engagement_rate)}
            </span>
          </p>

          {contentAnalysis.engagement_analysis.engagement_rate < 1 && (
            <p className="text-sm text-red-600 font-semibold mb-3">
              ⚠️ Very low engagement! Post more consistently, use trending audio, and try Reels to boost interaction.
            </p>
          )}

          {/* Weekly Frequency */}
          {contentAnalysis?.posting_frequency && (
            <div className="mt-3 text-sm text-brand-muted dark:text-brand-light">
              <p>
                📅 Posting frequency: <strong>{contentAnalysis.posting_frequency.posts_per_week}</strong> per week (
                <strong>{contentAnalysis.posting_frequency.consistency}</strong> consistency)
              </p>
            </div>
          )}

          {/* Optimal Hours Bar Chart */}
          {Array.isArray(contentAnalysis?.optimal_posting_times?.optimal_hours) && (
            <div className="mt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={contentAnalysis?.optimal_posting_times?.optimal_hours || []}
                  margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" label={{ value: 'Hour (UTC)', position: 'insideBottom', offset: -10 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      )}

      {/* Key Insights */}
      {keyInsights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand"
        >
          <h2 className="text-xl font-bold text-brand-void dark:text-brand-pure mb-6">Key AI Insights</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {keyInsights.map((insight, index) => {
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
      )}

      {/* AI Predictions */}
      {predictions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand"
        >
          <h2 className="text-xl font-bold text-brand-void dark:text-brand-pure mb-6">AI Predictions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {predictions.map((prediction, index) => (
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
      )}

      {/* Enhanced Content Analysis */}
      {contentAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand"
        >
          <h2 className="text-xl font-bold text-brand-void dark:text-brand-pure mb-6">
            Advanced Content Intelligence
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Best Performing Content */}
              <div>
                <h3 className="font-semibold text-brand-void dark:text-brand-pure mb-3 flex items-center gap-2">
                  <Video size={18} className="text-brand-lime" />
                  Top Content Category
                </h3>
                <div className="p-4 bg-gradient-to-r from-brand-lime/10 to-brand-lime/5 rounded-lg border border-brand-lime/20">
                  <div className="font-medium text-brand-void dark:text-brand-pure text-lg">
                    {contentAnalysis.bestPerforming}
                  </div>
                  <div className="text-sm text-brand-zinc dark:text-brand-frost mt-1">
                    Consistently drives highest engagement
                  </div>
                </div>
              </div>

              {/* Improvement Area */}
              {contentAnalysis.improvementArea && (
                <div>
                  <h3 className="font-semibold text-brand-void dark:text-brand-pure mb-3 flex items-center gap-2">
                    <Target size={18} className="text-brand-amber" />
                    Growth Opportunity
                  </h3>
                  <div className="p-4 bg-gradient-to-r from-brand-amber/10 to-brand-amber/5 rounded-lg border border-brand-amber/20">
                    <div className="font-medium text-brand-void dark:text-brand-pure">
                      {contentAnalysis.improvementArea}
                    </div>
                    <div className="text-sm text-brand-zinc dark:text-brand-frost mt-1">
                      Focus area for improved performance
                    </div>
                  </div>
                </div>
              )}

              {/* Optimal Frequency */}
              {contentAnalysis.optimalFrequency && (
                <div>
                  <h3 className="font-semibold text-brand-void dark:text-brand-pure mb-3 flex items-center gap-2">
                    <Calendar size={18} className="text-brand-electric" />
                    Optimal Posting Frequency
                  </h3>
                  <div className="p-4 bg-gradient-to-r from-brand-electric/10 to-brand-electric/5 rounded-lg border border-brand-electric/20">
                    <div className="font-medium text-brand-void dark:text-brand-pure text-lg">
                      {contentAnalysis.optimalFrequency}
                    </div>
                    <div className="text-sm text-brand-zinc dark:text-brand-frost mt-1">
                      Recommended posting schedule
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Engagement Patterns */}
              {contentAnalysis.engagementPatterns && (
                <div>
                  <h3 className="font-semibold text-brand-void dark:text-brand-pure mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-brand-electric" />
                    Optimal Timing
                  </h3>
                  
                  {/* Best Times */}
                  {contentAnalysis.engagementPatterns.bestTimes?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-brand-zinc dark:text-brand-frost mb-2">
                        🌟 Peak Engagement Hours
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {contentAnalysis.engagementPatterns.bestTimes.map((time, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-brand-lime/10 text-brand-lime text-sm font-medium rounded-full border border-brand-lime/20"
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Best Days */}
                  {contentAnalysis.engagementPatterns.bestDays?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-brand-zinc dark:text-brand-frost mb-2">
                        📅 High-Performance Days
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {contentAnalysis.engagementPatterns.bestDays.map((day, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-brand-electric/10 text-brand-electric text-sm font-medium rounded-full border border-brand-electric/20"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Worst Times - for learning */}
                  {contentAnalysis.engagementPatterns.worstTimes?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-brand-zinc dark:text-brand-frost mb-2">
                        ⚠️ Low-Engagement Periods
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {contentAnalysis.engagementPatterns.worstTimes.map((time, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400 text-sm font-medium rounded-full border border-error-200 dark:border-error-800"
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Top Hashtags */}
              {contentAnalysis.topHashtags?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-brand-void dark:text-brand-pure mb-3 flex items-center gap-2">
                    <Sparkles size={18} className="text-brand-neon" />
                    Top Performing Hashtags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {contentAnalysis.topHashtags.map((hashtag, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-2 bg-brand-neon/10 text-brand-neon text-sm font-medium rounded-lg border border-brand-neon/20 hover:bg-brand-neon/20 transition-colors cursor-pointer"
                      >
                        {hashtag.startsWith('#') ? hashtag : `#${hashtag}`}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-brand-zinc/60 dark:text-brand-frost/60">
                    Use these hashtags to maximize reach and engagement
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Enhanced Analysis Summary - Always Show */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-brand-electric/5 to-brand-neon/5 dark:from-brand-electric/10 dark:to-brand-neon/10 rounded-xl p-6 border border-brand-electric/20"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <BrainCircuit size={24} className="text-brand-electric" />
              <h3 className="text-xl font-bold text-brand-void dark:text-brand-pure">
                AI Analysis Dashboard
              </h3>
            </div>
            
            {/* Display AI Summary if available and not redundant */}
            {aiInsight.summary && (
              <div className="mb-6 p-4 bg-brand-pure/50 dark:bg-brand-carbon/30 rounded-lg border border-brand-frost/20 dark:border-brand-zinc/30">
                <p className="text-brand-void dark:text-brand-pure leading-relaxed text-sm">
                  {aiInsight.summary}
                </p>
              </div>
            )}
            
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-brand-pure/50 dark:bg-brand-carbon/30 rounded-lg text-center">
                <div className="text-2xl font-bold text-brand-electric">
                  {keyInsights.length}
                </div>
                <div className="text-sm text-brand-zinc dark:text-brand-frost">Key Insights</div>
              </div>
              <div className="p-4 bg-brand-pure/50 dark:bg-brand-carbon/30 rounded-lg text-center">
                <div className="text-2xl font-bold text-brand-electric">
                  {predictions.length}
                </div>
                <div className="text-sm text-brand-zinc dark:text-brand-frost">Predictions</div>
              </div>
              <div className="p-4 bg-brand-pure/50 dark:bg-brand-carbon/30 rounded-lg text-center">
                <div className="text-2xl font-bold text-brand-electric">
                  {performanceMetrics.length}
                </div>
                <div className="text-sm text-brand-zinc dark:text-brand-frost">Metrics</div>
              </div>
              <div className="p-4 bg-brand-pure/50 dark:bg-brand-carbon/30 rounded-lg text-center">
                <div className="text-2xl font-bold text-brand-electric">
                  {Math.round(aiInsight.confidence_score * 100)}%
                </div>
                <div className="text-sm text-brand-zinc dark:text-brand-frost">Confidence</div>
              </div>
            </div>

            {/* Dynamic Cards Based on Real AI Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Show Top AI Insight if available */}
              {keyInsights.length > 0 && (
                <div className={`p-4 rounded-lg border ${
                  keyInsights[0].impact === 'high' 
                    ? 'bg-brand-electric/10 border-brand-electric/20'
                    : keyInsights[0].impact === 'medium'
                    ? 'bg-brand-amber/10 border-brand-amber/20'
                    : 'bg-brand-lime/10 border-brand-lime/20'
                }`}>
                  <h4 className={`font-semibold mb-2 flex items-center gap-2 ${
                    keyInsights[0].impact === 'high' 
                      ? 'text-brand-electric'
                      : keyInsights[0].impact === 'medium'
                      ? 'text-brand-amber'
                      : 'text-brand-lime'
                  }`}>
                    {keyInsights[0].type === 'opportunity' ? (
                      <Lightbulb size={16} />
                    ) : keyInsights[0].type === 'warning' ? (
                      <AlertTriangle size={16} />
                    ) : (
                      <CheckCircle2 size={16} />
                    )}
                    {keyInsights[0].title}
                  </h4>
                  <p className="text-sm text-brand-zinc dark:text-brand-frost mb-2">
                    {keyInsights[0].description}
                  </p>
                  {keyInsights[0].recommendation && (
                    <p className="text-xs text-brand-void dark:text-brand-pure font-medium">
                      💡 {keyInsights[0].recommendation}
                    </p>
                  )}
                </div>
              )}

              {/* Show Performance Status */}
              {contentAnalysis?.engagement_analysis && (
                <div className={`p-4 rounded-lg border ${
                  contentAnalysis.engagement_analysis.engagement_rate < 1
                    ? 'bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-800'
                    : contentAnalysis.engagement_analysis.engagement_rate < 3
                    ? 'bg-brand-amber/10 border-brand-amber/20'
                    : 'bg-brand-lime/10 border-brand-lime/20'
                }`}>
                  <h4 className={`font-semibold mb-2 flex items-center gap-2 ${
                    contentAnalysis.engagement_analysis.engagement_rate < 1
                      ? 'text-error-600 dark:text-error-400'
                      : contentAnalysis.engagement_analysis.engagement_rate < 3
                      ? 'text-brand-amber'
                      : 'text-brand-lime'
                  }`}>
                    <Target size={16} />
                    Engagement Analysis
                  </h4>
                  <p className="text-sm text-brand-zinc dark:text-brand-frost mb-2">
                    Current rate: <strong>{contentAnalysis.engagement_analysis.engagement_rate}%</strong>
                  </p>
                  <p className="text-xs text-brand-void dark:text-brand-pure">
                    {getEngagementTier(contentAnalysis.engagement_analysis.engagement_rate)} performance level
                  </p>
                </div>
              )}

              {/* Fallback cards if no specific data */}
              {keyInsights.length === 0 && !contentAnalysis?.engagement_analysis && (
                <>
                  <div className="p-4 bg-brand-frost/10 dark:bg-brand-zinc/10 rounded-lg border border-brand-frost/20 dark:border-brand-zinc/30">
                    <h4 className="font-semibold text-brand-void dark:text-brand-pure mb-2 flex items-center gap-2">
                      <BrainCircuit size={16} className="text-brand-electric" />
                      Analysis Complete
                    </h4>
                    <p className="text-sm text-brand-zinc dark:text-brand-frost">
                      AI has processed your social media data with {Math.round(aiInsight.confidence_score * 100)}% confidence.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-brand-electric/10 rounded-lg border border-brand-electric/20">
                    <h4 className="font-semibold text-brand-electric mb-2 flex items-center gap-2">
                      <Sparkles size={16} />
                      Ready for Insights
                    </h4>
                    <p className="text-sm text-brand-zinc dark:text-brand-frost">
                      More detailed insights will appear as your content data grows.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* AI Recommendations from contentAnalysis */}
            {contentAnalysis?.recommendations && contentAnalysis.recommendations.length > 0 && (
              <div className="mt-6 p-4 bg-brand-lime/5 dark:bg-brand-lime/10 rounded-lg border border-brand-lime/20">
                <h4 className="font-semibold text-brand-void dark:text-brand-pure text-sm mb-3 flex items-center gap-2">
                  <Sparkles size={16} className="text-brand-lime" />
                  AI Recommendations ({contentAnalysis.recommendations.length})
                </h4>
                <div className="space-y-2 text-sm text-brand-zinc dark:text-brand-frost">
                  {contentAnalysis.recommendations.slice(0, 3).map((rec: string, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-brand-lime mt-1 text-xs">▶</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                  {contentAnalysis.recommendations.length > 3 && (
                    <p className="text-xs text-brand-zinc/60 dark:text-brand-frost/60 mt-2">
                      +{contentAnalysis.recommendations.length - 3} more recommendations available
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 min-w-[200px]">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-electric text-brand-pure rounded-lg hover:bg-brand-neon transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Analyzing...' : 'Refresh Analysis'}
            </button>
            
            <button
              onClick={() => {
                const dataToExport = {
                  score: overallScore,
                  trend: weeklyTrend,
                  summary: aiInsight.summary,
                  confidence: aiInsight.confidence_score * 100,
                  insights: keyInsights,
                  predictions: predictions,
                  metrics: performanceMetrics,
                  contentAnalysis: contentAnalysis,
                  generatedAt: new Date().toISOString(),
                  exportedAt: new Date().toLocaleString()
                };
                
                const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
                  type: 'application/json'
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ai-insights-report-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-pure dark:bg-brand-carbon border border-brand-frost/30 dark:border-brand-zinc/40 text-brand-void dark:text-brand-pure rounded-lg hover:bg-brand-frost/10 dark:hover:bg-brand-zinc/10 transition-all duration-200"
            >
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Insights;