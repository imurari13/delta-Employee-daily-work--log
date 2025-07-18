// backend/employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  work: String,
  date: String,
});

module.exports = mongoose.model('Employee', employeeSchema);
