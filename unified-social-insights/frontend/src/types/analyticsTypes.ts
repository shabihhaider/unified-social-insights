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

export interface AnalyticsData {
  summary: {
    totalFollowers: number;
    totalEngagement: number;
    totalImpressions: number;
    totalViews: number;
    totalVideoViews?: number;    // Not always present, add as optional
    totalPosts: number;
    fansChange: number;
    engagementRate?: number;     // Sometimes calculated in frontend
    totalReach?: number;         // Instagram
    websiteClicks?: number;      // Instagram
    accountsEngaged?: number;    // Instagram
    profileViews?: number;       // Instagram
  };
  chartData: Record<string, Array<{ date: string; value: number }>>;
  topPosts: Array<{
    id: string;
    // Facebook: message, picture, permalink, engagement
    // Instagram: caption, url, permalink, likes, comments, type
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
    platform?: string; // Add to use in PostCard
  }>;
  demographics: {
    countries: Record<string, number>;
    gender_age: Record<string, number>;
    cities?: Record<string, number>;
  };
  pageInfo?: PageInfo;           // Facebook
  accountInfo?: AccountInfo;     // Instagram
  warning?: string;
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
}

export interface AccountAnalytics {
  accountId: string;
  data: AnalyticsData | null;
  error: string | null;
  isLoading: boolean;
  lastUpdated: Date | null;
}