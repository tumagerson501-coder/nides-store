/**
 * NIDES STORE - User Account Controller Actions Registry
 * Path: controllers/userController.js
 */

const User = require('../models/User');
const Order = require('../models/Order');

exports.modifyShippingVaultAddress = async (req, res, next) => {
    try {
        const profile = await User.findById(req.user.id);
        if (!profile) return res.status(404).json({ success: false, message: "User index unverified." });

        profile.savedShipping = req.body; // Map inbound configuration fields safely onto embedded sub-document layers
        await profile.save();

        return res.status(200).json({ success: true, message: "Profile context address specifications normalized.", data: profile.savedShipping });
    } catch (error) {
        next(error);
    }
};

exports.fetchClientOrderHistory = async (req, res, next) => {
    try {
        const orderHistoryArray = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, count: orderHistoryArray.length, data: orderHistoryArray });
    } catch (error) {
        next(error);
    }
};