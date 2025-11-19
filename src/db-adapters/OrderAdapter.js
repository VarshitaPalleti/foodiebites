const prisma = require('../prismaClient');

class OrderAdapter {
    static async create(orderData) {
        try {
            // Extract the first restaurant ID from the cart items
            const restaurantId = orderData.items && orderData.items.length > 0 
                ? orderData.items[0].restaurantId 
                : null;
            
            if (!restaurantId) {
                throw new Error('Restaurant ID is required');
            }

            // Map the order data to match Prisma schema
            const mappedData = {
                restaurantId: restaurantId,
                customerName: orderData.customerName,
                customerAddress: orderData.deliveryAddress, // Map deliveryAddress to customerAddress
                customerPhone: orderData.customerPhone,
                totalAmount: orderData.total, // Map total to totalAmount
                items: orderData.items,
                status: 'pending'
            };

            const order = await prisma.order.create({
                data: mappedData
            });
            return { insertedId: order.id };
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }

    static async getAll() {
        try {
            const orders = await prisma.order.findMany({
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    restaurant: true
                }
            });
            // Convert to match MongoDB format (id as _id)
            return orders.map(o => ({
                ...o,
                _id: o.id
            }));
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            const order = await prisma.order.findUnique({
                where: { id: id },
                include: {
                    restaurant: true
                }
            });
            if (!order) {
                return null;
            }
            // Convert to match MongoDB format (id as _id)
            return {
                ...order,
                _id: order.id
            };
        } catch (error) {
            console.error('Error fetching order by id:', error);
            throw error;
        }
    }

    static async updateStatus(id, status) {
        try {
            const order = await prisma.order.update({
                where: { id: id },
                data: { 
                    status: status,
                    updatedAt: new Date()
                }
            });
            return { modifiedCount: 1 };
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    }
}

module.exports = OrderAdapter;
