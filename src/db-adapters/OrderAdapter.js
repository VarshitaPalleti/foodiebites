const prisma = require('../prismaClient');

class OrderAdapter {
    static async create(orderData) {
        try {
            const order = await prisma.order.create({
                data: {
                    ...orderData,
                    status: 'pending'
                }
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
