const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const insightsRoute = require("./routes/insights"); // 🔁 Add this back
require("dotenv").config(); // This loads .env
const REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI;

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.use("/api/insights", insightsRoute); // ✅ Register AI route

// Optional: Keep test route for future debugging
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Backend is responding" });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ Express server running on http://localhost:${PORT}`);
});

const authRoute = require("./routes/auth");

// After your app.use(cors()) and app.use(express.json())
app.use("/api/auth", authRoute);
