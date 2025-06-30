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

exports.getMockPages = (req, res) => {
  return res.json({
    pages: [
      {
        page_id: '1234567890',
        page_name: 'Blagat TV',
        ig_id: '17841400000000000',
        access_token: 'MOCK_PAGE_TOKEN'
      }
    ]
  });
};

exports.getMockInsights = (req, res) => {
  const ig_id = req.query.ig_id;
  if (!ig_id) return res.status(400).json({ error: 'Missing ig_id' });

  return res.json({
    ig_id,
    metrics: {
      followers_count: 9542,
      impressions: 123456,
      reach: 86742,
      profile_views: 3912,
      website_clicks: 123
    },
    timestamp: new Date().toISOString()
  });
};

exports.getMockMedia = (req, res) => {
  const { ig_id } = req.query;
  if (!ig_id) return res.status(400).json({ error: 'Missing ig_id' });

  return res.json({
    ig_id,
    media: [
      {
        id: '1001',
        caption: '💡 Tips to grow your reach',
        media_url: 'https://via.placeholder.com/300x300.png?text=Post+1',
        like_count: 143,
        comments_count: 21
      },
      {
        id: '1002',
        caption: '🎉 Launch Day Highlights!',
        media_url: 'https://via.placeholder.com/300x300.png?text=Post+2',
        like_count: 289,
        comments_count: 57
      },
      {
        id: '1003',
        caption: '📈 Growth over 7 days',
        media_url: 'https://via.placeholder.com/300x300.png?text=Post+3',
        like_count: 378,
        comments_count: 84
      }
    ]
  });
};
