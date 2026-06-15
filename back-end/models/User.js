/**
 * NIDES STORE - User Identity Schema
 * Path: models/User.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name parsing parameter is mandatory.'],
        trim: true,
        maxlength: [50, 'First name constraint capped at 50 characters.']
    },
    lastName: {
        type: String,
        required: [true, 'Last name parsing parameter is mandatory.'],
        trim: true,
        maxlength: [50, 'Last name constraint capped at 50 characters.']
    },
    email: {
        type: String,
        required: [true, 'Email field token is mandatory.'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid syntax mapping inside Email configuration string.']
    },
    password: {
        type: String,
        required: [true, 'Cryptographic password vector required.'],
        minlength: [6, 'Security protocol constraint: 6 characters minimum threshold.']
    },
    role: {
        type: String,
        enum: ['customer', 'administrator'],
        default: 'customer'
    },
    savedShipping: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        zip: { type: String, trim: true },
        phone: { type: String, trim: true }
    }
}, {
    timestamps: true
});

// Structural Hook Layer: Intercept password changes and encrypt with salt cycles
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Decryption verification method instance logic
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);