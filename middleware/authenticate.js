const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  // const token = req.headers.authorization?.split(" ")[1];
  console.log("Token received in /api/appointments:", token);
  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Use your secret key
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('User not found.');
    }
    req.user = user; // Attach user to the request object
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = authenticate;
