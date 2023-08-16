const jwt = require('jsonwebtoken');
const jwtKey = 'ecomm-my';


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token not provided.' });
    }
  
    jwt.verify(token, jwtKey, (err, decoded) => {
      if (err) {
        console.log('Token verification error:', err); // Log the error
        return res.status(403).json({ error: 'Invalid token.' });
      }
      
      console.log('Decoded token:', decoded); // Log the decoded token
      req.user = decoded; // Store the user information in the request
      next();
    });
  };


  module.exports = {
    authenticateToken,
  };