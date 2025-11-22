const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const [admins] = await db.query(
      'SELECT * FROM Admins WHERE Username = ?',
      [username]
    );

    if (admins.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = admins[0];

    // For demo: accept plain password 'admin123' or check bcrypt hash
    const isValidPassword = password === 'admin123' ||
                           await bcrypt.compare(password, admin.Password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        adminId: admin.Admin_ID,
        username: admin.Username,
        fullName: admin.Full_Name
      },
      process.env.JWT_SECRET || 'bloodsync_secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        id: admin.Admin_ID,
        username: admin.Username,
        fullName: admin.Full_Name,
        email: admin.Email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify Token
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bloodsync_secret_key');

    const [admins] = await db.query(
      'SELECT Admin_ID, Username, Full_Name, Email FROM Admins WHERE Admin_ID = ?',
      [decoded.adminId]
    );

    if (admins.length === 0) {
      return res.status(401).json({ error: 'Admin not found' });
    }

    res.json({ admin: admins[0], valid: true });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token', valid: false });
  }
});

module.exports = router;
