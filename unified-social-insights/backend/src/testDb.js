require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => {
    console.log('✅ PostgreSQL connected successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ PostgreSQL connection failed:', err);
    process.exit(1);
  });
