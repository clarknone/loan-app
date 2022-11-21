
const mongoose = require('mongoose');

const UserModel = mongoose.Schema({
  
  firstname: { type: String,},
  lastname: { type: String,},
  email: { type: String,},

}, {
  timestamps: true
});

exports.UserModel = mongoose.model('User', UserModel);