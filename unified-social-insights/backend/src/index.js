const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config(); // Load .env variables early

// ✅ Import routes
const insightsRoute = require("./routes/insights");
const instagramRoutes = require("./routes/instagram");
const authRoute = require("./routes/auth");

// ✅ Import DB connection
const connectDB = require("./utils/db");
const { pool } = require("./utils/db");


const app = express();

// ✅ CORS config for frontend dev
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ Parse JSON request bodies
app.use(express.json());

// ✅ Connect to DB and initialize tables
connectDB();

// ✅ Mount all API routes
app.use("/api/insights", insightsRoute);       // AI engine route
app.use("/api/instagram", instagramRoutes);    // Instagram fetch route
app.use("/api/auth", authRoute);               // Facebook OAuth route

// ✅ Optional test route
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Backend is responding" });
});

// ✅ Optional test database route
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool().query("SELECT NOW()");
    res.json({ message: "✅ DB connected", now: result.rows[0] });
  } catch (err) {
    console.error("❌ DB test failed:", err);
    res.status(500).json({ error: "DB connection failed" });
  }
});


// ✅ Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ Express server running on http://localhost:${PORT}`);
});
