const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('./models/User'); // Unified User model
const Appointment = require('./models/Appointment'); // Unified User model
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
const customerRoutes = require('./routes/customers'); // Adjust path
app.use('/api/customers', customerRoutes);
const appointmentRoutes = require('./routes/appointments'); // Adjust path
app.use('/api/appointments', appointmentRoutes);


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));
   
// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like Outlook, Yahoo, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});
// Contact form route
app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: email,
      to:  'shahfaisalkhan1993@gmail.com', // You receive the email
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

// Seeding Function
// const seedUsers = async () => {
//   try {
//     // Clear existing data in the collection
//     await User.deleteMany();
//     console.log('Existing users cleared.');

//     // Define sample data
//     const users = [
//       {
//         name: 'Admin User',
//         email: 'admin@example.com',
//         password: 'admin123', // Plaintext password
//         isAdmin: true,
//       },
//       {
//         name: 'Customer One',
//         email: 'customer1@example.com',
//         password: 'customer123', // Plaintext password
//         isAdmin: false,
//       },
//       {
//         name: 'Customer Two',
//         email: 'customer2@example.com',
//         password: 'customer456', // Plaintext password
//         isAdmin: false,
//       },
//     ];

//     // Hash passwords and prepare data for insertion
//     for (const user of users) {
//       user.password = await bcrypt.hash(user.password, 10); // Hash passwords
//     }

//     // Insert the users into the database
//     await User.insertMany(users);
//     console.log('Users seeded successfully.');

//     // Close the database connection
//     mongoose.connection.close();
//   } catch (error) {
//     console.error('Error seeding users:', error);
//     mongoose.connection.close();
//   }
// };

// // Execute the seeding function
// seedUsers();

  // const bcrypt = require('bcryptjs');
  // const Customer = require('./models/Customer'); // Adjust path to your model
  // const seedCustomers = async () => {
  //   try {
  //     console.log('Starting to seed customers...');
  //     const customers = [
  //       {
  //         name: 'Azam',
  //         email: 'azam@gmail.com',
  //         password: 'azam',
  //       },
  //     ];
  
  //     for (const customer of customers) {
  //       console.log('Hashing password for:', customer.email);
  //       customer.password = await bcrypt.hash(customer.password, 10);
  //     }
  
  //     console.log('Inserting customers into the database...');
  //     await Customer.insertMany(customers);
  //     console.log('Customer data seeded successfully');
  //     mongoose.connection.close();
  //   } catch (error) {
  //     console.error('Error seeding customer data:', error);
  //     mongoose.connection.close();
  //   }
  // };
  
  // seedCustomers();
// Appointment Schema
// const appointmentSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   phone: String,
//   date: String,
//   time: String,
//   message: String,
//   status: { type: String, default: 'pending' }, // Pending, Approved
// });
// const appointmentSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true, // Link to the logged-in user
//   },
//   date: {
//     type: String,
//     required: true,
//   },
//   time: {
//     type: String,
//     required: true,
//   },
//   message: {
//     type: String,
//     default: '',
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected'], // Appointment status
//     default: 'pending',
//   },
// });
// const Appointment = mongoose.model('Appointment', appointmentSchema);

// const bcrypt = require('bcryptjs');
// const Admin = require('./models/Admin');

// const seedAdmin = async () => {
//   const hashedPassword = await bcrypt.hash('admin123', 10); // Password: admin123
//   const admin = new Admin({ username: 'admin', password: hashedPassword });
//   await admin.save();
//   console.log('Admin user created');
// };

// seedAdmin();

// API Endpoint to Book Appointment
// app.post('/api/appointments', async (req, res) => {
//   try {
//     console.log('req.body in api/appointment is',req.body)
//     const appointment = new Appointment(req.body);
//     await appointment.save();
//     res.status(200).json({ message: 'Appointment booked successfully!' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to book appointment' });
//   }
// });

// app.post('/api/appointments', async (req, res) => {
//   try {
//     console.log('req.body in api/appointments is', req.body);
//     const { name, email, phone, date, time, message } = req.body;

//     // Check if the selected time or the next hour is already booked (excluding rejected appointments)
//     const [hours, minutes] = time.split(':');
//     const nextHour = `${String(Number(hours) + 1).padStart(2, '0')}:${minutes}`;

//     // Find any non-rejected appointment that matches the selected time or the next hour
//     const existingAppointment = await Appointment.findOne({
//       date,
//       $or: [
//         { time: time, status: { $ne: 'rejected' } },      // Check the selected time
//         // { time: nextHour, status: { $ne: 'rejected' } }, // Check the next hour
//       ],
//     });

//     if (existingAppointment) {
//       console.log('existing appointment in api/appointment is', existingAppointment);
//       return res.status(400).json({ error: 'This time slot or the following hour is already booked.' });
//     }

//     console.log('No conflicting appointment found. Proceeding to save.');
//     // Save the new appointment
//     const appointment = new Appointment({ name, email, phone, date, time, message, status: 'pending' }); // Default status: pending
//     await appointment.save();
//     res.status(200).json({ message: 'Appointment booked successfully!' });
//   } catch (error) {
//     console.error('Error in booking appointment:', error);
//     res.status(500).json({ error: 'Failed to book appointment.' });
//   }
// });
const authenticate = require('./middleware/authenticate'); // Import the middleware

app.post('/api/appointments', authenticate, async (req, res) => {
  try {
    // console.log('req.body in api/appointments is', req.body);
    // console.log('Authorization Header:', req.headers.authorization); // Log the header
    // console.log('User ID:', req.user.id); // Log the decoded user ID
    const { name, email, phone, date, time, message } = req.body;
    // console.log(req.user.id,name,email,phone,date,time,message);

    // Check if the selected time or the next hour is already booked (excluding rejected appointments)
    const [hours, minutes] = time.split(':');
    const nextHour = `${String(Number(hours) + 1).padStart(2, '0')}:${minutes}`;

    const existingAppointment = await Appointment.findOne({
      date,
      $or: [
        { time: time, status: { $ne: 'rejected' } },
      ],
    });

    if (existingAppointment) {
      console.log('existing appointment in api/appointment is', existingAppointment);
      return res.status(400).json({ error: 'This time slot for the following hour is already booked.' });
    }

    console.log('No conflicting appointment found. Proceeding to save.');

    // Save the new appointment with userId
    const appointment = new Appointment({
      userId: req.user.id, // Attach the logged-in user's ID
      name,
      email,
      phone,
      date,
      time,
      message,
      status: 'pending', // Default status
    });
    console.log('appointment object in the /api/appointment is',appointment)
    await appointment.save();
    res.status(200).json({ message: 'Your Appointment request sent successfully!.Your appointment current status is pending.Kindly wait for the appointment to be approved.' });
  } catch (error) {
    console.error('Error in booking appointment:', error);
    res.status(500).json({ error: 'Failed to book appointment.' });
  }
});

  
// app.get('/api/slots', async (req, res) => {
//     const { date } = req.query;
//     console.log('req.query in api/slots is',req.query)
//     // Define all possible time slots (in HH:mm format)
//     const allSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
  
//     // Fetch all booked appointments for the given date
//     const bookedAppointments = await Appointment.find({ date, status: 'approved' });
  
//     // Get booked slots and block 1 hour after each booked slot
//     const blockedSlots = [];
//     bookedAppointments.forEach((appointment) => {
//       blockedSlots.push(appointment.time);
  
//       // Calculate the next hour after the booked time
//       const [hours, minutes] = appointment.time.split(':');
//       const nextHour = `${String(Number(hours) + 1).padStart(2, '0')}:${minutes}`;
//       blockedSlots.push(nextHour);
//     });
  
//     // Determine available slots by excluding blocked slots
//     const availableSlots = allSlots.filter((slot) => !blockedSlots.includes(slot));
  
//     res.status(200).json({ availableSlots });
//   });
app.get('/api/slots', async (req, res) => {
    const { date } = req.query;
  
    // Define all possible time slots (in HH:mm format)
    const allSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
  
    try {
      // Fetch all booked appointments for the given date
      const bookedAppointments = await Appointment.find({ date, status: 'approved' });
    //   const bookedAppointments = await Appointment.find({ date });

      // Debug: Log all booked appointments
      console.log('Booked Appointments:', bookedAppointments);
  
      // Extract booked time slots
      const bookedSlots = bookedAppointments.map((appointment) => appointment.time);
  
      // Debug: Log all booked slots
      console.log('Booked Slots:', bookedSlots);
  
      // Prepare slots with availability status
      const slots = allSlots.map((slot) => ({
        time: slot,
        isAvailable: !bookedSlots.includes(slot), // False if the slot is in bookedSlots
      }));
  
      // Debug: Log all calculated slots with availability
      console.log('Calculated Slots:', slots);
  
      res.status(200).json({ slots });
    } catch (error) {
      console.error('Error fetching slots:', error);
      res.status(500).json({ error: 'Failed to fetch available slots' });
    }
  });
  
  const verifyAdmin = require('./middleware/auth');
  // Secure admin route
// app.get('/api/admin/appointments', verifyAdmin, async (req, res) => {
//     try {
//       const appointments = await Appointment.find().sort({ date: 1, time: 1 }); // Sorted by date and time
//       res.status(200).json(appointments);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to fetch appointments' });
//     }
//   });
app.get('/api/admin/appointments', async (req, res) => {
  const { page = 1, limit = 20 } = req.query; // Default to page 1, 10 items per page

  try {
    const totalAppointments = await Appointment.countDocuments(); // Total count of appointments
    const appointments = await Appointment.find()
      .sort({ date: -1, time: -1 }) // Sort by date and time
      .skip((page - 1) * limit) // Skip records for pagination
      .limit(Number(limit)); // Limit the number of records
    // console.log('appointments in /api/admin/appointments is',appointments)
    res.status(200).json({
      appointments,
      totalPages: Math.ceil(totalAppointments / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// app.patch('/api/admin/appointments/:id', async (req, res) => {
//     const { id } = req.params;
//     const { status } = req.body; // 'approved' or 'rejected'
  
//     try {
//       const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
//       if (!appointment) {
//         return res.status(404).json({ error: 'Appointment not found' });
//       }
//       res.status(200).json({ message: 'Appointment status updated successfully', appointment });
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to update appointment status' });
//     }
//   });
app.patch('/api/admin/appointments/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'

  try {
    const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(200).json({ message: 'Appointment status updated successfully', appointment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment status' });
  }
});
  

app.post('/api/register', async (req, res) => {
  const { name, email, password, isAdmin } = req.body; // Optionally allow isAdmin for admin creation

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false, // Default to false for regular users
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, 'your_jwt_secret');
    console.log('token in /api/login is',token)
    res.status(200).json({ token, isAdmin: user.isAdmin });
  } catch (error) {
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
