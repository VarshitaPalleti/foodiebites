const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create a new order
router.post('/', async (req, res) => {
    try {
        const result = await Order.create(req.body);
        res.status(201).json({ 
            message: 'Order placed successfully', 
            orderId: result.insertedId && result.insertedId.toString ? result.insertedId.toString() : result.insertedId
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.getAll();
        // Ensure _id is converted to string for JSON response
        const formattedOrders = orders.map(o => ({
            ...o,
            _id: o._id && o._id.toString ? o._id.toString() : o._id
        }));
        res.json(formattedOrders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.getById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        // Ensure _id is converted to string for JSON response
        const formattedOrder = {
            ...order,
            _id: order._id && order._id.toString ? order._id.toString() : order._id
        };
        res.json(formattedOrder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        await Order.updateStatus(req.params.id, status);
        res.json({ message: 'Order status updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

module.exports = router;
