// backend/src/models/AIInsight.js
const BaseModel = require('./BaseModel');

class AIInsight extends BaseModel {
  static async createTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS ai_insights (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        account_id UUID NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
        platform VARCHAR(20) NOT NULL CHECK (platform IN ('instagram', 'facebook')),
        insights JSONB NOT NULL DEFAULT '{}',
        summary TEXT,
        confidence_score DECIMAL(3,2) DEFAULT 0.80,
        processing_time DECIMAL(8,3),
        token_usage INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(account_id)
        );

        CREATE INDEX IF NOT EXISTS idx_ai_insights_account_id ON ai_insights(account_id);
        CREATE INDEX IF NOT EXISTS idx_ai_insights_user_id ON ai_insights(user_id);
        CREATE INDEX IF NOT EXISTS idx_ai_insights_created_at ON ai_insights(created_at);
    `;

    await this.query(query);
    console.log('✅ AIInsights table ensured');
    }

  static async upsert({ userId, accountId, platform, insights, summary, confidence_score, processing_time, token_usage }) {
    
    const userExists = await this.query(`SELECT 1 FROM users WHERE id = $1 LIMIT 1`, [userId]);
    if (userExists.rowCount === 0) {
      throw new Error(`AIInsight upsert failed: user_id ${userId} does not exist`);
    }
    
    const query = `
        INSERT INTO ai_insights (
            user_id, account_id, platform, "insights", "summary", 
            confidence_score, processing_time, token_usage, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
        ON CONFLICT (account_id) 
        DO UPDATE SET
            "insights" = EXCLUDED."insights",
            "summary" = EXCLUDED."summary",
            confidence_score = EXCLUDED.confidence_score,
            processing_time = EXCLUDED.processing_time,
            token_usage = EXCLUDED.token_usage,
            updated_at = CURRENT_TIMESTAMP
        RETURNING *
    `;

    const values = [
      userId, accountId, platform, 
      JSON.stringify(insights), summary,
      confidence_score || 0.80, processing_time || 0, token_usage || 0
    ];

    const result = await this.query(query, values);
    return this.formatInsight(result.rows[0]);
  }

  static async getByAccountId(accountId) {
    const result = await this.query(
      'SELECT * FROM ai_insights WHERE account_id = $1 ORDER BY created_at DESC LIMIT 1',
      [accountId]
    );
    return result.rows.length ? this.formatInsight(result.rows[0]) : null;
  }

  static async getByUserId(userId, limit = 10) {
    const result = await this.query(`
      SELECT ai.*, sa.username, sa.platform 
      FROM ai_insights ai
      JOIN social_accounts sa ON ai.account_id = sa.id
      WHERE ai.user_id = $1 AND ai.status = 'active'
      ORDER BY ai.created_at DESC
      LIMIT $2
    `, [userId, limit]);

    return result.rows.map(row => this.formatInsight(row));
  }

  static async getInsightsHistory(accountId, days = 30) {
    const result = await this.query(`
      SELECT * FROM ai_insights
      WHERE account_id = $1 
      AND created_at >= CURRENT_TIMESTAMP - INTERVAL '${days} days'
      ORDER BY created_at DESC
    `, [accountId]);

    return result.rows.map(row => this.formatInsight(row));
  }

  static formatInsight(row) {
    return {
      ...row,
      insights: this.parseJSON(row.insights),
    };
  }

  static async deleteByAccountId(accountId) {
      const result = await this.query(
        'DELETE FROM ai_insights WHERE account_id = $1 RETURNING *',
        [accountId]
      );
      return result.rows.length > 0;
  }

  static async findAccountsNeedingInsights() {
    const query = `
        SELECT sa.* FROM social_accounts sa
        LEFT JOIN ai_insights ai ON sa.id = ai.account_id
        WHERE sa.status = 'active' 
        AND (
        ai.id IS NULL 
        OR ai.updated_at < CURRENT_TIMESTAMP - INTERVAL '24 hours'
        )
        ORDER BY sa.updated_at DESC
        LIMIT 10
    `;
    const result = await this.query(query);
    return result.rows;
  }

  // Add this method to the AIInsight class
  static async getInsightsByDateRange(userId, startDate, endDate) {
    const result = await this.query(`
        SELECT ai.*, sa.username, sa.platform 
        FROM ai_insights ai
        JOIN social_accounts sa ON ai.account_id = sa.id
        WHERE ai.user_id = $1 
        AND ai.created_at BETWEEN $2 AND $3
        AND ai.status = 'active'
        ORDER BY ai.created_at DESC
    `, [userId, startDate, endDate]);

    return result.rows.map(row => this.formatInsight(row));
    }

    static async updateInsightStatus(accountId, status) {
    const result = await this.query(
        'UPDATE ai_insights SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE account_id = $2 RETURNING *',
        [status, accountId]
    );
    return result.rows.length ? this.formatInsight(result.rows[0]) : null;
    }
}

module.exports = AIInsight;