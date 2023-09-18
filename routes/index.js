const express = require('express');
const router = express.Router();
const multer = require('multer'); // Import the multer library

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const authenticateMiddleware = require('../middlewares/authMiddleware');


const loginStorage = multer.memoryStorage();
const loginUpload = multer({ storage: loginStorage });

const registerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Save the avatar files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
}); 
 const registerUpload = multer({ storage: registerStorage });


// Define your routes and associate them with controllers
router.post('/register',authenticateMiddleware.redirectIfAuthenticated, registerUpload.single('avatar'), userController.registerUser);
router.post('/login',authenticateMiddleware.redirectIfAuthenticated,loginUpload.none(), userController.loginUser);
router.post('/forgot-password', authenticateMiddleware.authenticateToken, authController.forgotPassword);
router.post('/verify-otp', authController.verifyOTP);
router.post('/reset-password', authController.resetPassword);
//router.post('/resend-otp', authController.resetOTP);
router.get('/getUser', authenticateMiddleware.authenticateToken, authController.getUser);
router.post('/addcars',authenticateMiddleware.authenticateToken, userController.addCar);
router.get('/profile/:userId',authenticateMiddleware.authenticateToken,userController.profile )

module.exports = router;