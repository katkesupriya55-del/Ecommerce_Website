// Read the order ID and amount passed from checkout.js
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');
const amount = urlParams.get('amount');

function processPayment(event) {
  event.preventDefault();

  const selectedMethod = document.querySelector('input[name="payment_method"]:checked').value;
  const submitBtn = document.querySelector('.pay-now-btn');
  const btnText = submitBtn.querySelector('.btn-text');

  submitBtn.classList.add('processing');
  btnText.textContent = 'Processing Payment...';
  submitBtn.disabled = true;

  setTimeout(() => {
    localStorage.setItem('shop_cart', JSON.stringify([]));
    if (typeof updateBadgeCounts === 'function') updateBadgeCounts();

    updateOrderPaymentStatus(orderId, selectedMethod);

    window.location.href = `success.html?orderId=${orderId}`;
  }, 1500);
}

// Finds the matching order (saved earlier by checkout.js's finalizeOrder) and updates its payment info
function updateOrderPaymentStatus(orderId, paymentMethod) {
  if (!orderId) return;

  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  const order = orders.find((o) => o.id === orderId);

  if (order) {
    order.paymentMethod = paymentMethod;
    order.paymentStatus = paymentMethod === 'COD' ? 'Pending (COD)' : 'Paid';
    order.transactionId = paymentMethod === 'COD' ? 'N/A' : 'TXN-' + Date.now();
    localStorage.setItem('orders', JSON.stringify(orders));
  }
}

// Display the order ID and amount on the payment page itself, if elements exist
document.addEventListener('DOMContentLoaded', () => {
  if (orderId) {
    const orderIdDisplay = document.getElementById('payment-order-id');
    if (orderIdDisplay) orderIdDisplay.textContent = `Order #${orderId}`;
  }
  if (amount) {
    const amountDisplay = document.getElementById('payment-amount');
    if (amountDisplay) amountDisplay.textContent = `$${amount}`;
  }
});

// Highlight container on radio selection
document.querySelectorAll('.payment-option').forEach(option => {
  option.addEventListener('click', () => {
    document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('active'));
    option.classList.add('active');
  });
});