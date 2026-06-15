/**
 * NIDES STORE - Category Schema
 * Path: models/Category.js
 */

const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category identifier name string is mandatory.'],
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: [40, 'Category length constraint capped at 40 characters.']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Description allocation ceiling capped at 200 characters.']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);