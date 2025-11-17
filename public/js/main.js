// Global variables
let allRestaurants = [];
let filteredRestaurants = [];

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    loadRestaurants();
});

// Load restaurants from API
async function loadRestaurants() {
    try {
        const response = await fetch('/api/restaurants');
        allRestaurants = await response.json();
        filteredRestaurants = allRestaurants;
        displayRestaurants(filteredRestaurants);
    } catch (error) {
        console.error('Error loading restaurants:', error);
        document.getElementById('loading').innerHTML = `
            <i class="fas fa-exclamation-circle text-4xl text-red-500"></i>
            <p class="mt-4 text-gray-600">Failed to load restaurants</p>
        `;
    }
}

// Display restaurants
function displayRestaurants(restaurants) {
    const grid = document.getElementById('restaurants-grid');
    const loading = document.getElementById('loading');
    const noResults = document.getElementById('no-results');
    
    loading.classList.add('hidden');
    
    if (restaurants.length === 0) {
        grid.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
    }
    
    grid.classList.remove('hidden');
    noResults.classList.add('hidden');
    
    grid.innerHTML = restaurants.map(restaurant => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer transform hover:-translate-y-1"
             onclick="window.location.href='/restaurant/${restaurant._id}'">
            <img src="${restaurant.image}" alt="${restaurant.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h4 class="text-xl font-bold text-gray-800 mb-2">${restaurant.name}</h4>
                <div class="flex items-center justify-between mb-2">
                    <span class="text-gray-600">
                        <i class="fas fa-utensils text-orange-500 mr-1"></i>
                        ${restaurant.cuisine}
                    </span>
                    <span class="text-gray-600">
                        <i class="fas fa-star text-yellow-400 mr-1"></i>
                        ${restaurant.rating}
                    </span>
                </div>
                <div class="flex items-center text-gray-600">
                    <i class="fas fa-clock text-orange-500 mr-2"></i>
                    <span>${restaurant.deliveryTime}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Search restaurants
function searchRestaurants() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    if (searchTerm.trim() === '') {
        filteredRestaurants = allRestaurants;
    } else {
        filteredRestaurants = allRestaurants.filter(restaurant => 
            restaurant.name.toLowerCase().includes(searchTerm) ||
            restaurant.cuisine.toLowerCase().includes(searchTerm)
        );
    }
    
    displayRestaurants(filteredRestaurants);
}

// Filter by cuisine
function filterByCuisine(cuisine) {
    // Update button styles
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-orange-500', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    event.target.classList.remove('bg-gray-200', 'text-gray-700');
    event.target.classList.add('bg-orange-500', 'text-white');
    
    if (cuisine === 'all') {
        filteredRestaurants = allRestaurants;
    } else {
        filteredRestaurants = allRestaurants.filter(restaurant => 
            restaurant.cuisine === cuisine
        );
    }
    
    displayRestaurants(filteredRestaurants);
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

// Add event listener for search input
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchRestaurants();
            }
        });
    }
});
