const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtKey = 'ecomm-my';

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); 
const multer = require('multer'); // Import the multer library
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('../db/config');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const registerUser = async (req, resp) => {
    console.log(req.file);
    const { name, email, password } = req.body;
  
    // Check for empty fields and validate email format
    if (!name || !email || !password) {
      return resp.status(400).json({ error: 'All fields are required.' });
    }
  
    if (!/\S+@\S+\.\S+/.test(email)) {
      return resp.status(400).json({ error: 'Invalid email format.' });
    }
  
    if (password.length < 6) {
      return resp.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }
  
    try {
      // Check if the user already exists with the provided email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return resp.status(400).json({ error: 'Email already registered.' });
      }
  
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Set default avatar path if no image is uploaded
      let avatarPath = ''; // Default to empty string
      if (req.file) {
        avatarPath = req.file.path;
      } else {
        // Use the path to your default avatar image
        avatarPath = 'uploads/default.png';
      }
  
      // Create a new User instance with the hashed password and avatar data
      const user = new User({
        name,
        email,
        password: hashedPassword,
        avatar: {
          data: fs.readFileSync(avatarPath), // Read the file content
          contentType: 'image/png', // Set the content type (change as needed)
          path: avatarPath,
        },
      });
  
      // Save the user to the database
      let result = await user.save();
      result = result.toObject();
      delete result.password;
  
      resp.send({ user: result });
    } catch (error) {
      console.error('Error while registering user:', error);
      resp.status(500).json({ error: 'Something went wrong, please try again.' });
    }
  };

const loginUser =async (req, resp) => {
    console.log(req.body);
    const { email, password } = req.body;
  
    if (email && password) {
      try {
        let user = await User.findOne({ email }).select('password email _id'); // Select 'email' and '_id' fields
        if (user) {
          const passwordMatch = await bcrypt.compare(password, user.password);
  
          if (passwordMatch) {
            jwt.sign({ id:user._id, email:user.email }, jwtKey, { expiresIn: "2h" }, (err, token) => {
              if (err) {
                resp.send({ result: "something went wrong" });
              }
              resp.send({
                result: 'Login successful',               
                token: token,
                email:user.email,
                id:user._id
              });
            });
          } else {
            resp.send({ result: 'Invalid email or password' });
          }
        } else {
          resp.send({ result: 'No user found' });
        }
      } catch (error) {
        console.error('Error while logging in:', error);
        resp.status(500).json({ error: 'Something went wrong, please try again.' });
      }
    } else {
      resp.send({ result: 'Please provide email and password fields.' });
    }
  };

module.exports = {
    registerUser,
    loginUser,
  };