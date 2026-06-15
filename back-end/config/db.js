/**
 * NIDES STORE - Database Connection Engine
 * Architecture Module: Mongoose Clustering Layer
 * Controlled Year: 2026
 */

const mongoose = require('mongoose');

// Extraction target configuration vector for fallback execution environments
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nides_store_db';

/**
 * Encapsulated Connection Manager Class Blueprint
 */
class DatabaseManager {
    constructor() {
        this.retryLimit = 5;
        this.retryCounter = 0;
        this.retryIntervalMs = 5000;
    }

    /**
     * Initializes the connection pool with explicit connection settings
     */
    async connect() {
        console.log('[DB_CLUSTER]: Initializing database abstraction tier layers...');

        const connectionOptions = {
            autoIndex: true, // Auto-compile index configurations (disable in high-throughput production vectors)
            maxPoolSize: 10, // Maintain up to 10 concurrent socket allocations
            serverSelectionTimeoutMS: 5000, // Terminate lookups after 5 seconds
            socketTimeoutMS: 45000, // Close inactive sockets after 45 seconds
        };

        try {
            mongoose.set('strictQuery', false); // Align query parsing parameters with Mongoose v7/v8 structural specs
            
            const connectionInstance = await mongoose.connect(MONGODB_URI, connectionOptions);
            
            this.retryCounter = 0; // Reset counter upon successful mounting
            console.log(`======================================================`);
            
            return connectionInstance;
        } catch (error) {
            this.retryCounter++;
            console.error(`[DB_CLUSTER_ERR]: Connection attempt (${this.retryCounter}/${this.retryLimit}) failed: ${error.message}`);
            
            if (this.retryCounter >= this.retryLimit) {
                console.error('[CRITICAL_CORE_ERR]: Database connection attempts exceeded. Shutting down system node...');
                process.exit(1);
            }

            console.log(`[DB_CLUSTER]: Re-attempting handshake in ${this.retryIntervalMs / 1000} seconds...`);
            setTimeout(() => this.connect(), this.retryIntervalMs);
        }
    }

    /**
     * Sets up lifecycle event observers directly on the global Mongoose instance connection pool
     */
    monitorLifecycle() {
        const db = mongoose.connection;

        db.on('connected', () => {
            console.log(` DATABASE MOUNTED SUCCESSFULLY                        `);
            console.log(` Target URI String   : ${MONGODB_URI.split('@').pop()}`); // Strip out credentials from logging string
            console.log(`======================================================`);
        });

        db.on('error', (err) => {
            console.error(`[DB_RUNTIME_ERR]: Active connection socket anomaly: ${err.message}`);
        });

        db.on('disconnected', () => {
            console.warn('[DB_CLUSTER_WARN]: Cluster lost socket connectivity. Standby for driver auto-reconnect routines.');
        });

        // Graceful termination hooks mapping process interruptions (e.g., nodemon restart or Ctrl+C)
        process.on('SIGINT', async () => {
            await this.terminateConnectionGracefully('Application execution context killed (SIGINT)');
        });

        process.on('SIGTERM', async () => {
            await this.terminateConnectionGracefully('Application execution context killed (SIGTERM)');
        });
    }

    /**
     * Drops connection references cleanly before allowing the node engine thread to terminate
     */
    async terminateConnectionGracefully(reason) {
        console.log(`\n[DB_CLUSTER]: Closing database allocations pool. Reason: [${reason}]`);
        try {
            await mongoose.connection.close();
            console.log('[DB_CLUSTER]: Pool drained completely. Thread safely disconnected.');
            process.exit(0);
        } catch (error) {
            console.error(`[DB_CLUSTER_ERR]: Error during connection pool drain: ${error.message}`);
            process.exit(1);
        }
    }
}

// Instantiation execution block
const dbManagerInstance = new DatabaseManager();
dbManagerInstance.monitorLifecycle();

module.exports = dbManagerInstance;