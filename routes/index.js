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
router.post('/register', registerUpload.single('avatar'), userController.registerUser);
router.post('/login',loginUpload.none(), userController.loginUser);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOTP);
router.post('/reset-password', authController.resetPassword);
router.get('/getUser', authenticateMiddleware.authenticateToken, authController.getUser);

module.exports = router;