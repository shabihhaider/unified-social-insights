const { Pool } = require('pg');

let pool;

/**
 * Connects to PostgreSQL and ensures required tables exist.
 */
async function connectDB() {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });

    await pool.connect();
    console.log('✅ Connected to PostgreSQL');

    // Ensure users table exists
    const createUserTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        facebook_token TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createUserTable);
    console.log('✅ Ensured users table exists');
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    throw err;
  }
}

/**
 * Returns initialized pool instance.
 */
function getPool() {
  if (!pool) throw new Error('❌ Pool not initialized. Call connectDB() first.');
  return pool;
}

module.exports = connectDB;
module.exports.pool = getPool;
