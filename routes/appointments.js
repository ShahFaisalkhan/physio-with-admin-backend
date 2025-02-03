// src/routes/appointments.js
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const authenticate = require('../middleware/authenticate'); // Middleware to verify the user

// Get appointments for the logged-in user
// router.get('/user-appointments', authenticate, async (req, res) => {
//   try {
//     const userId = req.user.id; // Assuming `req.user.id` is set by the `authenticate` middleware
//     const appointments = await Appointment.find({ userId }).sort({ date: 1 });
//     res.status(200).json(appointments);
//   } catch (error) {
//     console.error('Error fetching user appointments:', error);
//     res.status(500).json({ error: 'Failed to fetch appointments.' });
//   }
// });
router.get('/user-appointments', authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user.id` is set by the `authenticate` middleware
    const { page = 1, limit = 15 } = req.query; // Default values for pagination

    // Fetch paginated appointments, sorted by date in descending order (latest first)
    const appointments = await Appointment.find({ userId })
      .sort({ date: -1,time: -1}) // Sort by descending date
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Count total appointments for pagination metadata
    const totalAppointments = await Appointment.countDocuments({ userId });

    res.status(200).json({
      appointments,
      totalAppointments,
      totalPages: Math.ceil(totalAppointments / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments.' });
  }
});

module.exports = router;
