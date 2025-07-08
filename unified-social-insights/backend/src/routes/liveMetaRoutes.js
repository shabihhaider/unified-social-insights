// backend/src/routes/liveMetaRoutes.js
const requireAuth = require('../middlewares/auth');

const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middlewares/auth');
const { pool } = require('../utils/db');

console.log('🔥 /api/meta live router loaded');

// ✅ GET /api/meta/pages — Fetch FB pages and associated IG accounts
router.get('/pages', auth, async (req, res) => {
  console.log('🔍 /pages endpoint hit');
  const userId = req.user.id;

  try {
    // 1. Fetch user's Facebook token from DB
    const result = await pool().query(
      'SELECT facebook_token FROM users WHERE id = $1',
      [userId]
    );

    const facebook_token = result.rows[0]?.facebook_token;
    if (!facebook_token) {
      console.warn('⚠️ No Facebook token found for user:', userId);
      return res.status(400).json({ error: 'No Facebook token found for user' });
    }

    // 2. Fetch user's pages from Facebook
    const fbRes = await axios.get('https://graph.facebook.com/me/accounts', {
      params: { access_token: facebook_token },
    });

    // 3. For each page, fetch IG account if available
    const pages = await Promise.all(
      fbRes.data.data.map(async (page) => {
        try {
          const igRes = await axios.get(`https://graph.facebook.com/${page.id}`, {
            params: {
              access_token: page.access_token,
              fields: 'instagram_business_account',
            },
          });

          return {
            page_id: page.id,
            page_name: page.name,
            ig_id: igRes.data.instagram_business_account?.id || null,
            access_token: page.access_token,
          };
        } catch (err) {
          console.error(`❌ Error fetching IG for page ${page.id}:`, err.message);
          return {
            page_id: page.id,
            page_name: page.name,
            ig_id: null,
            access_token: page.access_token,
            error: err.message,
          };
        }
      })
    );

    console.log(`✅ Pages fetched: ${pages.length}`);
    return res.json({ pages });
  } catch (err) {
    console.error('❌ /pages error:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to fetch Facebook pages' });
  }
});

// ✅ Placeholder: GET /api/meta/insights
router.get('/insights', auth, (req, res) => {
  res.status(501).json({ error: 'Live /insights not implemented yet' });
});

// ✅ Placeholder: GET /api/meta/media
router.get('/media', auth, (req, res) => {
  res.status(501).json({ error: 'Live /media not implemented yet' });
});

module.exports = router;
