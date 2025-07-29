// src/services/aiInsights.ts
import axios from '../utils/axios';

export interface AIInsight {
  id: string;
  account_id: string;
  summary: string;
  insights: {
    overallScore?: number;
    weeklyTrend?: string;
    keyInsights?: Array<{
      type: string;
      title: string;
      description: string;
      impact: string;
      metric: string;
      icon?: string;
      actionable: boolean;
      recommendation?: string;
    }>;
    contentAnalysis?: {
        bestPerforming: string;
        improvementArea: string;
        optimalFrequency: string;
        topHashtags: string[];
        engagementPatterns: {
            bestDays: string[];
            bestTimes: string[];
            worstTimes: string[];
        };
        recommendations?: string[];
        engagement_analysis?: {
            engagement_rate: number;
        };
        posting_frequency?: {
            posts_per_week: number;
            consistency: string;
        };
        optimal_posting_times?: {
            optimal_hours: Array<{
            hour: number;
            count: number;
            }>;
        };
    };
    predictions?: Array<{
      title: string;
      description: string;
      confidence: number;
      timeframe: string;
      type: string;
    }>;
    performanceMetrics?: Array<{
      metric: string;
      current: number;
      previous: number;
      trend: string;
      target: number;
      unit: string;
    }>;
  };
  confidence_score: number;
  processing_time?: number;
  created_at: string;
  updated_at: string;
  status: string;
  age?: string;
}

export interface InsightStatus {
  status: 'success' | 'syncing' | 'error' | 'pending' | 'not_found';
  has_insights: boolean;
  last_sync?: string;
  insight_age?: string;
  needs_refresh: boolean;
}

export interface BatchProcessResult {
  success: boolean;
  processed: number;
  successful: number;
  failed: number;
  results: Array<{
    accountId: string;
    success: boolean;
    error?: string;
  }>;
}

export const aiInsightsAPI = {
  async getInsightByAccountId(accountId: string): Promise<AIInsight | null> {
    try {
      interface InsightResponse {
        success: boolean;
        data?: AIInsight;
        message?: string;
        status?: string;
        account_id?: string;
      }
      
      const response = await axios.get<InsightResponse>(`/api/ai-insights/${accountId}`);
      
      if (response.data?.success && isValidInsight(response.data.data)) {
        return response.data.data || null;
      } else if (response.data?.status === 'processing') {
        // Handle processing state
        console.log('Insights are being generated...');
        return null;
      } else {
        console.log('No insights available:', response.data?.message);
        return null;
      }
    } catch (error: any) {
      console.error('Error fetching AI insights:', error);
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async getInsightStatus(accountId: string): Promise<InsightStatus | null> {
    try {
      interface StatusResponse {
        success: boolean;
        data: InsightStatus;
      }
      
      const response = await axios.get<StatusResponse>(`/api/ai-insights/${accountId}/status`);
      return response.data?.success ? response.data.data : null;
    } catch (error) {
      console.error('Error fetching insight status:', error);
      return null;
    }
  },

  async triggerInsightGeneration(accountId: string, forceRefresh = false): Promise<AIInsight | null> {
    try {
      interface GenerateResponse {
        success: boolean;
        data?: AIInsight;
        message: string;
        status?: string;
      }
      
      const response = await axios.post<GenerateResponse>(
        `/api/ai-insights/${accountId}/generate`,
        { force_refresh: forceRefresh }
        );
      
      return response.data?.success && response.data.data ? response.data.data : null;
    } catch (error) {
      console.error('Error generating insights:', error);
      throw error;
    }
  },

  async getUserInsights(limit = 10): Promise<AIInsight[]> {
    try {
      interface UserInsightsResponse {
        success: boolean;
        data: AIInsight[];
        count: number;
      }
      
      const response = await axios.get<UserInsightsResponse>(`/api/ai-insights/user?limit=${limit}`);
      return response.data?.success ? response.data.data : [];
    } catch (error) {
      console.error('Error fetching user insights:', error);
      return [];
    }
  },

  async batchProcessInsights(accountIds: string[], forceRefresh = false): Promise<BatchProcessResult | null> {
    try {
      interface BatchResponse {
        success: boolean;
        data: BatchProcessResult;
        message: string;
      }
      
      const response = await axios.post<BatchResponse>('/api/ai-insights/batch-process', {
        account_ids: accountIds,
        force_refresh: forceRefresh
        });
      
      return response.data?.success ? response.data.data : null;
    } catch (error) {
      console.error('Error batch processing insights:', error);
      throw error;
    }
  },

  async getSystemHealth(): Promise<any> {
    try {
      const response = await axios.get('/api/ai-insights/health');
      return response.data;
    } catch (error) {
      console.error('Error checking system health:', error);
      throw error;
    }
  }
};

function isValidInsight(data: any): data is AIInsight {
  return data && typeof data.id === 'string' && typeof data.summary === 'string';
}