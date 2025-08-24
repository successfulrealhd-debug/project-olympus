const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { hashPassword, verifyPassword } = require('../utils/auth');

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashed = await hashPassword(password);
        const newUser = await User.create({ name, email, password: hashed });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const valid = await verifyPassword(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Invalid password' });

        res.json({ message: 'Login successful', user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
