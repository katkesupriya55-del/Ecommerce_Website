document.addEventListener('DOMContentLoaded', () => {
  renderWishlist();
});

function getValidWishlist() {
  const rawWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  
  // Filter out invalid items or legacy string items saved by old category scripts
  const cleanWishlist = rawWishlist.filter(
    (item) => typeof item === 'object' && item !== null && item.title
  );

  // If dirty string data was found and cleaned, update localStorage
  if (cleanWishlist.length !== rawWishlist.length) {
    localStorage.setItem('wishlist', JSON.stringify(cleanWishlist));
  }

  return cleanWishlist;
}

function renderWishlist() {
  const wishlistGrid = document.getElementById('wishlist-grid');
  const emptyState = document.getElementById('empty-wishlist');
  const wishlist = getValidWishlist();

  if (!wishlistGrid || !emptyState) return;

  if (wishlist.length === 0) {
    wishlistGrid.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  wishlistGrid.style.display = 'grid';
  emptyState.style.display = 'none';

  wishlistGrid.innerHTML = wishlist
    .map(
      (item, index) => `
    <article class="product-card" style="opacity:1; transform:none;">
      <div class="card-image-wrapper">
        <img src="${item.image || 'c1.jpg'}" alt="${item.title}" />
      </div>
      <div class="card-content">
        ${item.category ? `<span class="category">${item.category}</span>` : ''}
        <h3 class="product-title">${item.title}</h3>
        <div class="card-footer" style="flex-direction: column; gap: 12px; align-items: stretch;">
          <div class="price">
            <span class="current-price">${item.price}</span>
          </div>
          <div class="card-actions">
            <button class="move-cart-btn" onclick="moveToCart(${index})">
              <i class="fa-solid fa-cart-shopping"></i> Move to Cart
            </button>
            <button class="remove-wishlist-btn" onclick="removeFromWishlist(${index})" aria-label="Remove item">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    </article>
  `
    )
    .join('');
}

function removeFromWishlist(index) {
  let wishlist = getValidWishlist();
  wishlist.splice(index, 1);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));

  renderWishlist();
  if (typeof updateNavbarCounts === 'function') {
    updateNavbarCounts();
  }
}

function moveToCart(index) {
  let wishlist = getValidWishlist();
  const item = wishlist[index];

  if (item) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find((i) => i.title === item.title);

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));

    // Remove item from wishlist after moving to cart
    removeFromWishlist(index);
  }
}