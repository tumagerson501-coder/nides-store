/**
 * NIDES STORE - Authentication Routes
 * Path: routes/auth.js
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new customer profile node
 */
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Basic structural integrity guard
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ success: false, message: "All initialization parameters are mandatory." });
        }

        // Check for pre-existing collision vectors
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "Identity string token allocation collision. User already registered." });
        }

        // Generate and serialize the profile structure
        const user = await User.create({ firstName, lastName, email, password });

        return res.status(201).json({
            success: true,
            message: "Account compiled successfully.",
            userId: user._id
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate credentials and authorize user session
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password components are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid cryptographic handshake credentials." });
        }

        // Check password matching constraints via instance method
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid cryptographic handshake credentials." });
        }

        return res.status(200).json({
            success: true,
            message: "Authorization token mapped.",
            user: {
                id: user._id,
                firstName: user.firstName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;

// Example structural implementation template matching paths inside routes/auth.js:
const express = require('express');
const router = express.Router();
const { registerProfileNode, authorizeHandshakeSession } = require('../controllers/authController');

router.post('/register', registerProfileNode);
router.post('/login', authorizeHandshakeSession);

module.exports = router;