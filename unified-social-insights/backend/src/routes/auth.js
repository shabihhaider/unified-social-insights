const express = require("express");
const axios = require("axios");
const router = express.Router();

// Load environment variables
require("dotenv").config(); // ✅ Ensure this line exists in case this is your only route file

const CLIENT_ID = process.env.FACEBOOK_APP_ID;
const CLIENT_SECRET = process.env.FACEBOOK_APP_SECRET;
const REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI; // ✅ FIXED: Now uses .env

// Redirect to Facebook OAuth
router.get("/facebook", (req, res) => {
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=pages_show_list,instagram_basic,instagram_manage_insights,pages_read_engagement&response_type=code`;

  console.log("🔐 Generated OAuth URL:", authUrl); // ✅ Confirm correct URL
  res.redirect(authUrl);
});

// Handle Facebook callback
router.get("/facebook/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const tokenRes = await axios.get("https://graph.facebook.com/v18.0/oauth/access_token", {
      params: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code,
      },
    });

    const { access_token } = tokenRes.data;

    // Fetch pages/accounts connected to this user
    const accountsRes = await axios.get("https://graph.facebook.com/v18.0/me/accounts", {
      params: {
        access_token,
      },
    });

    res.json({
      message: "✅ Connected successfully",
      access_token,
      accounts: accountsRes.data,
    });
  } catch (err) {
    console.error("OAuth error:", err?.response?.data || err.message);
    res.status(500).json({ error: "OAuth failed" });
  }
});

module.exports = router;
