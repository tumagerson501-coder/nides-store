/**
 * NIDES STORE - Global Error Boundary Parser Middleware
 * Path: middleware/errorHandler.js
 */

const errorHandler = (err, req, res, next) => {
    let errorInstance = { ...err };
    errorInstance.message = err.message;

    // Log the stack trace internally for deployment monitoring
    console.error(`[INTERCEPTED_EXCEPTION] Trace Details: ${err.stack}`);

    // Mongoose cast exception mapping (e.g., malformed Hex String ObjectIDs)
    if (err.name === 'CastError') {
        const structuralMsg = `Resource allocation indicator reference format [${err.value}] is invalid.`;
        return res.status(404).json({ success: false, message: structuralMsg });
    }

    // Duplicate key mapping exceptions (MongoDB status error code 11000)
    if (err.code === 11000) {
        const duplicationField = Object.keys(err.keyValue || {});
        return res.status(400).json({ 
            success: false, 
            message: `Resource write collision. Field entry metric for [${duplicationField}] already exists.` 
        });
    }

    // Mongoose schema data validation loop failures
    if (err.name === 'ValidationError') {
        const errorStackSummary = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ success: false, errors: errorStackSummary, message: "Data payload mapping rules violation." });
    }

    // Fallback general catch-all handler response matrix
    return res.status(errorInstance.statusCode || 500).json({
        success: false,
        message: errorInstance.message || 'A generic internal structural operational pipeline exception occurred.'
    });
};

module.exports = errorHandler;