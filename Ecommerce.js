// ==========================================
// 1. GLOBAL NAVBAR & BADGE COUNT FUNCTIONS
// ==========================================

function updateBadgeCounts() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const rawWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  // Filter out any invalid items or old string data
  const wishlist = rawWishlist.filter(item => typeof item === 'object' && item !== null && item.title);

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const wishlistCount = wishlist.length;

  const cartBadge = document.getElementById('cart-count');
  const wishlistBadge = document.getElementById('wishlist-count');

  if (cartBadge) cartBadge.textContent = cartCount;
  if (wishlistBadge) wishlistBadge.textContent = wishlistCount;
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItemIndex = cart.findIndex(item => item.title === product.title);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateBadgeCounts();
}

function toggleWishlist(product, button) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  
  // Keep only object entries
  wishlist = wishlist.filter(item => typeof item === 'object' && item !== null && item.title);

  const existingIndex = wishlist.findIndex(item => item.title === product.title);
  const icon = button.querySelector('i');

  if (existingIndex > -1) {
    // Remove from wishlist
    wishlist.splice(existingIndex, 1);
    button.classList.remove('active');
    if (icon) icon.className = 'fa-regular fa-heart';
  } else {
    // Add to wishlist
    wishlist.push(product);
    button.classList.add('active');
    if (icon) icon.className = 'fa-solid fa-heart';
  }

  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateBadgeCounts();
}

// Highlight saved heart icons when visiting any page
function syncWishlistButtons() {
  const rawWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const wishlist = rawWishlist.filter(item => typeof item === 'object' && item !== null && item.title);
  
  const wishBtns = document.querySelectorAll('.wishlist-btn, [class*="wishlist"]');

  wishBtns.forEach(btn => {
    const card = btn.closest('.product-card, .card, .footwear-card, .jewel-card, article');
    if (!card) return;

    const titleElem = card.querySelector('.product-title, .card-title, .title, h3, h2, h4');
    const title = titleElem ? titleElem.innerText.trim() : '';
    
    if (!title) return;

    const isSaved = wishlist.some(item => item.title === title);
    const icon = btn.querySelector('i');

    if (isSaved) {
      btn.classList.add('active');
      if (icon) icon.className = 'fa-solid fa-heart';
    } else {
      btn.classList.remove('active');
      if (icon) icon.className = 'fa-regular fa-heart';
    }
  });
}


// Extract product data regardless of card layout differences
function extractProductData(card) {
  const titleElem = card.querySelector('.product-title, .card-title, .title, h3, h2, h4');
  const priceElem = card.querySelector('.current-price, .card-price, .price, span[class*="price"]');
  const imgElem = card.querySelector('img');
  const categoryElem = card.querySelector('.category, .card-category, .tag');

  return {
    title: titleElem ? titleElem.innerText.trim() : 'Unknown Product',
    price: priceElem ? priceElem.innerText.trim() : '',
    image: imgElem ? (imgElem.getAttribute('src') || imgElem.src) : '',
    category: categoryElem ? categoryElem.innerText.trim() : ''
  };
}

// ==========================================
// 2. AUTHENTICATION & NAVBAR MANAGEMENT (NEW)
// ==========================================

// Render Profile or Sign In button dynamically in the Navbar
function updateNavbar() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userActionsContainer = document.querySelector('.user-actions');

  if (!userActionsContainer) return;

  if (currentUser) {
    // Logged In: Show Profile link on the left side of Logout button
    const firstName = currentUser.name ? currentUser.name.split(' ')[0] : 'Profile';
    userActionsContainer.innerHTML = `
      <a href="http://127.0.0.1:5501/profile.html" class="profile-btn" title="View Profile">
        <i class="fa-solid fa-user"></i>
        <span>${firstName}</span>
      </a>
      <button class="logout-btn" onclick="handleLogout()" title="Logout">
        <i class="fa-solid fa-right-from-bracket"></i>
        <span>Logout</span>
      </button>
    `;
  } else {
    // Logged Out: Show Sign In button only
    userActionsContainer.innerHTML = `
      <a href="signin.html" class="signin-nav-btn">
        <i class="fa-solid fa-right-to-bracket"></i>
        <span>Sign In</span>
      </a>
    `;
  }
}

// Handle "Explore Our Products" button logic
function setupExploreButton() {
  const exploreBtn = document.querySelector('.btn[href*="product.html"]');
  if (!exploreBtn) return;

  exploreBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    if (currentUser) {
      // 1. Logged in user -> Go directly to Products
      window.location.href = 'product.html';
    } else if (registeredUsers.length === 0) {
      // 2. First-time visitor (no accounts registered) -> Go to Register
      window.location.href = 'register.html';
    } else {
      // 3. Existing user (registered before but logged out) -> Go to Sign In
      window.location.href = 'signin.html';
    }
  });
}

const pillButtons = document.querySelectorAll('.pill-btn');

pillButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all pills
    pillButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked pill
    button.classList.add('active');
  });
});

// Logout handler
function handleLogout() {
  if (confirm("Are you sure you want to log out?")) {
    localStorage.removeItem('currentUser');
    window.location.href = 'signin.html';
  }
}
window.handleLogout = handleLogout;

// ==========================================
// 3. DOM EVENT LISTENERS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Navbar and Explore Button
  updateNavbar();
  setupExploreButton();

  // Initialize Badges and Wishlists
  updateBadgeCounts();
  syncWishlistButtons();

  // Global click event delegation for Cart and Wishlist
  document.addEventListener('click', (e) => {
    
    // --- Handle Add to Cart Button Click ---
    const addBtn = e.target.closest('.add-cart-btn, .card-btn, .btn-add-cart');
    if (addBtn) {
      e.preventDefault();
      const card = addBtn.closest('.product-card, .card, .footwear-card, .jewel-card, article');
      if (!card) return;

      const product = extractProductData(card);
      addToCart(product);

      // Feedback animation
      const originalHTML = addBtn.innerHTML;
      addBtn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
      addBtn.style.backgroundColor = '#22c55e';
      addBtn.style.color = '#ffffff';

      setTimeout(() => {
        addBtn.innerHTML = originalHTML;
        addBtn.style.backgroundColor = '';
        addBtn.style.color = '';
      }, 1200);
    }

   
  const searchForm = document.querySelector('.search-box');
  const searchInput = document.querySelector('.search-input');

  searchForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Stop the form from submitting normally

    // Clean and normalize user input
    const query = searchInput.value.toLowerCase().trim();

    // Map input keywords to specific pages
    if (query.includes('formal')) {
      window.location.href = 'http://127.0.0.1:5501/formal.html';
    } else if (query.includes('foot wear') || query.includes('footwear') || query.includes('shoe')) {
      window.location.href = 'http://127.0.0.1:5501/footwear.html';
    } else if (query.includes('jwellwey') || query.includes('jewelry') || query.includes('jewellery')) {
      window.location.href = 'http://127.0.0.1:5501/jwel.html';
    } else {
      // Fallback: Redirect to default product page with search query
      window.location.href = `http://127.0.0.1:5501/product.html?q=${encodeURIComponent(query)}`;
    }
  });

  async function filterProductsByCategory(categoryName) {
  const container = document.getElementById('product-container');
  if (!container) return;

  try {
    const url = categoryName && categoryName !== 'All' 
      ? `http://localhost:5000/api/products?category=${encodeURIComponent(categoryName)}`
      : 'http://localhost:5000/api/products';

    const response = await fetch(url);
    const products = await response.json();

    if (products.length === 0) {
      container.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">No products found in this category.</p>`;
      return;
    }

    container.innerHTML = products.map(product => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>$${product.price}</p>
        <button onclick="addToCart('${product._id}')">Add to Cart</button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error filtering products:', error);
  }
}

  // Retrieve cart from localStorage or initialize empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart badge count in navbar
function updateCartBadge() {
  const cartBadge = document.getElementById('cart-count');
  if (cartBadge) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 1);
    cartBadge.textContent = cart.length;
  }
}

// Add item to cart
async function addToCart(productId) {
  try {
    const response = await fetch(`http://localhost:5000/api/products`);
    const products = await response.json();
    const product = products.find(p => p._id === productId);

    if (product) {
      const existingItem = cart.find(item => item._id === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartBadge();
      alert(`${product.title} added to your cart!`);
    }
  } catch (error) {
    console.error('Failed to add item to cart:', error);
  }
}
async function fetchProducts() {
  const container = document.getElementById('product-container'); // Ensure this ID matches your HTML grid container
  if (!container) return;

  try {
    const response = await fetch('http://localhost:5000/api/products');
    const products = await response.json();

    if (products.length === 0) {
      container.innerHTML = '<p>No products found in database.</p>';
      return;
    }

    container.innerHTML = products.map(product => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p class="category">${product.category}</p>
        <p class="price">$${product.price.toFixed(2)}</p>
        <button onclick="addToCart('${product._id}', '${product.title}', ${product.price}, '${product.image}')">
          Add to Cart
        </button>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error fetching products:', err);
    container.innerHTML = '<p>Failed to load products from server.</p>';
  }
}

document.addEventListener('DOMContentLoaded', fetchProducts);
// Initialize badge on load
document.addEventListener('DOMContentLoaded', updateCartBadge);

  async function loadProducts() {
  const container = document.getElementById('product-container');
  if (!container) return;

  try {
    const response = await fetch('http://localhost:5000/api/products');
    const products = await response.json();

    container.innerHTML = products.map(product => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>         <p>$${product.price}</p>
        <button onclick="addToCart('${product._id}')">Add to Cart</button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading products from server:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadProducts);

  // Fetch products dynamically from backend API
async function displayProductsFromDatabase() {
  try {
    const response = await fetch('http://localhost:5000/api/products');
    const products = await response.json();
    
    console.log('Fetched products from MongoDB:', products);
    // Render products dynamically in your HTML container here
  } catch (error) {
    console.error('Failed to load products:', error);
  }
}

// Call function on page load
document.addEventListener('DOMContentLoaded', displayProductsFromDatabase);


    // --- Handle Wishlist Button Click ---
    const wishBtn = e.target.closest('.wishlist-btn, [class*="wishlist"]');
    if (wishBtn) {
      e.preventDefault();
      e.stopPropagation();

      const card = wishBtn.closest('.product-card, .card, .footwear-card, .jewel-card, article');
      if (!card) return;

      const product = extractProductData(card);
      toggleWishlist(product, wishBtn);
    }
  });
});