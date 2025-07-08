const express = require('express');
const { registerUser, emailLogin } = require('../auth/handlers');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', emailLogin);

module.exports = router;
