// Compatibility wrapper for Order model
// This allows existing code to work without changes while using Prisma underneath
const OrderAdapter = require('../src/db-adapters/orderAdapter');

module.exports = OrderAdapter;
