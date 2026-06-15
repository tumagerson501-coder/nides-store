/**
 * NIDES STORE - Order Controller Actions Registry
 * Path: controllers/orderController.js
 */

const Order = require('../models/Order');
const Product = require('../models/Product');

exports.compileCheckoutTransaction = async (req, res, next) => {
    try {
        const { items, shippingDetails } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Cannot execute checkout processing on an empty order layout manifest." });
        }

        let processingBasket = [];
        let runningSubtotal = 0;

        for (let position of items) {
            const liveProduct = await Product.findById(position.productId);
            if (!liveProduct) {
                return res.status(404).json({ success: false, message: `Product link entry point ${position.productId} untraceable.` });
            }

            if (liveProduct.stock < position.quantity) {
                return res.status(400).json({ success: false, message: `Stock constraints overflow for item: [${liveProduct.name}].` });
            }

            // Atomic decrement operation loop
            liveProduct.stock -= position.quantity;
            await liveProduct.save();

            runningSubtotal += liveProduct.price * position.quantity;
            processingBasket.push({
                product: liveProduct._id,
                nameAtPurchase: liveProduct.name,
                priceAtPurchase: liveProduct.price,
                quantity: position.quantity
            });
        }

        const baselineTax = runningSubtotal * 0.08;
        const baselineShipping = runningSubtotal > 100 ? 0.00 : 9.99;

        const transactionalManifest = await Order.create({
            user: req.user.id,
            items: processingBasket,
            financialSummary: { subtotal: runningSubtotal, tax: baselineTax, shipping: baselineShipping, grandTotal: runningSubtotal + baselineTax + baselineShipping },
            shippingDetails,
            paymentStatus: 'authorized'
        });

        return res.status(201).json({ success: true, orderId: transactionalManifest._id, totalCharged: transactionalManifest.financialSummary.grandTotal });
    } catch (error) {
        next(error);
    }
};