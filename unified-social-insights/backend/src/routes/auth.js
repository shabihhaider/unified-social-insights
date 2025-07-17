const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const router = express.Router();
const pool = require("../utils/db").pool;
const UserModel = require("../models/UserModel");
const generateToken = require('../utils/generateToken'); // ✅ Add this
require("dotenv").config();

// ✅ Google strategy
require("../auth/passport/googleStrategy");

const {
  FACEBOOK_APP_ID: CLIENT_ID,
  FACEBOOK_APP_SECRET: CLIENT_SECRET,
  FACEBOOK_REDIRECT_URI: REDIRECT_URI,
  JWT_SECRET,
} = process.env;

// ========================
// 🌐 GOOGLE LOGIN ROUTES
// ========================
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const { token } = req.user;
    res.redirect(`http://localhost:3000/auth-success?token=${token}`);
  }
);

// ==========================
// 📘 FACEBOOK LOGIN ROUTES
// ==========================
router.get("/facebook", (req, res) => {
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=pages_show_list,instagram_basic,instagram_manage_insights,pages_read_engagement,business_management&response_type=code`;
  console.log("🔐 Redirecting to:", authUrl);
  res.redirect(authUrl);
});

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

    const { access_token, expires_in } = tokenRes.data;
    
    const meRes = await axios.get("https://graph.facebook.com/v18.0/me", {
      params: { access_token },
    });
    
    const facebookId = meRes.data.id;
    const email = `fb_${facebookId}@example.com`;
    
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
            expires_in, // ⬅️ this will be passed forward
          });
        }
      } catch (error) {
        console.warn(`⚠️ Failed IG for page ${page.name}:`, error?.response?.data || error.message);
      }
    }

    if (validPages.length === 0) {
      return res.status(400).json({ error: "No connected Instagram accounts found." });
    }

    const tempToken = jwt.sign(
      { email, access_token, pages: validPages },
      JWT_SECRET,
      { expiresIn: "2m" }
    );

    return res.redirect(`http://localhost:3000/select-page?token=${tempToken}`);
  } catch (err) {
    console.error("❌ OAuth Error:", err?.response?.data || err.message);
    return res.status(500).json({ error: "OAuth failed" });
  }
});

// ✅ FIXED: Finalize page route with proper column names and user creation
router.post("/finalize-page", async (req, res) => {
  const { token, selected_page } = req.body;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;
    
    // Check if user exists, create if not
    let userRes = await pool().query(`SELECT id, role FROM users WHERE email = $1`, [email]);
    let user = userRes.rows[0];
    
    if (!user) {
      // Create new user for Facebook login
      const insertResult = await pool().query(
        `INSERT INTO users (email, provider, provider_id, role) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, role`,
        [email, 'facebook', decoded.email.split('_')[1], 'free']
      );
      user = insertResult.rows[0];
      console.log('✅ Created new Facebook user:', user.id);
    }
    
    // Check if this IG account is already linked for this user
    const exists = await pool().query(
      `SELECT * FROM linked_accounts WHERE user_id = $1 AND instagram_account_id = $2`,
      [user.id, selected_page.instagram_account_id]
    );
    
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: "This Instagram account is already linked." });
    }
    
    // ✅ FIXED: Insert into linked_accounts with token expiration
    const expiresAt = new Date(Date.now() + (selected_page.expires_in || 60 * 60 * 24 * 60) * 1000); // default 60 days

    await pool().query(
      `INSERT INTO linked_accounts 
        (user_id, page_id, page_name, page_token, instagram_account_id, token_expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        user.id,
        selected_page.page_id,
        selected_page.page_name,
        selected_page.page_token,
        selected_page.instagram_account_id,
        expiresAt
      ]
    );
    
    console.log('✅ Successfully linked Instagram account:', selected_page.instagram_account_id);
    
    // Generate a new token with updated default account info
    const newToken = jwt.sign(
      {
        id: user.id,
        email,
        page_name: selected_page.page_name,
        instagram_account_id: selected_page.instagram_account_id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    return res.json({ token: newToken });
  } catch (err) {
    console.error("❌ Finalize page error:", err.message);
    return res.status(400).json({ error: "Failed to finalize page" });
  }
});

// ==========================
// 📧 EMAIL/PASSWORD ROUTES
// ==========================

// Register user
router.post("/register", async (req, res) => {
  const { email, name, password } = req.body;
  
  try {
    const existing = await UserModel.findUserByEmail(email);
    if (existing) {
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
    return res.status(201).json({ token });
  } catch (err) {
    console.error("❌ Registration error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await UserModel.findUserByEmail(email);
    if (!user || user.provider !== "local") {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    
    const token = generateToken(user); // ✅ Now includes role, full_name, etc.
    return res.json({ token });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Authenticated user info
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

// Refresh Token
router.post("/refresh", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }
  
  const oldToken = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(oldToken, process.env.JWT_SECRET, {
      ignoreExpiration: true, // important!
    });
    
    const newToken = jwt.sign(
      {
        id: decoded.id,
        email: decoded.email,
        page_name: decoded.page_name,
        instagram_account_id: decoded.instagram_account_id,
        role: decoded.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    
    return res.json({ token: newToken });
  } catch (err) {
    console.error("❌ Refresh failed:", err.message);
    return res.status(403).json({ error: "Invalid token" });
  }
});

// ✅ Get all Instagram pages linked by the logged-in user
router.get("/linked-accounts", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }
  
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    
    const result = await pool().query(
      `SELECT 
         id, page_id, page_name, instagram_account_id, created_at 
       FROM linked_accounts 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );
    
    return res.json({ accounts: result.rows });
  } catch (err) {
    console.error("❌ Fetch linked accounts failed:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;