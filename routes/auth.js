const express = require('express');
router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const pool = require('../config');
const jwt = require('jsonwebtoken');




router.post('/signup', async (req, res) => {
  const { username, firstname, lastname, password } = req.body;
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const [rows, fields] = await pool.query('INSERT INTO user (username, firstname, lastname, password, role) VALUES (?, ?, ?, ?, ?)', [username, firstname, lastname, password, 'user']);
    res.status(200).send('User created successfully');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error creating user');
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows, fields] = await pool.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password]);
    if (rows.length === 0) {
      res.status(401).send('Incorrect username or password');
      return;
    }
    const user = rows[0];
    const token = jwt.sign({ user }, 'taifhoonz');
    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).send(token);
    // res.redirect('/');
    // console.log(req.session.user)
  } catch (err) {
    console.log(err);
    res.status(500).send('Error logging in');
  }
});

router.get('/userbyid/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows, fields] = await pool.query('SELECT * FROM user WHERE id = ?', [id]);
    const user = rows[0];
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error retrieving user data');
  }
});

router.get('/userbyusername/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const [rows, fields] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);
    const user = rows[0];
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error retrieving user data');
  }
});


exports.router = router;

