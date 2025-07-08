const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role // ✅ Include role
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

module.exports = generateToken;
