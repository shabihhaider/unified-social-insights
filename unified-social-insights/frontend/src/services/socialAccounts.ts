import axios from '../utils/axios';

// Add response type interfaces
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
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
  permissions: string[];
  connectedAt: string;
  metrics: {
    posts: number;
    engagement: number;
    reach: number;
  };
}

interface GetAccountsResponse extends ApiResponse {
  accounts: SocialAccount[];
}

export const socialAccountsAPI = {
  // Get all connected accounts
  // Get all connected accounts
async getAccounts(): Promise<GetAccountsResponse> {
  try {
    const response = await axios.get<GetAccountsResponse>('/api/social-accounts');
    
    // Check if response.data exists and has the expected structure
    if (!response.data) {
      return {
        success: true,
        accounts: []
      };
    }
    
    // If response.data is already in the correct format
    if (response.data.accounts !== undefined) {
      return response.data;
    }
    
    // If response.data is an array directly
    if (Array.isArray(response.data)) {
      return {
        success: true,
        accounts: response.data
      };
    }
    
    // Default fallback
    return {
      success: true,
      accounts: []
    };
  } catch (error: any) {
    console.error('API Error:', error);
    
    // Check if it's a network error (server not running)
    if (!error.response) {
      return {
        success: true,
        accounts: [] // Return empty accounts instead of throwing error
      };
    }
    
    throw new Error(error.response?.data?.error || 'Failed to fetch accounts');
  }
},

  // Connect new account
  async connectAccount(platform: string, accessToken: string, pageData: any): Promise<ApiResponse> {
    try {
      const response = await axios.post<ApiResponse>('/api/social-accounts', {
        platform,
        accessToken,
        pageData
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to connect account');
    }
  },

  // Toggle account active status
  async toggleAccount(accountId: string, isActive: boolean): Promise<ApiResponse> {
    try {
      const response = await axios.put<ApiResponse>(`/api/social-accounts/${accountId}/toggle`, {
        isActive
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to toggle account');
    }
  },

  // Refresh account data
  async refreshAccount(accountId: string): Promise<ApiResponse> {
    try {
      const response = await axios.post<ApiResponse>(`/api/social-accounts/${accountId}/refresh`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to refresh account');
    }
  },

  // Delete account
  async deleteAccount(accountId: string): Promise<ApiResponse> {
    try {
      const response = await axios.delete<ApiResponse>(`/api/social-accounts/${accountId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete account');
    }
  },

  // Initiate Facebook OAuth
  async initiateFacebookAuth(): Promise<void> {
    const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID;
    const redirectUri = process.env.REACT_APP_FACEBOOK_REDIRECT_URI;
    
    if (!facebookAppId || !redirectUri) {
      throw new Error('Facebook OAuth configuration missing');
    }

    const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=pages_show_list,pages_read_engagement,instagram_basic&response_type=code`;
    window.location.href = facebookAuthUrl;
  },

  // Initiate Instagram OAuth (through Facebook)
  async initiateInstagramAuth(): Promise<void> {
    // Instagram Business accounts are managed through Facebook
    this.initiateFacebookAuth();
  }
};

export default socialAccountsAPI;