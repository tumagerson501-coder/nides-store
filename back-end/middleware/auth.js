/**
 * NIDES STORE - Identity Access Token Middleware Interceptor
 * Path: middleware/auth.js
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'SYS_FALLBACK_DEFAULT_SIGNING_VECTOR_HASH';

/**
 * Validates consumer access credentials via signature parsing
 */
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Isolate signature token payload from the string prefix array
            token = req.headers.authorization.split(' ')[1];

            const decodedPayload = jwt.verify(token, JWT_SECRET);

            // Re-arm local request maps with actual data fields while dropping password masks
            req.user = await User.findById(decodedPayload.id).select('-password');
            
            if (!req.user) {
                return res.status(401).json({ success: false, message: "Handshake identity token has no matching database profile match." });
            }

            return next();
        } catch (error) {
            return res.status(401).json({ success: false, message: "Authorization handshake signature parsing failed or expired." });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "Missing request identity access token payload. Access denied." });
    }
};

/**
 * Blocks unauthorized users from structural administration tiers
 */
const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'administrator') {
        return next();
    }
    return res.status(403).json({ 
        success: false, 
        message: "Security Protocol Violation: Admin privilege criteria unverified." 
    });
};

module.exports = { protect, authorizeAdmin };