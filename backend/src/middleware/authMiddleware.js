const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // 1. Get the token from the header (Format: "Bearer <token>")
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach the decoded user data (userId and organizationId) to the request object
    req.user = decoded;
    
    // 4. Move to the next function (the controller)
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;