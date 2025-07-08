const requireAuth = require('../middlewares/auth');

const express = require("express");
const axios = require("axios");
const router = express.Router();

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || "http://localhost:8000/insights/";

router.post("/generate", async (req, res) => {
    console.log("📨 Received POST to /api/insights/generate");
  try {
    const { account_name, recent_metrics } = req.body;

    const response = await axios.post(AI_ENGINE_URL, {
      account_name,
      recent_metrics,
    });

    res.status(200).json({
      success: true,
      insights: response.data.insights,
    });
  } catch (err) {
    console.error("AI Engine error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
        });
    res.status(500).json({
      success: false,
      error: "Failed to generate insights",
      details: err?.response?.data || err.message,
    });
  }
});

module.exports = router;
