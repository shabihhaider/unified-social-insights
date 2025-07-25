import axios from '../utils/axios';

interface ApiError {
  response?: {
    status: number;
    data?: {
      error?: string;
      code?: string;
    };
  };
  code?: string;
  message: string;
}

// Add helper function to extract error message
const extractErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  if (typeof error === 'object' && error?.message) {
    return error.message;
  }
  return 'Unknown error occurred';
};

// Add response type interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SocialAccount {
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
  permissions: string[];
  connectedAt: string;
  metrics: {
    posts: number;
    engagement: number;
    reach: number;
  };
}

export interface GetAccountsResponse extends ApiResponse {
  accounts: SocialAccount[];
}

export interface AnalyticsSummary {
  totalFollowers: number;
  totalEngagement?: number;
  totalImpressions?: number;
  totalViews?: number;
  totalVideoViews?: number;
  profileViews?: number;
  websiteClicks?: number;
  accountsEngaged?: number;
  totalPosts: number;
  fansChange?: number; // Made optional since it's not always available
  engagementRate?: number;
  totalReach?: number;
}
export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface PostInsight {
  id: string;
  message: string;
  date: string;
  insights: Record<string, number>;
}

export interface Demographics {
  countries: Record<string, number>;
  gender_age?: Record<string, number>; // Made optional since it might not always be present
  cities?: Record<string, number>;     // Made optional since it might not always be present
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  chartData: Record<string, ChartDataPoint[]>;
  topPosts: PostInsight[];
  demographics: Demographics;
  pageInfo?: PageInfo;      // Facebook specific
  accountInfo?: AccountInfo; // Instagram specific
}

export interface GetAnalyticsResponse extends ApiResponse {
  data: AnalyticsData;
}

export interface FacebookCallbackResponse extends ApiResponse {
  data?: {
    accountsConnected: number;
    accounts: Array<{
      platform: 'facebook' | 'instagram';
      name: string;
      username?: string;
      id: string;
      followers: number;
    }>;
    summary: {
      facebook: number;
      instagram: number;
    };
  };
}

export interface PageInfo {
  name: string;
  about?: string;
  category?: string;
  location?: any;
  cover?: string;
}

export interface AccountInfo {
  username: string;
  name: string;
  profile_picture?: string;
  followers_count: number;
  media_count: number;
}

// Input validation helpers
const validateAccountId = (accountId: string): boolean => {
  return typeof accountId === 'string' && accountId.trim().length > 0;
};

const validateAuthParams = (platform: string, accessToken: string): boolean => {
  return typeof platform === 'string' && platform.trim().length > 0 && 
         typeof accessToken === 'string' && accessToken.trim().length > 0;
};

export const retryRequest = async <T>(
  requestFn: () => Promise<T>, 
  maxRetries: number = 2,
  delay: number = 1000
): Promise<T> => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error: any) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Only retry on network errors or 5xx server errors
      if (!error.response || error.response.status >= 500) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
        continue;
      }
      
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
};

export const socialAccountsAPI = {
  // Get all connected accounts
    async getAccounts(): Promise<GetAccountsResponse> {
    try {
        const response = await axios.get<GetAccountsResponse>('/api/social-accounts');
        
        // Validate response structure
        if (!response.data) {
        return { success: true, accounts: [] };
        }
        
        // Handle different response formats
        if ('accounts' in response.data && Array.isArray(response.data.accounts)) {
        return response.data;
        }
        
        // If response.data is an array directly
        if (Array.isArray(response.data)) {
        return { success: true, accounts: response.data };
        }
        
        // Default fallback
        return { success: true, accounts: [] };
    } catch (error) {
        const apiError = error as ApiError;
        console.error('Failed to fetch social accounts:', apiError);
        
        // For development/network errors, return empty state instead of throwing
        if (!apiError.response) {
        return { success: true, accounts: [] };
        }
        
        return {
        success: false,
        error: extractErrorMessage(apiError.response?.data?.error) || 'Failed to fetch accounts',
        accounts: []
        };
    }
    },

  // Connect new account
    async connectAccount(platform: string, accessToken: string, pageData: any): Promise<ApiResponse> {
        try {
            if (!validateAuthParams(platform, accessToken)) {
            return {
                success: false,
                error: 'Platform and access token are required'
            };
            }

            const response = await retryRequest(async () => {
            const axiosResponse = await axios.post<ApiResponse>('/api/social-accounts', {
                platform: platform.trim(),
                accessToken: accessToken.trim(),
                pageData
            });
            return axiosResponse.data;
            });
            
            return response;
        } catch (error) {
            const apiError = error as ApiError;
            
            if (apiError.response?.status === 409) {
            return {
                success: false,
                error: 'This account is already connected'
            };
            }
            
            return {
            success: false,
            error: extractErrorMessage(apiError.response?.data?.error) || 'Failed to connect account'
            };
        }
        },

  // Toggle account active status
  async toggleAccount(accountId: string, isActive: boolean): Promise<ApiResponse> {
    
    // Add this validation at the start of each method
    if (!validateAccountId(accountId)) {
    return {
        success: false,
        error: 'Valid account ID is required'
    };
    }

    try {
      const response = await axios.put<ApiResponse>(`/api/social-accounts/${accountId}/toggle`, {
        isActive
      });
      return response.data;
    } catch (error) {
  const apiError = error as ApiError;
  return {
    success: false,
    error: extractErrorMessage(apiError.response?.data?.error) || 'Failed to toggle account'
  };
}
  },

  // Refresh account data
  async refreshAccount(accountId: string): Promise<ApiResponse> {
    // Add this validation at the start of each method
if (!validateAccountId(accountId)) {
  return {
    success: false,
    error: 'Valid account ID is required'
  };
}
    try {
      const response = await axios.post<ApiResponse>(`/api/social-accounts/${accountId}/refresh`);
      return response.data;
    } catch (error) {
  const apiError = error as ApiError;
  return {
    success: false,
    error: extractErrorMessage(apiError.response?.data?.error) || 'Failed to refresh account'
  };
}
  },

  // Delete account
  async deleteAccount(accountId: string): Promise<ApiResponse> {
    // Add this validation at the start of each method
if (!validateAccountId(accountId)) {
  return {
    success: false,
    error: 'Valid account ID is required'
  };
}
    try {
      const response = await axios.delete<ApiResponse>(`/api/social-accounts/${accountId}`);
      return response.data;
    } catch (error) {
  const apiError = error as ApiError;
  return {
    success: false,
    error: extractErrorMessage(apiError.response?.data?.error) || 'Failed to delete account'
  };
}
  },

  // Initiate Facebook OAuth
  async initiateFacebookAuth(): Promise<void> {
    const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID;
    const redirectUri = process.env.REACT_APP_FACEBOOK_REDIRECT_URI;
    
    if (!facebookAppId || !redirectUri) {
        throw new Error('Facebook OAuth configuration missing. Please check your environment variables.');
    }

    // Validate the redirect URI format
    try {
        new URL(redirectUri);
    } catch {
        throw new Error('Invalid redirect URI format in configuration');
    }

    const scope = [
        'pages_show_list',
        'pages_read_engagement', 
        'pages_read_user_content',
        'instagram_basic',
        'instagram_manage_insights'
    ].join(',');

    const facebookAuthUrl = `https://www.facebook.com/v23.0/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code&state=${Date.now()}`;
    
    window.location.href = facebookAuthUrl;
    },

  // Initiate Instagram OAuth (through Facebook)
  async initiateInstagramAuth(): Promise<void> {
    // Instagram Business accounts are managed through Facebook
    await this.initiateFacebookAuth();
    },

  // Handle Facebook OAuth callback
    async handleFacebookCallback(code: string): Promise<ApiResponse<{ accountsConnected: number; accounts: any[] }>> {
        if (!code || typeof code !== 'string' || code.trim().length === 0) {
            return {
            success: false,
            error: 'Authorization code is required'
            };
        }

        try {
            const response = await retryRequest(async () => {
            const axiosResponse = await axios.post<ApiResponse<{ accountsConnected: number; accounts: any[]; summary: any }>>('/api/auth/facebook/callback', {
                code: code.trim()
            });
            return axiosResponse.data;
            });

            return response;
        } catch (error) {
            const apiError = error as ApiError;
            console.error('Facebook callback error:', apiError);
            
            if (apiError.response?.data?.code === 'INVALID_TOKEN') {
            return {
                success: false,
                error: 'Invalid authorization code. Please try connecting again.'
            };
            }
            
            if (apiError.response?.data?.code === 'INSUFFICIENT_PERMISSIONS') {
            return {
                success: false,
                error: 'Insufficient permissions granted. Please allow all requested permissions.'
            };
            }

            return {
  success: false,
  error: extractErrorMessage(apiError.response?.data?.error) || 'Failed to connect Facebook account'
};
        }
        },

  // Fetch analytics for a given social account
  async getAccountAnalytics(accountId: string, params: any = {}): Promise<GetAnalyticsResponse> {
    // Add this validation at the start of each method
    if (!validateAccountId(accountId)) {
        return {
        success: false,
        error: 'Valid account ID is required'
        } as GetAnalyticsResponse;
    }

    try {
        
        const response = await axios.get<GetAnalyticsResponse>(`/api/social-accounts/${accountId}/analytics`, { 
        params,
        timeout: 30000 // 30 second timeout for analytics requests
        });

        // Validate response structure
        if(!response.data || !response.data.success) {
          return {
            success: false,
            error: response.data?.error || 'Analytics data fetch failed'
          } as GetAnalyticsResponse;
        }

        return response.data;
    } catch (error: any) {
        console.error('Analytics API Error:', error);

        // Handle specific error cases
        if (error.code === 'ECONNABORTED') {
        return {
            success: false,
            error: 'Request timeout - analytics data is taking too long to load'
        } as GetAnalyticsResponse;
        }

        if (error.response?.status === 404) {
        return {
            success: false,
            error: 'Account not found or you do not have access to it'
        } as GetAnalyticsResponse;
        }

        if (error.response?.status === 403) {
        return {
            success: false,
            error: 'Access token expired or insufficient permissions'
        } as GetAnalyticsResponse;
        }

        let serverMessage = extractErrorMessage(error?.response?.data?.error);

        // // Facebook Graph API errors sometimes come as objects with `message`
        // if (typeof serverMessage === 'object' && serverMessage?.message) {
        //   serverMessage = serverMessage.message;
        // }

        return {
        success: false,
        error: serverMessage || 'Failed to fetch analytics'
        } as GetAnalyticsResponse;
    }
    },
    
  async checkAccountStatus(accountId: string): Promise<ApiResponse<{ isConnected: boolean; lastSync: string; status: string }>> {
    if (!validateAccountId(accountId)) {
        return {
        success: false,
        error: 'Valid account ID is required'
        };
    }
    
    try {
        const accounts = await this.getAccounts();
        const account = accounts.accounts?.find(acc => acc.id === accountId);
        
        if (!account) {
        return {
            success: false,
            error: 'Account not found'
        };
        }
        
        return {
        success: true,
        data: {
            isConnected: account.isActive,
            lastSync: account.lastSync,
            status: account.syncStatus
        }
        };
    } catch (error) {
        const apiError = error as ApiError;
        return {
        success: false,
        error: apiError.message || 'Failed to check account status'
        };
    }
    }
};

export default socialAccountsAPI;
