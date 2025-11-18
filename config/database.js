// Prisma database connection module
// Replaces the MongoDB connection with Prisma initialization

const prisma = require('../src/prismaClient');

/**
 * Initialize database connection
 * For Prisma, connection is lazy and happens on first query
 * We just need to ensure the client is ready
 */
async function connectDB() {
  try {
    // Test the connection
    await prisma.$connect();
    console.log('Connected to PostgreSQL via Prisma');
    return true;
  } catch (error) {
    console.error('Failed to connect to PostgreSQL:', error.message);
    throw error;
  }
}

/**
 * Get database client (for compatibility)
 * Returns the Prisma client instance
 */
function getDB() {
  return prisma;
}

/**
 * Close database connection gracefully
 */
async function closeDB() {
  await prisma.$disconnect();
  console.log('PostgreSQL connection closed');
}

module.exports = { connectDB, getDB, closeDB };
