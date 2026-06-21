const CATALOG_CATEGORIES = {
  living: 'Гостиная',
  bedroom: 'Спальня',
  kitchen: 'Кухня',
  hallway: 'Прихожая',
  kids: 'Детская',
  budget: 'Бюджетная'
};

const SVG_PLACEHOLDERS = {
  living: `<svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:70%;height:auto;"><rect x="20" y="80" width="160" height="50" rx="8" fill="#c8956c"/><rect x="24" y="84" width="152" height="42" rx="6" fill="#3d3d3d"/><rect x="30" y="90" width="60" height="30" rx="4" fill="#4a4a4a"/><rect x="100" y="90" width="70" height="30" rx="4" fill="#4a4a4a"/><rect x="20" y="70" width="30" height="60" rx="4" fill="#c8956c" opacity="0.7"/><rect x="150" y="70" width="30" height="60" rx="4" fill="#c8956c" opacity="0.7"/></svg>`,
  bedroom: `<svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:70%;height:auto;"><rect x="20" y="70" width="160" height="60" rx="6" fill="#c8956c"/><rect x="24" y="74" width="152" height="52" rx="4" fill="#3d3d3d"/><rect x="30" y="80" width="140" height="20" rx="4" fill="#4a4a4a"/><rect x="20" y="50" width="40" height="80" rx="4" fill="#c8956c" opacity="0.8"/><rect x="140" y="50" width="40" height="80" rx="4" fill="#c8956c" opacity="0.8"/></svg>`,
  kitchen: `<svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:70%;height:auto;"><rect x="40" y="60" width="120" height="10" rx="2" fill="#c8956c"/><rect x="50" y="70" width="8" height="50" rx="2" fill="#c8956c" opacity="0.8"/><rect x="142" y="70" width="8" height="50" rx="2" fill="#c8956c" opacity="0.8"/><rect x="45" y="120" width="110" height="8" rx="2" fill="#c8956c" opacity="0.5"/><circle cx="100" cy="50" r="20" fill="#c8956c" opacity="0.3"/></svg>`,
  hallway: `<svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:70%;height:auto;"><rect x="30" y="20" width="140" height="110" rx="6" fill="#c8956c"/><rect x="34" y="24" width="66" height="102" rx="4" fill="#3d3d3d"/><rect x="104" y="24" width="62" height="102" rx="4" fill="#3d3d3d"/><rect x="40" y="30" width="54" height="90" rx="2" fill="#4a4a4a"/><rect x="110" y="30" width="50" height="90" rx="2" fill="#4a4a4a"/></svg>`,
  kids: `<svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:70%;height:auto;"><rect x="30" y="60" width="140" height="60" rx="6" fill="#c8956c"/><rect x="34" y="64" width="132" height="52" rx="4" fill="#3d3d3d"/><rect x="40" y="70" width="120" height="20" rx="3" fill="#4a4a4a"/><rect x="30" y="40" width="30" height="80" rx="4" fill="#c8956c" opacity="0.7"/><rect x="140" y="40" width="30" height="80" rx="4" fill="#c8956c" opacity="0.7"/></svg>`,
  budget: `<svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:70%;height:auto;"><rect x="50" y="40" width="100" height="80" rx="8" fill="#c8956c" opacity="0.6"/><rect x="54" y="44" width="92" height="72" rx="6" fill="#3d3d3d"/><text x="100" y="88" text-anchor="middle" fill="#c8956c" font-size="28" font-weight="bold">%</text><rect x="70" y="20" width="60" height="20" rx="10" fill="#c8956c"/><text x="100" y="35" text-anchor="middle" fill="#1a1a1a" font-size="12" font-weight="bold">-30%</text></svg>`
};

function getPlaceholder(cat) {
  return SVG_PLACEHOLDERS[cat] || SVG_PLACEHOLDERS.living;
}

function getAllImages(p) {
  const imgs = [];
  if (p.image) imgs.push(p.image);
  if (p.images && p.images.length) imgs.push(...p.images);
  return imgs;
}

function renderCatalogCard(p) {
  const allImgs = getAllImages(p);
  const hasImage = allImgs.length > 0;
  const imageContent = hasImage
    ? `<img src="${escapeHtml(allImgs[0])}" alt="${escapeHtml(p.name)}" loading="lazy" onclick="event.stopPropagation(); openLightbox(${JSON.stringify(allImgs).replace(/"/g, '&quot;')}, 0)">`
    : getPlaceholder(p.category);

  const badgeHtml = p.badge ? `<span class="badge">${escapeHtml(p.badge)}</span>` : '';
  const descHtml = p.description ? `<p class="catalog-card-desc">${escapeHtml(p.description)}</p>` : '';
  const imgCount = allImgs.length > 1 ? `<span class="card-img-count">📷 ${allImgs.length}</span>` : '';

  const reviews = JSON.parse(localStorage.getItem('ttmebel_reviews_' + p.id) || '[]');
  let ratingHtml = '';
  if (reviews.length > 0) {
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    ratingHtml = `<div style="color:var(--accent);font-size:0.85rem;margin-top:8px;">${'★'.repeat(Math.round(avg))}${'☆'.repeat(5 - Math.round(avg))} <span style="color:var(--text-muted);font-size:0.8rem;">(${reviews.length})</span></div>`;
  }

  return `
    <div class="catalog-card" data-category="${p.category}" onclick="window.location.href='product.html?id=${p.id}'" style="cursor:pointer;">
      <div class="catalog-card-image" style="background:linear-gradient(135deg,#2a2a2a,#3d3d3d);">
        ${imageContent}
        ${badgeHtml}
        ${imgCount}
        <button class="quick-view-btn" onclick="event.stopPropagation(); window.location.href='product.html?id=${p.id}'" title="Подробнее">
          <i class="fa-solid fa-eye"></i>
        </button>
      </div>
      <div class="catalog-card-body">
        <div class="category">${p.categoryLabel || CATALOG_CATEGORIES[p.category] || p.category}</div>
        <h3>${escapeHtml(p.name)}</h3>
        ${descHtml}
        <div class="price">${p.price} <small>${p.priceUnit || ''}</small></div>
        ${ratingHtml}
      </div>
    </div>
  `;
}

function loadCatalogProducts() {
  const saved = localStorage.getItem('ttmebel_products');
  if (saved) return Promise.resolve(JSON.parse(saved));

  return fetch('data/products.json')
    .then(r => r.json())
    .catch(() => []);
}

let currentProductImages = [];
let currentImageIndex = 0;

function openProductModal(id) {
  addRecentlyViewed(id);
  loadCatalogProducts().then(products => {
    const p = products.find(x => x.id === id);
    if (!p) return;

    const allImgs = getAllImages(p);
    const catLabel = p.categoryLabel || CATALOG_CATEGORIES[p.category] || p.category;
    const badgeHtml = p.badge ? `<span class="pm-badge">${p.badge}</span>` : '';

    currentProductImages = allImgs;
    currentImageIndex = 0;

    const mainImageHtml = allImgs.length > 0
      ? `<img id="pmMainImg" src="${escapeHtml(allImgs[0])}" alt="${escapeHtml(p.name)}" loading="lazy" onclick="openLightbox(currentProductImages, currentImageIndex)" style="cursor:zoom-in">`
      : `<div class="pm-placeholder">${getPlaceholder(p.category)}</div>`;

    const thumbsHtml = allImgs.length > 1
      ? `<div class="pm-thumbs">${allImgs.map((img, i) =>
          `<div class="pm-thumb ${i === 0 ? 'active' : ''}" onclick="switchProductImage(${i})"><img src="${escapeHtml(img)}" alt="" loading="lazy"></div>`
        ).join('')}</div>`
      : '';

    const navHtml = allImgs.length > 1
      ? `<button class="pm-nav pm-prev" onclick="prevProductImage()">‹</button>
         <button class="pm-nav pm-next" onclick="nextProductImage()">›</button>`
      : '';

    const counterHtml = allImgs.length > 1
      ? `<div class="pm-counter" id="pmCounter">1 / ${allImgs.length}</div>`
      : '';

    const modal = document.createElement('div');
    modal.className = 'product-modal-overlay';
    modal.id = 'productModal';
    modal.innerHTML = `
      <div class="product-modal">
        <button class="pm-close" onclick="closeProductModal()">✕</button>
        <div class="pm-gallery">
          <div class="pm-main-image">
            ${mainImageHtml}
            ${navHtml}
            ${counterHtml}
          </div>
          ${thumbsHtml}
        </div>
        <div class="pm-info">
          <div class="pm-category">${escapeHtml(catLabel)}</div>
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
            ${badgeHtml}
            <button class="fav-btn" onclick="toggleFavorite(${p.id})" id="favBtn_${p.id}" title="В избранное">
              <i class="fa-${isFavorite(p.id) ? 'solid' : 'regular'} fa-heart"></i>
            </button>
            <button class="fav-btn" onclick="toggleComparison(${p.id})" style="background:rgba(139,111,175,0.1);border-color:rgba(139,111,175,0.3);color:var(--accent);" title="Сравнить">
              <i class="fa-solid fa-scale-balanced"></i>
            </button>
          </div>
          <h2 class="pm-title">${escapeHtml(p.name)}</h2>
          <div class="pm-price">${p.price} <small>${p.priceUnit || ''}</small></div>
          <div class="pm-description">
            <h4>Описание</h4>
            <p>${escapeHtml(p.description) || 'Описание товара отсутствует.'}</p>
          </div>
          <div class="pm-meta">
            <div class="pm-meta-item"><span>Артикул:</span> TT-${String(p.id).padStart(4, '0')}</div>
            <div class="pm-meta-item"><span>Наличие:</span> В наличии</div>
            <div class="pm-meta-item"><span>Гарантия:</span> 2 года</div>
          </div>
          <form class="pm-order-form" onsubmit="submitProductOrder(event, this.getAttribute('data-product-name'))" data-product-name="${escapeHtml(p.name)}">
            <div class="pm-form-row">
              <input type="text" id="pmOrderName" placeholder="Ваше имя" required>
              <input type="tel" id="pmOrderPhone" placeholder="+7 (___) ___-__-__" required>
            </div>
            <button type="submit" class="btn btn-primary pm-order" id="pmOrderBtn">Заказать расчёт</button>
            <button type="button" class="btn btn-outline" onclick="addToCart(${p.id}); closeProductModal();" style="margin-top:8px;">
              <i class="fa-solid fa-cart-plus"></i> В корзину
            </button>
          </form>
          <div class="pm-order-success" id="pmOrderSuccess" style="display:none">
            <div style="text-align:center;padding:12px 0;color:var(--accent);font-weight:600;">✓ Заявка отправлена!</div>
          </div>
          <a href="tel:+79991234567" class="btn btn-outline pm-call">Позвонить</a>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => modal.classList.add('open'));

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeProductModal();
    });

    document.addEventListener('keydown', productModalKeyHandler);
  });
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => modal.remove(), 300);
  document.removeEventListener('keydown', productModalKeyHandler);
}

function productModalKeyHandler(e) {
  if (e.key === 'Escape') closeProductModal();
  if (e.key === 'ArrowLeft') prevProductImage();
  if (e.key === 'ArrowRight') nextProductImage();
}

function switchProductImage(index) {
  if (index < 0 || index >= currentProductImages.length) return;
  currentImageIndex = index;

  const mainImg = document.getElementById('pmMainImg');
  if (mainImg) mainImg.src = currentProductImages[index];

  document.querySelectorAll('.pm-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === index);
  });

  const counter = document.getElementById('pmCounter');
  if (counter) counter.textContent = `${index + 1} / ${currentProductImages.length}`;
}

function nextProductImage() {
  if (currentProductImages.length <= 1) return;
  switchProductImage((currentImageIndex + 1) % currentProductImages.length);
}

function prevProductImage() {
  if (currentProductImages.length <= 1) return;
  switchProductImage((currentImageIndex - 1 + currentProductImages.length) % currentProductImages.length);
}

function submitProductOrder(e, productName) {
  e.preventDefault();
  if (!checkRateLimit('product_order', 30000)) return;
  const name = document.getElementById('pmOrderName').value.trim();
  const phone = document.getElementById('pmOrderPhone').value.trim();
  if (!name || !phone) return;

  const btn = document.getElementById('pmOrderBtn');
  btn.textContent = 'Отправка...';
  btn.disabled = true;

  submitForm('order', { name, phone, product: productName })
    .then(() => {
      document.querySelector('.pm-order-form').style.display = 'none';
      document.getElementById('pmOrderSuccess').style.display = 'block';
      showToast('Заказ отправлен! Мы свяжемся с вами.');
    })
    .catch(() => {
      document.querySelector('.pm-order-form').style.display = 'none';
      document.getElementById('pmOrderSuccess').style.display = 'block';
      showToast('Заказ принят!');
    });
}

// ========== LIGHTBOX ==========

let lightboxImages = [];
let lightboxIndex = 0;

function openLightbox(images, index) {
  if (!images || !images.length) return;
  lightboxImages = images;
  lightboxIndex = index || 0;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.id = 'lightbox';
  overlay.innerHTML = `
    <button class="lightbox-close" onclick="closeLightbox()">✕</button>
    ${images.length > 1 ? `
      <button class="lightbox-nav lightbox-prev" onclick="event.stopPropagation(); navigateLightbox(-1)">‹</button>
      <button class="lightbox-nav lightbox-next" onclick="event.stopPropagation(); navigateLightbox(1)">›</button>
      <div class="lightbox-counter" id="lightboxCounter">${lightboxIndex + 1} / ${images.length}</div>
    ` : ''}
    <img id="lightboxImg" src="${escapeHtml(images[lightboxIndex])}" alt="">
  `;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => overlay.classList.add('open'));

  document.addEventListener('keydown', lightboxKeyHandler);
}

function closeLightbox() {
  const overlay = document.getElementById('lightbox');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => overlay.remove(), 300);
  document.removeEventListener('keydown', lightboxKeyHandler);
}

function navigateLightbox(dir) {
  lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
  const img = document.getElementById('lightboxImg');
  const counter = document.getElementById('lightboxCounter');
  if (img) img.src = lightboxImages[lightboxIndex];
  if (counter) counter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
}

function lightboxKeyHandler(e) {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
}

// ========== FAVORITES ==========

function getFavorites() {
  const user = JSON.parse(localStorage.getItem('ttmebel_current_user'));
  if (!user) return [];
  return JSON.parse(localStorage.getItem('ttmebel_favorites_' + user.id) || '[]');
}

function isFavorite(id) {
  return getFavorites().includes(id);
}

function toggleFavorite(id) {
  const user = JSON.parse(localStorage.getItem('ttmebel_current_user'));
  if (!user) {
    showToast('Войдите, чтобы добавлять в избранное');
    return;
  }

  const key = 'ttmebel_favorites_' + user.id;
  let favs = JSON.parse(localStorage.getItem(key) || '[]');

  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
    showToast('Удалено из избранного');
  } else {
    favs.push(id);
    showToast('Добавлено в избранное ❤️');
  }

  localStorage.setItem(key, JSON.stringify(favs));

  const btn = document.getElementById('favBtn_' + id);
  if (btn) {
    const icon = btn.querySelector('i');
    icon.className = favs.includes(id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
  }
}

// ========== RECENTLY VIEWED ==========

function addRecentlyViewed(id) {
  let recent = JSON.parse(localStorage.getItem('ttmebel_recent') || '[]');
  recent = recent.filter(r => r !== id);
  recent.unshift(id);
  if (recent.length > 10) recent = recent.slice(0, 10);
  localStorage.setItem('ttmebel_recent', JSON.stringify(recent));
}

function getRecentlyViewed() {
  return JSON.parse(localStorage.getItem('ttmebel_recent') || '[]');
}

function renderRecentlyViewed(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const ids = getRecentlyViewed();
  if (ids.length === 0) {
    container.parentElement.style.display = 'none';
    return;
  }

  loadCatalogProducts().then(products => {
    const recentProducts = ids.map(id => products.find(p => p.id === id)).filter(Boolean).slice(0, 6);
    if (recentProducts.length === 0) {
      container.parentElement.style.display = 'none';
      return;
    }
    container.innerHTML = recentProducts.map(renderCatalogCard).join('');
  });
}

// ========== COMPARISON ==========

function getComparison() {
  return JSON.parse(localStorage.getItem('ttmebel_comparison') || '[]');
}

function toggleComparison(id) {
  let comp = getComparison();
  if (comp.includes(id)) {
    comp = comp.filter(c => c !== id);
    showToast('Удалено из сравнения');
  } else {
    if (comp.length >= 4) {
      showToast('Можно сравнить максимум 4 товара');
      return;
    }
    comp.push(id);
    showToast('Добавлено к сравнению');
  }
  localStorage.setItem('ttmebel_comparison', JSON.stringify(comp));
  updateComparisonBar();
}

function updateComparisonBar() {
  const comp = getComparison();
  let bar = document.getElementById('comparisonBar');

  if (comp.length === 0) {
    if (bar) bar.remove();
    return;
  }

  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'comparisonBar';
    bar.className = 'comparison-bar';
    document.body.appendChild(bar);
  }

  loadCatalogProducts().then(products => {
    const items = comp.map(id => products.find(p => p.id === id)).filter(Boolean);
    bar.innerHTML = `
      <div class="comparison-bar-inner">
        <span class="comparison-count">${items.length} товар${items.length > 1 ? 'а' : ''} для сравнения</span>
        <button class="btn btn-primary btn-sm" onclick="openComparison()">Сравнить</button>
        <button class="btn btn-outline btn-sm" onclick="clearComparison()">Очистить</button>
      </div>
    `;
  });
}

function clearComparison() {
  localStorage.removeItem('ttmebel_comparison');
  updateComparisonBar();
  showToast('Сравнение очищено');
}

function openComparison() {
  const comp = getComparison();
  if (comp.length < 2) {
    showToast('Добавьте минимум 2 товара для сравнения');
    return;
  }

  loadCatalogProducts().then(products => {
    const items = comp.map(id => products.find(p => p.id === id)).filter(Boolean);
    const cats = [...new Set(items.map(i => i.category))];
    const catLabel = cats.length === 1 ? CATALOG_CATEGORIES[cats[0]] : 'Разные категории';

    const overlay = document.createElement('div');
    overlay.className = 'product-modal-overlay open';
    overlay.id = 'comparisonModal';
    overlay.innerHTML = `
      <div class="product-modal" style="max-width:900px;">
        <button class="pm-close" onclick="document.getElementById('comparisonModal').remove(); document.body.style.overflow='';">✕</button>
        <div style="padding:24px;overflow-x:auto;">
          <h2 style="margin-bottom:16px;font-size:1.3rem;">Сравнение товаров</h2>
          <table style="width:100%;border-collapse:collapse;min-width:500px;">
            <thead>
              <tr>
                <th style="text-align:left;padding:12px;border-bottom:2px solid var(--border);color:var(--text-light);font-size:0.85rem;width:120px;">Параметр</th>
                ${items.map(i => `<th style="text-align:center;padding:12px;border-bottom:2px solid var(--border);">
                  <div style="font-weight:700;font-size:0.95rem;">${escapeHtml(i.name)}</div>
                </th>`).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--text-light);font-size:0.85rem;">Категория</td>
                ${items.map(i => `<td style="text-align:center;padding:10px 12px;border-bottom:1px solid var(--border);">${escapeHtml(catLabel)}</td>`).join('')}
              </tr>
              <tr>
                <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--text-light);font-size:0.85rem;">Цена</td>
                ${items.map(i => `<td style="text-align:center;padding:10px 12px;border-bottom:1px solid var(--border);color:var(--accent);font-weight:700;">${escapeHtml(i.price)}</td>`).join('')}
              </tr>
              <tr>
                <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--text-light);font-size:0.85rem;">Бейдж</td>
                ${items.map(i => `<td style="text-align:center;padding:10px 12px;border-bottom:1px solid var(--border);">${i.badge ? escapeHtml(i.badge) : '—'}</td>`).join('')}
              </tr>
              <tr>
                <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--text-light);font-size:0.85rem;">Артикул</td>
                ${items.map(i => `<td style="text-align:center;padding:10px 12px;border-bottom:1px solid var(--border);">TT-${String(i.id).padStart(4, '0')}</td>`).join('')}
              </tr>
              <tr>
                <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--text-light);font-size:0.85rem;">Описание</td>
                ${items.map(i => `<td style="text-align:center;padding:10px 12px;border-bottom:1px solid var(--border);font-size:0.85rem;">${escapeHtml(i.description || '—')}</td>`).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
        document.body.style.overflow = '';
      }
    });
  });
}
