const prisma = require('../prismaClient');

class OrderAdapter {
    /**
     * Create a new order
     * Mongoose equivalent: Order.create(data)
     */
    static async create(orderData) {
        const order = await prisma.order.create({
            data: {
                restaurantId: orderData.restaurantId || null,
                restaurantName: orderData.restaurantName || null,
                items: orderData.items,
                customerName: orderData.customerName,
                customerAddress: orderData.customerAddress,
                customerPhone: orderData.customerPhone,
                subtotal: orderData.subtotal,
                tax: orderData.tax,
                deliveryFee: orderData.deliveryFee,
                total: orderData.total,
                status: orderData.status || 'pending'
            }
        });
        
        // Return MongoDB-compatible result
        return {
            insertedId: order.id
        };
    }

    /**
     * Get all orders sorted by creation date (newest first)
     * Mongoose equivalent: Order.find({}).sort({ createdAt: -1 })
     */
    static async getAll() {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' }
        });
        
        // Convert to MongoDB-compatible format with _id
        return orders.map(o => ({
            _id: o.id,
            restaurantId: o.restaurantId,
            restaurantName: o.restaurantName,
            items: o.items,
            customerName: o.customerName,
            customerAddress: o.customerAddress,
            customerPhone: o.customerPhone,
            subtotal: o.subtotal,
            tax: o.tax,
            deliveryFee: o.deliveryFee,
            total: o.total,
            status: o.status,
            createdAt: o.createdAt,
            updatedAt: o.updatedAt
        }));
    }

    /**
     * Get order by ID
     * Mongoose equivalent: Order.findById(id)
     */
    static async getById(id) {
        const order = await prisma.order.findUnique({
            where: { id }
        });
        
        if (!order) {
            return null;
        }
        
        // Convert to MongoDB-compatible format with _id
        return {
            _id: order.id,
            restaurantId: order.restaurantId,
            restaurantName: order.restaurantName,
            items: order.items,
            customerName: order.customerName,
            customerAddress: order.customerAddress,
            customerPhone: order.customerPhone,
            subtotal: order.subtotal,
            tax: order.tax,
            deliveryFee: order.deliveryFee,
            total: order.total,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        };
    }

    /**
     * Update order status
     * Mongoose equivalent: Order.updateOne({ _id: id }, { $set: { status, updatedAt } })
     */
    static async updateStatus(id, status) {
        const result = await prisma.order.update({
            where: { id },
            data: { 
                status,
                // updatedAt is automatically updated by Prisma
            }
        });
        
        // Return MongoDB-compatible result
        return {
            modifiedCount: result ? 1 : 0
        };
    }
}

module.exports = OrderAdapter;
