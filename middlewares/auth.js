const jwt = require('jsonwebtoken');
//  Researcha vettig struktur för middleware

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, error: 'Authorization header is missing' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: 'Bearer token is missing' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    req.user = user;

    next();
  });
};

const verifyRole = (role) => (req, res, next) => {
  if (role.includes(req.user.role)) {
    return next();
  }
  return res.status(403).send({ message: 'Access denied' });
};

module.exports = { authenticate, verifyRole };
