const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    if(await User.findOne({ email })) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ username, email, password, role });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, username, email, role: user.role } });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if(!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, username: user.username, email, role: user.role } });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
