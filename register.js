document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Reset errors
    clearErrors();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    let isValid = true;

    // Validation
    if (fullName.length < 3) {
      showError('nameError', 'Please enter a valid full name (min 3 characters).');
      isValid = false;
    }

    // Corrected Email Regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showError('emailError', 'Please enter a valid email address.');
      isValid = false;
    }

    if (password.length < 6) {
      showError('passwordError', 'Password must be at least 6 characters long.');
      isValid = false;
    }

    if (password !== confirmPassword) {
      showError('confirmPasswordError', 'Passwords do not match.');
      isValid = false;
    }

    if (!isValid) return;

    // Retrieve existing registered users
    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    // Check if email already registered
    const existingUser = registeredUsers.find(u => u.email === email);
    if (existingUser) {
      showError('emailError', 'This email is already registered. Please Sign In.');
      return;
    }

    // Save user details
    const newUser = { name: fullName, email, password };
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    alert('Registration successful! Please sign in with your credentials.');
    window.location.href = 'signin.html';
  });

  function showError(id, message) {
    document.getElementById(id).textContent = message;
  }

  function clearErrors() {
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
  }
});