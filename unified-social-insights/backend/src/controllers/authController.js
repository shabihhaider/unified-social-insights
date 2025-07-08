const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { pool } = require('../utils/db');

const createToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

/**
 * 🔐 Register a new user
 */
async function registerUser(req, res) {
  console.log('🔥 registerUser() triggered');
  const { email, password, full_name = '', role = 'Free' } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool().query(
      `INSERT INTO users (email, password, full_name, role)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [email, hashed, full_name, role]
    );

    const user = result.rows[0];
    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    console.error('❌ Registration error:', err);
    return res.status(500).json({ error: 'Server error during registration' });
  }
}

/**
 * 🔓 Login with email + password
 */
async function emailLogin(req, res) {
  console.log('🔥 emailLogin() triggered');
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const result = await pool().query('SELECT * FROM users WHERE email=$1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = createToken(user);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    return res.status(500).json({ error: 'Server error during login' });
  }
}

module.exports = {
  registerUser,
  emailLogin,
};
