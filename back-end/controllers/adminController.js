/**
 * NIDES STORE - Administrative Workspace Controller Actions Registry
 * Path: controllers/adminController.js
 */

const Product = require('../models/Product');
const Order = require('../models/Order');

exports.injectNewHardwareAsset = async (req, res, next) => {
    try {
        const newAsset = await Product.create(req.body);
        return res.status(201).json({ success: true, message: "Asset loaded cleanly to live listings catalog matrix data.", data: newAsset });
    } catch (error) {
        next(error);
    }
};

exports.overrideFulfillmentStatusTrack = async (req, res, next) => {
    try {
        const orderManifest = await Order.findById(req.params.id);
        if (!orderManifest) return res.status(404).json({ success: false, message: "Target system transaction manifest mapping lost." });

        orderManifest.fulfillmentStatus = req.body.status;
        await orderManifest.save();

        return res.status(200).json({ success: true, message: "Fulfillment step value mutated successfully.", currentStatus: orderManifest.fulfillmentStatus });
    } catch (error) {
        next(error);
    }
};