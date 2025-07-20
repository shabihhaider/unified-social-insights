const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables early

const connectDB = require("./utils/db");
const { pool } = require("./utils/db");
const passport = require("passport"); // ✅ Import Passport

// ✅ Initialize Express
const app = express();

// ✅ Init Passport BEFORE routes
app.use(passport.initialize());

// ✅ Connect to DB and initialize tables
connectDB();

// ✅ Middleware
app.use(cors({
  origin: "http://localhost:3000", // Frontend URL
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());

// ✅ Mount all routes
const insightsRoute = require("./routes/insights");
const instagramRoutes = require("./routes/instagram");
const authRoute = require("./routes/auth");
const fetchDetailedInsights = require("./routes/instagram/fetchDetailedInsights");
const protectedRoutes = require('./routes/protectedRoutes');
const configRoutes = require('./routes/configRoutes');
const socialAccountsRoute = require('./routes/socialAccounts');
const SocialAccount = require('./models/SocialAccount');
SocialAccount.createTable();

app.use('/api/social-accounts', socialAccountsRoute);
app.use('/api/config', configRoutes);
app.use("/api/insights", insightsRoute);
app.use("/api/instagram", instagramRoutes);
app.use("/api/auth", authRoute);
app.use(fetchDetailedInsights);
app.use('/api/protected', protectedRoutes);
app.use("/api/auth", authRoute);

// ✅ Healthcheck route
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Backend is responding" });
});

// ✅ DB test route
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool().query("SELECT NOW()");
    res.json({ message: "✅ DB connected", now: result.rows[0] });
  } catch (err) {
    console.error("❌ DB test failed:", err.message);
    res.status(500).json({ error: "DB connection failed" });
  }
});


// ✅ Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ Express server running at http://localhost:${PORT}`);
});

require('./jobs/refreshTokens');