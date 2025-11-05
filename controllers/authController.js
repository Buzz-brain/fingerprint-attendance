const jwt = require('jsonwebtoken');
const Lecturer = require('../models/Lecturer');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const JWT_EXPIRES_IN = '8h';

// Register a new lecturer
exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }
  try {
    const existing = await Lecturer.findOne({ username });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Username already exists' });
    }
    const lecturer = new Lecturer({ username, password });
    await lecturer.save();
    // Optionally, auto-login after registration:
    // const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    // return res.json({ success: true, token });
    return res.json({ success: true, message: 'Registration successful' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Login (using Lecturer model)
exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }
  try {
    const lecturer = await Lecturer.findOne({ username });
    if (!lecturer) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await lecturer.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return res.json({ success: true, token });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
