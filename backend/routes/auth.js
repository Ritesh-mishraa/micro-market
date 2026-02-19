const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth')

// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: 'User already exists' });

        user = new User({ username, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, username, email } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`[Login] Attempting login for: ${email}`);
    try {
        console.log('[Login] Finding user in DB...');
        let user = await User.findOne({ email });
        console.log(`[Login] User found: ${user ? 'Yes' : 'No'}`);

        if (!user) return res.status(400).json({ error: 'Invalid Credentials (User not found)' });

        console.log('[Login] Verifying password...');
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`[Login] Password match: ${isMatch}`);

        if (!isMatch) return res.status(400).json({ error: 'Invalid Credentials (Password mismatch)' });

        const payload = { user: { id: user.id } };
        console.log('[Login] Signing JWT...');
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
            if (err) {
                console.error('[Login] JWT Sign Error:', err);
                throw err;
            }
            console.log('[Login] Token generated, sending response.');
            res.json({ token, user: { id: user.id, username: user.username, email, favorites: user.favorites } });
        });
    } catch (err) {
        console.error('[Login] Server Error:', err.message);
        res.status(500).send('Server error');
    }
});

// Get Current User
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password').populate('favorites');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
