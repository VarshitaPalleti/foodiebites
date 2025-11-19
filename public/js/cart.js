// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
  displayCart();
});

// Display cart items
function displayCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsContainer = document.getElementById("cart-items");
  const emptyCart = document.getElementById("empty-cart");
  const orderSummary = document.getElementById("order-summary");
  const itemsSpan = document.getElementById("items-span");
  const summarySpan = document.getElementById("summary-span");

  if (cart.length === 0) {
    cartItemsContainer.classList.add("hidden");
    emptyCart.classList.remove("hidden");
    orderSummary.classList.add("hidden");

    itemsSpan.classList.remove("lg:col-span-2");
    itemsSpan.classList.add("lg:col-span-3");
    summarySpan.classList.remove("lg:col-span-1");
    return;
  }

  cartItemsContainer.classList.remove("hidden");
  emptyCart.classList.add("hidden");
  orderSummary.classList.remove("hidden");

  itemsSpan.classList.remove("lg:col-span-3");
  itemsSpan.classList.add("lg:col-span-2");
  summarySpan.classList.add("lg:col-span-1");

  cartItemsContainer.innerHTML = cart
    .map(
      (item, index) => `
        <div class="bg-white rounded-lg shadow-md p-4 flex items-center gap-4">
            <img src="${item.image}" alt="${
        item.name
      }" class="w-24 h-24 object-cover rounded-lg">
            <div class="flex-1">
                <h4 class="text-lg font-bold text-gray-800">${item.name}</h4>
                <p class="text-gray-600 text-sm">${item.restaurantName}</p>
                <p class="text-orange-500 font-semibold mt-1">₹${item.price.toFixed(
                  2
                )}</p>
            </div>
            <div class="flex items-center gap-3">
                <button onclick="updateQuantity(${index}, -1)" 
                        class="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="text-lg font-semibold w-8 text-center">${
                  item.quantity
                }</span>
                <button onclick="updateQuantity(${index}, 1)" 
                        class="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <button onclick="removeFromCart(${index})" 
                    class="text-red-500 hover:text-red-700 transition">
                <i class="fas fa-trash text-xl"></i>
            </button>
        </div>
    `
    )
    .join("");

  updateOrderSummary(cart);
}

// Update quantity
function updateQuantity(index, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart[index].quantity += change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  displayCart();
}

// Remove from cart
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  displayCart();
}

// Update order summary
function updateOrderSummary(cart) {
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const deliveryFee = 2.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;

  document.getElementById("subtotal").textContent = `₹${subtotal.toFixed(2)}`;
  document.getElementById("delivery-fee").textContent = `₹${deliveryFee.toFixed(
    2
  )}`;
  document.getElementById("tax").textContent = `₹${tax.toFixed(2)}`;
  document.getElementById("total").textContent = `₹${total.toFixed(2)}`;
}

// Update cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = count;
  }
}

// Place order
async function placeOrder() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Get delivery details
  const name = document.getElementById("customer-name").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();
  const address = document.getElementById("customer-address").value.trim();

  if (!name || !phone || !address) {
    alert("Please fill in all delivery details!");
    return;
  }

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const deliveryFee = 49.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const order = {
    customerName: name,
    customerPhone: phone,
    deliveryAddress: address,
    items: cart,
    subtotal: subtotal,
    deliveryFee: deliveryFee,
    tax: tax,
    total: total,
    status: "pending",
  };

  try {
    const checkoutBtn = document.getElementById("checkout-btn");
    checkoutBtn.disabled = true;
    checkoutBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin mr-2"></i>Placing Order...';

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    const result = await response.json();

    if (response.ok) {
      // Clear cart
      localStorage.removeItem("cart");

      // Show success message and redirect
      alert("Order placed successfully!");
      window.location.href = "/orders";
    } else {
      throw new Error(result.error || "Failed to place order");
    }
  } catch (error) {
    console.error("Error placing order:", error);
    alert("Failed to place order. Please try again.");

    const checkoutBtn = document.getElementById("checkout-btn");
    checkoutBtn.disabled = false;
    checkoutBtn.innerHTML = "Place Order";
  }
}
