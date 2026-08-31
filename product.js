document.addEventListener("DOMContentLoaded", () => {
  initWishlistPage();
});

function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistCount();
}

function updateWishlistCount() {
  const wishlist = getWishlist();
  const badges = document.querySelectorAll('.nav-pill[aria-label="Wishlist"] .count-badge');
  badges.forEach((badge) => {
    badge.textContent = wishlist.length;
  });
}

function initWishlistPage() {
  updateWishlistCount();
  const wishlist = getWishlist();
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    const productData = getProductDataFromCard(card);
    const wishlistBtn = card.querySelector(".wishlist-btn");
    const isWishlisted = wishlist.some((item) => item.id === productData.id);

    // Set initial active heart state
    updateHeartIcon(wishlistBtn, isWishlisted);

    // Add click handler
    wishlistBtn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleWishlist(productData, wishlistBtn);
    });
  });
}

function getProductDataFromCard(card) {
  const title = card.querySelector(".product-title")?.textContent.trim() || "";
  const category = card.querySelector(".category")?.textContent.trim() || "";
  const image = card.querySelector(".card-image-wrapper img")?.getAttribute("src") || "";
  const currentPrice = card.querySelector(".current-price")?.textContent.trim() || "";
  const oldPrice = card.querySelector(".old-price")?.textContent.trim() || "";
  const rating = card.querySelector(".rating span")?.textContent.trim() || "";
  const reviews = card.querySelector(".rating small")?.textContent.trim() || "";

  // Unique ID based on title or image src
  const id = title.toLowerCase().replace(/\s+/g, "-") || image;

  return { id, title, category, image, currentPrice, oldPrice, rating, reviews };
}

function toggleWishlist(product, button) {
  let wishlist = getWishlist();
  const index = wishlist.findIndex((item) => item.id === product.id);

  if (index > -1) {
    wishlist.splice(index, 1);
    updateHeartIcon(button, false);
  } else {
    wishlist.push(product);
    updateHeartIcon(button, true);
  }

  saveWishlist(wishlist);
}

function updateHeartIcon(button, isWishlisted) {
  const icon = button.querySelector("i");
  if (isWishlisted) {
    icon.className = "fa-solid fa-heart";
    button.style.color = "#e63946";
  } else {
    icon.className = "fa-regular fa-heart";
    button.style.color = "";
  }
}