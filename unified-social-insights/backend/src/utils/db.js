const { Pool } = require('pg');

let pool;

async function connectDB() {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });

    await pool.connect();
    console.log('✅ Connected to PostgreSQL');

    // ✅ Create users table
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";

      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email VARCHAR(255) UNIQUE,
        name VARCHAR(255),
        password TEXT,
        provider VARCHAR(50) DEFAULT 'local',
        provider_id VARCHAR(255),
        role VARCHAR(50) DEFAULT 'free',
        facebook_token TEXT,
        instagram_account_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Ensured users table exists');

    // ✅ Create instagram_insights table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS instagram_insights (
        id SERIAL PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        username VARCHAR(255),
        followers_count INTEGER,
        follows_count INTEGER,
        media_count INTEGER,
        full_name VARCHAR(255),
        fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Ensured instagram_insights table exists');

  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    throw err;
  }
}

function getPool() {
  if (!pool) throw new Error('❌ Pool not initialized. Call connectDB() first.');
  return pool;
}

module.exports = connectDB;
module.exports.pool = getPool;
