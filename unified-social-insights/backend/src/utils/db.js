const { Pool } = require('pg');

// Maintain pool as singleton
let pool;

// Main DB connection
async function connectDB() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("❌ DATABASE_URL is not defined in .env");
    }

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });

    await pool.connect();
    console.log('✅ Connected to PostgreSQL');

    // Enable UUID generation
    await pool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');
    console.log('✅ pgcrypto extension ensured');

    // ⚠️ Optional: Set CREATE_SCHEMA=true in .env if you want to recreate tables manually
    if (process.env.CREATE_SCHEMA === 'true') {
      console.warn('⚠️ CREATE_SCHEMA=true – resetting database schema');
      await dropAllTables();
      await createAllTables();
    }

  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    throw err;
  }
}

// Safe pool getter
function getPool() {
  if (!pool) throw new Error('❌ Pool not initialized. Call connectDB() first.');
  return pool;
}

// Dev-only: Drop tables
async function dropAllTables() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error("❌ dropAllTables should never run in production");
  }

  console.warn('⚠️ Dropping tables for dev reset...');
  await pool.query('DROP TABLE IF EXISTS instagram_insights CASCADE;');
  await pool.query('DROP TABLE IF EXISTS linked_accounts CASCADE;');
  await pool.query('DROP TABLE IF EXISTS users CASCADE;');
  console.log('✅ Dropped tables');
}

// Create schema tables
async function createAllTables() {
  // users table
  await pool.query(`
    CREATE TABLE users (
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
  console.log('✅ Created users table');

  // linked_accounts table
  await pool.query(`
    CREATE TABLE linked_accounts (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      page_id TEXT NOT NULL,
      page_name TEXT,
      page_token TEXT,
      instagram_account_id TEXT,
      token_expires_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✅ Created linked_accounts table');

  // instagram_insights table
  await pool.query(`
    CREATE TABLE instagram_insights (
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
  console.log('✅ Created instagram_insights table');
}

module.exports = connectDB;
module.exports.pool = getPool;