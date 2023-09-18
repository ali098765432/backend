const jwt = require('jsonwebtoken');
const jwtKey = 'ecomm-my';

const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs'); 
const multer = require('multer'); // Import the multer library
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('../db/config');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const User = require('../models/userModel');

  const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        //return res.status(400).json({ error: 'User not found.' });
        return res.render('auth/forget-password', { error: 'No user found' });

      }
  
      // Generate OTP and set expiration time (e.g., 15 minutes)
      const otp = Math.floor(100000 + Math.random() * 900000);
      user.resetPasswordOTP = otp;
      user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
      await user.save();
  
      // Send OTP to user's email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mali383737@gmail.com',
          pass: 'hlbjpupfgsymhbpa',
        },
      });
  
      const mailOptions = {
        from: 'mali383737@gmail.com',
        to: user.email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset: ${otp}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          //res.status(500).json({ error: 'Something went wrong, please try again.' });
          return res.render('auth/forget-password', { error: 'Something went wrong, please try again.' });

        } else {
         // res.status(200).json({ message: 'OTP sent to your email.' });
         return res.render('auth/two-step-verification', { success: true, message: 'OTP send Successfully' });

        }
      });
    } catch (error) {
      console.error('Error generating OTP:', error);
     // res.status(500).json({ error: 'Something went wrong, please try again.' });
     return res.render('auth/forget-password', { error: 'Something went wrong, please try again.' });

    }
  };
  const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      const user = await User.findOne({
        email,
        resetPasswordOTP: otp,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        // return res.status(400).json({ error: 'Invalid or expired OTP.' });
        return res.render('auth/two-step-verification', { error: 'invalid or expired OTP' });

      }
  else{
     // res.status(200).json({ message: 'OTP verified.' });
     return res.render('auth/reset-password', { success: true, message: 'OTP Verified' });
  }
    } catch (error) {
      console.error('Error verifying OTP:', error);
     // res.status(500).json({ error: 'Something went wrong, please try again.' });
     return res.render('auth/two-step-verification', { error: 'Something went wrong, please try again.' });

    }
  };
  const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ error: 'User not found.' });
      }
  
      // Update the user's password and reset token fields
      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordOTP = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
     // res.status(200).json({ message: 'Password reset successful.' });
     return res.render('auth/login', { success: true, message: 'password reset successfully' });

    } catch (error) {
      console.error('Error resetting password:', error);
      return res.render('auth/reset-password', { error: 'Something went wrong, please try again.' });
    }
  };
  const getUser =  async (req, res) => {
    try {
      
      const userEmail = req.user.email; // Assuming you've stored the user ID in the token payload
      const user = await User.findOne({email: userEmail }).select('email name'); // Exclude password field
      
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      return res.status(200).json({ user });
    } catch (error) {
      console.error('Error while fetching user:', error);
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  };
  //  const resetOTP= async (req, res) => {
  //   const { email } = req.body;
  
  //   try {
  //     const user = await User.findOne({ email });
  //     if (!user) {
  //       return res.status(400).json({ error: 'User not found.' });
  //     }
  
  //     const newOTP = generateOTP();
  
  //     user.resetPasswordOTP = newOTP;
  //     user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  //     await user.save();
  
  //     const transporter = nodemailer.createTransport({
        
  //         service: 'gmail',
  //         auth: {
  //           user: 'mali383737@gmail.com',
  //           pass: 'hlbjpupfgsymhbpa',
  //         },
        
  //     });
  
  //     const mailOptions = {
  //       from: 'mali383737@gmail.com',
  //       to: user.email,
  //       subject: 'New OTP for Password Reset',
  //       text: `Your new OTP for password reset: ${newOTP}`,
  //     };
  
  //     transporter.sendMail(mailOptions, (error, info) => {
  //       if (error) {
  //         console.error('Error sending email:', error);
  //         return res.render('auth/two-step-verification', { error: 'Something went wrong, please try again.' });
  //       } else {
  //        // res.status(200).json({ message: 'New OTP sent to your email.' });
  //        return res.render('auth/two-step-verification', { success: true, message: 'OTP resend successfully' });

  //       }
  //     });
  //   } catch (error) {
  //     console.error('Error resending OTP:', error);
  //     return res.render('auth/two-step-verification', { error: 'Something went wrong, please try again.' });
  //   }
  // };
  // const logoutUser = (req, res) => {
  //   // You may need to clear the token from client-side (cookies/local storage)
  //   // Example for clearing a cookie named 'auth_token':
  //   res.clearCookie('auth_token');
  
  //   // Redirect the user to the login page after logout
  //   res.redirect('/login');
  // };
module.exports = {
    forgotPassword,
    verifyOTP,
    resetPassword,
    getUser,
   // logoutUser
    //resetOTP
  };