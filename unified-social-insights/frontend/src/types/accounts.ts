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
