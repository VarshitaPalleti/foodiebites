const { MongoClient } = require('mongodb');

// MongoDB connection URI (can be overridden with environment variable)
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'foodiego';

let client;
let db;

async function connectDB() {
    try {
        if (!client) {
            client = new MongoClient(uri);
            await client.connect();
            db = client.db(dbName);
            console.log('Connected to MongoDB');
        }
        return db;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

function getDB() {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB first.');
    }
    return db;
}

async function closeDB() {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log('MongoDB connection closed');
    }
}

module.exports = { connectDB, getDB, closeDB };
