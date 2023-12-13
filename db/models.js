const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  roles: {
    type: [String],
    default: ['user'],
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = { User };


