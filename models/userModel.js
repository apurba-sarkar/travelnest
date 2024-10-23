const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please fill your name"],
  },
  email: {
    type: String,
    required: [true, "please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide your email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "please provide a password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please provide a password"],
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
