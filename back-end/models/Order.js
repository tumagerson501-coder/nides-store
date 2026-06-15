/**
 * NIDES STORE - Order Transaction Manifest Schema
 * Path: models/Order.js
 */

const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    nameAtPurchase: { type: String, required: true },
    priceAtPurchase: { type: Number, required: true },
    quantity: { type: Number, required: true }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [OrderItemSchema],
    financialSummary: {
        subtotal: { type: Number, required: true },
        tax: { type: Number, required: true },
        shipping: { type: Number, required: true, default: 0.00 },
        grandTotal: { type: Number, required: true }
    },
    shippingDetails: {
        fullName: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        phone: { type: String, required: true }
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'authorized', 'failed', 'refunded'],
        default: 'pending'
    },
    fulfillmentStatus: {
        type: String,
        enum: ['processing', 'dispatched', 'delivered', 'cancelled'],
        default: 'processing'
    }
}, {
    timestamps: true
});

// Setup lookup optimizations for user tracking lists within their profile consoles
OrderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Order', OrderSchema);