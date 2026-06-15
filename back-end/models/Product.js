/**
 * NIDES STORE - Product Catalog Schema
 * Path: models/Product.js
 */

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product catalog label is mandatory.'],
        trim: true,
        maxlength: [120, 'Product nomenclature capped at 120 characters.']
    },
    description: {
        type: String,
        required: [true, 'Product structural description parameter required.'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Financial asset pricing metric required.'],
        min: [0.01, 'Pricing cannot map below sub-cent bounds.']
    },
    stock: {
        type: Number,
        required: [true, 'Inventory allocation tracker bounds mandatory.'],
        min: [0, 'Stock indicators cannot descend below absolute baseline zero.'],
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Product items must link to an active Category entity node.']
    },
    imageUrl: {
        type: String,
        default: '/images/placeholder.png'
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Optimization: Speed up query lookup times on pricing arrays and active state lookups
ProductSchema.index({ price: 1, isAvailable: -1 });

module.exports = mongoose.model('Product', ProductSchema);