/**
 * NIDES STORE - Core Application Server Engine
 * Architecture Architecture: Express.js REST Framework & Production Asset Pipeline
 * Controlled Year: 2026
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// SECURITY & DATA PIPELINE MIDDLEWARES
// ==========================================

// Helmet acts as a shield to secure HTTP headers, guarding against cross-site scripting and injection flaws
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https://*"],
        },
    },
}));

// Cross-Origin Resource Sharing settings to accept secure external API pings
app.use(cors());

// Internal log systems mapping network asset requests safely inside terminal
app.use(morgan('dev'));

// Parsing middleware for handling incoming data package streams
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// IN-MEMORY DATA CACHE (MOCK DATABASE)
// ==========================================

const productInventory = [
    { id: 101, name: "CryptoCrypt Secure Vault Card", price: 89.99, stock: 14, category: "hardware" },
    { id: 102, name: "NodeStream High-Speed Layer Bus", price: 145.00, stock: 8, category: "hardware" },
    { id: 103, name: "OmniChannel Token Hub Splitter", price: 34.50, stock: 45, category: "accessories" },
    { id: 104, name: "Decentralized Key Sync Cluster", price: 210.00, stock: 3, category: "hardware" }
];

const customerTicketsDb = [];

// ==========================================
// RESTFUL API ENDPOINT ROUTING TIERS
// ==========================================

/**
 * @route   GET /api/products
 * @desc    Fetch whole application hardware catalog matrix logs
 */
app.get('/api/products', (req, res) => {
    try {
        res.status(200).json({
            success: true,
            timestamp: new Date().toISOString(),
            count: productInventory.length,
            data: productInventory
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Catalog Vector Leak." });
    }
});

/**
 * @route   POST /api/tickets
 * @desc    Intercept communication field form tokens and register them to database worker queue
 */
app.post('/api/tickets', (req, res) => {
    const { name, email, reason, message } = req.body;

    // Structural validation guards
    if (!name || !email || !reason || !message) {
        return res.status(400).json({
            success: false,
            error_code: "MALFORMED_TRANSMISSION",
            message: "Mandatory telemetry parameter missing from tracking envelope arrays."
        });
    }

    if (message.length < 15) {
        return res.status(400).json({
            success: false,
            error_code: "PAYLOAD_TOO_SMALL",
            message: "Core message length doesn't meet minimum structural threshold."
        });
    }

    // Process new ticket layout item
    const transientTicketId = `TCK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newTicketRecord = {
        id: transientTicketId,
        clientName: name.trim(),
        clientEmail: email.trim(),
        classification: reason,
        payload: message.trim(),
        status: "QUEUED_SLA_ACTIVE",
        injectedAt: new Date().toISOString()
    };

    customerTicketsDb.push(newTicketRecord);
    console.log(`[TICKET_WORKER]: Token injected safely ${transientTicketId}`);

    return res.status(201).json({
        success: true,
        ticket_id: transientTicketId,
        message: "Data pack serialized and pushed into active engineering dispatch pipelines."
    });
});

// ==========================================
// STATIC FRONTEND USER ASSET DELIVERY PIPELINE
// ==========================================

// Point static execution folders target straight to your standard frontend folder
const FRONTEND_PATH = path.join(__dirname, 'front-end');
app.use(express.static(FRONTEND_PATH));

// Express route defaults fall back down straight onto home page layout matrix
app.get('/', (req, res) => {
    res.sendFile(path.join(FRONTEND_PATH, 'index.html'));
});

// Route catch-all to cleanly serve any requested local explicit structural HTML viewports
app.get('/:page.html', (req, res) => {
    const requestedPage = req.params.page;
    res.sendFile(path.join(FRONTEND_PATH, `${requestedPage}.html`), (err) => {
        if (err) {
            res.status(404).sendFile(path.join(FRONTEND_PATH, '404.html'), (fallbackErr) => {
                if (fallbackErr) {
                    res.status(404).send("Error 404: Layout endpoint path anomaly detected.");
                }
            });
        }
    });
});

// Global Error Interception Firewall
app.use((err, req, res, next) => {
    console.error(`[CRITICAL_CORE_ERR]: ${err.stack}`);
    res.status(500).json({
        success: false,
        message: "A fatal routing exception was successfully caught by the application firewall."
    });
});

// ==========================================
// REARRM EXECUTION ENGINE LISTENER
// ==========================================
// ... remaining express middleware and endpoint configurations below ...
// ==========================================
// MOUNT COMPONENT ROUTING MIDDLEWARES
// ==========================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));

app.listen(PORT, () => {
    console.log(`======================================================`);
    console.log(` SERVER ENGINE INITIALIZED SUCCESSFULLY                `);
    console.log(` Network Port Target : http://localhost:${PORT}        `);
    console.log(` Core Environment    : ${process.env.NODE_ENV || 'development'}`);
    console.log(`======================================================`);
});

// ==========================================
// CORE MODULE INITIALIZATION
// ==========================================

// Require and boot the database management instance script
const db = require('./config/db');
db.connect();


// Clean system initialization mount map for global middleware arrays inside server.js:
const errorHandler = require('./middleware/errorHandler');

// ... mount your various app routes above ...

// Place error tracking handler dead-last so it intercepts failures from upstream controllers
app.use(errorHandler);