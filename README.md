# Foodie Bites - Food Delivery Application

A modern, clean, and appealing food delivery web application built with HTML, JavaScript, Tailwind CSS, and PostgreSQL + Prisma ORM.

## Features

- 🍕 Browse restaurants by cuisine
- 🔍 Search for restaurants and dishes
- 🛒 Shopping cart functionality
- 📦 Order placement and tracking
- 📱 Responsive design for mobile and desktop
- ⚡ Fast and intuitive user interface

## Tech Stack

- **Frontend**: HTML, JavaScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (via Prisma ORM)
- **Container**: Docker Compose (for PostgreSQL & pgAdmin)
- **Icons**: Font Awesome

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose (recommended for PostgreSQL)
- OR PostgreSQL (v15 or higher) if not using Docker

## Installation

1. Clone the repository:

```bash
git clone https://github.com/VarshitaPalleti/foodiebites.git
cd foodiebites
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/foodiebites?schema=public"
```

4. Start PostgreSQL and pgAdmin using Docker Compose:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- pgAdmin on port 8080 (access at http://localhost:8080)
  - Email: admin@foodiebites.com
  - Password: admin

5. Run database migrations:

```bash
npm run prisma:migrate
```

This will create the necessary database schema in PostgreSQL.

6. Generate Prisma Client:

```bash
npm run prisma:generate
```

## Running the Application

1. Start the server:

```bash
npm start
```

2. Open your browser and navigate to:

```
http://localhost:3000
```

The application will automatically seed the database with sample restaurant data on first run.

## Database Management

### Prisma Scripts

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations (development)
- `npm run prisma:migrate:deploy` - Deploy migrations (production)
- `npm run prisma:studio` - Open Prisma Studio to view/edit data

### Access pgAdmin

1. Open http://localhost:8080
2. Login with:
   - Email: admin@foodiebites.com
   - Password: admin
3. Add a new server connection:
   - Host: postgres (or localhost if accessing from host machine)
   - Port: 5432
   - Username: postgres
   - Password: postgres
   - Database: foodiebites

## Project Structure

```
foodiebites/
├── config/
│   └── database.js          # Legacy MongoDB config (kept for reference)
├── models/
│   ├── Restaurant.js        # Restaurant adapter (wraps Prisma)
│   └── Order.js             # Order adapter (wraps Prisma)
├── src/
│   ├── prismaClient.js      # Prisma client initialization
│   └── db-adapters/
│       ├── RestaurantAdapter.js  # Restaurant database operations
│       └── OrderAdapter.js       # Order database operations
├── prisma/
│   └── schema.prisma        # Prisma schema definition
├── routes/
│   ├── restaurants.js       # Restaurant API routes
│   └── orders.js            # Order API routes
├── public/
│   ├── index.html           # Home page
│   ├── restaurant.html      # Restaurant detail page
│   ├── cart.html            # Shopping cart page
│   ├── orders.html          # Order tracking page
│   └── js/
│       ├── main.js          # Home page JavaScript
│       ├── restaurant.js    # Restaurant page JavaScript
│       ├── cart.js          # Cart page JavaScript
│       └── orders.js        # Orders page JavaScript
├── docker-compose.yml       # Docker configuration for PostgreSQL & pgAdmin
├── server.js                # Express server setup
├── package.json             # Project dependencies
└── README.md                # Project documentation
```

## Features Breakdown

### Home Page

- View all available restaurants
- Filter restaurants by cuisine type
- Search for specific restaurants or cuisines
- See restaurant ratings and delivery times

### Restaurant Page

- View restaurant details
- Browse menu items with images and descriptions
- Add items to cart with quantity selection

### Cart Page

- View all cart items
- Update quantities or remove items
- Enter delivery details
- View order summary with subtotal, tax, and delivery fee
- Place order

### Orders Page

- View all placed orders
- Track order status
- Cancel pending orders
- View order details including items and delivery information

## API Endpoints

### Restaurants

- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID

### Orders

- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` - Update order status

## Migration from MongoDB to PostgreSQL

This project has been migrated from MongoDB to PostgreSQL with Prisma ORM. The migration includes:

### Key Changes

1. **Database**: MongoDB → PostgreSQL
2. **ORM**: Native MongoDB driver → Prisma ORM
3. **Models**: Mongoose/MongoDB models → Prisma schema + adapters
4. **IDs**: MongoDB ObjectId → UUID (String)
5. **Deployment**: Added Docker Compose for easy PostgreSQL setup

### Architecture

The migration maintains backward compatibility by:
- Keeping the same model interfaces (getAll, getById, create, etc.)
- Using adapter pattern to wrap Prisma operations
- Converting Prisma results to match MongoDB format (id → _id)

### Prisma Schema

The database schema is defined in `prisma/schema.prisma`:

- **Restaurant**: Stores restaurant information and menu items (as JSON)
- **Order**: Stores order information with a relation to Restaurant

### Benefits of PostgreSQL + Prisma

- **Type Safety**: Prisma provides full TypeScript/JavaScript type safety
- **Performance**: Better query optimization and indexing
- **Reliability**: ACID compliance and data integrity
- **Tooling**: Prisma Studio for database visualization
- **Migrations**: Version-controlled schema migrations
- **Relations**: Proper foreign key constraints

### Legacy MongoDB Support

The old MongoDB configuration files are preserved in `config/database.js` for reference, but are no longer used by the application.

## Sample Data

The application automatically initializes with sample restaurant data including:

- Pizza Paradise (Italian)
- Burger House (American)
- Sushi Master (Japanese)
- Taco Fiesta (Mexican)
- Curry Corner (Indian)
- Pasta Palace (Italian)

Each restaurant comes with a menu of 4 items with images and descriptions.

## Security Considerations

This application includes the following security features:

- Input validation for order placement
- CORS protection
- Body parsing limits
- Environment variable support for sensitive configuration

**Production Recommendations:**

- Add rate limiting to prevent abuse (currently flagged by CodeQL)
- Implement user authentication and authorization
- Add input sanitization and validation
- Use HTTPS for all communications
- Store sensitive data securely
- Add CSRF protection
- Implement proper session management

## Development

To run in development mode with auto-reload:

```bash
npm run dev
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

