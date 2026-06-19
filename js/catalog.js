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
    ? `<img src="${allImgs[0]}" alt="${p.name}" loading="lazy" onclick="event.stopPropagation(); openLightbox(${JSON.stringify(allImgs).replace(/"/g, '&quot;')}, 0)">`
    : getPlaceholder(p.category);

  const badgeHtml = p.badge ? `<span class="badge">${p.badge}</span>` : '';
  const descHtml = p.description ? `<p class="catalog-card-desc">${p.description}</p>` : '';
  const imgCount = allImgs.length > 1 ? `<span class="card-img-count">📷 ${allImgs.length}</span>` : '';

  return `
    <div class="catalog-card" data-category="${p.category}" onclick="openProductModal(${p.id})" style="cursor:pointer;">
      <div class="catalog-card-image" style="background:linear-gradient(135deg,#2a2a2a,#3d3d3d);">
        ${imageContent}
        ${badgeHtml}
        ${imgCount}
        <button class="quick-view-btn" onclick="event.stopPropagation(); openProductModal(${p.id})" title="Быстрый просмотр">
          <i class="fa-solid fa-eye"></i>
        </button>
      </div>
      <div class="catalog-card-body">
        <div class="category">${p.categoryLabel || CATALOG_CATEGORIES[p.category] || p.category}</div>
        <h3>${p.name}</h3>
        ${descHtml}
        <div class="price">${p.price} <small>${p.priceUnit || ''}</small></div>
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
  loadCatalogProducts().then(products => {
    const p = products.find(x => x.id === id);
    if (!p) return;

    const allImgs = getAllImages(p);
    const catLabel = p.categoryLabel || CATALOG_CATEGORIES[p.category] || p.category;
    const badgeHtml = p.badge ? `<span class="pm-badge">${p.badge}</span>` : '';

    currentProductImages = allImgs;
    currentImageIndex = 0;

    const mainImageHtml = allImgs.length > 0
      ? `<img id="pmMainImg" src="${allImgs[0]}" alt="${p.name}" onclick="openLightbox(currentProductImages, currentImageIndex)" style="cursor:zoom-in">`
      : `<div class="pm-placeholder">${getPlaceholder(p.category)}</div>`;

    const thumbsHtml = allImgs.length > 1
      ? `<div class="pm-thumbs">${allImgs.map((img, i) =>
          `<div class="pm-thumb ${i === 0 ? 'active' : ''}" onclick="switchProductImage(${i})"><img src="${img}" alt=""></div>`
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
          <div class="pm-category">${catLabel}</div>
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
            ${badgeHtml}
            <button class="fav-btn" onclick="toggleFavorite(${p.id})" id="favBtn_${p.id}" title="В избранное">
              <i class="fa-${isFavorite(p.id) ? 'solid' : 'regular'} fa-heart"></i>
            </button>
          </div>
          <h2 class="pm-title">${p.name}</h2>
          <div class="pm-price">${p.price} <small>${p.priceUnit || ''}</small></div>
          <div class="pm-description">
            <h4>Описание</h4>
            <p>${p.description || 'Описание товара отсутствует.'}</p>
          </div>
          <div class="pm-meta">
            <div class="pm-meta-item"><span>Артикул:</span> TT-${String(p.id).padStart(4, '0')}</div>
            <div class="pm-meta-item"><span>Наличие:</span> В наличии</div>
            <div class="pm-meta-item"><span>Гарантия:</span> 2 года</div>
          </div>
          <form class="pm-order-form" onsubmit="submitProductOrder(event, '${p.name.replace(/'/g, "\\'")}')">
            <div class="pm-form-row">
              <input type="text" id="pmOrderName" placeholder="Ваше имя" required>
              <input type="tel" id="pmOrderPhone" placeholder="+7 (___) ___-__-__" required>
            </div>
            <button type="submit" class="btn btn-primary pm-order" id="pmOrderBtn">Заказать расчёт</button>
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
    <img id="lightboxImg" src="${images[lightboxIndex]}" alt="">
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
