const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log('🔐 Auth middleware triggered');
  const auth = req.headers.authorization;

  if (!auth) {
    console.log('❌ No authorization header');
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = auth.split(' ')[1];
  if (!token) {
    console.log('❌ Token format invalid');
    return res.status(401).json({ error: 'Access denied. Invalid token format.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('✅ Token verified:', decoded.id);
    next();
  } catch (err) {
    console.log('❌ Invalid token:', err.message);
    return res.status(403).json({ error: 'Invalid token.' });
  }
};
