const axios = require('axios');

exports.getFacebookPages = async (req, res) => {
  const access_token = req.query.token;
  if (!access_token) return res.status(400).json({ error: 'Missing access token' });

  try {
    const fbRes = await axios.get('https://graph.facebook.com/v20.0/me/accounts', {
      params: { access_token }
    });

    const pages = fbRes.data.data;

    const connected = await Promise.all(pages.map(async (page) => {
      const igRes = await axios.get(
        `https://graph.facebook.com/v20.0/${page.id}?fields=instagram_business_account`,
        { params: { access_token: page.access_token } }
      );

      return {
        page_id: page.id,
        page_name: page.name,
        ig_id: igRes.data.instagram_business_account?.id || null,
        access_token: page.access_token
      };
    }));

    res.json({ pages: connected });
  } catch (err) {
    console.error('❌ Meta API Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
};
