const express = require('express');
const router = express.Router();
const metaController = require('../controllers/metaController');
const auth = require('../middlewares/auth');

router.get('/pages', auth, metaController.getFacebookPages);

module.exports = router;
