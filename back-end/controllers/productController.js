/**
 * NIDES STORE - Product Controller Actions Registry
 * Path: controllers/productController.js
 */

const Product = require('../models/Product');

exports.getMarketplaceCatalog = async (req, res, next) => {
    try {
        const { category, minPrice, maxPrice } = req.query;
        let filteringMatrix = { isAvailable: true };

        if (category) filteringMatrix.category = category;
        if (minPrice || maxPrice) {
            filteringMatrix.price = {};
            if (minPrice) filteringMatrix.price.$gte = Number(minPrice);
            if (maxPrice) filteringMatrix.price.$lte = Number(maxPrice);
        }

        const items = await Product.find(filteringMatrix).populate('category', 'name').sort({ createdAt: -1 });
        return res.status(200).json({ success: true, count: items.length, data: items });
    } catch (error) {
        next(error);
    }
};

exports.isolateProductRecord = async (req, res, next) => {
    try {
        const productInstance = await Product.findById(req.params.id).populate('category', 'name');
        if (!productInstance) {
            return res.status(404).json({ success: false, message: "Target product record missing." });
        }
        return res.status(200).json({ success: true, data: productInstance });
    } catch (error) {
        next(error);
    }
};