let discountPercent = 0;

document.addEventListener('DOMContentLoaded', () => {
  const mobileInput = document.getElementById('mobile');
  if (mobileInput) {
    mobileInput.addEventListener('input', () => {
      // Strip anything that isn't a digit, then cap at 10 characters
      mobileInput.value = mobileInput.value.replace(/[^0-9]/g, '').slice(0, 10);
    });

    // Also block paste of non-numeric content
    mobileInput.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text');
      const digitsOnly = pasted.replace(/[^0-9]/g, '').slice(0, 10);
      mobileInput.value = digitsOnly;
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  renderCheckoutSummary();
});

function getCart() { return JSON.parse(localStorage.getItem('shop_cart')) || []; }
function setCart(cart) { localStorage.setItem('shop_cart', JSON.stringify(cart)); }

function formatCurrency(amount) {
  return '$' + amount.toFixed(2);
}

function renderCheckoutSummary() {
  const cart = getCart();
  const itemsContainer = document.getElementById('checkout-items-preview');
  const itemCountBadge = document.getElementById('summary-item-count');

  if (cart.length === 0) {
    alert('No items in cart to checkout!');
    window.location.href = 'cart.html';
    return;
  }

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (itemCountBadge) {
    itemCountBadge.textContent = `${totalItemsCount} ${totalItemsCount === 1 ? 'Item' : 'Items'}`;
  }

  let subtotal = 0;

  itemsContainer.innerHTML = cart.map((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    return `
      <div class="checkout-item-row">
        <div class="item-img-wrapper">
          <img class="checkout-item-img" src="${item.img}" alt="${item.title}" />
          <span class="item-qty-badge">${item.quantity}</span>
        </div>
        <div class="checkout-item-info">
          <h4 class="checkout-item-title">${item.title}</h4>
        </div>
        <span class="checkout-item-price">${formatCurrency(itemTotal)}</span>
      </div>
    `;
  }).join('');

  const discountAmount = subtotal * discountPercent;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const tax = subtotalAfterDiscount * 0.05;
  const total = subtotalAfterDiscount + tax;

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

function applyPromoCode() {
  const codeInput = document.getElementById('promo-code-input').value.trim().toUpperCase();
  const messageBox = document.getElementById('promo-message');

  if (codeInput === 'SAVE10') {
    discountPercent = 0.10;
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

// Form submission & order confirmation
function handlePlaceOrder(event) {
  event.preventDefault();

  const name = document.getElementById('full-name').value;
  const mobile = document.getElementById('mobile').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;

  const order = finalizeOrder();

  // Redirect to payment page, passing the order ID and total so payment.html can display them
  window.location.href = `payment.html?orderId=${order.id}&amount=${order.totalPrice.toFixed(2)}`;
}
// Saves order to history, clears the cart, and updates badges
function finalizeOrder(paymentType = 'Online Payment', transactionId = 'TXN-' + Date.now()) {
  const cart = getCart();
  if (cart.length === 0) return null;

  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  const orderDate = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  const newOrder = {
    id: orderId,
    date: orderDate,
    items: cart,
    totalPrice: totalAmount,
    paymentMethod: paymentType,
    paymentStatus: paymentType === 'Online Payment' ? 'Paid' : 'Pending (COD)',
    transactionId: paymentType === 'Online Payment' ? transactionId : 'N/A'
  };

  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.unshift(newOrder);
  localStorage.setItem('orders', JSON.stringify(orders));

  setCart([]);
  if (typeof updateBadgeCounts === 'function') updateBadgeCounts();

  return newOrder;
}

function checkout() {
  const cart = getCart();
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  window.location.href = 'checkout.html';
}