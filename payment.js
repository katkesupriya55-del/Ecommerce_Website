function processPayment(event) {
  event.preventDefault();

  const selectedMethod = document.querySelector('input[name="payment_method"]:checked').value;

  // Simulate payment processing delay
  const submitBtn = document.querySelector('.pay-now-btn');
  submitBtn.innerText = "Processing Payment...";
  submitBtn.disabled = true;

  setTimeout(() => {
    // Clear user cart from LocalStorage
    localStorage.removeItem('cart');

    // Create Order Reference ID
    const orderId = "SE" + Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem('latestOrderId', orderId);

    alert(`Payment successful via ${selectedMethod}! Your Order ID: ${orderId}`);
    
    // Redirect to Order Success Page or Main Page
    window.location.href = 'http://127.0.0.1:5501/success.html';
  }, 1500);
}

// Highlight container on radio selection
document.querySelectorAll('.payment-option').forEach(option => {
  option.addEventListener('click', () => {
    document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('active'));
    option.classList.add('active');
  });
});