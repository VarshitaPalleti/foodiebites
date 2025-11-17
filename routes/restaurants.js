const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// Get all restaurants
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.getAll();
        // Ensure _id is converted to string for JSON response
        const formattedRestaurants = restaurants.map(r => ({
            ...r,
            _id: r._id && r._id.toString ? r._id.toString() : r._id
        }));
        res.json(formattedRestaurants);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch restaurants' });
    }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.getById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }
        // Ensure _id is converted to string for JSON response
        const formattedRestaurant = {
            ...restaurant,
            _id: restaurant._id && restaurant._id.toString ? restaurant._id.toString() : restaurant._id
        };
        res.json(formattedRestaurant);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch restaurant' });
    }
});

module.exports = router;
