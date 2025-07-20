const express = require('express');

const router = express.Router();

router.get('/oauth-config', (req, res) => {
  res.json({
    facebookAppId: process.env.FACEBOOK_APP_ID,
    facebookRedirectUri: process.env.FACEBOOK_REDIRECT_URI // Backend URI
  });
});

module.exports = router;