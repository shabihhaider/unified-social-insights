// backend/src/middlewares/requireRole.js
module.exports = (allowedRoles = []) => {
  return (req, res, next) => {
    const user = req.user; // comes from auth middleware

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Access denied: insufficient role' });
    }

    next();
  };
};
