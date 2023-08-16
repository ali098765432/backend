const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  avatar: {
    data: Buffer,
    contentType: String,
    path: String,
  },
  resetPasswordOTP: String, // Add this field to store the OTP
  resetPasswordExpires: Date, // Add this field to store the expiration timestamp
});

module.exports = mongoose.model('users', userSchema);