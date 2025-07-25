// // backend/src/controllers/metaController.js
// const axios = require('axios');

// /**
//  * 📡 Get Facebook Pages and linked Instagram accounts
//  * Used in OAuth testing and fallback development scenarios.
//  */
// exports.getFacebookPages = async (req, res) => {
//   const access_token = req.query.token;
//   if (!access_token) {
//     return res.status(400).json({ error: 'Missing access token in query' });
//   }

//   try {
//     const fbRes = await axios.get('https://graph.facebook.com/v20.0/me/accounts', {
//       params: { access_token }
//     });

//     const pages = fbRes.data.data;

//     const connected = await Promise.all(
//       pages.map(async (page) => {
//         try {
//           const igRes = await axios.get(
//             `https://graph.facebook.com/v20.0/${page.id}`,
//             {
//               params: {
//                 access_token: page.access_token,
//                 fields: 'instagram_business_account',
//               },
//             }
//           );

//           return {
//             page_id: page.id,
//             page_name: page.name,
//             ig_id: igRes.data.instagram_business_account?.id || null,
//             access_token: page.access_token,
//           };
//         } catch (err) {
//           console.warn(`⚠️ IG account fetch failed for page ${page.id}:`, err.message);
//           return {
//             page_id: page.id,
//             page_name: page.name,
//             ig_id: null,
//             access_token: page.access_token,
//             error: 'Could not fetch Instagram account',
//           };
//         }
//       })
//     );

//     return res.json({ pages: connected });
//   } catch (err) {
//     console.error('❌ Failed to fetch Facebook pages:', err.response?.data || err.message);
//     return res.status(500).json({ error: 'Failed to retrieve Facebook pages' });
//   }
// };

// /**
//  * 🧪 Mock: Pages
//  */
// exports.getMockPages = (req, res) => {
//   return res.json({
//     pages: [
//       {
//         page_id: '1234567890',
//         page_name: 'Blagat TV',
//         ig_id: '17841400000000000',
//         access_token: 'MOCK_PAGE_TOKEN',
//       }
//     ]
//   });
// };

// /**
//  * 🧪 Mock: Insights Metrics
//  */
// exports.getMockInsights = (req, res) => {
//   const { ig_id, range } = req.query;
//   const days = parseInt(range) || 7;

//   if (!ig_id) {
//     return res.status(400).json({ error: 'Missing ig_id in query' });
//   }

//   const multiplier = days === 30 ? 2.5 : 1;

//   return res.json({
//     ig_id,
//     metrics: {
//       followers_count: Math.floor(9542 * multiplier),
//       impressions: Math.floor(123456 * multiplier),
//       reach: Math.floor(86742 * multiplier),
//       profile_views: Math.floor(3912 * multiplier),
//       website_clicks: Math.floor(123 * multiplier)
//     },
//     timestamp: new Date().toISOString()
//   });
// };

// /**
//  * 🧪 Mock: Recent Media
//  */
// exports.getMockMedia = (req, res) => {
//   const { ig_id } = req.query;

//   if (!ig_id) {
//     return res.status(400).json({ error: 'Missing ig_id in query' });
//   }

//   return res.json({
//     ig_id,
//     media: [
//       {
//         id: '1001',
//         caption: '💡 Tips to grow your reach',
//         media_url: 'https://via.placeholder.com/300x300.png?text=Post+1',
//         like_count: 143,
//         comments_count: 21
//       },
//       {
//         id: '1002',
//         caption: '🎉 Launch Day Highlights!',
//         media_url: 'https://via.placeholder.com/300x300.png?text=Post+2',
//         like_count: 289,
//         comments_count: 57
//       },
//       {
//         id: '1003',
//         caption: '📈 Growth over 7 days',
//         media_url: 'https://via.placeholder.com/300x300.png?text=Post+3',
//         like_count: 378,
//         comments_count: 84
//       }
//     ]
//   });
// };
