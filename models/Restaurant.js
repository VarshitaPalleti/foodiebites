// Compatibility wrapper for Restaurant model
// This allows existing code to work without changes while using Prisma underneath
const RestaurantAdapter = require('../src/db-adapters/restaurantAdapter');

module.exports = RestaurantAdapter;
