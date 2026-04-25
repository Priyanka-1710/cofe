// Sample Coffee Menu Data
const coffeeProducts = [
  { id: 1, name: "Espresso", price: 250, category: "coffee", rating: "⭐⭐⭐⭐⭐", image: "./image/Espresso.jfif" },
  { id: 2, name: "Americano", price: 150, category: "coffee", rating: "⭐⭐⭐⭐", image: "./image/americano.jfif" },
  { id: 3, name: "Cappuccino", price: 200, category: "coffee", rating: "⭐⭐⭐⭐⭐", image: "./image/Cappuccino.jfif" },
  { id: 4, name: "Latte", price: 220, category: "coffee", rating: "⭐⭐⭐⭐", image: "./image/Latte.jfif" },
  { id: 5, name: "Iced Coffee", price: 180, category: "cold", rating: "⭐⭐⭐⭐", image: "./image/Iced-Coffee.jfif" },
  { id: 6, name: "Cold Brew", price: 200, category: "cold", rating: "⭐⭐⭐⭐⭐", image: "./image/Cold-Brew.jfif" },
  { id: 7, name: "Croissant", price: 100, category: "snack", rating: "⭐⭐⭐⭐", image: "./image/Croissant.jfif" },
  { id: 8, name: "Muffin", price: 80, category: "snack", rating: "⭐⭐⭐⭐", image: "./image/Muffin.jfif" }
];

let cart = [];
let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

// Display Menu Items
function displayMenu(products) {
  const menuContainer = document.getElementById("menuContainer");
  menuContainer.innerHTML = products.map(product => `
    <div class="card" data-category="${product.category}">
      <div class="card-image-container">
        <img src="${product.image}" alt="${product.name}" class="card-img">
        <div class="card-overlay">
          <button class="quick-view-btn" onclick="showQuickView(${product.id})">👁️ Quick View</button>
        </div>
      </div>
      <div class="card-content">
        <div class="card-header">
          <h3 class="card-title">${product.name}</h3>
          <span class="card-rating">${product.rating}</span>
        </div>
        <div class="card-price">₹${product.price}</div>
        <div class="card-description">${getProductDescription(product.name)}</div>
        <div class="card-actions">
          <button class="add-to-cart-btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
            <span class="btn-icon">🛒</span> Add to Cart
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

// Get product descriptions
function getProductDescription(productName) {
  const descriptions = {
    "Espresso": "Rich, bold shot of pure coffee essence",
    "Americano": "Smooth espresso diluted with hot water",
    "Cappuccino": "Espresso with steamed milk and foam",
    "Latte": "Creamy espresso with steamed milk",
    "Iced Coffee": "Chilled coffee over ice, refreshing",
    "Cold Brew": "Slow-steeped cold coffee, smooth taste",
    "Croissant": "Buttery, flaky French pastry",
    "Muffin": "Soft, moist baked treat"
  };
  return descriptions[productName] || "Delicious coffee shop favorite";
}

// Quick view function
function showQuickView(productId) {
  const product = coffeeProducts.find(p => p.id === productId);
  if (product) {
    alert(`${product.name}\n\n${getProductDescription(product.name)}\n\nPrice: ₹${product.price}\nRating: ${product.rating}\n\nPerfect for coffee lovers!`);
  }
}

// Add to Cart
function addToCart(id, name, price) {
  cart.push({ id, name, price });
  document.getElementById("cartCount").textContent = cart.length;
  alert(`${name} added to cart!`);
}

// CHECKOUT FUNCTIONS
function openCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty! Add items first.");
    return;
  }
  displayCartItems();
  document.getElementById("checkoutModal").classList.add("active");
}

function closeCheckout() {
  document.getElementById("checkoutModal").classList.remove("active");
}

function displayCartItems() {
  const cartItemsList = document.getElementById("cartItemsList");
  let totalPrice = 0;

  if (cart.length === 0) {
    cartItemsList.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    document.getElementById("totalPrice").textContent = "0";
    return;
  }

  cartItemsList.innerHTML = cart.map((item, index) => {
    totalPrice += item.price;
    return `
      <div class="cart-item">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">₹${item.price}</span>
        <button type="button" style="background: #d32f2f; padding: 5px 10px; font-size: 12px;" onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
  }).join("");

  document.getElementById("totalPrice").textContent = totalPrice;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  document.getElementById("cartCount").textContent = cart.length;
  displayCartItems();
}

// Display Reviews
function displayReviews() {
  const reviewList = document.getElementById("reviewList");
  reviewList.innerHTML = reviews.map(review => `
    <div class="review">
      <p>${review.text}</p>
      <p>${review.rating}</p>
    </div>
  `).join("");
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  // Filter Menu
  document.querySelectorAll(".filters button").forEach(button => {
    button.addEventListener("click", function() {
      const filter = this.getAttribute("data-filter");
      const filtered = filter === "all" ? coffeeProducts : coffeeProducts.filter(p => p.category === filter);
      displayMenu(filtered);
    });
  });

  // Search
  document.getElementById("searchBar").addEventListener("input", function() {
    const search = this.value.toLowerCase();
    const filtered = coffeeProducts.filter(p => p.name.toLowerCase().includes(search));
    displayMenu(filtered);
  });

  // Order Button
  document.getElementById("orderBtn").addEventListener("click", function() {
    displayMenu(coffeeProducts);
    window.scrollTo({ top: document.querySelector(".menu").offsetTop, behavior: "smooth" });
  });

  // Add Review
  document.getElementById("submitReview").addEventListener("click", function() {
    const reviewText = document.getElementById("reviewInput").value;
    const rating = document.getElementById("rating").value;
    
    if (reviewText.trim()) {
      reviews.push({ text: reviewText, rating });
      localStorage.setItem("reviews", JSON.stringify(reviews));
      document.getElementById("reviewInput").value = "";
      displayReviews();
    }
  });

  // Checkout Form Submission
  document.getElementById("checkoutFormElement").addEventListener("submit", function(e) {
    e.preventDefault();

    const customerName = document.getElementById("customerName").value;
    const customerEmail = document.getElementById("customerEmail").value;
    const customerPhone = document.getElementById("customerPhone").value;
    const customerAddress = document.getElementById("customerAddress").value;
    const paymentMethod = document.getElementById("paymentMethod").value;

    if (!customerName || !customerEmail || !customerPhone || !customerAddress || !paymentMethod) {
      alert("Please fill all fields!");
      return;
    }

    // Calculate total
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    // Create order
    const order = {
      orderId: "ORD-" + Date.now(),
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      paymentMethod,
      items: cart,
      total,
      date: new Date().toLocaleString()
    };

    // Save order to localStorage
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Show success message
    alert(`Order Placed Successfully!\n\nOrder ID: ${order.orderId}\nTotal: ₹${order.total}\n\nThank you for your order!`);

    // Reset
    cart = [];
    document.getElementById("cartCount").textContent = "0";
    document.getElementById("checkoutFormElement").reset();
    closeCheckout();
  });

  // Contact Form Submission
  document.getElementById("contactFormElement").addEventListener("submit", function(e) {
    e.preventDefault();

    const contactName = document.getElementById("contactName").value;
    const contactEmail = document.getElementById("contactEmail").value;
    const contactPhone = document.getElementById("contactPhone").value;
    const contactSubject = document.getElementById("contactSubject").value;
    const contactMessage = document.getElementById("contactMessage").value;

    if (!contactName || !contactEmail || !contactSubject || !contactMessage) {
      alert("Please fill all required fields!");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      alert("Please enter a valid email address!");
      return;
    }

    // Create contact message object
    const message = {
      messageId: "MSG-" + Date.now(),
      name: contactName,
      email: contactEmail,
      phone: contactPhone,
      subject: contactSubject,
      message: contactMessage,
      date: new Date().toLocaleString()
    };

    // Save message to localStorage
    let messages = JSON.parse(localStorage.getItem("contactMessages")) || [];
    messages.push(message);
    localStorage.setItem("contactMessages", JSON.stringify(messages));

    // Show success message
    alert(`Thank You!\n\nYour message has been sent successfully.\nMessage ID: ${message.messageId}\n\nWe will get back to you soon!`);

    // Reset form
    document.getElementById("contactFormElement").reset();
  });

  // Close modal when clicking outside
  window.addEventListener("click", function(event) {
    const modal = document.getElementById("checkoutModal");
    if (event.target === modal) {
      closeCheckout();
    }
  });

  // Initialize
  displayMenu(coffeeProducts);
  displayReviews();
});
