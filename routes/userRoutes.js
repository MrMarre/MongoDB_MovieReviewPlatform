const { User } = require('../models/userModel');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { hashedPassword, comparePassword } = require('../bcrypt');

router

  .post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
      const hashPassword = await hashedPassword(password);
      const newUser = new User({
        username,
        email,
        password: hashPassword,
        role,
      });
      await newUser.save();
      res.status(201).send(newUser);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  })

  .post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Invalid password or email' });
      }
      console.log('User found:', user);

      const correctCredentials = await comparePassword(password, user.password);

      if (!correctCredentials) {
        return res.status(400).json({ error: 'Invalid password or email' });
      }
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );
      res.status(200).json({ user, token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;
