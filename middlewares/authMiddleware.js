const jwt = require('jsonwebtoken');
const jwtKey = 'ecomm-my';


const authenticateToken = (req, res, next) => {
   const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
   // const token = req.cookies.token || '';
    console.log('Token:', token);

    
    if (!token) {
     // return res.status(401).json({ error: 'You are not login you cannot access this page' });
     return res.redirect('/login');
    }
  
    jwt.verify(token, jwtKey, (err, decoded) => {
      if (err) {
        console.log('Token verification error:', err); // Log the error
      //  return res.status(403).json({ error: 'Invalid token.' });
      return res.redirect('/login');
      }
      
      console.log('Decoded token:', decoded); // Log the decoded token
      req.user = decoded; // Store the user information in the request
     // console.log("sdsdfsdf"+req.user)
      next();
    });
  };
  const redirectIfAuthenticated = (req, res, next) => {
  //  console.log("sdsdfsdf"+req.user)
    if (req.user) {
      // If user is authenticated, redirect to the home page
      return res.redirect('/');
    }
    next();
  };
  // const preventLoggedInAccess = (req, res, next) => {
  //   // Check if the user is authenticated
  //   if (req.user) {
  //     // User is already logged in, redirect to a different route
  //     return res.redirect('/'); // Redirect to the homepage or any other route
  //   }
  
  //   // User is not logged in, continue to the next middleware or route
  //   next();
  // };
  

  module.exports = {
    authenticateToken,
   // preventLoggedInAccess
   redirectIfAuthenticated 
  };