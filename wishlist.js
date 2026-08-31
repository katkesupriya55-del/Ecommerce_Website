// Safely retrieve wishlist array from LocalStorage
function getWishlistData() {
  try {
    const data = localStorage.getItem('wishlist');
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => item && typeof item === 'object');
    }
  } catch (error) {
    console.error('Error reading wishlist from localStorage:', error);
  }
  return [];
}

// Alias for getWishlistData
function getWishlist() {
  return getWishlistData();
}

// Safely save wishlist array back to LocalStorage
function saveWishlistData(wishlist) {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateNavbarCounts();
}

// Update header badges for both Wishlist and Cart dynamically
function updateNavbarCounts() {
  const wishlist = getWishlistData();
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
  } catch (e) {
    cart = [];
  }

  // Update wishlist badge (by aria-label or ID)
  const wishlistBadge = document.querySelector('a[aria-label="Wishlist"] .count-badge') || document.getElementById('wishlist-count');
  if (wishlistBadge) {
    wishlistBadge.textContent = wishlist.length;
  }

  // Update cart badge
  const cartBadge = document.querySelector('a[aria-label="Cart"] .count-badge');
  if (cartBadge) {
    const totalCartItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartBadge.textContent = totalCartItems;
  }
}

// Check if an item is already in Wishlist
function isInWishlist(idOrTitle) {
  const wishlist = getWishlistData();
  return wishlist.some(item => item.id === idOrTitle || item.title === idOrTitle);
}

// Toggle item in Wishlist (Used on Product listing pages)
function toggleWishlist(id, title, price, image, event) {
  if (event) event.stopPropagation();

  let wishlist = getWishlistData();
  const index = wishlist.findIndex(item => (id && item.id === id) || (title && item.title === title));

  if (index > -1) {
    wishlist.splice(index, 1); // Remove if already present
  } else {
    wishlist.push({ id: id || title, title, price, image }); // Add new item
  }

  saveWishlistData(wishlist);

  // If on product catalog page, refresh UI if needed
  if (typeof fetchProducts === 'function') {
    fetchProducts();
  }

  // If on wishlist page, re-render
  if (document.getElementById('wishlist-grid')) {
    renderWishlist();
  }
}

// Main function to render cards on wishlist.html
function renderWishlist() {
  const wishlistGrid = document.getElementById('wishlist-grid');
  const emptyState = document.getElementById('empty-wishlist');

  // If elements don't exist (e.g., on product.html), just update counts and return
  if (!wishlistGrid || !emptyState) {
    updateNavbarCounts();
    return;
  }

  const wishlist = getWishlistData();

  // Show empty state if wishlist is empty
  if (wishlist.length === 0) {
    wishlistGrid.style.display = 'none';
    emptyState.style.display = 'flex';
    updateNavbarCounts();
    return;
  }

  wishlistGrid.style.display = 'grid';
  emptyState.style.display = 'none';

  // Inject HTML structure into grid
  wishlistGrid.innerHTML = wishlist
    .map(
      (item) => `
    <article class="product-card" style="opacity:1; transform:none;">
      <div class="card-image-wrapper">
        <img src="${item.image || 'c1.jpg'}" alt="${item.title || 'Product'}" />
      </div>
      <div class="card-content">
        ${item.category ? `<span class="category">${item.category}</span>` : ''}
        <h3 class="product-title">${item.title}</h3>
        <div class="card-footer" style="flex-direction: column; gap: 12px; align-items: stretch;">
          <div class="price">
            <span class="current-price">${item.price ? '$' + item.price : ''}</span>
          </div>
          <div class="card-actions">
            <button class="move-cart-btn" data-title="${item.title}" data-id="${item.id || ''}">
              <i class="fa-solid fa-cart-shopping"></i> Move to Cart
            </button>
            <button class="remove-wishlist-btn" data-title="${item.title}" data-id="${item.id || ''}" aria-label="Remove item">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    </article>
  `
    )
    .join('');

  // Attach direct event listeners to delete buttons
  const removeButtons = wishlistGrid.querySelectorAll('.remove-wishlist-btn');
  removeButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const key = this.getAttribute('data-id') || this.getAttribute('data-title');
      removeFromWishlist(key);
    });
  });

  // Attach direct event listeners to move-to-cart buttons
  const moveButtons = wishlistGrid.querySelectorAll('.move-cart-btn');
  moveButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const key = this.getAttribute('data-id') || this.getAttribute('data-title');
      moveToCart(key);
    });
  });

  updateNavbarCounts();
}

// Remove item from Wishlist
function removeFromWishlist(idOrTitle) {
  let wishlist = getWishlistData();
  wishlist = wishlist.filter((item) => item.id !== idOrTitle && item.title !== idOrTitle);
  saveWishlistData(wishlist);
  renderWishlist();
}

// Move item to cart matching title or ID
function moveToCart(idOrTitle) {
  let wishlist = getWishlistData();
  const itemToMove = wishlist.find((item) => item.id === idOrTitle || item.title === idOrTitle);

  if (itemToMove) {
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
      cart = [];
    }

    const existingIndex = cart.findIndex((i) => (itemToMove.id && i.id === itemToMove.id) || i.title === itemToMove.title);
    if (existingIndex > -1) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
      cart.push({ ...itemToMove, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    removeFromWishlist(idOrTitle);
  }
}

// Single initialization entry point
document.addEventListener('DOMContentLoaded', () => {
  renderWishlist();
  updateNavbarCounts();
});