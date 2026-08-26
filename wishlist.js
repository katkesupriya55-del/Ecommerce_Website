document.addEventListener('DOMContentLoaded', () => {
  renderWishlist();
});

// Safely get wishlist array from LocalStorage
function getWishlistData() {
  try {
    const data = localStorage.getItem('wishlist');
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => item && typeof item === 'object' && item.title);
    }
  } catch (error) {
    console.error('Error reading wishlist from localStorage:', error);
  }
  return [];
}

// Safely save wishlist array back to LocalStorage
function saveWishlistData(wishlist) {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Main function to render cards and bind direct click events
function renderWishlist() {
  const wishlistGrid = document.getElementById('wishlist-grid');
  const emptyState = document.getElementById('empty-wishlist');

  if (!wishlistGrid || !emptyState) return;

  const wishlist = getWishlistData();

  // If empty, show empty state message
  if (wishlist.length === 0) {
    wishlistGrid.style.display = 'none';
    emptyState.style.display = 'block';
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
            <span class="current-price">${item.price || ''}</span>
          </div>
          <div class="card-actions">
            <button class="move-cart-btn" data-title="${item.title}">
              <i class="fa-solid fa-cart-shopping"></i> Move to Cart
            </button>
            <button class="remove-wishlist-btn" data-title="${item.title}" aria-label="Remove item">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    </article>
  `
    )
    .join('');

  // Attach direct event listeners to every delete button
  const removeButtons = wishlistGrid.querySelectorAll('.remove-wishlist-btn');
  removeButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const title = this.getAttribute('data-title');
      removeFromWishlist(title);
    });
  });

  // Attach direct event listeners to every move-to-cart button
  const moveButtons = wishlistGrid.querySelectorAll('.move-cart-btn');
  moveButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const title = this.getAttribute('data-title');
      moveToCart(title);
    });
  });

  updateNavbarCounts();
}

// Remove item matching title
function removeFromWishlist(title) {
  let wishlist = getWishlistData();
  
  // Keep all items EXCEPT the one with matching title
  wishlist = wishlist.filter((item) => item.title !== title);
  
  saveWishlistData(wishlist);
  renderWishlist(); // Re-render page
}

// Move item to cart matching title
function moveToCart(title) {
  let wishlist = getWishlistData();
  const itemToMove = wishlist.find((item) => item.title === title);

  if (itemToMove) {
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
      cart = [];
    }

    const existingIndex = cart.findIndex((i) => i.title === itemToMove.title);
    if (existingIndex > -1) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
      cart.push({ ...itemToMove, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Remove from wishlist after moving
    removeFromWishlist(title);
  }
}

// Update header badges dynamically
function updateNavbarCounts() {
  const wishlist = getWishlistData();
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
  } catch (e) {
    cart = [];
  }

  const wishlistBadge = document.querySelector('a[aria-label="Wishlist"] .count-badge');
  if (wishlistBadge) {
    wishlistBadge.textContent = wishlist.length;
  }

  const cartBadge = document.querySelector('a[aria-label="Cart"] .count-badge');
  if (cartBadge) {
    const totalCartItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartBadge.textContent = totalCartItems;
  }
}