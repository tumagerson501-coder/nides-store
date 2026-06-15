/**
 * NIDES STORE - Administrative Dashboard Command Console Routes
 * Path: routes/admin.js
 */

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');

/**
 * @route   POST /api/admin/products
 * @desc    Inject a new functional product item into the active marketplace registry
 */
router.post('/products', async (req, res) => {
    try {
        const { name, description, price, stock, category, imageUrl } = req.body;

        if (!name || !price || stock === undefined || !category) {
            return res.status(400).json({ success: false, message: "Incomplete configuration metrics provided for new product allocation." });
        }

        const newHardwareAsset = await Product.create({
            name, description, price, stock, category, imageUrl
        });

        return res.status(201).json({
            success: true,
            message: "Asset parameters compiled and loaded to live catalog listings.",
            data: newHardwareAsset
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @route   PATCH /api/admin/orders/:id/fulfillment
 * @desc    Manually override and alter delivery step tracking indicators for client packages
 */
router.patch('/orders/:id/fulfillment', async (req, res) => {
    try {
        const { status } = req.body; // Expected values matching enum limits: 'dispatched', 'delivered', 'cancelled'
        
        const activeOrderReference = await Order.findById(req.params.id);
        if (!activeOrderReference) {
            return res.status(404).json({ success: false, message: "Target system transaction manifest mapping lost." });
        }

        activeOrderReference.fulfillmentStatus = status;
        await activeOrderReference.save();

        return res.status(200).json({
            success: true,
            message: "Fulfillment target track value mutated successfully.",
            currentStatus: activeOrderReference.fulfillmentStatus
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;