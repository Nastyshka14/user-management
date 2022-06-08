const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ message: 'No authorization' });
    }

    // const decoded = jwt.verify(token, config.get('jwtSecret'));
    const decoded = jwt.verify(token, 'nastya ex4 authorization');
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ message: 'No authorization' });
  }
};
