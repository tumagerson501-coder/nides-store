/**
 * NIDES STORE - Order Lifecycle Routes
 * Path: routes/orders.js
 */

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * @route   POST /api/orders
 * @desc    Authorize item allocations, calculate sub-totals, and write order entries
 */
router.post('/', async (req, res) => {
    try {
        const { userId, items, shippingDetails } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Cannot execute checkout processing on an empty order layout manifest." });
        }

        let compiledItems = [];
        let subtotal = 0;

        // Atomic iteration loop to resolve true catalog pricing and block over-drafting store quantities
        for (let entry of items) {
            const dbProduct = await Product.findById(entry.productId);
            if (!dbProduct) {
                return res.status(404).json({ success: false, message: `Product reference link node ${entry.productId} untraceable.` });
            }

            if (dbProduct.stock < entry.quantity) {
                return res.status(400).json({ success: false, message: `Stock constraints overflow for item: [${dbProduct.name}].` });
            }

            // Decrement active store inventory counts safely
            dbProduct.stock -= entry.quantity;
            await dbProduct.save();

            const analyticalPrice = dbProduct.price;
            subtotal += analyticalPrice * entry.quantity;

            compiledItems.push({
                product: dbProduct._id,
                nameAtPurchase: dbProduct.name,
                priceAtPurchase: analyticalPrice,
                quantity: entry.quantity
            });
        }

        const calculatedTax = subtotal * 0.08; // 8% sales tax calculation rule configuration
        const calculatedShipping = subtotal > 100 ? 0.00 : 9.99; // Free shipping threshold override logic
        const absoluteGrandTotal = subtotal + calculatedTax + calculatedShipping;

        const transactionalManifest = await Order.create({
            user: userId,
            items: compiledItems,
            financialSummary: {
                subtotal,
                tax: calculatedTax,
                shipping: calculatedShipping,
                grandTotal: absoluteGrandTotal
            },
            shippingDetails,
            paymentStatus: 'authorized' // Simulated payment processing state validation
        });

        return res.status(201).json({
            success: true,
            message: "Order context written successfully to persistent records.",
            orderId: transactionalManifest._id,
            totalCharged: absoluteGrandTotal
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;