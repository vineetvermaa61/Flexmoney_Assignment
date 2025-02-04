const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  batch: { 
    type: String, 
    required: true, 
    enum: ["6-7AM", "7-8AM", "8-9AM", "5-6PM"]
  },
  enrollmentDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
