document.addEventListener('DOMContentLoaded', () => {
  renderCheckoutSummary();
});

// Helper to parse price string to number
function parsePrice(priceString) {
  if (!priceString) return 0;
  const numericString = priceString.replace(/[^0-9.]/g, '');
  return parseFloat(numericString) || 0;
}

// Format currency display
function formatCurrency(amount) {
  return '$' + amount.toFixed(2);
}

// Load cart items into the checkout order summary
function renderCheckoutSummary() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemsContainer = document.getElementById('checkout-items-preview');

  if (cart.length === 0) {
    alert('No items in cart to checkout!');
    window.location.href = 'product.html';
    return;
  }

  let subtotal = 0;

  itemsContainer.innerHTML = cart.map((item) => {
    const itemPrice = parsePrice(item.price);
    const itemTotal = itemPrice * item.quantity;
    subtotal += itemTotal;

    return `
      <div class="checkout-item-row">
        <img class="checkout-item-img" src="${item.image || 'c1.jpg'}" alt="${item.title}" />
        <div class="checkout-item-info">
          <h4 class="checkout-item-title">${item.title}</h4>
          <span class="checkout-item-qty">Qty: ${item.quantity}</span>
        </div>
        <span class="checkout-item-price">${formatCurrency(itemTotal)}</span>
      </div>
    `;
  }).join('');

  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  document.getElementById('checkout-subtotal').textContent = formatCurrency(subtotal);
  document.getElementById('checkout-tax').textContent = formatCurrency(tax);
  document.getElementById('checkout-total').textContent = formatCurrency(total);
}

// Form Submission & Order Confirmation Logic
function handlePlaceOrder(event) {
  event.preventDefault();

  const name = document.getElementById('full-name').value;
  const mobile = document.getElementById('mobile').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;

  alert(`Thank you for your order, ${name}!\n\nOrder Confirmation sent to: ${email}\nShipping to: ${address}, ${city}\nContact: ${mobile}`);

  // Clear Cart after successful order placement
  localStorage.removeItem('cart');

  // Update badge counter
  if (typeof updateBadgeCounts === 'function') {
    updateBadgeCounts();
  }

  // Redirect to home or products page
  window.location.href = 'Ecommerce.html';
}

let discountPercent = 0;

document.addEventListener('DOMContentLoaded', () => {
  renderCheckoutSummary();
});

function parsePrice(priceString) {
  if (!priceString) return 0;
  const numericString = priceString.replace(/[^0-9.]/g, '');
  return parseFloat(numericString) || 0;
}

function formatCurrency(amount) {
  return '$' + amount.toFixed(2);
}

function renderCheckoutSummary() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemsContainer = document.getElementById('checkout-items-preview');
  const itemCountBadge = document.getElementById('summary-item-count');

  if (cart.length === 0) {
    alert('No items in cart to checkout!');
    window.location.href = 'product.html';
    return;
  }

  // Calculate total items quantity
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (itemCountBadge) {
    itemCountBadge.textContent = `${totalItemsCount} ${totalItemsCount === 1 ? 'Item' : 'Items'}`;
  }

  let subtotal = 0;

  // Render Items List with Quantity Badges
  itemsContainer.innerHTML = cart.map((item) => {
    const itemPrice = parsePrice(item.price);
    const itemTotal = itemPrice * item.quantity;
    subtotal += itemTotal;

    return `
      <div class="checkout-item-row">
        <div class="item-img-wrapper">
          <img class="checkout-item-img" src="${item.image || 'c1.jpg'}" alt="${item.title}" />
          <span class="item-qty-badge">${item.quantity}</span>
        </div>
        <div class="checkout-item-info">
          <h4 class="checkout-item-title">${item.title}</h4>
        </div>
        <span class="checkout-item-price">${formatCurrency(itemTotal)}</span>
      </div>
    `;
  }).join('');

  // Apply Discount
  const discountAmount = subtotal * discountPercent;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const tax = subtotalAfterDiscount * 0.05;
  const total = subtotalAfterDiscount + tax;

  // Update Summary Pricing
  document.getElementById('checkout-subtotal').textContent = formatCurrency(subtotal);
  
  const discountRow = document.getElementById('discount-row');
  if (discountPercent > 0) {
    discountRow.style.display = 'flex';
    document.getElementById('checkout-discount').textContent = `-${formatCurrency(discountAmount)}`;
  } else {
    discountRow.style.display = 'none';
  }

  document.getElementById('checkout-tax').textContent = formatCurrency(tax);
  document.getElementById('checkout-total').textContent = formatCurrency(total);
}

// Promo Code Handler
function applyPromoCode() {
  const codeInput = document.getElementById('promo-code-input').value.trim().toUpperCase();
  const messageBox = document.getElementById('promo-message');

  if (codeInput === 'SAVE10') {
    discountPercent = 0.10; // 10% discount
    messageBox.className = 'promo-message success';
    messageBox.textContent = '10% Discount applied successfully!';
  } else if (codeInput === '') {
    messageBox.className = 'promo-message error';
    messageBox.textContent = 'Please enter a coupon code.';
  } else {
    discountPercent = 0;
    messageBox.className = 'promo-message error';
    messageBox.textContent = 'Invalid promo code. Try SAVE10';
  }

  renderCheckoutSummary();
}

// Redirect to checkout page when clicking 'Proceed to Checkout'
function checkout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  window.location.href = 'checkout.html';
}