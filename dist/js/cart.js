function getCart() {
  const user = JSON.parse(localStorage.getItem('ttmebel_current_user'));
  if (!user) return [];
  return JSON.parse(localStorage.getItem('ttmebel_cart_' + user.id) || '[]');
}

function saveCart(cart) {
  const user = JSON.parse(localStorage.getItem('ttmebel_current_user'));
  if (!user) return;
  localStorage.setItem('ttmebel_cart_' + user.id, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(id, qty) {
  qty = qty || 1;
  const user = JSON.parse(localStorage.getItem('ttmebel_current_user'));
  if (!user) {
    showToast('Войдите, чтобы добавлять в корзину');
    return;
  }

  let cart = getCart();
  const existing = cart.find(c => c.id === id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: id, qty: qty });
  }

  saveCart(cart);
  showToast('Товар добавлен в корзину');
}

function removeFromCart(id) {
  let cart = getCart().filter(c => c.id !== id);
  saveCart(cart);
}

function updateCartQty(id, qty) {
  let cart = getCart();
  const item = cart.find(c => c.id === id);
  if (item) {
    if (qty <= 0) {
      cart = cart.filter(c => c.id !== id);
    } else {
      item.qty = qty;
    }
  }
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function getCartCount() {
  return getCart().reduce((sum, c) => sum + c.qty, 0);
}

function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(badge => {
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  });
}

function getCartTotal(cartItems, products) {
  let total = 0;
  cartItems.forEach(ci => {
    const p = products.find(x => x.id === ci.id);
    if (p) {
      const num = parseInt(p.price.replace(/[^\d]/g, '')) || 0;
      total += num * ci.qty;
    }
  });
  return total;
}

function formatCartMessage(cartItems, products, userName, userPhone) {
  const now = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
  let msg = `🛒 Заявка на расчёт с сайта ТТмебель\n\n`;
  msg += `👤 Клиент: ${userName || '—'}\n`;
  msg += `📞 Телефон: ${userPhone || '—'}\n\n`;
  msg += `Товары:\n`;

  let total = 0;
  cartItems.forEach((ci, i) => {
    const p = products.find(x => x.id === ci.id);
    if (p) {
      const num = parseInt(p.price.replace(/[^\d]/g, '')) || 0;
      const itemTotal = num * ci.qty;
      total += itemTotal;
      msg += `${i + 1}. ${p.name} — ${ci.qty} шт. × ${p.price} = ${itemTotal.toLocaleString('ru-RU')} ₽\n`;
    }
  });

  msg += `\n💰 Итого: ~${total.toLocaleString('ru-RU')} ₽\n`;
  msg += `📦 Позиций: ${cartItems.length}\n`;
  msg += `\n🕐 ${now}`;

  return msg;
}