document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateBadges();
});

function getCart() { return JSON.parse(localStorage.getItem('shop_cart')) || []; }
function setCart(cart) { localStorage.setItem('shop_cart', JSON.stringify(cart)); }
function getWishlist() { return JSON.parse(localStorage.getItem('shop_wishlist')) || []; }

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

function renderCart() {
  const listContainer = document.getElementById('cart-items-list');
  const cartContent = document.getElementById('cart-content');
  const emptyState = document.getElementById('empty-cart');
  const cart = getCart();

  listContainer.innerHTML = '';

  if (cart.length === 0) {
    cartContent.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  cartContent.style.display = 'grid';
  emptyState.style.display = 'none';

  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const row = document.createElement('div');
    row.className = 'cart-item-card';
    row.innerHTML = `
      <img src="${item.img}" alt="${item.title}" class="cart-item-img" />
      <div class="cart-item-details">
        <h3 class="cart-item-title">${item.title}</h3>
        <span class="cart-item-price">${item.currentPriceText}</span>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="changeQty('${item.id}', -1)">-</button>
        <span class="qty-value">${item.quantity}</span>
        <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
      </div>
      <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
      <button class="remove-cart-item" onclick="removeFromCart('${item.id}')" aria-label="Remove item">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
    listContainer.appendChild(row);
  });

  // Recalculate totals
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  document.getElementById('summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('summary-tax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;
}

function changeQty(id, delta) {
  let cart = getCart();
  const item = cart.find((i) => i.id === id);

  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter((i) => i.id !== id);
    }
  }

  setCart(cart);
  renderCart();
  updateBadges();
}

function removeFromCart(id) {
  let cart = getCart().filter((item) => item.id !== id);
  setCart(cart);
  renderCart();
  updateBadges();
}