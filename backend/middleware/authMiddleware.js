const { findUserById } = require('../data/store');

function requireUser(req, res, next) {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const user = findUserById(userId);

  if (!user) {
    return res.status(401).json({ message: 'User not found.' });
  }

  req.user = user;
  next();
}

function requireAdmin(req, res, next) {
  requireUser(req, res, () => {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        message: 'Access denied. Admin access required.'
      });
    }

    next();
  });
}

module.exports = { requireUser, requireAdmin };
