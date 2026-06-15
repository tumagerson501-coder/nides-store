/**
 * NIDES STORE - User Account & Profile Telemetry Routes
 * Path: routes/users.js
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');

/**
 * @route   PUT /api/users/:id/shipping
 * @desc    Update a consumer's preferred shipping destination values within their saved vault profiles
 */
router.put('/:id/shipping', async (req, res) => {
    try {
        const { street, city, state, zip, phone } = req.body;
        
        const profileNode = await User.findById(req.params.id);
        if (!profileNode) {
            return res.status(404).json({ success: false, message: "Target user identity trace unverified." });
        }

        profileNode.savedShipping = { street, city, state, zip, phone };
        await profileNode.save();

        return res.status(200).json({
            success: true,
            message: "User context address specifications normalized.",
            data: profileNode.savedShipping
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @route   GET /api/users/:id/orders
 * @desc    Isolate and dump all historical transaction configurations for a specific client profile card
 */
router.get('/:id/orders', async (req, res) => {
    try {
        const customerManifestHistory = await Order.find({ user: req.params.id }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: customerManifestHistory.length,
            data: customerManifestHistory
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;