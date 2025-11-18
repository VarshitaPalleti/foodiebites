// Adapter wrapper for Prisma-based Restaurant operations
const RestaurantAdapter = require('../src/db-adapters/RestaurantAdapter');

// Export the adapter as the Restaurant model for backward compatibility
module.exports = RestaurantAdapter;
