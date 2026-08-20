document.addEventListener('DOMContentLoaded', () => {
  renderCart();
});

// Helper to parse price string like "$29.99" or "₹1,299" into a float
function parsePrice(priceString) {
  if (!priceString) return 0;
  const numericString = priceString.replace(/[^0-9.]/g, '');
  return parseFloat(numericString) || 0;
}

// Format number to currency format
function formatCurrency(amount) {
  return '$' + amount.toFixed(2);
}

function renderCart() {
  const cartContent = document.getElementById('cart-content');
  const emptyState = document.getElementById('empty-cart');
  const cartItemsList = document.getElementById('cart-items-list');

  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    cartContent.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  cartContent.style.display = 'grid';
  emptyState.style.display = 'none';

  let subtotal = 0;

  // Render Items List
  cartItemsList.innerHTML = cart.map((item, index) => {
    const itemPrice = parsePrice(item.price);
    const itemTotal = itemPrice * item.quantity;
    subtotal += itemTotal;

    return `
      <div class="cart-item-card">
        <img class="cart-item-img" src="${item.image || 'c1.jpg'}" alt="${item.title}" />
        
        <div class="cart-item-details">
          <h3 class="cart-item-title">${item.title}</h3>
          <span class="cart-item-price">${item.price}</span>
          
          <div class="quantity-controls">
            <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
          </div>
        </div>

        <div class="cart-item-actions">
          <span class="line-total">${formatCurrency(itemTotal)}</span>
          <button class="remove-cart-btn" onclick="removeItem(${index})" title="Remove item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Calculate Order Totals
  const tax = subtotal * 0.05; // 5% tax rate
  const total = subtotal + tax;

  // Update Summary DOM
  document.getElementById('summary-subtotal').textContent = formatCurrency(subtotal);
  document.getElementById('summary-tax').textContent = formatCurrency(tax);
  document.getElementById('summary-total').textContent = formatCurrency(total);
}

// Function to increase/decrease quantity
function changeQuantity(index, delta) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart[index]) {
    cart[index].quantity += delta;

    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();

    if (typeof updateBadgeCounts === 'function') {
      updateBadgeCounts();
    }
  }
}

// Function to remove an item entirely
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));

  renderCart();

  if (typeof updateBadgeCounts === 'function') {
    updateBadgeCounts();
  }
}
document.getElementById('checkoutBtn').addEventListener('click', function() {
  window.location.href = 'http://127.0.0.1:5501/checkout.html'; // Replace with your checkout page path or URL
});
// Basic checkout placeholder action
// function checkout() {
//   alert('Thank you for your order! Order processing integration coming soon.');
//   localStorage.removeItem('cart');
//   renderCart();

//   if (typeof updateBadgeCounts === 'function') {
//     updateBadgeCounts();
//   }
// }