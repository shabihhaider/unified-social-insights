const { Pool } = require('pg');
let pool;

async function connectDB() {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });

  await pool.connect();
  console.log('✅ Connected to PostgreSQL');

  const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255),
      role VARCHAR(50) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(createUserTable);
  console.log('✅ Ensured users table exists');
}

module.exports = connectDB;
module.exports.pool = () => pool;
