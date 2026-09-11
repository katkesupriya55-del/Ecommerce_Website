document.addEventListener('DOMContentLoaded', () => {
  renderWishlist();
  updateBadges();
});

function getCart() { return JSON.parse(localStorage.getItem('shop_cart')) || []; }
function setCart(cart) { localStorage.setItem('shop_cart', JSON.stringify(cart)); }
function getWishlist() { return JSON.parse(localStorage.getItem('shop_wishlist')) || []; }
function setWishlist(wl) { localStorage.setItem('shop_wishlist', JSON.stringify(wl)); }

function updateBadges() {
  const cart = getCart();
  const wishlist = getWishlist();

  const cartBadge = document.querySelector('.nav-pill[aria-label="Cart"] .count-badge');
  const wishlistBadge = document.querySelector('.nav-pill[aria-label="Wishlist"] .count-badge');

  if (cartBadge) {
    cartBadge.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  }
  if (wishlistBadge) {
    wishlistBadge.textContent = wishlist.length;
  }
}

function renderWishlist() {
  const container = document.getElementById('wishlist-grid');
  const emptyState = document.getElementById('empty-wishlist');
  const wishlist = getWishlist();

  container.innerHTML = '';

  if (wishlist.length === 0) {
    container.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  container.style.display = 'flex';
  emptyState.style.display = 'none';

  wishlist.forEach((product) => {
    const row = document.createElement('div');
    row.className = 'wishlist-item-card';
    row.innerHTML = `
      <img src="${product.img}" alt="${product.title}" class="wishlist-item-img" />
      <div class="wishlist-item-details">
        <h3 class="wishlist-item-title">${product.title}</h3>
        <span class="wishlist-item-price">${product.currentPriceText}</span>
      </div>
      <div class="wishlist-item-actions">
        <button class="move-cart-btn" onclick="moveToCart('${product.id}')">
          <i class="fa-solid fa-cart-shopping"></i> Move to Cart
        </button>
        <button class="remove-wishlist-btn" onclick="removeFromWishlist('${product.id}')" aria-label="Remove">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `;
    container.appendChild(row);
  });
}


function removeFromWishlist(id) {
  let wishlist = getWishlist().filter((item) => item.id !== id);
  setWishlist(wishlist);
  renderWishlist();
  updateBadges();
}

function moveToCart(id) {
  const wishlist = getWishlist();
  const product = wishlist.find((item) => item.id === id);

  if (product) {
    let cart = getCart();
    const existing = cart.find((item) => item.id === id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    setCart(cart);
    removeFromWishlist(id);
  }
}