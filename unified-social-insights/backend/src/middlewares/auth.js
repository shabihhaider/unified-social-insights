// backend/src/middlewares/auth.js

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log('🔐 Auth middleware triggered');

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.warn('❌ Missing Authorization header');
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    console.warn('❌ Invalid Authorization format. Expected: Bearer <token>');
    return res.status(400).json({ error: 'Invalid Authorization format. Use Bearer <token>' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('✅ JWT verified for user ID:', decoded.id);
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
