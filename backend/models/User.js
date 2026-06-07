const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
  aadharNo: { type: String },
  enrollmentNo: { type: String },
  city: { type: String },
  state: { type: String },
  address: { type: String },
  mobileNo: { type: String },
  studentIdUrl: { type: String },
  collegeIdUrl: { type: String },
});

module.exports = mongoose.model('User', UserSchema);