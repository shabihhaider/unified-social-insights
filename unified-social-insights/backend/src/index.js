// backend/src/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");

// Load environment variables
dotenv.config();

// Import utilities and models
const connectDB = require("./utils/db");
const User = require('./models/UserModel');
const SocialAccount = require('./models/SocialAccount');
const AIInsight = require('./models/AIInsight');

// Initialize Express
const app = express();

// Initialize Passport
app.use(passport.initialize());

// Connect to database and initialize tables
const initializeApp = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Initialize all tables
    await User.createTable();
    await SocialAccount.createTable();
    await AIInsight.createTable();
    
    console.log('✅ All database tables initialized');
  } catch (error) {
    console.error('❌ App initialization failed:', error.message);
    process.exit(1);
  }
};

initializeApp();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check routes
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || "1.0.0"
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const { pool } = require('./utils/db');
    const result = await pool().query("SELECT NOW() as current_time, version() as pg_version");
    res.json({ 
      status: "connected", 
      database: {
        current_time: result.rows[0].current_time,
        version: result.rows[0].pg_version.split(' ')[0] + ' ' + result.rows[0].pg_version.split(' ')[1]
      }
    });
  } catch (err) {
    console.error("❌ DB test failed:", err.message);
    res.status(500).json({ 
      status: "error", 
      message: "Database connection failed",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// API Routes
const authRoutes = require("./routes/auth");
const socialAccountsRoutes = require("./routes/socialAccounts");
const aiInsightsRoutes = require("./routes/aiInsights");
const instagramRoutes = require("./routes/instagram");
const protectedRoutes = require('./routes/protectedRoutes');
const configRoutes = require('./routes/configRoutes');
const helmet = require('helmet');
const { insightProcessor } = require('./services/aiIntegrationService');
insightProcessor.start(); // 🚀 Starts auto AI insight processing every 5 mins

// Mount routes
app.use(helmet());
app.use("/api/auth", authRoutes);
app.use("/api/social-accounts", socialAccountsRoutes);
app.use("/api/ai-insights", aiInsightsRoutes);
app.use("/api/instagram", instagramRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/config", configRoutes);

// Legacy routes for backward compatibility
app.use("/api/insights", aiInsightsRoutes); // Redirect old insights route

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  
  if (error.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Request entity too large'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 5050;
const server = app.listen(PORT, () => {
  console.log(`✅ Express server running at http://localhost:${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', error);
  }
});

// Initialize background jobs
if (process.env.NODE_ENV !== 'test') {
  require('./jobs/refreshTokens');
  // Add other background jobs here
}

module.exports = app;
