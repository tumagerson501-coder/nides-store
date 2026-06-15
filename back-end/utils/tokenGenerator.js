/**
 * NIDES STORE - JWT Verification Token Serialization Engine
 * Path: utils/tokenGenerator.js
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'SYS_FALLBACK_DEFAULT_SIGNING_VECTOR_HASH';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Packs user database identifiers inside encrypted tokens
 */
const generateTokenSignature = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });
};

module.exports = { generateTokenSignature };