// backend/src/models/UserModel.js
const { pool } = require('../utils/db');

const findUserByEmail = async (email) => {
  const result = await pool().query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

const findUserByProviderId = async (provider, providerId) => {
  const result = await pool().query(
    'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
    [provider, providerId]
  );
  return result.rows[0];
};

const createUser = async ({ email, name, password, provider, providerId, role = 'free' }) => {
  if (!email || !name || !password || !provider) {
    throw new Error("Missing required user fields");
  }

  console.log('🧪 DEBUG INSERT VALUES:', {
    email,
    name,
    password,
    provider,
    providerId,
    role
  });

  try {
    const result = await pool().query(
      'INSERT INTO users (email, name, password, provider, provider_id, role) ' +
      'VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        email.trim(),
        name.trim(),
        password,
        provider,
        providerId ?? null,
        role
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('❌ PostgreSQL INSERT error:', error.message);
    throw error;
  }
};

module.exports = {
  findUserByEmail,
  findUserByProviderId,
  createUser,
};
