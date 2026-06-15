/**
 * NIDES STORE - Shopping Cart Cache Schema
 * Path: models/Cart.js
 */

const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Minimum item quantity tracking iteration must be at least 1.'],
        default: 1
    }
}, { _id: false }); // Prevents mongoose from nesting internal sub-document IDs into raw loops

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // Guarantees a strict 1-to-1 operational allocation between a profile and its cart cache
    },
    items: [CartItemSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', CartSchema);