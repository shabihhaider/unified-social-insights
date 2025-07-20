const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class SocialAccount {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS social_accounts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        platform VARCHAR(20) NOT NULL CHECK (platform IN ('instagram', 'facebook')),
        platform_account_id VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        display_name VARCHAR(255),
        profile_image_url TEXT,
        access_token TEXT NOT NULL,
        refresh_token TEXT,
        token_expires_at TIMESTAMP,
        account_type VARCHAR(50) DEFAULT 'business',
        followers_count INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        permissions JSONB DEFAULT '[]'::jsonb,
        last_sync_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        sync_status VARCHAR(20) DEFAULT 'success' CHECK (sync_status IN ('success', 'error', 'syncing', 'pending')),
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, platform, platform_account_id)
      );
      
      CREATE INDEX IF NOT EXISTS idx_social_accounts_user_id ON social_accounts(user_id);
      CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_accounts(platform);
      CREATE INDEX IF NOT EXISTS idx_social_accounts_active ON social_accounts(user_id, is_active);
    `;
    
    try {
      await pool.query(query);
      console.log('✅ SocialAccounts table created successfully');
    } catch (error) {
      console.error('❌ Error creating social_accounts table:', error);
      throw error;
    }
  }

  static async create(accountData) {
    const {
      user_id,
      platform,
      platform_account_id,
      username,
      display_name,
      profile_image_url,
      access_token,
      refresh_token,
      token_expires_at,
      account_type,
      followers_count,
      permissions,
      metadata
    } = accountData;

    const query = `
      INSERT INTO social_accounts (
        user_id, platform, platform_account_id, username, display_name,
        profile_image_url, access_token, refresh_token, token_expires_at,
        account_type, followers_count, permissions, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const values = [
      user_id, platform, platform_account_id, username, display_name,
      profile_image_url, access_token, refresh_token, token_expires_at,
      account_type, followers_count, JSON.stringify(permissions || []),
      JSON.stringify(metadata || {})
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('Account already connected');
      }
      throw error;
    }
  }

  static async findByUserId(userId) {
    const query = `
      SELECT * FROM social_accounts 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      return result.rows.map(row => ({
        ...row,
        permissions: typeof row.permissions === 'string' ? JSON.parse(row.permissions) : row.permissions,
        metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata
      }));
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    const query = 'SELECT * FROM social_accounts WHERE id = $1';
    
    try {
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) return null;
      
      const row = result.rows[0];
      return {
        ...row,
        permissions: typeof row.permissions === 'string' ? JSON.parse(row.permissions) : row.permissions,
        metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata
      };
    } catch (error) {
      throw error;
    }
  }

  static async updateSyncStatus(id, status, lastSyncAt = new Date()) {
    const query = `
      UPDATE social_accounts 
      SET sync_status = $1, last_sync_at = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [status, lastSyncAt, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateActiveStatus(id, isActive) {
    const query = `
      UPDATE social_accounts 
      SET is_active = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [isActive, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM social_accounts WHERE id = $1 RETURNING *';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateMetrics(id, metrics) {
    const query = `
      UPDATE social_accounts 
      SET followers_count = $1, metadata = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    
    try {
      const currentAccount = await this.findById(id);
      const updatedMetadata = { ...currentAccount.metadata, ...metrics };
      
      const result = await pool.query(query, [
        metrics.followers_count || currentAccount.followers_count,
        JSON.stringify(updatedMetadata),
        id
      ]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

    static async findByUserIdAndPlatformAccountId(userId, platform, platform_account_id) {
        const result = await pool.query(
            `SELECT * FROM social_accounts WHERE user_id = $1 AND platform = $2 AND platform_account_id = $3`,
            [userId, platform, platform_account_id]
        );
        return result.rows[0] || null;
    }
}

module.exports = SocialAccount;