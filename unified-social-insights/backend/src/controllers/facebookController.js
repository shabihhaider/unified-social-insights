// backend/src/controllers/facebookController.js
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { pool } = require('../utils/db');

const redirectUri = process.env.FACEBOOK_REDIRECT_URI;
const frontendUrl = process.env.CLIENT_URL;

/**
 * 🔗 Step 1: Redirect user to Facebook login
 */
exports.redirectToFacebook = (req, res) => {
  const authURL = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${redirectUri}&scope=pages_show_list,instagram_basic,pages_read_engagement,email`;
  res.redirect(authURL);
};

/**
 * 🔁 Step 2: Handle Facebook's callback with ?code
 */
exports.facebookCallback = async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: 'Missing code parameter from Facebook' });

  try {
    // 1️⃣ Exchange code for short-lived access token
    const tokenRes = await axios.get('https://graph.facebook.com/v20.0/oauth/access_token', {
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: redirectUri,
        code
      }
    });

    const facebook_token = tokenRes.data.access_token;

    // 2️⃣ Get Facebook profile (with email)
    const meRes = await axios.get('https://graph.facebook.com/me', {
      params: {
        fields: 'id,name,email',
        access_token: facebook_token
      }
    });

    const fb = meRes.data;
    const email = fb.email || `fbuser_${fb.id}@facebook.com`;

    // 3️⃣ Insert or update local user
    const result = await pool().query(`
      INSERT INTO users (email, facebook_token)
      VALUES ($1, $2)
      ON CONFLICT (email) DO UPDATE SET facebook_token = EXCLUDED.facebook_token
      RETURNING id, role, email
    `, [email, facebook_token]);

    const user = result.rows[0];

    // 4️⃣ Issue JWT for internal auth
    const jwtToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5️⃣ Redirect to frontend with JWT
    res.redirect(`${frontendUrl}/oauth-success?token=${jwtToken}`);
  } catch (err) {
    console.error('❌ Facebook OAuth failed:', err.response?.data || err.message);
    res.status(500).json({ error: 'Facebook authentication failed' });
  }
};
