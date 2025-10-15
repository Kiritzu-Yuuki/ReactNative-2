const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// Local login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success:false, message:'Faltan datos' });
  try {
    const [rows] = await pool.execute('SELECT id, name, email, password, photo_url FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.json({ success:false, message:'Usuario no existe' });
    const user = rows[0];
    if (user.password !== password) return res.json({ success:false, message:'Contraseña incorrecta' });
    delete user.password;
    res.json({ success:true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message:'Error interno' });
  }
});

// Mock OAuth endpoints for testing without real credentials
router.get('/oauth/mock/google', (req, res) => {
  // Simulate a Google callback returning a user JSON
  res.json({ success:true, provider:'google', user:{ id: 'g123', name:'Google Mock', email:'google@mock.com', photo_url:'' } });
});

router.get('/oauth/mock/facebook', (req, res) => {
  res.json({ success:true, provider:'facebook', user:{ id: 'f123', name:'FB Mock', email:'fb@mock.com', photo_url:'' } });
});

module.exports = router;
