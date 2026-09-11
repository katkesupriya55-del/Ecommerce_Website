document.addEventListener('DOMContentLoaded', () => {
  renderOrders();
});

function getOrders() {
  return JSON.parse(localStorage.getItem('orders')) || [];
}

function renderOrders() {
  const orders = getOrders();
  const listContainer = document.getElementById('orders-list');
  const emptyState = document.getElementById('empty-orders');

  if (orders.length === 0) {
    listContainer.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  listContainer.style.display = 'block';
  emptyState.style.display = 'none';

  listContainer.innerHTML = orders.map((order, index) => {
    const isPaid = order.paymentStatus === 'Paid';
    const totalItemsCount = order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);

    const thumbsHtml = order.items.slice(0, 5).map((item) => `
      <div class="order-item-thumb">
        <img src="${item.img}" alt="${item.title}">
        <span class="qty-tag">x${item.quantity}</span>
      </div>
    `).join('');

    const fullItemsHtml = order.items.map((item) => `
      <div class="order-line-item">
        <img src="${item.img}" alt="${item.title}">
        <div class="item-info">
          <div class="item-title">${item.title}</div>
          <div class="item-qty">Qty: ${item.quantity}</div>
        </div>
        <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
      </div>
    `).join('');

    return `
      <div class="order-card" style="animation-delay: ${index * 0.06}s">
        <div class="order-card-header">
          <div class="order-id-block">
            <div class="order-id">Order #${order.id}</div>
            <div class="order-date">${order.date}</div>
          </div>
          <span class="order-status-badge ${isPaid ? 'paid' : 'pending'}">
            <i class="fa-solid ${isPaid ? 'fa-circle-check' : 'fa-clock'}"></i>
            ${order.paymentStatus}
          </span>
        </div>

        <div class="order-items-preview">
          ${thumbsHtml}
        </div>

        <div class="order-card-footer">
          <div class="order-meta">${totalItemsCount} item${totalItemsCount === 1 ? '' : 's'} · ${order.paymentMethod}</div>
          <div style="display: flex; align-items: center; gap: 14px;">
            <div class="order-total">$${order.totalPrice.toFixed(2)}</div>
            <button class="toggle-details-btn" onclick="toggleDetails(this)">View Details</button>
          </div>
        </div>

        <div class="order-full-details">
          ${fullItemsHtml}
        </div>
      </div>
    `;
  }).join('');
}

function toggleDetails(btn) {
  const card = btn.closest('.order-card');
  const details = card.querySelector('.order-full-details');
  const isExpanded = details.classList.toggle('expanded');
  btn.textContent = isExpanded ? 'Hide Details' : 'View Details';
}