// backend/src/middlewares/auth.js

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = decoded;

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Authenticated user:', decoded.email || decoded.id);
    }

    next();
  } catch (err) {
    const isExpired = err.name === 'TokenExpiredError';
    console.error('❌ JWT Verification Error:', err.message);
    return res.status(isExpired ? 401 : 403).json({
      error: isExpired
        ? 'Token expired. Please log in again.'
        : 'Invalid or tampered token.',
    });
  }
};
