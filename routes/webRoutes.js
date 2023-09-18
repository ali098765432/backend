
const express = require('express');
const router = express.Router();


const authenticateMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.get('/',authenticateMiddleware.authenticateToken, (req, res) => {
    res.render("index");

})
router.get('/register',authenticateMiddleware.redirectIfAuthenticated, (req, res) => {
    res.render("auth/register");

})
router.get('/login',authenticateMiddleware.redirectIfAuthenticated, (req, res) => {
    res.render("auth/login");

});

router.get('/forget-password', (req, res) => {
    res.render("auth/forget-password");

})

router.get('/verify-email', (req, res) => {
    res.render("auth/verify-email");

})
router.get('/reset-password', (req, res) => {
    res.render("auth/reset-password");
})
router.get('/two-step', (req, res) => {
    res.render("auth/two-step-verification");

})
//router.get('/logout', authenticateMiddleware.authenticateToken, authController.logoutUser);
router.get('/protected', authenticateMiddleware.authenticateToken, (req, res) => {
    // Access req.user here to get the authenticated user's data
    res.json({ user: req.user });
  });


module.exports = router;