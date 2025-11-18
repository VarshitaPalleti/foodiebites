const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Graceful shutdown handlers
process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing Prisma Client');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing Prisma Client');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('beforeExit', async () => {
  console.log('beforeExit event: closing Prisma Client');
  await prisma.$disconnect();
});

module.exports = prisma;
