const CATEGORIES = {
  living: 'Гостиная', bedroom: 'Спальня', kitchen: 'Кухня',
  hallway: 'Прихожая', kids: 'Детская', budget: 'Бюджетная'
};

const CATEGORY_LABELS = {
  living: 'Гостиная', bedroom: 'Спальня', kitchen: 'Кухня',
  hallway: 'Прихожая', kids: 'Детская', budget: 'Бюджетная',
  custom: 'Мебель под заказ', other: 'Другое'
};

let products = [];
let siteData = {};
let currentImageData = null;
let currentMultiImages = [];
let inlineUploadTarget = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!checkAdminAuth()) return;
  loadProducts();
  loadSiteData();
  setupDragDrop();
});

function checkAdminAuth() {
  const isAdmin = localStorage.getItem('ttmebel_admin') === 'true';
  if (!isAdmin) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function logoutAdmin() {
  localStorage.removeItem('ttmebel_admin');
  localStorage.removeItem('ttmebel_auth');
  window.location.href = 'index.html';
}

// ========== PRODUCTS ==========

function loadProducts() {
  const saved = localStorage.getItem('ttmebel_products');
  if (saved) {
    products = JSON.parse(saved);
    renderStats();
    filterTable();
  } else {
    loadProductsFromJSON();
  }
}

function loadProductsFromJSON() {
  fetch('data/products.json').then(r => r.json()).then(data => {
    products = data; saveProducts(); renderStats(); filterTable();
  }).catch(() => { products = []; renderStats(); filterTable(); });
}

function saveProducts() { localStorage.setItem('ttmebel_products', JSON.stringify(products)); }

function renderStats() {
  const total = products.length;
  const withImg = products.filter(p => p.image || (p.images && p.images.length)).length;
  const cats = [...new Set(products.map(p => p.category))].length;
  const totalPhotos = products.reduce((s, p) => s + (p.image ? 1 : 0) + (p.images ? p.images.length : 0), 0);
  const el = document.getElementById('stats');
  if (el) el.innerHTML = `
    <div class="stat-box"><div class="num">${total}</div><div class="lbl">Товаров</div></div>
    <div class="stat-box"><div class="num">${totalPhotos}</div><div class="lbl">Фото</div></div>
    <div class="stat-box"><div class="num">${cats}</div><div class="lbl">Категорий</div></div>`;
}

function filterTable() {
  const search = (document.getElementById('adminSearch')?.value || '').toLowerCase().trim();
  const filter = document.getElementById('adminFilter')?.value || 'all';
  let filtered = products;
  if (filter !== 'all') filtered = filtered.filter(p => p.category === filter);
  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
  renderTable(filtered);
}

function renderTable(items) {
  const tbody = document.getElementById('productsBody');
  if (!tbody) return;
  if (!items.length) { tbody.innerHTML = '<tr><td colspan="6"><div class="admin-empty"><div class="icon">📦</div><div>Товары не найдены</div></div></td></tr>'; return; }
  tbody.innerHTML = items.map(p => {
    const img = p.image || (p.images && p.images[0]) || '';
    const cnt = (p.image ? 1 : 0) + (p.images ? p.images.length : 0);
    const badge = cnt > 1 ? `<span style="position:absolute;bottom:2px;right:2px;background:var(--accent);color:var(--primary-dark);font-size:0.6rem;padding:1px 4px;border-radius:3px;">${cnt}📷</span>` : '';
    return `<tr>
      <td>${img ? `<div style="position:relative;display:inline-block"><img class="thumb" src="${img}" alt="">${badge}</div>` : '<div class="thumb-placeholder">📦</div>'}</td>
      <td class="name-cell">${p.name}</td>
      <td><span class="cat-badge">${CATEGORIES[p.category] || p.category}</span></td>
      <td>${p.price} <small style="color:var(--text-light)">${p.priceUnit || ''}</small></td>
      <td>${p.badge ? `<span class="badge-tag">${p.badge}</span>` : '—'}</td>
      <td><div class="action-cell"><button class="btn-edit" onclick="editProduct(${p.id})">✏️</button><button class="btn-danger" onclick="deleteProduct(${p.id})">🗑️</button></div></td>
    </tr>`;
  }).join('');
}

function openModal() {
  document.getElementById('modal').classList.add('open');
  document.getElementById('editId').value = '';
  document.getElementById('modalTitle').textContent = 'Добавить товар';
  document.getElementById('productForm').reset();
  document.getElementById('pPriceUnit').value = '/шт';
  currentImageData = null; currentMultiImages = [];
  resetUploadArea(); renderMultiPreviews();
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  currentImageData = null; currentMultiImages = [];
  resetUploadArea(); renderMultiPreviews();
  document.body.style.overflow = '';
}

function editProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  document.getElementById('modal').classList.add('open');
  document.getElementById('editId').value = p.id;
  document.getElementById('modalTitle').textContent = 'Редактировать товар';
  document.getElementById('pName').value = p.name;
  document.getElementById('pCategory').value = p.category;
  document.getElementById('pBadge').value = p.badge || '';
  document.getElementById('pPrice').value = p.price;
  document.getElementById('pPriceUnit').value = p.priceUnit || '/шт';
  document.getElementById('pDesc').value = p.description || '';
  document.getElementById('pMaterial').value = p.material || '';
  document.getElementById('pColor').value = p.color || '';
  currentImageData = p.image || null;
  currentMultiImages = (p.images && p.images.length) ? [...p.images] : [];
  if (currentImageData) {
    const area = document.getElementById('uploadArea');
    document.getElementById('uploadPreview').src = currentImageData;
    document.getElementById('uploadPreview').style.display = 'block';
    document.getElementById('uploadPlaceholder').style.display = 'none';
    area.classList.add('has-image');
  } else { resetUploadArea(); }
  renderMultiPreviews();
  document.body.style.overflow = 'hidden';
}

function saveProduct(e) {
  e.preventDefault();
  const editId = document.getElementById('editId').value;
  const data = {
    name: document.getElementById('pName').value.trim(),
    category: document.getElementById('pCategory').value,
    categoryLabel: CATEGORIES[document.getElementById('pCategory').value],
    price: document.getElementById('pPrice').value.trim(),
    priceUnit: document.getElementById('pPriceUnit').value.trim(),
    badge: document.getElementById('pBadge').value,
    material: document.getElementById('pMaterial').value,
    color: document.getElementById('pColor').value.trim(),
    image: currentImageData || '', images: currentMultiImages,
    description: document.getElementById('pDesc').value.trim()
  };
  if (editId) { const idx = products.findIndex(x => x.id === parseInt(editId)); if (idx !== -1) products[idx] = { ...products[idx], ...data }; }
  else { data.id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1; products.push(data); }
  saveProducts(); renderStats(); filterTable(); closeModal();
}

function deleteProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p || !confirm(`Удалить «${p.name}»?`)) return;
  products = products.filter(x => x.id !== id);
  saveProducts(); renderStats(); filterTable();
}

// ========== IMAGE HANDLING ==========

function handleFileSelect(e) { if (e.target.files[0]) processFile(e.target.files[0]); }

function setupDragDrop() {
  const area = document.getElementById('uploadArea');
  if (!area) return;
  area.addEventListener('dragover', e => { e.preventDefault(); area.style.borderColor = 'var(--accent)'; });
  area.addEventListener('dragleave', () => { area.style.borderColor = ''; });
  area.addEventListener('drop', e => { e.preventDefault(); area.style.borderColor = ''; if (e.dataTransfer.files[0]?.type.startsWith('image/')) processFile(e.dataTransfer.files[0]); });
}

function processFile(file) {
  if (file.size > 10 * 1024 * 1024) { alert('Максимум 10 МБ'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    compressImage(e.target.result, 1200, 0.75).then(compressed => {
      currentImageData = compressed;
      document.getElementById('uploadPreview').src = compressed;
      document.getElementById('uploadPreview').style.display = 'block';
      document.getElementById('uploadPlaceholder').style.display = 'none';
      document.getElementById('uploadArea').classList.add('has-image');
    });
  };
  reader.readAsDataURL(file);
}

function removeImage(e) { e.stopPropagation(); currentImageData = null; resetUploadArea(); document.getElementById('fileInput').value = ''; }

function resetUploadArea() {
  const area = document.getElementById('uploadArea');
  if (!area) return;
  document.getElementById('uploadPreview').style.display = 'none';
  document.getElementById('uploadPreview').src = '';
  document.getElementById('uploadPlaceholder').style.display = '';
  area.classList.remove('has-image');
}

function handleMultiFileSelect(e) {
  Array.from(e.target.files).forEach(file => {
    if (file.size > 10 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = ev => {
      compressImage(ev.target.result, 1200, 0.75).then(compressed => {
        currentMultiImages.push(compressed);
        renderMultiPreviews();
      });
    };
    reader.readAsDataURL(file);
  });
  e.target.value = '';
}

function renderMultiPreviews() {
  const el = document.getElementById('multiPreviews');
  if (!el) return;
  el.innerHTML = currentMultiImages.map((img, i) =>
    `<div class="multi-preview-item ${i === 0 ? 'is-main' : ''}"><img src="${img}"><button class="remove-multi" onclick="removeMultiImage(${i})">✕</button></div>`
  ).join('');
}

function removeMultiImage(i) { currentMultiImages.splice(i, 1); renderMultiPreviews(); }

// ========== INLINE IMAGE UPLOAD ==========

function triggerInlineUpload(inputId) { document.getElementById(inputId)?.click(); }

function handleInlineUpload(e, previewId, section) {
  const file = e.target.files[0];
  if (!file || file.size > 10 * 1024 * 1024) { alert('Максимум 10 МБ'); return; }

  const reader = new FileReader();
  reader.onload = ev => {
    compressImage(ev.target.result, 800, 0.7).then(compressed => {
      document.getElementById(previewId + 'Preview').src = compressed;
      document.getElementById(previewId + 'Preview').style.display = 'block';
      document.getElementById(previewId + 'Placeholder').style.display = 'none';
      document.getElementById(previewId + 'Upload').classList.add('has-image');
      if (!siteData[section]) siteData[section] = {};
      siteData[section][previewId] = compressed;
    });
  };
  reader.readAsDataURL(file);
}

function compressImage(dataUrl, maxWidth, quality) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      if (img.width <= maxWidth) { resolve(dataUrl); return; }
      const canvas = document.createElement('canvas');
      const ratio = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * ratio;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      try {
        const webp = canvas.toDataURL('image/webp', quality);
        if (webp && webp.length < dataUrl.length) { resolve(webp); return; }
      } catch(e) {}
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function removeInlineImg(e, key, section) {
  e.stopPropagation();
  if (siteData[section]) siteData[section][key] = '';
  const preview = document.getElementById(key + 'Preview');
  const placeholder = document.getElementById(key + 'Placeholder');
  const upload = document.getElementById(key + 'Upload');
  if (preview) { preview.style.display = 'none'; preview.src = ''; }
  if (placeholder) placeholder.style.display = '';
  if (upload) upload.classList.remove('has-image');
  const input = document.getElementById(key + 'File');
  if (input) input.value = '';
}

function loadInlineImage(key, section) {
  const val = siteData[section]?.[key];
  if (!val) return;
  const preview = document.getElementById(key + 'Preview');
  const placeholder = document.getElementById(key + 'Placeholder');
  const upload = document.getElementById(key + 'Upload');
  if (preview) { preview.src = val; preview.style.display = 'block'; }
  if (placeholder) placeholder.style.display = 'none';
  if (upload) upload.classList.add('has-image');
}

// ========== SITE DATA ==========

function loadSiteData() {
  const saved = localStorage.getItem('ttmebel_site');
  if (saved) { siteData = JSON.parse(saved); fillAllTabs(); return; }
  fetch('data/site.json').then(r => r.json()).then(data => {
    siteData = data; localStorage.setItem('ttmebel_site', JSON.stringify(siteData)); fillAllTabs();
  }).catch(() => { siteData = {}; fillAllTabs(); });
}

function saveSiteData() {
  collectAllTabs();
  try {
    const json = JSON.stringify(siteData);
    if (json.length > 4.5 * 1024 * 1024) {
      alert('Данные слишком большие для сохранения. Попробуйте уменьшить размер фото или удалить лишние.');
      return;
    }
    localStorage.setItem('ttmebel_site', json);
    alert('Настройки сохранены!');
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      alert('Недостаточно места в хранилище браузера. Удалите лишние фото или очистите кэш.');
    } else {
      alert('Ошибка сохранения: ' + e.message);
    }
  }
}

function fillAllTabs() {
  const hp = siteData.homepage || {};
  const ab = siteData.about || {};
  const dl = siteData.delivery || {};
  const ct = siteData.contacts || {};
  const ft = siteData.footer || {};
  const cfg = siteData.config || {};

  if (document.getElementById('hpTitle')) document.getElementById('hpTitle').value = hp.heroTitle || '';
  if (document.getElementById('hpSubtitle')) document.getElementById('hpSubtitle').value = hp.heroSubtitle || '';
  if (document.getElementById('hpPopTitle')) document.getElementById('hpPopTitle').value = hp.popularTitle || '';
  if (document.getElementById('hpPopSubtitle')) document.getElementById('hpPopSubtitle').value = hp.popularSubtitle || '';
  loadInlineImage('hpHero', 'homepage');

  if (document.getElementById('abTitle')) document.getElementById('abTitle').value = ab.title || '';
  if (document.getElementById('abText')) document.getElementById('abText').value = (ab.text || []).join('\n');
  loadInlineImage('abImage', 'about');
  renderStatsEditor(ab.stats || []);
  renderTeamEditor(ab.team || []);

  renderShippingEditor(dl.shippingMethods || []);
  renderPaymentEditor(dl.paymentMethods || []);
  renderFaqEditor(dl.faq || []);

  renderReviewsEditor(siteData.reviews || []);

  renderGalleryEditor(siteData.gallery || []);

  if (document.getElementById('ctPhone')) document.getElementById('ctPhone').value = ct.phone || '';
  if (document.getElementById('ctPhoneHours')) document.getElementById('ctPhoneHours').value = ct.phoneHours || '';
  if (document.getElementById('ctEmail')) document.getElementById('ctEmail').value = ct.email || '';
  if (document.getElementById('ctEmailNote')) document.getElementById('ctEmailNote').value = ct.emailNote || '';
  if (document.getElementById('ctAddress')) document.getElementById('ctAddress').value = ct.address || '';
  if (document.getElementById('ctShowroomHours')) document.getElementById('ctShowroomHours').value = ct.showroomHours || '';
  if (document.getElementById('ctMessengers')) document.getElementById('ctMessengers').value = ct.messengers || '';
  if (document.getElementById('ctMessengerNote')) document.getElementById('ctMessengerNote').value = ct.messengerNote || '';

  if (document.getElementById('ftAbout')) document.getElementById('ftAbout').value = ft.about || '';
  if (document.getElementById('ftCopyright')) document.getElementById('ftCopyright').value = ft.copyright || '';

  if (document.getElementById('cfgTgToken')) document.getElementById('cfgTgToken').value = cfg.telegramToken || '';
  if (document.getElementById('cfgTgChat')) document.getElementById('cfgTgChat').value = cfg.telegramChatId || '';
  if (document.getElementById('cfgWaPhone')) document.getElementById('cfgWaPhone').value = cfg.whatsappPhone || '';
  if (document.getElementById('cfgTgEnabled')) document.getElementById('cfgTgEnabled').value = cfg.telegramEnabled !== false ? 'true' : 'false';
}

function collectAllTabs() {
  const prevAbout = siteData.about || {};
  const prevHomepage = siteData.homepage || {};

  siteData.homepage = {
    heroTitle: document.getElementById('hpTitle')?.value || '',
    heroSubtitle: document.getElementById('hpSubtitle')?.value || '',
    heroImage: prevHomepage.hpHero || prevHomepage.heroImage || '',
    hpHero: prevHomepage.hpHero || prevHomepage.heroImage || '',
    popularTitle: document.getElementById('hpPopTitle')?.value || '',
    popularSubtitle: document.getElementById('hpPopSubtitle')?.value || ''
  };

  siteData.about = {
    title: document.getElementById('abTitle')?.value || '',
    text: (document.getElementById('abText')?.value || '').split('\n').filter(l => l.trim()),
    companyImage: prevAbout.abImage || prevAbout.companyImage || '',
    abImage: prevAbout.abImage || prevAbout.companyImage || '',
    stats: collectStatsEditor(),
    team: collectTeamEditor()
  };

  siteData.delivery = {
    shippingMethods: collectShippingEditor(),
    paymentMethods: collectPaymentEditor(),
    faq: collectFaqEditor()
  };

  siteData.reviews = collectReviewsEditor();

  siteData.gallery = collectGalleryEditor();

  siteData.contacts = {
    phone: document.getElementById('ctPhone')?.value || '',
    phoneHours: document.getElementById('ctPhoneHours')?.value || '',
    email: document.getElementById('ctEmail')?.value || '',
    emailNote: document.getElementById('ctEmailNote')?.value || '',
    address: document.getElementById('ctAddress')?.value || '',
    showroomHours: document.getElementById('ctShowroomHours')?.value || '',
    messengers: document.getElementById('ctMessengers')?.value || '',
    messengerNote: document.getElementById('ctMessengerNote')?.value || ''
  };

  siteData.footer = {
    about: document.getElementById('ftAbout')?.value || '',
    copyright: document.getElementById('ftCopyright')?.value || ''
  };

  siteData.config = {
    telegramToken: document.getElementById('cfgTgToken')?.value || '',
    telegramChatId: document.getElementById('cfgTgChat')?.value || '',
    whatsappPhone: document.getElementById('cfgWaPhone')?.value || '',
    telegramEnabled: document.getElementById('cfgTgEnabled')?.value === 'true'
  };
}

// ========== STATS EDITOR ==========

function renderStatsEditor(stats) {
  const el = document.getElementById('statsEditor');
  if (!el) return;
  el.innerHTML = stats.map((s, i) => `
    <div class="editor-row"><div class="row-header"><span>Статистика ${i + 1}</span><button class="remove-row" onclick="removeStat(${i})">✕</button></div>
    <div class="row-fields"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><input value="${s.value}" placeholder="Значение" onchange="updateStat(${i},'value',this.value)"><input value="${s.label}" placeholder="Подпись" onchange="updateStat(${i},'label',this.value)"></div></div></div>
  `).join('');
}

function addStat() {
  collectAllTabs();
  siteData.about = siteData.about || {};
  siteData.about.stats = siteData.about.stats || [];
  siteData.about.stats.push({ value: '', label: '' });
  renderStatsEditor(siteData.about.stats);
}

function removeStat(i) {
  collectAllTabs();
  siteData.about.stats.splice(i, 1);
  renderStatsEditor(siteData.about.stats);
}

function updateStat(i, key, val) {
  if (!siteData.about?.stats) return;
  siteData.about.stats[i][key] = val;
}

function collectStatsEditor() {
  return siteData.about?.stats || [];
}

// ========== TEAM EDITOR ==========

function renderTeamEditor(team) {
  const el = document.getElementById('teamEditor');
  if (!el) return;
  el.innerHTML = team.map((m, i) => `
    <div class="editor-row with-photo">
      <div class="editor-photo-upload" onclick="triggerInlineUpload('teamImg${i}')">
        ${m.image ? `<img src="${m.image}">` : '<div class="placeholder-text">📷<br>Фото</div>'}
        <input type="file" id="teamImg${i}" accept="image/*" style="display:none" onchange="handleTeamPhoto(${i}, event)">
      </div>
      <div>
        <div class="row-header"><span>${m.name || 'Сотрудник'}</span><button class="remove-row" onclick="removeTeam(${i})">✕</button></div>
        <div class="row-fields">
          <input value="${m.name}" placeholder="Имя" onchange="updateTeam(${i},'name',this.value)">
          <input value="${m.role}" placeholder="Должность" onchange="updateTeam(${i},'role',this.value)">
          <input value="${m.bio}" placeholder="Описание" onchange="updateTeam(${i},'bio',this.value)">
        </div>
      </div>
    </div>
  `).join('');
}

function addTeamMember() {
  collectAllTabs();
  siteData.about = siteData.about || {};
  siteData.about.team = siteData.about.team || [];
  siteData.about.team.push({ name: '', role: '', bio: '', image: '' });
  renderTeamEditor(siteData.about.team);
}

function removeTeam(i) {
  collectAllTabs();
  siteData.about.team.splice(i, 1);
  renderTeamEditor(siteData.about.team);
}

function updateTeam(i, key, val) {
  if (!siteData.about?.team) return;
  siteData.about.team[i][key] = val;
}

function handleTeamPhoto(i, e) {
  const file = e.target.files[0];
  if (!file || file.size > 10 * 1024 * 1024) return;
  const reader = new FileReader();
  reader.onload = ev => {
    compressImage(ev.target.result, 400, 0.7).then(compressed => {
      siteData.about.team[i].image = compressed;
      renderTeamEditor(siteData.about.team);
    });
  };
  reader.readAsDataURL(file);
}

function collectTeamEditor() { return siteData.about?.team || []; }

// ========== SHIPPING EDITOR ==========

function renderShippingEditor(items) {
  const el = document.getElementById('shippingEditor');
  if (!el) return;
  el.innerHTML = items.map((s, i) => `
    <div class="editor-row"><div class="row-header"><span>Доставка ${i + 1}</span><button class="remove-row" onclick="removeShipping(${i})">✕</button></div>
    <div class="row-fields"><input value="${s.title}" placeholder="Название" onchange="updateShipping(${i},'title',this.value)"><textarea rows="2" placeholder="Описание" onchange="updateShipping(${i},'text',this.value)">${s.text}</textarea></div></div>
  `).join('');
}

function addShipping() {
  collectAllTabs();
  siteData.delivery = siteData.delivery || {};
  siteData.delivery.shippingMethods = siteData.delivery.shippingMethods || [];
  siteData.delivery.shippingMethods.push({ title: '', text: '' });
  renderShippingEditor(siteData.delivery.shippingMethods);
}

function removeShipping(i) { collectAllTabs(); siteData.delivery.shippingMethods.splice(i, 1); renderShippingEditor(siteData.delivery.shippingMethods); }
function updateShipping(i, k, v) { if (siteData.delivery?.shippingMethods) siteData.delivery.shippingMethods[i][k] = v; }
function collectShippingEditor() { return siteData.delivery?.shippingMethods || []; }

// ========== PAYMENT EDITOR ==========

function renderPaymentEditor(items) {
  const el = document.getElementById('paymentEditor');
  if (!el) return;
  el.innerHTML = items.map((p, i) => `
    <div class="editor-row"><div class="row-header"><span>Оплата ${i + 1}</span><button class="remove-row" onclick="removePayment(${i})">✕</button></div>
    <div class="row-fields"><input value="${p.title}" placeholder="Название" onchange="updatePayment(${i},'title',this.value)"><textarea rows="2" placeholder="Описание" onchange="updatePayment(${i},'text',this.value)">${p.text}</textarea></div></div>
  `).join('');
}

function addPayment() {
  collectAllTabs();
  siteData.delivery = siteData.delivery || {};
  siteData.delivery.paymentMethods = siteData.delivery.paymentMethods || [];
  siteData.delivery.paymentMethods.push({ title: '', text: '' });
  renderPaymentEditor(siteData.delivery.paymentMethods);
}

function removePayment(i) { collectAllTabs(); siteData.delivery.paymentMethods.splice(i, 1); renderPaymentEditor(siteData.delivery.paymentMethods); }
function updatePayment(i, k, v) { if (siteData.delivery?.paymentMethods) siteData.delivery.paymentMethods[i][k] = v; }
function collectPaymentEditor() { return siteData.delivery?.paymentMethods || []; }

// ========== FAQ EDITOR ==========

function renderFaqEditor(items) {
  const el = document.getElementById('faqEditor');
  if (!el) return;
  el.innerHTML = items.map((f, i) => `
    <div class="editor-row"><div class="row-header"><span>Вопрос ${i + 1}</span><button class="remove-row" onclick="removeFaq(${i})">✕</button></div>
    <div class="row-fields"><input value="${f.question}" placeholder="Вопрос" onchange="updateFaq(${i},'question',this.value)"><textarea rows="2" placeholder="Ответ" onchange="updateFaq(${i},'answer',this.value)">${f.answer}</textarea></div></div>
  `).join('');
}

function addFaq() {
  collectAllTabs();
  siteData.delivery = siteData.delivery || {};
  siteData.delivery.faq = siteData.delivery.faq || [];
  siteData.delivery.faq.push({ question: '', answer: '' });
  renderFaqEditor(siteData.delivery.faq);
}

function removeFaq(i) { collectAllTabs(); siteData.delivery.faq.splice(i, 1); renderFaqEditor(siteData.delivery.faq); }
function updateFaq(i, k, v) { if (siteData.delivery?.faq) siteData.delivery.faq[i][k] = v; }
function collectFaqEditor() { return siteData.delivery?.faq || []; }

// ========== REVIEWS EDITOR ==========

function renderReviewsEditor(items) {
  const el = document.getElementById('reviewsEditor');
  if (!el) return;
  el.innerHTML = items.map((r, i) => `
    <div class="editor-row with-photo">
      <div class="editor-photo-upload" onclick="triggerInlineUpload('reviewImg${i}')">
        ${r.avatar ? `<img src="${r.avatar}">` : '<div class="placeholder-text">📷<br>Фото</div>'}
        <input type="file" id="reviewImg${i}" accept="image/*" style="display:none" onchange="handleReviewPhoto(${i}, event)">
      </div>
      <div>
        <div class="row-header"><span>${r.name || 'Отзыв'}</span><button class="remove-row" onclick="removeReview(${i})">✕</button></div>
        <div class="row-fields">
          <input value="${r.name}" placeholder="Имя клиента" onchange="updateReview(${i},'name',this.value)">
          <input value="${r.date}" placeholder="Дата" onchange="updateReview(${i},'date',this.value)">
          <textarea rows="3" placeholder="Текст отзыва" onchange="updateReview(${i},'text',this.value)">${r.text}</textarea>
        </div>
      </div>
    </div>
  `).join('');
}

function addReview() {
  collectAllTabs();
  siteData.reviews = siteData.reviews || [];
  siteData.reviews.push({ name: '', date: '', text: '', avatar: '' });
  renderReviewsEditor(siteData.reviews);
}

function removeReview(i) { collectAllTabs(); siteData.reviews.splice(i, 1); renderReviewsEditor(siteData.reviews); }
function updateReview(i, k, v) { if (siteData.reviews) siteData.reviews[i][k] = v; }

function handleReviewPhoto(i, e) {
  const file = e.target.files[0];
  if (!file || file.size > 10 * 1024 * 1024) return;
  const reader = new FileReader();
  reader.onload = ev => {
    compressImage(ev.target.result, 400, 0.7).then(compressed => {
      siteData.reviews[i].avatar = compressed;
      renderReviewsEditor(siteData.reviews);
    });
  };
  reader.readAsDataURL(file);
}

function collectReviewsEditor() { return siteData.reviews || []; }

// ========== TAB SWITCHING ==========

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === 'tab-' + tab));
}

// ========== EXPORT / IMPORT ==========

function exportProducts() {
  downloadJSON(products, 'products.json');
}

function exportSite() {
  collectAllTabs();
  downloadJSON(siteData, 'site-data.json');
}

function exportAll() {
  collectAllTabs();
  downloadJSON({ products, siteData }, 'ttmebel-all-data.json');
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function importProducts(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (!Array.isArray(data)) throw new Error('Неверный формат');
      if (confirm(`Заменить каталог (${products.length} товаров) на (${data.length} товаров)?`)) {
        products = data; saveProducts(); renderStats(); filterTable();
      }
    } catch (err) { alert('Ошибка: ' + err.message); }
  };
  reader.readAsText(file); e.target.value = '';
}

function importSite(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (confirm('Заменить настройки сайта?')) {
        siteData = data; localStorage.setItem('ttmebel_site', JSON.stringify(siteData)); fillAllTabs();
      }
    } catch (err) { alert('Ошибка: ' + err.message); }
  };
  reader.readAsText(file); e.target.value = '';
}

function importAll(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (data.products && confirm(`Заменить всё? Товары: ${data.products.length}`)) {
        products = data.products; siteData = data.siteData || {};
        saveProducts(); localStorage.setItem('ttmebel_site', JSON.stringify(siteData));
        renderStats(); filterTable(); fillAllTabs();
      }
    } catch (err) { alert('Ошибка: ' + err.message); }
  };
  reader.readAsText(file); e.target.value = '';
}

function resetAll() {
  if (!confirm('Удалить ВСЕ данные из localStorage? Это необратимо!')) return;
  if (!confirm('Точно удалить?')) return;
  localStorage.removeItem('ttmebel_products');
  localStorage.removeItem('ttmebel_site');
  products = []; siteData = {};
  renderStats(); filterTable(); fillAllTabs();
  alert('Все данные удалены. Перезагрузите страницу.');
}

// ========== GALLERY EDITOR ==========

function renderGalleryEditor(images) {
  const el = document.getElementById('galleryEditor');
  if (!el) return;
  if (!images || !images.length) {
    el.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-muted);">Нет фото. Добавьте изображения для галереи.</div>';
    return;
  }
  el.innerHTML = '';
  setTimeout(() => {
    el.innerHTML = images.map((img, i) => `
      <div style="display:inline-block;position:relative;margin:6px;border:2px solid var(--border);border-radius:8px;overflow:hidden;width:120px;height:80px;">
        <img src="${img}" style="width:100%;height:100%;object-fit:cover;" alt="Фото ${i + 1}">
        <button onclick="removeGalleryImage(${i})" style="position:absolute;top:2px;right:2px;background:#e74c3c;color:#fff;border:none;border-radius:50%;width:22px;height:22px;font-size:0.7rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>
        <div style="position:absolute;bottom:2px;left:2px;background:rgba(0,0,0,0.6);color:#fff;font-size:0.6rem;padding:2px 6px;border-radius:4px;">${i + 1}</div>
      </div>
    `).join('');
  }, 50);
}

function collectGalleryEditor() {
  return siteData.gallery || [];
}

function handleGalleryUpload(event) {
  const files = event.target.files;
  if (!files.length) return;

  if (!siteData.gallery) siteData.gallery = [];

  let processed = 0;
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxW = 1200;
        let w = img.width;
        let h = img.height;
        if (w > maxW) { h = h * maxW / w; w = maxW; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        let dataUrl;
        try {
          const webp = canvas.toDataURL('image/webp', 0.8);
          dataUrl = (webp && webp.length < canvas.toDataURL('image/jpeg', 0.8).length) ? webp : canvas.toDataURL('image/jpeg', 0.8);
        } catch(e) { dataUrl = canvas.toDataURL('image/jpeg', 0.8); }
        siteData.gallery.push(dataUrl);
        processed++;
        if (processed === files.length) {
          renderGalleryEditor(siteData.gallery);
          autoSaveSiteData();
          showToast(`${files.length} фото добавлено в галерею`);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
  event.target.value = '';
}

function removeGalleryImage(index) {
  if (!confirm('Удалить это фото из галереи?')) return;
  siteData.gallery.splice(index, 1);
  renderGalleryEditor(siteData.gallery);
  autoSaveSiteData();
}

function autoSaveSiteData() {
  try {
    const json = JSON.stringify(siteData);
    if (json.length > 4.5 * 1024 * 1024) {
      showToast('Данные слишком большие!');
      return;
    }
    localStorage.setItem('ttmebel_site', json);
  } catch (e) {}
}

// ========== MODAL EVENTS ==========

document.getElementById('modal')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
