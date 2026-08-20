document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signinForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    clearErrors();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    let isValid = true;

    if (!email) {
      showError('loginEmailError', 'Please enter your email.');
      isValid = false;
    }

    if (!password) {
      showError('loginPasswordError', 'Please enter your password.');
      isValid = false;
    }

    if (!isValid) return;

    // Check credentials against registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const matchedUser = registeredUsers.find(u => u.email === email && u.password === password);

    if (matchedUser) {
      // Save current active session
      localStorage.setItem('currentUser', JSON.stringify(matchedUser));
      alert(`Welcome back, ${matchedUser.name}!`);
      window.location.href = 'http://127.0.0.1:5501/Ecommerce.html';
    } else {
      showError('loginPasswordError', 'Invalid email or password.');
    }
  });

  function showError(id, message) {
    document.getElementById(id).textContent = message;
  }

  function clearErrors() {
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
  }
});