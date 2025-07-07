const { Pool } = require("pg");

let pool;

async function connectDB() {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    });

    await pool.connect();
    console.log("✅ Connected to PostgreSQL");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        facebook_token TEXT,
        instagram_account_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Ensured users table exists");

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
    console.log("✅ Ensured instagram_insights table exists");
  } catch (err) {
    console.error("❌ PostgreSQL connection failed:", err.message);
    throw err;
  }
}

function getPool() {
  if (!pool) throw new Error("❌ Pool not initialized. Call connectDB() first.");
  return pool;
}

module.exports = connectDB;
module.exports.pool = getPool;