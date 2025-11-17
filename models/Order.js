const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');

class Order {
    static async create(order) {
        const db = getDB();
        const orderData = {
            ...order,
            createdAt: new Date(),
            status: 'pending'
        };
        const result = await db.collection('orders').insertOne(orderData);
        return result;
    }

    static async getAll() {
        const db = getDB();
        return await db.collection('orders').find({}).sort({ createdAt: -1 }).toArray();
    }

    static async getById(id) {
        const db = getDB();
        return await db.collection('orders').findOne({ _id: new ObjectId(id) });
    }

    static async updateStatus(id, status) {
        const db = getDB();
        return await db.collection('orders').updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: status, updatedAt: new Date() } }
        );
    }
}

module.exports = Order;
