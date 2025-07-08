// backend/src/models/UserModel.js
const pool = require('../utils/db').pool();

const findUserByEmail = async (email) => {
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
};

const findUserByProviderId = async (provider, providerId) => {
  const res = await pool.query(
    'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
    [provider, providerId]
  );
  return res.rows[0];
};

const createUser = async ({ email, name, password, provider, providerId, role = 'free' }) => {
  const res = await pool.query(
    `INSERT INTO users (email, name, password, provider, provider_id, role)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [email, name, password, provider, providerId, role]  // ✅ now 6 values for 6 columns
  );
  return res.rows[0];
};

module.exports = {
  findUserByEmail,
  findUserByProviderId,
  createUser,
};
