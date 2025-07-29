// backend/src/models/SocialAccount.js
const BaseModel = require('./BaseModel');

class SocialAccount extends BaseModel {
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

    await this.query(query);
    console.log('✅ SocialAccounts table ensured');
  }

  static async create(data) {
    const {
      user_id, platform, platform_account_id, username, display_name,
      profile_image_url, access_token, refresh_token, token_expires_at,
      account_type, followers_count, permissions, metadata
    } = data;

    const query = `
      INSERT INTO social_accounts (
        user_id, platform, platform_account_id, username, display_name,
        profile_image_url, access_token, refresh_token, token_expires_at,
        account_type, followers_count, permissions, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
      RETURNING *
    `;

    const values = [
      user_id, platform, platform_account_id, username, display_name,
      profile_image_url, access_token, refresh_token, token_expires_at,
      account_type || 'business', followers_count || 0,
      JSON.stringify(permissions || []), JSON.stringify(metadata || {})
    ];

    try {
      const result = await this.query(query, values);
      return this.formatAccount(result.rows[0]);
    } catch (error) {
      if (error.code === '23505') throw new Error('Account already connected');
      throw error;
    }
  }

  static async findByUserId(userId) {
    const result = await this.query(
      'SELECT * FROM social_accounts WHERE user_id = $1 AND is_active = true ORDER BY created_at DESC',
      [userId]
    );
    return result.rows.map(row => this.formatAccount(row));
  }

  static async findById(id) {
    const result = await this.query('SELECT * FROM social_accounts WHERE id = $1', [id]);
    return result.rows.length ? this.formatAccount(result.rows[0]) : null;
  }

  static async updateSyncStatus(id, status, lastSyncAt = new Date()) {
    const result = await this.query(`
      UPDATE social_accounts
      SET sync_status = $1, last_sync_at = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 RETURNING *
    `, [status, lastSyncAt, id]);

    return result.rows.length ? this.formatAccount(result.rows[0]) : null;
  }

  static async updateMetrics(id, metrics) {
    const current = await this.findById(id);
    if (!current) throw new Error('Account not found');

    const updatedMetadata = { ...current.metadata, ...metrics };

    const result = await this.query(`
      UPDATE social_accounts
      SET followers_count = $1, metadata = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 RETURNING *
    `, [
      metrics.followers_count || current.followers_count,
      JSON.stringify(updatedMetadata),
      id
    ]);

    return this.formatAccount(result.rows[0]);
  }

  static async delete(id) {
    const result = await this.query('DELETE FROM social_accounts WHERE id = $1 RETURNING *', [id]);
    return result.rows.length ? this.formatAccount(result.rows[0]) : null;
  }

  static formatAccount(row) {
    return {
      ...row,
      permissions: this.parseJSON(row.permissions),
      metadata: this.parseJSON(row.metadata),
    };
  }

  static async findAllActiveAccounts() {
    const result = await this.query(`
        SELECT * FROM social_accounts
        WHERE is_active = true
    `);
    return result.rows;
    }
}

module.exports = SocialAccount;