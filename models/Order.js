// Adapter wrapper for Prisma-based Order operations
const OrderAdapter = require('../src/db-adapters/OrderAdapter');

// Export the adapter as the Order model for backward compatibility
module.exports = OrderAdapter;
