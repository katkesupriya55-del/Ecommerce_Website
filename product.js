document.addEventListener('DOMContentLoaded', () => {
  updateBadges();
  initProductCards();
});

// Helper functions for localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('shop_cart')) || [];
}

function setCart(cart) {
  localStorage.setItem('shop_cart', JSON.stringify(cart));
}

function getWishlist() {
  return JSON.parse(localStorage.getItem('shop_wishlist')) || [];
}

function setWishlist(wishlist) {
  localStorage.setItem('shop_wishlist', JSON.stringify(wishlist));
}

// Update header badges
function updateBadges() {
  const cart = getCart();
  const wishlist = getWishlist();

  const cartBadge = document.querySelector('.nav-pill[aria-label="Cart"] .count-badge');
  const wishlistBadge = document.querySelector('.nav-pill[aria-label="Wishlist"] .count-badge');

  if (cartBadge) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
  }

  if (wishlistBadge) {
    wishlistBadge.textContent = wishlist.length;
  }
}

// Extract product data from card
function getProductData(card) {
  const title = card.querySelector('.product-title')?.innerText.trim() || 'Product';
  const img = card.querySelector('.card-image-wrapper img')?.getAttribute('src') || '';
  const currentPriceText = card.querySelector('.current-price')?.innerText.trim() || '$0.00';
  const oldPriceText = card.querySelector('.old-price')?.innerText.trim() || '';
  const price = parseFloat(currentPriceText.replace(/[^0-9.]/g, '')) || 0;
  const rating = card.querySelector('.rating span')?.innerText.trim() || '0.0';
  const reviews = card.querySelector('.rating small')?.innerText.trim() || '(0)';
  const id = title.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return { id, title, img, price, currentPriceText, oldPriceText, rating, reviews };
}

// Initialize product card states & click events
function initProductCards() {
  const cards = document.querySelectorAll('.product-card');
  const cart = getCart();
  const wishlist = getWishlist();

  cards.forEach((card) => {
    const product = getProductData(card);
    const wishlistBtn = card.querySelector('.wishlist-btn');
    const addCartBtn = card.querySelector('.add-cart-btn');

    // 1. Set initial Wishlist button state
    const isInWishlist = wishlist.some((item) => item.id === product.id);
    if (wishlistBtn) {
      if (isInWishlist) {
        wishlistBtn.classList.add('active');
        wishlistBtn.innerHTML = `<i class="fa-solid fa-heart" style="color: #e74c3c;"></i>`;
      } else {
        wishlistBtn.classList.remove('active');
        wishlistBtn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
      }

      // Wishlist toggle event
      wishlistBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let currentWL = getWishlist();
        const exists = currentWL.some((item) => item.id === product.id);

        if (exists) {
          currentWL = currentWL.filter((item) => item.id !== product.id);
          wishlistBtn.classList.remove('active');
          wishlistBtn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
        } else {
          currentWL.push(product);
          wishlistBtn.classList.add('active');
          wishlistBtn.innerHTML = `<i class="fa-solid fa-heart" style="color: #e74c3c;"></i>`;
        }

        setWishlist(currentWL);
        updateBadges();
      });
    }

    // 2. Set initial Cart button state
    const isInCart = cart.some((item) => item.id === product.id);
    if (addCartBtn) {
      if (isInCart) {
        addCartBtn.classList.add('added');
        addCartBtn.innerHTML = `<i class="fa-solid fa-check"></i> Added`;
      }

      // Cart toggle event
      addCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let currentCart = getCart();
        const cartIndex = currentCart.findIndex((item) => item.id === product.id);

        if (cartIndex > -1) {
          // Remove from cart if clicked again
          currentCart.splice(cartIndex, 1);
          addCartBtn.classList.remove('added');
          addCartBtn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Add`;
        } else {
          // Add to cart
          currentCart.push({ ...product, quantity: 1 });
          addCartBtn.classList.add('added');
          addCartBtn.innerHTML = `<i class="fa-solid fa-check"></i> Added`;
        }

        setCart(currentCart);
        updateBadges();
      });
    }
  });
}