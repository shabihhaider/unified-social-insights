import axios from '../utils/axios';

export const socialAccountsAPI = {
  // Get all connected accounts
  async getAccounts() {
    try {
      const response = await axios.get('/api/social-accounts');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch accounts');
    }
  },

  // Connect new account
  async connectAccount(platform, accessToken, pageData) {
    try {
      const response = await axios.post('/api/social-accounts', {
        platform,
        accessToken,
        pageData
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to connect account');
    }
  },

  // Toggle account active status
  async toggleAccount(accountId, isActive) {
    try {
      const response = await axios.put(`/api/social-accounts/${accountId}/toggle`, {
        isActive
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to toggle account');
    }
  },

  // Refresh account data
  async refreshAccount(accountId) {
    try {
      const response = await axios.post(`/api/social-accounts/${accountId}/refresh`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to refresh account');
    }
  },

  // Delete account
  async deleteAccount(accountId) {
    try {
      const response = await axios.delete(`/api/social-accounts/${accountId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete account');
    }
  },

  // Initiate Facebook OAuth
  async initiateFacebookAuth() {
    const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.REACT_APP_FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(process.env.REACT_APP_FACEBOOK_REDIRECT_URI)}&scope=pages_show_list,pages_read_engagement,instagram_basic&response_type=code`;
    window.location.href = facebookAuthUrl;
  },

  // Initiate Instagram OAuth (through Facebook)
  async initiateInstagramAuth() {
    // Instagram Business accounts are managed through Facebook
    this.initiateFacebookAuth();
  }
};

export default socialAccountsAPI;