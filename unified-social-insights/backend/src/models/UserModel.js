// backend/src/models/UserModel.js
const BaseModel = require('./BaseModel');

class User extends BaseModel {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        provider VARCHAR(50) NOT NULL,
        provider_id VARCHAR(255),
        role VARCHAR(20) DEFAULT 'free' CHECK (role IN ('free', 'premium', 'admin')),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider, provider_id);
    `;

    await this.query(query);
    console.log('✅ Users table ensured');
  }

  static async findByEmail(email) {
    const result = await this.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  static async findByProviderId(provider, providerId) {
    const result = await this.query(
      'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
      [provider, providerId]
    );
    return result.rows[0] || null;
  }

  static async findById(id) {
    const result = await this.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async create({ email, name, password, provider, providerId, role = 'free' }) {
    if (!email || !name || !password || !provider) {
      throw new Error("Missing required user fields");
    }

    const result = await this.query(`
      INSERT INTO users (email, name, password, provider, provider_id, role)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `, [email.trim(), name.trim(), password, provider, providerId || null, role]);

    return result.rows[0];
  }

  static async updateLastLogin(id) {
    await this.query(
      'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
  }
}

module.exports = User;
