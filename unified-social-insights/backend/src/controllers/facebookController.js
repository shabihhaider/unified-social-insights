// // backend/src/controllers/facebookController.js
// const axios = require('axios');
// const jwt = require('jsonwebtoken');
// const { pool } = require('../utils/db');

// const redirectUri = process.env.FACEBOOK_REDIRECT_URI; // Should match Facebook App setting
// const frontendUrl = process.env.CLIENT_URL; // e.g. http://localhost:3000

// /**
//  * 🔗 Step 1: Redirect user to Facebook login
//  */
// exports.redirectToFacebook = (req, res) => {
//   const authURL = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${redirectUri}&scope=email,public_profile,pages_show_list,instagram_basic,pages_read_engagement`;
//   res.redirect(authURL);
// };

// /**
//  * 🔁 Step 2: Handle Facebook's redirect with ?code
//  */
// exports.facebookCallback = async (req, res) => {
//   const code = req.query.code;
//   if (!code) {
//     return res.redirect(`${frontendUrl}/oauth-failed?error=missing_code`);
//   }

//   try {
//     // 1️⃣ Exchange code for Facebook access token
//     const tokenResponse = await axios.get('https://graph.facebook.com/v20.0/oauth/access_token', {
//       params: {
//         client_id: process.env.FACEBOOK_APP_ID,
//         client_secret: process.env.FACEBOOK_APP_SECRET,
//         redirect_uri: redirectUri,
//         code,
//       },
//     });

//     const facebookToken = tokenResponse.data.access_token;

//     // 2️⃣ Get user profile info from Facebook
//     const profileResponse = await axios.get('https://graph.facebook.com/me', {
//       params: {
//         fields: 'id,name,email',
//         access_token: facebookToken,
//       },
//     });

//     const fbUser = profileResponse.data;
//     const email = fbUser.email || `fbuser_${fbUser.id}@facebook.com`;

//     // 3️⃣ Save or update user in database
//     const dbRes = await pool().query(
//       `INSERT INTO users (email, facebook_token)
//        VALUES ($1, $2)
//        ON CONFLICT (email) DO UPDATE SET facebook_token = EXCLUDED.facebook_token
//        RETURNING id, role, email`,
//       [email, facebookToken]
//     );

//     const user = dbRes.rows[0];

//     // 4️⃣ Generate JWT for your app
//     const jwtToken = jwt.sign(
//       { id: user.id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     // 5️⃣ Redirect to frontend with token in URL
//     res.redirect(`${frontendUrl}/auth/facebook/callback?token=${jwtToken}&linked=facebook`);
//   } catch (err) {
//     console.error('❌ Facebook OAuth error:', err.response?.data || err.message);
//     res.redirect(`${frontendUrl}/oauth-failed?error=auth_failed`);
//   }
// };
