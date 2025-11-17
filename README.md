# Foodie Bites - Food Delivery Application

A modern, clean, and appealing food delivery web application built with HTML, JavaScript, Tailwind CSS, and MongoDB.

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
- **Database**: MongoDB
- **Icons**: Font Awesome

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

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

3. Create a `.env` file in the root directory (optional):

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=foodiebites
```

4. Make sure MongoDB is running on your system:

```bash
# For macOS/Linux
mongod

# For Windows
net start MongoDB
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

## Project Structure

```
foodiebites/
├── config/
│   └── database.js          # MongoDB connection configuration
├── models/
│   ├── Restaurant.js        # Restaurant model and sample data
│   └── Order.js             # Order model
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

