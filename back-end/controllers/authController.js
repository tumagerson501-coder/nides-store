/**
 * NIDES STORE - Auth Controller Actions Registry
 * Path: controllers/authController.js
 */

const User = require('../models/User');
const { generateTokenSignature } = require('../utils/tokenGenerator');

exports.registerProfileNode = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ success: false, message: "All initialization parameters are mandatory." });
        }

        const userCollisionCheck = await User.findOne({ email });
        if (userCollisionCheck) {
            return res.status(400).json({ success: false, message: "Identity string token allocation collision. User already registered." });
        }

        const createdUser = await User.create({ firstName, lastName, email, password });
        const allocationToken = generateTokenSignature(createdUser._id);

        return res.status(201).json({
            success: true,
            token: allocationToken,
            userId: createdUser._id,
            message: "Account compiled successfully."
        });
    } catch (error) {
        next(error);
    }
};

exports.authorizeHandshakeSession = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password components are required." });
        }

        const targetUser = await User.findOne({ email });
        if (!targetUser || !(await targetUser.comparePassword(password))) {
            return res.status(401).json({ success: false, message: "Invalid cryptographic handshake credentials." });
        }

        const sessionToken = generateTokenSignature(targetUser._id);

        return res.status(200).json({
            success: true,
            token: sessionToken,
            user: { id: targetUser._id, name: targetUser.firstName, role: targetUser.role }
        });
    } catch (error) {
        next(error);
    }
};