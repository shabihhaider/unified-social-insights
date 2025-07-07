const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const router = express.Router();
const pool = require("../utils/db").pool;

require("dotenv").config();

const CLIENT_ID = process.env.FACEBOOK_APP_ID;
const CLIENT_SECRET = process.env.FACEBOOK_APP_SECRET;
const REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Step 1: Redirect to Facebook for OAuth
router.get("/facebook", (req, res) => {
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=pages_show_list,instagram_basic,instagram_manage_insights,pages_read_engagement,business_management&response_type=code`;

  console.log("🔐 Redirecting to:", authUrl);
  res.redirect(authUrl);
});

// Step 2: Facebook OAuth Callback
router.get("/facebook/callback", async (req, res) => {
  const code = req.query.code;

  try {
    // Step 2.1: Exchange code for access token
    const tokenRes = await axios.get("https://graph.facebook.com/v18.0/oauth/access_token", {
      params: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code,
      },
    });

    const { access_token } = tokenRes.data;

    // Step 2.2: Get Facebook user ID
    const meRes = await axios.get("https://graph.facebook.com/v18.0/me", {
      params: { access_token },
    });
    const facebookId = meRes.data.id;
    const email = `fb_${facebookId}@example.com`;

    // Step 2.3: Fetch all connected pages
    const pagesRes = await axios.get("https://graph.facebook.com/v18.0/me/accounts", {
      params: { access_token },
    });

    const validPages = [];

    for (const page of pagesRes.data.data) {
      try {
        const igRes = await axios.get(`https://graph.facebook.com/v19.0/${page.id}`, {
          params: {
            fields: "instagram_business_account",
            access_token: page.access_token,
          },
        });

        if (igRes.data.instagram_business_account?.id) {
          validPages.push({
            page_id: page.id,
            page_name: page.name,
            page_token: page.access_token,
            instagram_account_id: igRes.data.instagram_business_account.id,
          });
        }
      } catch (error) {
        console.warn(`⚠️ Failed to fetch IG for page ${page.name}:`, error?.response?.data || error.message);
      }
    }

    if (validPages.length === 0) {
      return res.status(400).json({ error: "No connected Instagram accounts found." });
    }

    // Send TEMP TOKEN with pages to frontend for selection
    const tempToken = jwt.sign(
      {
        email,
        access_token,
        pages: validPages,
      },
      JWT_SECRET,
      { expiresIn: "2m" } // short expiry
    );

    return res.redirect(`http://localhost:3000/select-page?token=${tempToken}`);
  } catch (err) {
    console.error("❌ OAuth Error:", err?.response?.data || err.message);
    return res.status(500).json({ error: "OAuth failed" });
  }
});

// Step 3: Finalize selected page and store user
router.post("/finalize-page", async (req, res) => {
  const { token, selected_page } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;

    // Save or update user in DB
    const result = await pool().query(
      `INSERT INTO users (email, facebook_token, instagram_account_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET
         facebook_token = EXCLUDED.facebook_token,
         instagram_account_id = EXCLUDED.instagram_account_id
       RETURNING id, email, facebook_token AS access_token, instagram_account_id`,
      [email, selected_page.page_token, selected_page.instagram_account_id]
    );

    const user = result.rows[0];

    // 🆕 Include page_name in the final token for frontend display
    const newToken = jwt.sign(
      {
        ...user,
        page_name: selected_page.page_name
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token: newToken });
  } catch (err) {
    console.error("❌ Failed to finalize page:", err.message);
    return res.status(400).json({ error: "Failed to finalize page" });
  }
});

// Step 4: Authenticated user info
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ user: decoded });
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;
