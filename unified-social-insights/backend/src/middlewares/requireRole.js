// backend/src/middlewares/requireRole.js

module.exports = (allowedRoles = []) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: No user found in request' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        error: `Access denied: requires ${allowedRoles.join(' or ')} role(s)`,
      });
    }

    next();
  };
};
