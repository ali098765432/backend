
const express = require('express');
const router = express.Router();


const authenticateMiddleware = require('../middlewares/authMiddleware');


router.get('/', (req, res) => {
    res.render("index");

})
router.get('/register', (req, res) => {
    res.render("auth/register");

})
router.get('/login', (req, res) => {
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


module.exports = router;