const jwt = require('jsonwebtoken');

const createToken = (user) =>
  jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

const verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);

module.exports = { createToken, verifyToken };
