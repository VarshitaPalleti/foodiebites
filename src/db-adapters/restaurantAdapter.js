const prisma = require('../prismaClient');

class RestaurantAdapter {
    /**
     * Get all restaurants
     * Mongoose equivalent: Restaurant.find({})
     */
    static async getAll() {
        const restaurants = await prisma.restaurant.findMany({
            orderBy: { createdAt: 'asc' }
        });
        
        // Convert to MongoDB-compatible format with _id
        return restaurants.map(r => ({
            _id: r.id,
            name: r.name,
            cuisine: r.cuisine,
            rating: r.rating,
            deliveryTime: r.deliveryTime,
            image: r.image,
            menu: r.menu
        }));
    }

    /**
     * Get restaurant by ID
     * Mongoose equivalent: Restaurant.findById(id)
     */
    static async getById(id) {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id }
        });
        
        if (!restaurant) {
            return null;
        }
        
        // Convert to MongoDB-compatible format with _id
        return {
            _id: restaurant.id,
            name: restaurant.name,
            cuisine: restaurant.cuisine,
            rating: restaurant.rating,
            deliveryTime: restaurant.deliveryTime,
            image: restaurant.image,
            menu: restaurant.menu
        };
    }

    /**
     * Create a new restaurant
     * Mongoose equivalent: Restaurant.create(data)
     */
    static async create(restaurantData) {
        const restaurant = await prisma.restaurant.create({
            data: {
                name: restaurantData.name,
                cuisine: restaurantData.cuisine,
                rating: restaurantData.rating,
                deliveryTime: restaurantData.deliveryTime,
                image: restaurantData.image,
                menu: restaurantData.menu
            }
        });
        
        // Return MongoDB-compatible result
        return {
            insertedId: restaurant.id
        };
    }

    /**
     * Initialize sample data if restaurants collection is empty
     */
    static async initializeSampleData() {
        const count = await prisma.restaurant.count();
        
        if (count === 0) {
            const sampleRestaurants = [
                {
                    name: "Pizza Paradise",
                    cuisine: "Italian",
                    rating: 4.5,
                    deliveryTime: "30-40 min",
                    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
                    menu: [
                        { id: 1, name: "Margherita Pizza", price: 12.99, description: "Classic tomato and mozzarella", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop" },
                        { id: 2, name: "Pepperoni Pizza", price: 14.99, description: "Loaded with pepperoni", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop" },
                        { id: 3, name: "Veggie Supreme", price: 13.99, description: "Fresh vegetables and cheese", image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=300&h=200&fit=crop" },
                        { id: 4, name: "BBQ Chicken Pizza", price: 15.99, description: "BBQ sauce and grilled chicken", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop" }
                    ]
                },
                {
                    name: "Burger House",
                    cuisine: "American",
                    rating: 4.3,
                    deliveryTime: "25-35 min",
                    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
                    menu: [
                        { id: 1, name: "Classic Burger", price: 9.99, description: "Beef patty with lettuce and tomato", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop" },
                        { id: 2, name: "Cheese Burger", price: 10.99, description: "Double cheese, beef patty", image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=300&h=200&fit=crop" },
                        { id: 3, name: "Chicken Burger", price: 10.49, description: "Crispy chicken fillet", image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300&h=200&fit=crop" },
                        { id: 4, name: "Veggie Burger", price: 8.99, description: "Plant-based patty", image: "https://images.unsplash.com/photo-1525059696034-4967a729002a?w=300&h=200&fit=crop" }
                    ]
                },
                {
                    name: "Sushi Master",
                    cuisine: "Japanese",
                    rating: 4.7,
                    deliveryTime: "40-50 min",
                    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
                    menu: [
                        { id: 1, name: "California Roll", price: 11.99, description: "Crab, avocado, cucumber", image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop" },
                        { id: 2, name: "Salmon Nigiri", price: 13.99, description: "Fresh salmon over rice", image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300&h=200&fit=crop" },
                        { id: 3, name: "Tuna Roll", price: 12.99, description: "Fresh tuna and seaweed", image: "https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=300&h=200&fit=crop" },
                        { id: 4, name: "Tempura Roll", price: 14.99, description: "Shrimp tempura roll", image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop" }
                    ]
                },
                {
                    name: "Taco Fiesta",
                    cuisine: "Mexican",
                    rating: 4.4,
                    deliveryTime: "20-30 min",
                    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop",
                    menu: [
                        { id: 1, name: "Beef Tacos", price: 8.99, description: "Three seasoned beef tacos", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&h=200&fit=crop" },
                        { id: 2, name: "Chicken Quesadilla", price: 9.99, description: "Grilled chicken and cheese", image: "https://images.unsplash.com/photo-1599974979242-c1cb95082431?w=300&h=200&fit=crop" },
                        { id: 3, name: "Burrito Bowl", price: 11.99, description: "Rice, beans, meat, and toppings", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&h=200&fit=crop" },
                        { id: 4, name: "Nachos Supreme", price: 10.99, description: "Loaded nachos", image: "https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=300&h=200&fit=crop" }
                    ]
                },
                {
                    name: "Curry Corner",
                    cuisine: "Indian",
                    rating: 4.6,
                    deliveryTime: "35-45 min",
                    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
                    menu: [
                        { id: 1, name: "Butter Chicken", price: 13.99, description: "Creamy tomato curry", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop" },
                        { id: 2, name: "Tikka Masala", price: 12.99, description: "Spiced curry with naan", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop" },
                        { id: 3, name: "Biryani", price: 14.99, description: "Fragrant rice with meat", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=200&fit=crop" },
                        { id: 4, name: "Samosa", price: 5.99, description: "Crispy pastry with filling", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop" }
                    ]
                },
                {
                    name: "Pasta Palace",
                    cuisine: "Italian",
                    rating: 4.5,
                    deliveryTime: "30-40 min",
                    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop",
                    menu: [
                        { id: 1, name: "Spaghetti Carbonara", price: 12.99, description: "Creamy pasta with bacon", image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300&h=200&fit=crop" },
                        { id: 2, name: "Fettuccine Alfredo", price: 11.99, description: "Rich and creamy", image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=300&h=200&fit=crop" },
                        { id: 3, name: "Penne Arrabbiata", price: 10.99, description: "Spicy tomato sauce", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&h=200&fit=crop" },
                        { id: 4, name: "Lasagna", price: 13.99, description: "Layers of pasta and meat", image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=300&h=200&fit=crop" }
                    ]
                }
            ];
            
            // Use createMany for bulk insert
            await prisma.restaurant.createMany({
                data: sampleRestaurants
            });
            
            console.log('Sample restaurant data initialized in PostgreSQL');
        }
    }
}

module.exports = RestaurantAdapter;
