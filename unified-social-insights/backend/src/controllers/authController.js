const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { pool } = require('../utils/db');

// Replace this if needed for FB testing
const access_token = '...';

const createToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

async function registerUser(req, res) {
  console.log("🔥 registerUser() triggered");
  console.log("📦 req.body:", req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    console.log("❌ Missing email or password");
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool().query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashed]
    );

    const user = result.rows[0];
    const token = createToken(user);

    console.log("✅ Registration complete:", user.email);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("❌ Error in registration:", err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    return res.status(500).json({ error: 'Server error during registration' });
  }
}

async function emailLogin(req, res) {
  console.log("🔥 emailLogin() triggered");
  console.log("📦 req.body:", req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const result = await pool().query('SELECT * FROM users WHERE email=$1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log("❌ Invalid credentials:", email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = createToken(user);
    console.log("✅ Login success:", email);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ error: 'Server error during login' });
  }
}

// Optional OAuth
function initiateFacebookOAuth(req, res) {
  const redirectUrl = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&scope=pages_show_list,instagram_basic,pages_read_engagement`;
  return res.redirect(redirectUrl);
}

async function handleFacebookOAuth(req, res) {
  console.log('📥 Facebook callback hit');
  try {
    const pagesRes = await axios.get(`https://graph.facebook.com/me/accounts`, {
      params: { access_token }
    });

    const pages = pagesRes.data.data;

    const connected = await Promise.all(pages.map(async (page) => {
      const igRes = await axios.get(
        `https://graph.facebook.com/v20.0/${page.id}?fields=instagram_business_account`,
        { params: { access_token: page.access_token } }
      );

      return {
        page_id: page.id,
        page_name: page.name,
        ig_id: igRes.data.instagram_business_account?.id || null,
        access_token: page.access_token,
      };
    }));

    return res.json({ connected });
  } catch (err) {
    console.error('OAuth Error:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Facebook OAuth failed.' });
  }
}

module.exports = {
  registerUser,
  emailLogin,
  initiateFacebookOAuth,
  handleFacebookOAuth
};
