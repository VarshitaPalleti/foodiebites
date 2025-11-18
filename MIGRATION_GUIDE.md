# MongoDB to PostgreSQL Migration Guide

This document describes the migration of FoodieBites from MongoDB to PostgreSQL with Prisma ORM.

## Overview

The application has been successfully migrated from MongoDB (using native driver) to PostgreSQL with Prisma ORM while maintaining full backward compatibility with existing API endpoints.

## What Changed

### Database Layer

- **Before**: MongoDB with native MongoDB driver
- **After**: PostgreSQL 15 with Prisma ORM

### Models

- **Before**: MongoDB models with custom methods (getAll, getById, create, etc.)
- **After**: Prisma schema + adapter pattern to maintain the same interface

### IDs

- **Before**: MongoDB ObjectId
- **After**: UUID (String type)

### Connection

- **Before**: `mongodb://localhost:27017`
- **After**: `postgresql://postgres:postgres@localhost:5432/foodiebites`

## Architecture

### Prisma Schema (`prisma/schema.prisma`)

Defines the database schema with two models:

```prisma
model Restaurant {
  id           String   @id @default(uuid())
  name         String
  cuisine      String
  rating       Float
  deliveryTime String
  image        String
  menu         Json
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  orders       Order[]
}

model Order {
  id              String     @id @default(uuid())
  restaurantId    String
  restaurant      Restaurant @relation(fields: [restaurantId], references: [id])
  items           Json
  customerName    String
  customerAddress String
  customerPhone   String
  totalAmount     Float
  status          String     @default("pending")
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
}
```

### Adapter Pattern

To maintain backward compatibility, adapters wrap Prisma operations:

**RestaurantAdapter** (`src/db-adapters/RestaurantAdapter.js`):
- Implements the same static methods as the old Restaurant model
- Converts Prisma results to MongoDB-compatible format (id → _id)
- Handles sample data initialization

**OrderAdapter** (`src/db-adapters/OrderAdapter.js`):
- Implements the same static methods as the old Order model
- Converts Prisma results to MongoDB-compatible format
- Includes restaurant relations in queries

### Model Wrappers

The original model files (`models/Restaurant.js` and `models/Order.js`) now simply export the adapters, maintaining the same import paths throughout the codebase.

## Development Setup

### Prerequisites

- Node.js v14+
- Docker and Docker Compose (recommended)
- OR PostgreSQL 15+ (if not using Docker)

### Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env if needed (default values work with Docker Compose)
   ```

3. **Start PostgreSQL**:
   ```bash
   docker compose up -d
   ```

4. **Run migrations**:
   ```bash
   npm run prisma:migrate
   ```

5. **Start application**:
   ```bash
   npm start
   ```

## Database Management

### Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create a new migration
npm run prisma:migrate

# Deploy migrations to production
npm run prisma:migrate:deploy

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

### Docker Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f postgres
docker compose logs -f pgadmin

# Access PostgreSQL CLI
docker exec -it foodiebites psql -U postgres -d foodiebites
```

### pgAdmin Access

- URL: http://localhost:8080
- Email: admin@foodiebites.com
- Password: admin

To connect to the database in pgAdmin:
- Host: postgres (or localhost from host machine)
- Port: 5432
- Username: postgres
- Password: postgres
- Database: foodiebites

## API Compatibility

All API endpoints remain unchanged:

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` - Update order status

Response format is maintained for backward compatibility, with `_id` field present alongside `id`.

## Testing

All endpoints have been tested and verified:

```bash
# Test restaurants endpoint
curl http://localhost:3000/api/restaurants

# Test creating an order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "<restaurant-id>",
    "items": [{"id": 1, "name": "Pizza", "price": 12.99, "quantity": 2}],
    "customerName": "Test User",
    "customerAddress": "123 Test St",
    "customerPhone": "555-1234",
    "totalAmount": 25.98
  }'

# Test getting orders
curl http://localhost:3000/api/orders
```

## Benefits of Migration

1. **Type Safety**: Prisma provides full type safety for database operations
2. **Performance**: PostgreSQL offers better performance for complex queries
3. **Reliability**: ACID compliance and data integrity
4. **Tooling**: 
   - Prisma Studio for database visualization
   - pgAdmin for advanced database management
5. **Migrations**: Version-controlled schema changes
6. **Relations**: Proper foreign key constraints and relational data
7. **Development**: Docker Compose for consistent development environment

## Rollback Plan

If needed to rollback to MongoDB:

1. Restore the original `config/database.js` usage in `server.js`
2. Update `models/Restaurant.js` and `models/Order.js` to use MongoDB operations
3. Start MongoDB instead of PostgreSQL
4. Update `.env` with MongoDB connection string

The original MongoDB code structure is preserved in git history for reference.

## Production Deployment

For production deployment:

1. Set up a PostgreSQL database (managed service recommended)
2. Set `DATABASE_URL` environment variable to production database
3. Run migrations: `npm run prisma:migrate:deploy`
4. Start the application: `npm start`

### Environment Variables

```bash
PORT=3000
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

## Troubleshooting

### Connection Issues

If you can't connect to PostgreSQL:
- Check Docker containers are running: `docker ps`
- Verify DATABASE_URL in `.env`
- Check PostgreSQL logs: `docker compose logs postgres`

### Migration Issues

If migrations fail:
- Drop the database and recreate: `docker compose down -v && docker compose up -d`
- Run migrations again: `npm run prisma:migrate`

### Application Issues

If the app won't start:
- Verify Prisma Client is generated: `npm run prisma:generate`
- Check for connection errors in server logs
- Ensure PostgreSQL is healthy: `docker compose ps`

## Support

For issues or questions about the migration:
1. Check the logs: `docker compose logs -f`
2. Review Prisma documentation: https://www.prisma.io/docs
3. Check PostgreSQL documentation: https://www.postgresql.org/docs/
