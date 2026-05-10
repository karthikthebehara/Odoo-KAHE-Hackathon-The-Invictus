const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// Mock Signup (Module 1 is actually responsible for this)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Insert without real hashing just to unblock Module 4 testing
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, 'mock_hash_for_testing']
    );

    res.status(201).json({ success: true, userId: result.insertId, message: 'Mock Signup Successful' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Database error during signup' });
  }
});

// Mock Login (Module 1 is actually responsible for this)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [[user]] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!user) {
      return res.status(401).json({ error: 'You are not registered yet' });
    }

    res.json({ success: true, userId: user.id, message: 'Mock Login Successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error during login' });
  }
});

module.exports = router;
