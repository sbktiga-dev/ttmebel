function loadSiteData() {
  const saved = localStorage.getItem('ttmebel_site');
  if (saved) return JSON.parse(saved);
  return null;
}

function getSiteData() {
  return loadSiteData();
}

function renderSiteContent() {
  const d = loadSiteData();
  if (!d) return;

  renderPhoneAllPages(d);
  renderFooter(d);

  const page = document.body.dataset.page;
  if (page === 'home') renderHomePage(d);
  if (page === 'about') renderAboutPage(d);
  if (page === 'delivery') renderDeliveryPage(d);
  if (page === 'reviews') renderReviewsPage(d);
  if (page === 'contacts') renderContactsPage(d);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el && text !== undefined && text !== null) el.textContent = text;
}

function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el && html !== undefined && html !== null) el.innerHTML = html;
}

function setImg(id, src) {
  const el = document.getElementById(id);
  if (!el) return;
  if (src) { el.src = src; el.style.display = ''; }
  else { el.style.display = 'none'; }
}

function renderPhoneAllPages(d) {
  const ct = d.contacts || {};
  if (!ct.phone) return;
  document.querySelectorAll('[data-phone]').forEach(el => el.textContent = ct.phone);
  document.querySelectorAll('[data-phone-href]').forEach(el => el.href = 'tel:' + ct.phone.replace(/\D/g, ''));
}

function renderFooter(d) {
  const ft = d.footer || {};
  const ct = d.contacts || {};
  setText('ftAboutText', ft.about);
  setText('ftCopyright', ft.copyright);
  if (ct.phone) {
    document.querySelectorAll('.footer-phone').forEach(el => { el.textContent = ct.phone; el.href = 'tel:' + ct.phone.replace(/\D/g, ''); });
  }
  if (ct.email) {
    document.querySelectorAll('.footer-email').forEach(el => { el.textContent = ct.email; el.href = 'mailto:' + ct.email; });
  }
  if (ct.address) {
    document.querySelectorAll('.footer-address').forEach(el => el.textContent = ct.address);
  }
}

// ========== HOME PAGE ==========

function renderHomePage(d) {
  const hp = d.homepage || {};

  if (hp.heroTitle) setHTML('heroTitle', hp.heroTitle);
  if (hp.heroSubtitle) setText('heroSubtitle', hp.heroSubtitle);
  if (hp.heroImage) {
    const heroImg = document.getElementById('heroImageArea');
    if (heroImg) {
      heroImg.innerHTML = `<img src="${hp.heroImage}" alt="" class="site-rendered-img" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-lg);">`;
    }
  }
  if (hp.popularTitle) setText('popularTitle', hp.popularTitle);
  if (hp.popularSubtitle) setText('popularSubtitle', hp.popularSubtitle);
}

// ========== ABOUT PAGE ==========

function renderAboutPage(d) {
  const ab = d.about || {};

  if (ab.title) setHTML('aboutTitle', ab.title);
  if (ab.text && ab.text.length) {
    const el = document.getElementById('aboutText');
    if (el) el.innerHTML = ab.text.map(p => `<p>${p}</p>`).join('');
  }
  if (ab.companyImage) {
    const imgEl = document.getElementById('aboutCompanyImage');
    if (imgEl) {
      const svgPlaceholder = imgEl.querySelector('svg');
      if (svgPlaceholder) svgPlaceholder.style.display = 'none';
      const img = document.createElement('img');
      img.src = ab.companyImage;
      img.className = 'site-rendered-img';
      img.style.cssText = 'width:100%;height:auto;max-height:400px;object-fit:cover;border-radius:20px;';
      imgEl.appendChild(img);
    }
  }

  if (ab.stats && ab.stats.length) {
    const el = document.getElementById('aboutStats');
    if (el) el.innerHTML = ab.stats.map(s => `
      <div class="stat">
        <div class="stat-number">${s.value}</div>
        <div class="stat-label">${s.label}</div>
      </div>
    `).join('');
  }

  if (ab.team && ab.team.length) {
    const el = document.getElementById('aboutTeam');
    if (el) el.innerHTML = ab.team.map(m => `
      <div class="review-card" style="text-align:center;">
        <div class="review-avatar" style="width:80px;height:80px;font-size:2rem;margin:0 auto 16px;overflow:hidden;">
          ${m.image
            ? `<img src="${m.image}" class="site-rendered-img" loading="lazy" style="width:100%;height:100%;object-fit:cover;" alt="${m.name}">`
            : `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><circle cx="20" cy="20" r="20" fill="#c8956c"/><circle cx="20" cy="14" r="8" fill="#3d3d3d"/><path d="M8 36c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="#3d3d3d"/></svg>`
          }
        </div>
        <h3 style="margin-bottom:4px;">${m.name}</h3>
        <p style="color:var(--text-light);font-size:0.9rem;margin-bottom:8px;">${m.role}</p>
        <p style="color:var(--text-light);font-size:0.85rem;">${m.bio}</p>
      </div>
    `).join('');
  }
}

// ========== DELIVERY PAGE ==========

function renderDeliveryPage(d) {
  const dl = d.delivery || {};
  const icons = [
    `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:64px;height:64px;"><rect x="4" y="20" width="40" height="24" rx="4" fill="#c8956c"/><rect x="44" y="28" width="16" height="16" rx="2" fill="#c8956c" opacity="0.7"/><circle cx="16" cy="48" r="6" fill="#3d3d3d"/><circle cx="16" cy="48" r="3" fill="#c8956c"/><circle cx="52" cy="48" r="6" fill="#3d3d3d"/><circle cx="52" cy="48" r="3" fill="#c8956c"/></svg>`,
    `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:64px;height:64px;"><path d="M32 8l4 8h8l-6 6 2 8-8-4-8 4 2-8-6-6h8l4-8z" fill="#c8956c"/><rect x="20" y="32" width="24" height="24" rx="4" fill="#c8956c" opacity="0.5"/></svg>`,
    `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:64px;height:64px;"><rect x="12" y="20" width="40" height="32" rx="4" fill="#c8956c"/><rect x="16" y="24" width="32" height="24" rx="2" fill="#3d3d3d"/><rect x="28" y="8" width="8" height="16" rx="2" fill="#c8956c" opacity="0.7"/><rect x="24" y="4" width="16" height="8" rx="2" fill="#c8956c"/></svg>`
  ];
  const payIcons = [
    `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:64px;height:64px;"><rect x="8" y="16" width="48" height="32" rx="4" fill="#c8956c"/><rect x="8" y="24" width="48" height="8" fill="#3d3d3d"/><rect x="16" y="40" width="16" height="4" rx="1" fill="#3d3d3d"/></svg>`,
    `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:64px;height:64px;"><rect x="16" y="8" width="32" height="48" rx="4" fill="#c8956c"/><circle cx="32" cy="32" r="12" fill="#3d3d3d"/><text x="32" y="36" text-anchor="middle" fill="#c8956c" font-size="14" font-weight="bold">₽</text></svg>`,
    `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:64px;height:64px;"><rect x="16" y="8" width="32" height="48" rx="8" fill="#c8956c"/><circle cx="32" cy="32" r="10" fill="#3d3d3d"/><path d="M28 28l8 8M36 28l-8 8" stroke="#c8956c" stroke-width="2" stroke-linecap="round"/></svg>`
  ];

  if (dl.shippingMethods && dl.shippingMethods.length) {
    const el = document.getElementById('shippingGrid');
    if (el) el.innerHTML = dl.shippingMethods.map((s, i) => `
      <div class="delivery-card">
        <div class="icon">${icons[i % icons.length]}</div>
        <h3>${s.title}</h3>
        <p>${s.text}</p>
      </div>
    `).join('');
  }

  if (dl.paymentMethods && dl.paymentMethods.length) {
    const el = document.getElementById('paymentGrid');
    if (el) el.innerHTML = dl.paymentMethods.map((p, i) => `
      <div class="delivery-card">
        <div class="icon">${payIcons[i % payIcons.length]}</div>
        <h3>${p.title}</h3>
        <p>${p.text}</p>
      </div>
    `).join('');
  }

  if (dl.faq && dl.faq.length) {
    const el = document.getElementById('faqList');
    if (el) {
      el.innerHTML = dl.faq.map(f => `
        <div class="faq-item">
          <button class="faq-question">${f.question}</button>
          <div class="faq-answer"><p>${f.answer}</p></div>
        </div>
      `).join('');
      el.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
          const item = btn.closest('.faq-item');
          const wasOpen = item.classList.contains('open');
          document.querySelectorAll('.faq-item.open').forEach(x => x.classList.remove('open'));
          if (!wasOpen) item.classList.add('open');
        });
      });
    }
  }
}

// ========== REVIEWS PAGE ==========

function renderReviewsPage(d) {
  const reviews = d.reviews || [];
  if (!reviews.length) return;
  const el = document.getElementById('reviewsGrid');
  if (!el) return;

  el.innerHTML = reviews.map(r => {
    const stars = '★★★★★';
    const avatarContent = r.avatar
      ? `<img src="${r.avatar}" class="site-rendered-img" loading="lazy" style="width:100%;height:100%;object-fit:cover;" alt="${r.name}">`
      : r.name ? r.name.charAt(0) : '?';
    return `
      <div class="review-card">
        <div class="review-stars">${stars}</div>
        <p class="review-text">${r.text}</p>
        <div class="review-author">
          <div class="review-avatar">${avatarContent}</div>
          <div>
            <div class="review-name">${r.name}</div>
            <div class="review-date">${r.date}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ========== CONTACTS PAGE ==========

function renderContactsPage(d) {
  const ct = d.contacts || {};
  setText('ctPhoneVal', ct.phone);
  setText('ctPhoneHoursVal', ct.phoneHours);
  setText('ctEmailVal', ct.email);
  setText('ctEmailNoteVal', ct.emailNote);
  setText('ctAddressVal', ct.address);
  setText('ctShowroomHoursVal', ct.showroomHours);
  setText('ctMessengersVal', ct.messengers);
  setText('ctMessengerNoteVal', ct.messengerNote);

  if (ct.phone) {
    const phoneLink = document.getElementById('ctPhoneLink');
    if (phoneLink) phoneLink.href = 'tel:' + ct.phone.replace(/\D/g, '');
    const phoneLink2 = document.getElementById('ctPhoneLink2');
    if (phoneLink2) { phoneLink2.href = 'tel:' + ct.phone.replace(/\D/g, ''); phoneLink2.textContent = ct.phone; }
  }
  if (ct.email) {
    const emailLink = document.getElementById('ctEmailLink');
    if (emailLink) { emailLink.href = 'mailto:' + ct.email; emailLink.textContent = ct.email; }
  }
}

document.addEventListener('DOMContentLoaded', renderSiteContent);
