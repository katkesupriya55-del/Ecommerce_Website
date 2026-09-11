document.addEventListener('DOMContentLoaded', () => {
  updateBadges();

  document.querySelectorAll('.card').forEach((card) => {
    const product = extractProduct(card);
    const wishBtn = card.querySelector('.wishlist-btn');
    const cartBtn = card.querySelector('.card-btn');

    syncWishlistBtn(wishBtn, product.id);

    if (wishBtn) {
      wishBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleWishlist(extractProduct(card), wishBtn);
      });
    }

    if (cartBtn) {
      cartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(extractProduct(card));

        const original = cartBtn.innerText;
        cartBtn.innerText = 'Added!';
        cartBtn.style.backgroundColor = '#22c55e';
        setTimeout(() => {
          cartBtn.innerText = original;
          cartBtn.style.backgroundColor = '';
        }, 1000);
      });
    }
  });
});

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function extractProduct(card) {
  const titleEl = card.querySelector('.card-title');
  const priceEl = card.querySelector('.card-price');
  const imgEl = card.querySelector('.card-img');
  const catEl = card.querySelector('.card-category');

  const title = titleEl ? titleEl.innerText.trim() : 'Unknown Product';
  const priceText = priceEl ? priceEl.innerText.trim() : '$0.00';
  const priceNum = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

  return {
    id: slugify(title),
    title,
    currentPriceText: priceText,
    price: priceNum,
    img: imgEl ? imgEl.getAttribute('src') : '',
    category: catEl ? catEl.innerText.trim() : '',
    rating: 4.5,
    reviews: '(New)'
  };
}

function getCart() { return JSON.parse(localStorage.getItem('shop_cart')) || []; }
function setCart(cart) { localStorage.setItem('shop_cart', JSON.stringify(cart)); }
function getWishlist() { return JSON.parse(localStorage.getItem('shop_wishlist')) || []; }
function setWishlist(wl) { localStorage.setItem('shop_wishlist', JSON.stringify(wl)); }

function updateBadges() {
  const cart = getCart();
  const wishlist = getWishlist();
  const cartBadge = document.querySelector('.nav-pill[aria-label="Cart"] .count-badge');
  const wishlistBadge = document.querySelector('.nav-pill[aria-label="Wishlist"] .count-badge');
  if (cartBadge) cartBadge.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (wishlistBadge) wishlistBadge.textContent = wishlist.length;
}

function addToCart(product) {
  let cart = getCart();
  const existing = cart.find((i) => i.id === product.id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  setCart(cart);
  updateBadges();
}

function toggleWishlist(product, btn) {
  let wishlist = getWishlist();
  const idx = wishlist.findIndex((i) => i.id === product.id);
  const icon = btn ? btn.querySelector('i') : null;

  if (idx > -1) {
    wishlist.splice(idx, 1);
    if (btn) btn.classList.remove('active');
    if (icon) { icon.classList.remove('fa-solid'); icon.classList.add('fa-regular'); }
  } else {
    wishlist.push(product);
    if (btn) btn.classList.add('active');
    if (icon) { icon.classList.remove('fa-regular'); icon.classList.add('fa-solid'); }
  }
  setWishlist(wishlist);
  updateBadges();
}

function syncWishlistBtn(btn, id) {
  if (!btn) return;
  const icon = btn.querySelector('i');
  if (getWishlist().some((i) => i.id === id)) {
    btn.classList.add('active');
    if (icon) { icon.classList.remove('fa-regular'); icon.classList.add('fa-solid'); }
  }
}