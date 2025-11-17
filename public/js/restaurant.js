// Get restaurant ID from URL
const urlParts = window.location.pathname.split('/');
const restaurantId = urlParts[urlParts.length - 1];

let currentRestaurant = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    loadRestaurant();
});

// Load restaurant details
async function loadRestaurant() {
    try {
        const response = await fetch(`/api/restaurants/${restaurantId}`);
        if (!response.ok) {
            throw new Error('Restaurant not found');
        }
        currentRestaurant = await response.json();
        displayRestaurant();
    } catch (error) {
        console.error('Error loading restaurant:', error);
        document.getElementById('loading').innerHTML = `
            <i class="fas fa-exclamation-circle text-4xl text-red-500"></i>
            <p class="mt-4 text-gray-600">Failed to load restaurant</p>
        `;
    }
}

// Display restaurant details
function displayRestaurant() {
    const headerSection = document.getElementById('restaurant-header');
    const menuSection = document.getElementById('menu-section');
    const loading = document.getElementById('loading');
    
    loading.classList.add('hidden');
    
    // Display restaurant header
    headerSection.innerHTML = `
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="${currentRestaurant.image}" alt="${currentRestaurant.name}" class="w-full h-64 object-cover">
            <div class="p-6">
                <h2 class="text-3xl font-bold text-gray-800 mb-4">${currentRestaurant.name}</h2>
                <div class="flex flex-wrap gap-4 text-gray-600">
                    <span>
                        <i class="fas fa-utensils text-orange-500 mr-2"></i>
                        ${currentRestaurant.cuisine}
                    </span>
                    <span>
                        <i class="fas fa-star text-yellow-400 mr-2"></i>
                        ${currentRestaurant.rating} Rating
                    </span>
                    <span>
                        <i class="fas fa-clock text-orange-500 mr-2"></i>
                        ${currentRestaurant.deliveryTime}
                    </span>
                </div>
            </div>
        </div>
    `;
    
    // Display menu
    menuSection.classList.remove('hidden');
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = currentRestaurant.menu.map(item => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
            <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h4 class="text-xl font-bold text-gray-800 mb-2">${item.name}</h4>
                <p class="text-gray-600 text-sm mb-3">${item.description}</p>
                <div class="flex items-center justify-between">
                    <span class="text-2xl font-bold text-orange-500">$${item.price.toFixed(2)}</span>
                    <button onclick="addToCart(${item.id})" 
                            class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
                        <i class="fas fa-plus mr-2"></i>Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Add item to cart
function addToCart(itemId) {
    const item = currentRestaurant.menu.find(m => m.id === itemId);
    if (!item) return;
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const restaurantIdString = currentRestaurant._id && currentRestaurant._id.toString ? currentRestaurant._id.toString() : currentRestaurant._id;
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(cartItem => 
        cartItem.restaurantId === restaurantIdString && cartItem.id === itemId
    );
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            restaurantId: restaurantIdString,
            restaurantName: currentRestaurant.name,
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show success message
    showNotification('Item added to cart!');
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

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
    notification.innerHTML = `
        <i class="fas fa-check-circle mr-2"></i>
        ${message}
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
