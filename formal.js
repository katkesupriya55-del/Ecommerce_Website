document.addEventListener("DOMContentLoaded", () => {
  // Update navbar counters when page loads
  updateNavbarCounts();

  // -----------------------------
  // 1. WISHLIST FUNCTIONALITY
  // -----------------------------
  const wishlistButtons = document.querySelectorAll(".wishlist-btn");
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  wishlistButtons.forEach((btn) => {
    const card = btn.closest(".card");
    const productTitle = card ? card.querySelector(".card-title").innerText.trim() : "";

    // Set initial active state if item is already in wishlist
    if (wishlist.some((item) => item.title === productTitle)) {
      btn.classList.add("active");
      const icon = btn.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
      }
    }

    // Toggle item in/out of wishlist on click
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      let currentWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

      // Build product object
      const product = {
        title: productTitle,
        price: card.querySelector(".card-price") ? card.querySelector(".card-price").innerText.trim() : "",
        image: card.querySelector(".card-img") ? card.querySelector(".card-img").getAttribute("src") : "",
        category: card.querySelector(".card-category") ? card.querySelector(".card-category").innerText.trim() : ""
      };

      const existingIndex = currentWishlist.findIndex((item) => item.title === product.title);
      const icon = btn.querySelector("i");

      if (existingIndex > -1) {
        // Remove item
        currentWishlist.splice(existingIndex, 1);
        btn.classList.remove("active");
        if (icon) {
          icon.classList.remove("fa-solid");
          icon.classList.add("fa-regular");
        }
      } else {
        // Add item
        currentWishlist.push(product);
        btn.classList.add("active");
        if (icon) {
          icon.classList.remove("fa-regular");
          icon.classList.add("fa-solid");
        }
      }

      localStorage.setItem("wishlist", JSON.stringify(currentWishlist));
      updateNavbarCounts();
    });
  });

  // -----------------------------
  // 2. ADD TO CART FUNCTIONALITY
  // -----------------------------
  const addToCartButtons = document.querySelectorAll(".card-btn");

  addToCartButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const product = {
        title: card.querySelector(".card-title").innerText.trim(),
        price: card.querySelector(".card-price").innerText.trim(),
        image: card.querySelector(".card-img").getAttribute("src"),
        category: card.querySelector(".card-category").innerText.trim(),
        quantity: 1
      };

      // Check if product is already in cart
      const existingProduct = cart.find((item) => item.title === product.title);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.push(product);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateNavbarCounts();

      // Visual feedback on button click
      const originalText = btn.innerText;
      btn.innerText = "Added!";
      btn.style.backgroundColor = "#22c55e"; // Green feedback

      setTimeout(() => {
        btn.innerText = originalText;
        btn.style.backgroundColor = "";
      }, 1000);
    });
  });
});

// Helper function to update Navbar Badges
function updateNavbarCounts() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const wishlistBadge = document.getElementById("wishlist-count");
  const cartBadge = document.getElementById("cart-count");

  if (wishlistBadge) {
    wishlistBadge.textContent = wishlist.length;
  }

  if (cartBadge) {
    const totalCartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartBadge.textContent = totalCartCount;
  }
}