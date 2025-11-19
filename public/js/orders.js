// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    loadOrders();
});

// Load orders from API
async function loadOrders() {
    try {
        const response = await fetch('/api/orders');
        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('loading').innerHTML = `
            <i class="fas fa-exclamation-circle text-4xl text-red-500"></i>
            <p class="mt-4 text-gray-600">Failed to load orders</p>
        `;
    }
}

// Display orders
function displayOrders(orders) {
    const container = document.getElementById('orders-container');
    const loading = document.getElementById('loading');
    const noOrders = document.getElementById('no-orders');
    
    loading.classList.add('hidden');
    
    if (orders.length === 0) {
        container.classList.add('hidden');
        noOrders.classList.remove('hidden');
        return;
    }
    
    container.classList.remove('hidden');
    noOrders.classList.add('hidden');
    
    container.innerHTML = orders.map(order => {
        const statusColors = {
            pending: 'bg-yellow-100 text-yellow-800',
            preparing: 'bg-blue-100 text-blue-800',
            'out-for-delivery': 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        
        const statusIcons = {
            pending: 'fa-clock',
            preparing: 'fa-fire',
            'out-for-delivery': 'fa-truck',
            delivered: 'fa-check-circle',
            cancelled: 'fa-times-circle'
        };
        
        const orderDate = new Date(order.createdAt).toLocaleString();
        const statusColor = statusColors[order.status] || 'bg-gray-100 text-gray-800';
        const statusIcon = statusIcons[order.status] || 'fa-circle';
        
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-xl font-bold text-gray-800 mb-1">Order #${order._id.slice(-6)}</h3>
                        <p class="text-gray-600 text-sm">${orderDate}</p>
                    </div>
                    <span class="px-4 py-2 rounded-full ${statusColor} font-semibold flex items-center">
                        <i class="fas ${statusIcon} mr-2"></i>
                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
                    </span>
                </div>
                
                <div class="border-t border-gray-200 pt-4 mb-4">
                    <h4 class="font-semibold text-gray-800 mb-2">Items:</h4>
                    <ul class="space-y-2">
                        ${order.items.map(item => `
                            <li class="flex justify-between text-gray-600">
                                <span>${item.quantity}x ${item.name}</span>
                                <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="border-t border-gray-200 pt-4 mb-4">
                    <h4 class="font-semibold text-gray-800 mb-2">Delivery Details:</h4>
                    <p class="text-gray-600"><i class="fas fa-user mr-2"></i>${order.customerName}</p>
                    <p class="text-gray-600"><i class="fas fa-phone mr-2"></i>${order.customerPhone}</p>
                    <p class="text-gray-600"><i class="fas fa-map-marker-alt mr-2"></i>${order.customerAddress}</p>
                </div>
                
                <div class="border-t border-gray-200 pt-4">
                    <div class="flex justify-between items-center">
                        <span class="text-lg font-semibold text-gray-800">Total:</span>
                        <span class="text-2xl font-bold text-orange-500">₹${order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
                
                ${order.status === 'pending' ? `
                    <div class="mt-4">
                        <button onclick="cancelOrder('${order._id}')" 
                                class="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition">
                            Cancel Order
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// Cancel order
async function cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'cancelled' })
        });
        
        if (response.ok) {
            alert('Order cancelled successfully');
            loadOrders(); // Reload orders
        } else {
            throw new Error('Failed to cancel order');
        }
    } catch (error) {
        console.error('Error cancelling order:', error);
        alert('Failed to cancel order. Please try again.');
    }
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}
