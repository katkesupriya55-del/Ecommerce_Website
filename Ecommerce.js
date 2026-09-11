// ==========================================
// SHARED STORAGE HELPERS (same keys/shape as cart.js, wishlist.js, formal.js, etc.)
// ==========================================

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function getCart() { return JSON.parse(localStorage.getItem('shop_cart')) || []; }
function setCart(cart) { localStorage.setItem('shop_cart', JSON.stringify(cart)); }
function getWishlist() { return JSON.parse(localStorage.getItem('shop_wishlist')) || []; }
function setWishlist(wl) { localStorage.setItem('shop_wishlist', JSON.stringify(wl)); }

function updateBadgeCounts() {
  const cart = getCart();
  const wishlist = getWishlist();

  const cartCount = cart.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 1), 0);
  const wishlistCount = wishlist.length;

  document.querySelectorAll('#cart-count, .cart-count, .cart-badge').forEach((badge) => {
    badge.textContent = cartCount;
  });
  document.querySelectorAll('#wishlist-count, .wishlist-count, .wishlist-badge').forEach((badge) => {
    badge.textContent = wishlistCount;
  });
}

function triggerBadgeUpdate() {
  updateBadgeCounts();
  syncWishlistButtons();
  window.dispatchEvent(new Event('badgeUpdate'));
}
window.triggerBadgeUpdate = triggerBadgeUpdate;
window.updateBadgeCounts = updateBadgeCounts;

// ==========================================
// WISHLIST & CART CONTROLLERS
// ==========================================

function addToCart(product) {
  let cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity = (parseInt(existing.quantity, 10) || 1) + 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  setCart(cart);
  triggerBadgeUpdate();
}

function toggleWishlist(product, button) {
  let wishlist = getWishlist();
  const existingIndex = wishlist.findIndex((item) => item.id === product.id);
  const icon = button ? button.querySelector('i') : null;

  if (existingIndex > -1) {
    wishlist.splice(existingIndex, 1);
    if (button) button.classList.remove('active');
    if (icon) icon.className = 'fa-regular fa-heart';
  } else {
    wishlist.push(product);
    if (button) button.classList.add('active');
    if (icon) icon.className = 'fa-solid fa-heart';
  }

  setWishlist(wishlist);
  triggerBadgeUpdate();
}

function syncWishlistButtons() {
  const wishlist = getWishlist();
  const wishBtns = document.querySelectorAll('.wishlist-btn, [class*="wishlist"]');

  wishBtns.forEach((btn) => {
    const card = btn.closest('.product-card, .card, .footwear-card, .jewel-card, article');
    if (!card) return;

    const titleElem = card.querySelector('.product-title, .card-title, .title, h3, h2, h4');
    const title = titleElem ? titleElem.innerText.trim() : '';
    if (!title) return;

    const isSaved = wishlist.some((item) => item.id === slugify(title));
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

function extractProductData(card) {
  const titleElem = card.querySelector('.product-title, .card-title, .title, h3, h2, h4');
  const priceElem = card.querySelector('.current-price, .card-price, .price, span[class*="price"]');
  const imgElem = card.querySelector('img');
  const catElem = card.querySelector('.card-category, .category');

  const title = titleElem ? titleElem.innerText.trim() : 'Unknown Product';
  const priceText = priceElem ? priceElem.innerText.trim() : '';
  const priceNum = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

  return {
    id: slugify(title),
    title,
    currentPriceText: priceText,
    price: priceNum,
    img: imgElem ? (imgElem.getAttribute('src') || imgElem.src) : '',
    category: catElem ? catElem.innerText.trim() : '',
    rating: 4.5,
    reviews: '(New)'
  };
}

// ==========================================
// NAVBAR & AUTHENTICATION (unchanged — sign-in display only, not tied to cart data)
// ==========================================

function getUserKey() {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      if (typeof currentUser === 'string') return currentUser;
      return currentUser.username || currentUser.name || currentUser._id || currentUser.id || currentUser.email || null;
    }
  } catch (e) {
    const rawUser = localStorage.getItem('currentUser');
    if (rawUser) return rawUser.replace(/"/g, '');
  }
  return null;
}

function updateNavbar() {
  const userKey = getUserKey();
  const userActionsContainer = document.querySelector('.user-actions');
  if (!userActionsContainer) return;

  if (userKey) {
    const displayName = userKey.split(' ')[0];
    userActionsContainer.innerHTML = `
      <a href="profile.html" class="profile-btn" title="View Profile">
        <i class="fa-solid fa-user"></i>
        <span>${displayName}</span>
      </a>
      <button class="logout-btn" onclick="handleLogout()" title="Logout">
        <i class="fa-solid fa-right-from-bracket"></i>
        <span>Logout</span>
      </button>
    `;
  } else {
    userActionsContainer.innerHTML = `
      <a href="signin.html" class="signin-nav-btn">
        <i class="fa-solid fa-right-to-bracket"></i>
        <span>Sign In</span>
      </a>
    `;
  }
}

function handleLogout() {
  if (confirm("Are you sure you want to log out?")) {
    localStorage.removeItem('currentUser');
    clearShopData();
    window.location.href = 'signin.html';
  }
}
window.handleLogout = handleLogout;

// Wipes cart & wishlist and resets all badges to 0
function clearShopData() {
  localStorage.removeItem('shop_cart');
  localStorage.removeItem('shop_wishlist');
  updateBadgeCounts();
  syncWishlistButtons();
}
window.clearShopData = clearShopData;

// ==========================================
// LISTENERS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();
  updateBadgeCounts();
  syncWishlistButtons();

  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-cart-btn, .card-btn, .btn-add-cart');
    if (addBtn) {
      e.preventDefault();
      const card = addBtn.closest('.product-card, .card, .footwear-card, .jewel-card, article');
      if (card) addToCart(extractProductData(card));
    }

    const wishBtn = e.target.closest('.wishlist-btn, [class*="wishlist"]');
    if (wishBtn) {
      e.preventDefault();
      const card = wishBtn.closest('.product-card, .card, .footwear-card, .jewel-card, article');
      if (card) toggleWishlist(extractProductData(card), wishBtn);
    }
  });
});

window.addEventListener('pageshow', updateBadgeCounts);
window.addEventListener('focus', updateBadgeCounts);

window.addEventListener('storage', () => {
  updateBadgeCounts();
  syncWishlistButtons();
  updateNavbar();
});

window.addEventListener('badgeUpdate', () => {
  updateBadgeCounts();
  syncWishlistButtons();
});

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');
  const customModal = document.getElementById('custom-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      customModal.classList.add('hidden');
    });
  }

  if (customModal) {
    customModal.addEventListener('click', (e) => {
      if (e.target === customModal) {
        customModal.classList.add('hidden');
      }
    });
  }

  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const query = document.getElementById('search-input').value.trim().toLowerCase();

      if (query.includes('foot') || query.includes('shoe') || query.includes('sandal')) {
        window.location.href = './footwear.html';
      } else if (query.includes('formal') || query.includes('dress') || query.includes('suit')) {
        window.location.href = './formal.html';
      } else if (query.includes('jewel') || query.includes('jwel') || query.includes('ring')) {
        window.location.href = './jwel.html';
      } else {
        customModal.classList.remove('hidden');
      }
    });
  }
});