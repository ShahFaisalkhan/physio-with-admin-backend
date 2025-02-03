const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Link to the logged-in user
    },
    name: {
      type: String,
      required: true, // Name of the person booking the appointment
    },
    email: {
      type: String,
      required: true, // Email of the person booking the appointment
    },
    phone: {
      type: String,
      required: true, // Phone number of the person booking the appointment
      
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'], // Appointment status
      default: 'pending',
    },
  });
  module.exports = mongoose.model('Appointment', appointmentSchema);
  