const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/database');
const Restaurant = require('./models/Restaurant');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
const restaurantRoutes = require('./routes/restaurants');
const orderRoutes = require('./routes/orders');

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/restaurant/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'restaurant.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

app.get('/orders', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'orders.html'));
});

// Start server
async function startServer() {
    try {
        await connectDB();
        await Restaurant.initializeSampleData();
        
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`Visit http://localhost:${PORT} to view the application`);
        });
    } catch (error) {
        console.error('Server startup error:', error);
        // Continue running even if DB connection fails - using in-memory storage
        await Restaurant.initializeSampleData();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT} (using in-memory storage)`);
        });
    }
}

startServer();
