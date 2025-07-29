const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const requireAuth = require('../middlewares/auth');
const passport = require("passport");
const bcrypt = require("bcryptjs");
const router = express.Router();
const pool = require("../utils/db").pool;
const UserModel = require("../models/UserModel");
const SocialAccount = require('../models/SocialAccount');
const generateToken = require('../utils/generateToken');
require("dotenv").config();

// Google strategy
require("../auth/passport/googleStrategy");

const {
  FACEBOOK_APP_ID: CLIENT_ID,
  FACEBOOK_APP_SECRET: CLIENT_SECRET,
  FACEBOOK_REDIRECT_URI: REDIRECT_URI,
  JWT_SECRET,
  CLIENT_URL
} = process.env;

// Constants
const DEFAULT_TOKEN_EXPIRY_DAYS = 60;
const FACEBOOK_API_VERSION = "v23.0";
const PAGE_FIELDS = "id,name,access_token,category,fan_count,followers_count,about,cover,location";
const PAGE_INFO_FIELDS = "instagram_business_account,fan_count,followers_count,category,about,cover,location";
const IG_INFO_FIELDS = "username,followers_count,media_count,profile_picture_url,name";

// Utility functions
const createAxiosConfig = (params) => ({ params });

const handleAxiosError = (error, context) => {
  const errorData = error.response?.data?.error;
  console.error(`❌ ${context}:`, errorData || error.message);
  return errorData;
};

const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing or invalid token");
  }
  return authHeader.split(" ")[1];
};

const verifyJWT = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

const createSocialAccountData = (userId, platform, accountData, additionalData = {}) => ({
  user_id: userId,
  platform,
  platform_account_id: accountData.id,
  username: accountData.username || accountData.name,
  display_name: accountData.display_name || accountData.name,
  access_token: accountData.access_token,
  account_type: additionalData.account_type || 'page',
  followers_count: additionalData.followers_count || 0,
  permissions: additionalData.permissions || [],
  metadata: additionalData.metadata || {}
});

// ========================
// 🌐 GOOGLE LOGIN ROUTES
// ========================
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const { token } = req.user;
    res.redirect(`${CLIENT_URL}/auth-success?token=${token}`);
  }
);

// ==========================
// 📘 FACEBOOK LOGIN ROUTES
// ==========================
router.get("/facebook", (req, res) => {
  const authUrl = `https://www.facebook.com/${FACEBOOK_API_VERSION}/dialog/oauth?` +
    `client_id=${CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `scope=pages_show_list,instagram_basic,instagram_manage_insights,pages_read_engagement,business_management&` +
    `response_type=code`;
  
  console.log("🔐 Redirecting to:", authUrl);
  res.redirect(authUrl);
});

router.get("/facebook/callback", (req, res) => {
  const { code } = req.query;
  res.redirect(`${CLIENT_URL}/oauth-success?code=${code}`);
});

// Facebook callback handler
router.post("/facebook/callback", requireAuth, async (req, res) => {
  console.log("POST /facebook/callback HIT");
  
  try {
    const { code } = req.body;
    const token = extractToken(req);
    const decoded = verifyJWT(token);
    const userId = decoded.id;

    // Exchange code for access token
    const tokenResponse = await axios.get(
      `https://graph.facebook.com/${FACEBOOK_API_VERSION}/oauth/access_token`,
      createAxiosConfig({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code,
      })
    );

    const { access_token } = tokenResponse.data;

    // Get user's Facebook pages
    const pagesResponse = await axios.get(
      `https://graph.facebook.com/${FACEBOOK_API_VERSION}/me/accounts`,
      createAxiosConfig({ access_token, fields: PAGE_FIELDS })
    );

    const connectedAccounts = [];
    let connectedCount = 0;

    // Process each page
    await Promise.allSettled(
      pagesResponse.data.data.map(async (page) => {
        try {
          // Get additional page info
          const pageInfoResponse = await axios.get(
            `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${page.id}`,
            createAxiosConfig({
              fields: PAGE_INFO_FIELDS,
              access_token: page.access_token,
            })
          );

          const pageInfo = pageInfoResponse.data;

          // Create Facebook account
          const fbAccountData = createSocialAccountData(userId, 'facebook', page, {
            followers_count: pageInfo.fan_count || pageInfo.followers_count || 0,
            permissions: ['pages_read_engagement', 'pages_show_list', 'pages_read_user_content'],
            metadata: {
              category: pageInfo.category,
              about: pageInfo.about,
              cover_photo: pageInfo.cover?.source,
              location: pageInfo.location,
              instagram_account_id: pageInfo.instagram_business_account?.id
            }
          });

          const existing = await SocialAccount.findByUserIdAndPlatformAccountId(userId, page.id, 'facebook');
          if (existing) {
            console.warn(`⚠️ Account already connected: ${page.name}`);
            return;
          }

          const fbAccount = await SocialAccount.create(fbAccountData);
          connectedCount++;
          connectedAccounts.push({
            platform: 'facebook',
            name: page.name,
            id: fbAccount.id,
            followers: fbAccountData.followers_count
          });

          // Handle Instagram business account if available
          if (pageInfo.instagram_business_account?.id) {
            await processInstagramAccount(
              userId, pageInfo.instagram_business_account.id, page, connectedAccounts
            );
            connectedCount++;
          }

        } catch (error) {
          console.warn(`Failed to process page ${page.name}:`, handleAxiosError(error, 'Page processing'));
        }
      })
    );

    if (connectedCount === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid pages could be connected. Please check if your Facebook pages have insights enabled or post history."
      });
    }
    // if (connectedCount === 0) {
    //   return res.status(400).json({
    //     success: false,
    //     error: "No accounts could be connected. Please ensure you have the required permissions.",
    //     details: "Make sure your Facebook pages have the necessary permissions for analytics access."
    //   });
    // }

    res.json({
      success: true,
      message: `Successfully connected ${connectedCount} account(s)`,
      accountsConnected: connectedCount,
      accounts: connectedAccounts,
      summary: {
        facebook: connectedAccounts.filter(acc => acc.platform === 'facebook').length,
        instagram: connectedAccounts.filter(acc => acc.platform === 'instagram').length
      }
    });

  } catch (error) {
    const errorData = handleAxiosError(error, 'Facebook callback error');
    
    // Handle specific Facebook API errors
    const errorResponses = {
      190: { status: 401, error: "Invalid or expired Facebook access token. Please try reconnecting.", code: 'INVALID_TOKEN' },
      200: { status: 403, error: "Insufficient permissions. Please grant all requested permissions.", code: 'INSUFFICIENT_PERMISSIONS' }
    };

    const errorResponse = errorResponses[errorData?.code];
    if (errorResponse) {
      return res.status(errorResponse.status).json({
        success: false,
        error: errorResponse.error,
        code: errorResponse.code
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to process Facebook connection",
      details: errorData?.message || error.message
    });
  }
});

// Helper function to process Instagram accounts
async function processInstagramAccount(userId, igAccountId, page, connectedAccounts) {
  try {
    const igInfoResponse = await axios.get(
      `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${igAccountId}`,
      createAxiosConfig({
        fields: IG_INFO_FIELDS,
        access_token: page.access_token,
      })
    );

    const igInfo = igInfoResponse.data;
    const igAccountData = createSocialAccountData(userId, 'instagram', {
      id: igAccountId,
      name: igInfo.name || page.name,
      username: igInfo.username ? `@${igInfo.username}` : `@${page.name.toLowerCase().replace(/\s+/g, '')}`,
      access_token: page.access_token
    }, {
      account_type: 'business',
      followers_count: igInfo.followers_count || 0,
      permissions: ['instagram_basic', 'pages_read_engagement', 'instagram_manage_insights'],
      metadata: {
        page_id: page.id,
        media_count: igInfo.media_count || 0,
        profile_picture_url: igInfo.profile_picture_url
      }
    });

    const igAccount = await SocialAccount.create(igAccountData);
    connectedAccounts.push({
      platform: 'instagram',
      name: igAccountData.display_name,
      username: igAccountData.username,
      id: igAccount.id,
      followers: igAccountData.followers_count
    });

  } catch (error) {
    console.warn(`Failed to fetch Instagram details for page ${page.name}:`, handleAxiosError(error, 'Instagram processing'));
    
    // Fallback: create Instagram account with basic info
    const fallbackIgData = createSocialAccountData(userId, 'instagram', {
      id: igAccountId,
      name: page.name,
      username: `@${page.name.toLowerCase().replace(/\s+/g, '')}`,
      access_token: page.access_token
    }, {
      account_type: 'business',
      followers_count: 0,
      permissions: ['instagram_basic', 'pages_read_engagement'],
      metadata: { page_id: page.id }
    });

    const igAccount = await SocialAccount.create(fallbackIgData);
    connectedAccounts.push({
      platform: 'instagram',
      name: fallbackIgData.display_name,
      username: fallbackIgData.username,
      id: igAccount.id,
      followers: 0
    });
  }
}

// Finalize page route
router.post("/finalize-page", async (req, res) => {
  const { token, selected_page } = req.body;
  
  try {
    const decoded = verifyJWT(token);
    const email = decoded.email;
    
    // Determine user ID
    let userId = req.user?.id || decoded.id;
    
    if (!userId) {
      // Fallback: find or create user by email
      let userQuery = await pool().query(`SELECT id, role FROM users WHERE email = $1`, [email]);
      let user = userQuery.rows[0];
      
      if (!user) {
        const insertQuery = await pool().query(
          `INSERT INTO users (email, provider, provider_id, role) VALUES ($1, $2, $3, $4) RETURNING id, role`,
          [email, 'facebook', selected_page.facebook_id || null, 'free']
        );
        user = insertQuery.rows[0];
      }
      userId = user.id;
    }

    // Check if Instagram account is already linked
    const existingAccount = await pool().query(
      `SELECT id FROM linked_accounts WHERE user_id = $1 AND instagram_account_id = $2`,
      [userId, selected_page.instagram_account_id]
    );

    if (existingAccount.rows.length > 0) {
      return res.status(409).json({ error: "This Instagram account is already linked." });
    }

    // Insert into linked_accounts
    const expiresAt = new Date(Date.now() + (selected_page.expires_in || DEFAULT_TOKEN_EXPIRY_DAYS * 24 * 60 * 60) * 1000);

    await pool().query(
      `INSERT INTO linked_accounts (user_id, page_id, page_name, page_token, instagram_account_id, token_expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, selected_page.page_id, selected_page.page_name, selected_page.page_token, selected_page.instagram_account_id, expiresAt]
    );

    console.log('✅ Successfully linked Instagram account:', selected_page.instagram_account_id);

    // Generate new token
    const newToken = jwt.sign({
      id: userId,
      email,
      page_name: selected_page.page_name,
      instagram_account_id: selected_page.instagram_account_id,
      role: decoded.role || 'free',
    }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token: newToken });

  } catch (error) {
    console.error("❌ Finalize page error:", error.message);
    res.status(400).json({ error: "Failed to finalize page" });
  }
});

// ==========================
// 📧 EMAIL/PASSWORD ROUTES
// ==========================

// Register user
router.post("/register", async (req, res) => {
  const { email, name, password } = req.body;
  
  try {
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await UserModel.createUser({
      email,
      name,
      password: hashedPassword,
      provider: "local",
      providerId: null,
      role: "free"
    });
    
    const token = generateToken(user);
    res.status(201).json({ token });

  } catch (error) {
    console.error("❌ Registration error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await UserModel.findByEmail(email);
    if (!user || user.provider !== "local") {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    
    const token = generateToken(user);
    res.json({ token });

  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get authenticated user info
router.get("/me", (req, res) => {
  try {
    const token = extractToken(req);
    const decoded = verifyJWT(token);
    res.json({ user: decoded });
  } catch (error) {
    console.error("JWT Error:", error.message);
    res.status(401).json({ error: error.message });
  }
});

// Refresh token
router.post("/refresh", (req, res) => {
  try {
    const oldToken = extractToken(req);
    const decoded = jwt.verify(oldToken, JWT_SECRET, { ignoreExpiration: true });
    
    const newToken = jwt.sign({
      id: decoded.id,
      email: decoded.email,
      page_name: decoded.page_name,
      instagram_account_id: decoded.instagram_account_id,
      role: decoded.role,
    }, JWT_SECRET, { expiresIn: "15m" });
    
    res.json({ token: newToken });

  } catch (error) {
    console.error("❌ Refresh failed:", error.message);
    res.status(403).json({ error: "Invalid token" });
  }
});

// Get linked accounts
router.get("/linked-accounts", async (req, res) => {
  try {
    const token = extractToken(req);
    const decoded = verifyJWT(token);
    
    const result = await pool().query(
      `SELECT id, page_id, page_name, instagram_account_id, created_at 
       FROM linked_accounts 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [decoded.id]
    );
    
    res.json({ accounts: result.rows });

  } catch (error) {
    console.error("❌ Fetch linked accounts failed:", error.message);
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;