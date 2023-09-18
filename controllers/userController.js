const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CarModel = require('../models/car'); // Create a Car model schema using mongoose

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
        //return resp.render('auth/register', { error: 'Email already registered.' });

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
      //resp.render('auth/register', { success: true, message: 'Registration successful, you can now login.' });

    } catch (error) {
      console.error('Error while registering user:', error);
     // resp.render('auth/register', { error: 'Something went wrong, please try again.' });

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
                return resp.render('auth/login', { error: 'something went wrong!' });
              }
              
              resp.status(200).json({
                result: 'Login successful',
                token: token,
                email: user.email,
                id: user._id,
              });
             // resp.cookie('token', token);
              console.log('Token:', token);

          //   return resp.render('index', { success: true, message: 'Login Sucessful' });

            });
          } else {
           return resp.render('auth/login', { error: 'invalid email and password' });
         // return resp.status(400).json({ error: 'Invalid email and password' });

          }
        } else {
         // return resp.render('auth/login', { error: 'No user found' });
         return resp.status(404).json({ error: 'No user found' });

        }
      } catch (error) {
        console.error('Error while logging in:', error);
        resp.status(500).json({ error: 'Something went wrong, please try again.' });
       // return resp.render('auth/login', { error: 'Something went wrong please try again' });

      }
    } else {
       resp.send({ result: 'Please provide email and password fields.' });
      //return resp.render('auth/login', { error: 'please provide email password both' });

    }
  };

  const addCar = async (req, resp) => {
    const {
      brand,
      model,
      yearofregistration,
      kmdriving,
      title,
      description,
    } = req.body;
  
    // Validation: Check if all required fields are provided
    if (!brand || !model || !yearofregistration || !kmdriving || !title || !description ) {
      return resp.status(400).json({ result: 'Please provide all required user details.' });
    }
  
    try {
      // Create a new Car instance using the CarModel
      const newCar = new CarModel({
        brand,
        model,
        yearofregistration,
        kmdriving,
        title,
        description,
      });
  
      // Save the new car to the database
      await newCar.save();
  
      resp.json({ result: 'Car added successfully!' });
    } catch (error) {
      console.error('Error while adding car:', error);
      resp.status(500).json({ error: 'Something went wrong, please try again.' });
    }
  };
  const profile=async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId).select('-password');
  
      if (user) {
        const userProfile = {
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        };
        res.json({ user: userProfile });
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).send('Something went wrong');
    }
  };


module.exports = {
    registerUser,
    loginUser,
    addCar,
    profile
  };