/**
 * NIDES STORE - Product Browsing Routes
 * Path: routes/products.js
 */

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

/**
 * @route   GET /api/products
 * @desc    Fetch comprehensive active product inventory items with clean filtering variables
 */
router.get('/', async (req, res) => {
    try {
        const { category, minPrice, maxPrice } = req.query;
        let queryFilter = { isAvailable: true };

        // Append category parameter configurations if parsed
        if (category) {
            queryFilter.category = category;
        }

        // Construct mathematical boundaries for inventory queries
        if (minPrice || maxPrice) {
            queryFilter.price = {};
            if (minPrice) queryFilter.price.$gte = Number(minPrice);
            if (maxPrice) queryFilter.price.$lte = Number(maxPrice);
        }

        const items = await Product.find(queryFilter)
            .populate('category', 'name')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @route   GET /api/products/:id
 * @desc    Isolate an explicit product node via its index reference
 */
router.get('/:id', async (req, res) => {
    try {
        const item = await Product.findById(req.params.id).populate('category', 'name');
        if (!item) {
            return res.status(404).json({ success: false, message: "Target product record missing." });
        }
        return res.status(200).json({ success: true, data: item });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Invalid structural object identification trace format." });
    }
});

module.exports = router;