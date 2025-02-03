const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Customer = require('../models/Customer'); // Adjust path to your model

router.post('/login', async (req, res) => {
  console.log('req.body in customer login is',req.body);
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: customer._id, email: customer.email }, 'your_jwt_secret', {
      expiresIn: '1h',
    });

    res.status(200).json({ token, name: customer.name });
  } catch (error) {
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});
const verifyCustomer = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token, 'your_jwt_secret');
      req.customer = decoded;
      next();
    } catch (error) {
      res.status(403).json({ error: 'Invalid or expired token' });
    }
  };
  
  router.get('/api/customers/appointments', verifyCustomer, async (req, res) => {
    try {
      const appointments = await Appointment.find({ email: req.customer.email }).sort({ date: 1 });
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch appointments.' });
    }
  });
  module.exports = router;
