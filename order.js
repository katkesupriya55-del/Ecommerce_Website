document.getElementById('checkoutForm').addEventListener('submit', function(e) {
  e.preventDefault(); // Stop default form reloading

  // Gather values from inputs
  const formData = {
    fullName: document.getElementById('fullName').value,
    mobile: document.getElementById('mobile').value,
    email: document.getElementById('email').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    state: document.getElementById('state').value,
    pinCode: document.getElementById('pinCode').value
  };

  // 1. Send formData to backend API here (optional)

  // 2. Redirect user to success page
  window.location.href = 'order-success.html';
});