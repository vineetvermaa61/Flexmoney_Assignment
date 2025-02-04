require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import models
const User = require('./models/User');
const Enrollment = require('./models/Enrollment');
const Payment = require('./models/Payment');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

// Authentication Middleware
function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid." });
  }
}

// Mock CompletePayment function
function CompletePayment(paymentDetails) {
  // Simulated payment function – always returns success.
  return {
    success: true,
    transactionId: "TXN" + Date.now()
  };
}

// Helper: Check if user is already enrolled in the current month
async function checkCurrentMonthEnrollment(userId) {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);

  const enrollment = await Enrollment.findOne({
    user: userId,
    enrollmentDate: { $gte: startOfMonth, $lt: endOfMonth }
  });
  return enrollment;
}

// --------------------- ROUTES ---------------------

// Signup Route
app.post('/signup', async (req, res) => {
  try {
    const { name, age, email, phone, password } = req.body;
    if (!name || !age || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (age < 18 || age > 65) {
      return res.status(400).json({ message: "Age must be between 18 and 65." });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, age, email, phone, password: hashedPassword });
    await user.save();

    // Generate JWT token on signup (optional – user may then log in)
    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Enrollment Route (requires authentication)
app.post('/enroll', authMiddleware, async (req, res) => {
  const { batch } = req.body;
  if (!batch || !["6-7AM", "7-8AM", "8-9AM", "5-6PM"].includes(batch)) {
    return res.status(400).json({ message: "Invalid batch selection." });
  }
  try {
    // Ensure user is enrolling only once per month.
    const existingEnrollment = await checkCurrentMonthEnrollment(req.user.id);
    if (existingEnrollment) {
      return res.status(400).json({ message: "Already enrolled for this month." });
    }
    // Create enrollment record
    const enrollment = new Enrollment({ user: req.user.id, batch });
    await enrollment.save();

    // Process Payment (simulate with CompletePayment)
    const paymentResponse = CompletePayment({ userId: req.user.id, amount: 500 });
    if (!paymentResponse.success) {
      return res.status(400).json({ message: "Payment failed." });
    }
    // Save payment record
    const payment = new Payment({
      user: req.user.id,
      enrollment: enrollment._id,
      transactionId: paymentResponse.transactionId,
      status: "success"
    });
    await payment.save();

    res.status(200).json({ message: "Enrollment successful.", enrollment, payment: paymentResponse });
  } catch (error) {
    console.error("Enrollment Error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Profile Route (returns user details and current month enrollment/payment)
app.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const enrollment = await checkCurrentMonthEnrollment(req.user.id);
    let payment = null;
    if (enrollment) {
      payment = await Payment.findOne({ enrollment: enrollment._id });
    }
    res.status(200).json({ user, enrollment, payment });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
