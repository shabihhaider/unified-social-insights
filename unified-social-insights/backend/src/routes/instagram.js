const express = require("express");
const axios = require("axios");
const router = express.Router();
const pool = require("../utils/db").pool;

router.post("/fetch-insights", async (req, res) => {
  const { instagram_account_id, access_token, user_id } = req.body;

  if (!instagram_account_id || !access_token || !user_id) {
    return res.status(400).json({ error: "Missing instagram_account_id, access_token or user_id" });
  }

  try {
    const fields = ["followers_count", "follows_count", "media_count", "username", "name"];
    const url = `https://graph.facebook.com/v19.0/${instagram_account_id}?fields=${fields.join(",")}&access_token=${access_token}`;
    const response = await axios.get(url);
    const data = response.data;

    const insertQuery = `
      INSERT INTO instagram_insights (
        user_id,
        username,
        followers_count,
        follows_count,
        media_count,
        full_name
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      user_id,
      data.username,
      data.followers_count,
      data.follows_count,
      data.media_count,
      data.name,
    ];

    const result = await pool().query(insertQuery, values);

    res.json({
      message: "✅ Insights fetched and stored successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error during fetch or insert:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch or store Instagram insights" });
  }
});

module.exports = router;