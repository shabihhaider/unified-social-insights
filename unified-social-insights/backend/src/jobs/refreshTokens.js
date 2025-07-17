const cron = require('node-cron');
const axios = require('axios');
const pool = require('../utils/db').pool;

require('dotenv').config();

const APP_ID = process.env.FACEBOOK_APP_ID;
const APP_SECRET = process.env.FACEBOOK_APP_SECRET;

// Runs every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log('🔄 Running token refresh job...');

  try {
    const result = await pool().query(
      `SELECT id, page_id, page_token FROM linked_accounts`
    );

    const accounts = result.rows;

    for (const account of accounts) {
      try {
        const debugRes = await axios.get(
          `https://graph.facebook.com/debug_token`,
          {
            params: {
              input_token: account.page_token,
              access_token: `${APP_ID}|${APP_SECRET}`,
            },
          }
        );

        const isValid = debugRes.data.data?.is_valid;
        const expiresAt = debugRes.data.data?.expires_at;
        const now = Math.floor(Date.now() / 1000);

        if (!isValid || expiresAt - now < 7200) {
          // Refresh token if expiring within 2 hours
          const refreshedRes = await axios.get(
            `https://graph.facebook.com/oauth/access_token`,
            {
              params: {
                grant_type: 'fb_exchange_token',
                client_id: APP_ID,
                client_secret: APP_SECRET,
                fb_exchange_token: account.page_token,
              },
            }
          );

          const newToken = refreshedRes.data.access_token;

          await pool().query(
            `UPDATE linked_accounts SET page_token = $1 WHERE id = $2`,
            [newToken, account.id]
          );

          console.log(`✅ Token refreshed for page ${account.page_id}`);
        } else {
          console.log(`🟢 Token valid for page ${account.page_id}`);
        }
      } catch (err) {
        console.warn(
          `⚠️ Failed to refresh token for page ${account.page_id}:`,
          err?.response?.data || err.message
        );
      }
    }

    console.log('✅ Token refresh job completed.');
  } catch (err) {
    console.error('❌ Error running token refresh job:', err.message);
  }
});
