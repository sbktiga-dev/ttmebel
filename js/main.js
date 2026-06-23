function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', () => {
  initBurger();
  initScrollTop();
  initObserver();
  initPhoneMask();
  initContactForm();
  initFaq();
  initTooltips();
  initPageTransitions();
  initAdminVisibility();
  initUserHeader();
  initBgDecorations();
});

function initBgDecorations() {
  const page = document.body.dataset.page;
  if (!page || page === 'admin' || page === 'login' || page === 'register' || page === 'profile') return;

  const container = document.createElement('div');
  container.className = 'bg-decorations';
  container.setAttribute('aria-hidden', 'true');

  const configs = {
    home: [
      { cls: 'bg-decor--circle bg-decor--float1', w: 300, h: 300, top: '8%', left: '5%' },
      { cls: 'bg-decor--ring bg-decor--float2', w: 180, h: 180, top: '15%', right: '8%' },
      { cls: 'bg-decor--glow bg-decor--pulse', w: 400, h: 400, top: '40%', left: '60%' },
      { cls: 'bg-decor--dot bg-decor--float3', w: 6, h: 6, top: '25%', left: '30%' },
      { cls: 'bg-decor--dot bg-decor--float1', w: 4, h: 4, top: '55%', right: '20%' },
      { cls: 'bg-decor--dot bg-decor--float2', w: 5, h: 5, top: '70%', left: '15%' },
      { cls: 'bg-decor--line bg-decor--drift', w: 250, h: 1, top: '35%', left: '10%', rotate: 15 },
      { cls: 'bg-decor--line bg-decor--drift', w: 180, h: 1, top: '65%', right: '5%', rotate: -20, delay: '5s' },
      { cls: 'bg-decor--circle bg-decor--float2', w: 120, h: 120, bottom: '10%', left: '8%' },
      { cls: 'bg-decor--ring bg-decor--float3', w: 90, h: 90, bottom: '20%', right: '12%' },
    ],
    catalog: [
      { cls: 'bg-decor--glow bg-decor--pulse', w: 350, h: 350, top: '5%', right: '10%' },
      { cls: 'bg-decor--circle bg-decor--float1', w: 200, h: 200, top: '30%', left: '3%' },
      { cls: 'bg-decor--dot bg-decor--float3', w: 5, h: 5, top: '20%', left: '40%' },
      { cls: 'bg-decor--dot bg-decor--float1', w: 4, h: 4, top: '60%', right: '30%' },
      { cls: 'bg-decor--line bg-decor--drift', w: 200, h: 1, top: '45%', left: '20%', rotate: 10 },
    ],
    about: [
      { cls: 'bg-decor--circle bg-decor--float2', w: 250, h: 250, top: '10%', right: '5%' },
      { cls: 'bg-decor--ring bg-decor--float1', w: 150, h: 150, top: '50%', left: '5%' },
      { cls: 'bg-decor--glow bg-decor--pulse', w: 300, h: 300, bottom: '10%', right: '20%' },
      { cls: 'bg-decor--dot bg-decor--float3', w: 5, h: 5, top: '35%', left: '25%' },
    ],
    delivery: [
      { cls: 'bg-decor--ring bg-decor--float1', w: 200, h: 200, top: '8%', left: '10%' },
      { cls: 'bg-decor--glow bg-decor--pulse', w: 350, h: 350, top: '50%', right: '5%' },
      { cls: 'bg-decor--dot bg-decor--float2', w: 5, h: 5, top: '25%', right: '25%' },
      { cls: 'bg-decor--line bg-decor--drift', w: 220, h: 1, top: '70%', left: '15%', rotate: -8 },
    ],
    reviews: [
      { cls: 'bg-decor--circle bg-decor--float3', w: 220, h: 220, top: '12%', right: '8%' },
      { cls: 'bg-decor--ring bg-decor--float2', w: 130, h: 130, bottom: '15%', left: '10%' },
      { cls: 'bg-decor--glow bg-decor--pulse', w: 300, h: 300, top: '40%', left: '50%' },
      { cls: 'bg-decor--dot bg-decor--float1', w: 4, h: 4, top: '30%', left: '20%' },
    ],
    contacts: [
      { cls: 'bg-decor--circle bg-decor--float1', w: 280, h: 280, top: '5%', left: '5%' },
      { cls: 'bg-decor--ring bg-decor--float3', w: 160, h: 160, top: '40%', right: '10%' },
      { cls: 'bg-decor--dot bg-decor--float2', w: 5, h: 5, top: '20%', right: '30%' },
      { cls: 'bg-decor--line bg-decor--drift', w: 200, h: 1, top: '60%', left: '25%', rotate: 12 },
    ],
  };

  const elements = configs[page] || configs.home;
  elements.forEach(cfg => {
    const el = document.createElement('div');
    el.className = 'bg-decor ' + cfg.cls;
    el.style.width = cfg.w + 'px';
    el.style.height = cfg.h + 'px';
    if (cfg.top) el.style.top = cfg.top;
    if (cfg.bottom) el.style.bottom = cfg.bottom;
    if (cfg.left) el.style.left = cfg.left;
    if (cfg.right) el.style.right = cfg.right;
    if (cfg.rotate) el.style.transform = 'rotate(' + cfg.rotate + 'deg)';
    if (cfg.delay) el.style.animationDelay = '1.5s, ' + cfg.delay;
    container.appendChild(el);
  });

  document.body.prepend(container);
}

function initBurger() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  function observeElements() {
    document.querySelectorAll('.advantage-card, .catalog-card, .review-card, .delivery-card, .section-title, .footer-grid').forEach(el => {
      if (el.dataset.observed) return;
      el.dataset.observed = '1';
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  observeElements();

  const targets = document.querySelectorAll('.catalog-grid, .reviews-grid, .advantages-grid');
  if (targets.length) {
    targets.forEach(target => {
      new MutationObserver(observeElements).observe(target, { childList: true, subtree: true });
    });
  } else {
    new MutationObserver(observeElements).observe(document.body, { childList: true, subtree: true });
  }
}

function initPhoneMask() {
  const phoneInput = document.getElementById('phone');
  if (!phoneInput) return;

  phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 0) {
      if (value[0] === '7' || value[0] === '8') {
        value = value.substring(1);
      }

      let formatted = '+7';
      if (value.length > 0) formatted += ' (' + value.substring(0, 3);
      if (value.length >= 3) formatted += ') ' + value.substring(3, 6);
      if (value.length >= 6) formatted += '-' + value.substring(6, 8);
      if (value.length >= 8) formatted += '-' + value.substring(8, 10);

      e.target.value = formatted;
    }
  });

  phoneInput.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && e.target.value === '+7 (') {
      e.target.value = '';
    }
  });

  phoneInput.addEventListener('focus', () => {
    if (!phoneInput.value) {
      phoneInput.value = '+7 ';
    }
  });

  phoneInput.addEventListener('blur', () => {
    if (phoneInput.value === '+7' || phoneInput.value === '+7 ') {
      phoneInput.value = '';
    }
  });
}

function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (!contactForm || !formSuccess) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!checkRateLimit('contact_form', 60000)) return;
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    const submitBtn = contactForm.querySelector('.form-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;

    submitForm('contact', data)
      .then(() => {
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');
        showToast('Заявка отправлена! Мы свяжемся с вами.');
      })
      .catch(err => {
        console.error('Submit error:', err);
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');
        showToast('Заявка принята!');
      });
  });
}

function initFaq() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) openItem.classList.remove('open');
      });

      item.classList.toggle('open', !isOpen);
    });
  });
}

function initTooltips() {
  document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.style.position = 'relative';
    if (!el.querySelector('::after') && !el.classList.contains('messenger-btn')) {
      el.addEventListener('mouseenter', function() {
        const tip = document.createElement('span');
        tip.className = 'tooltip-text';
        tip.textContent = this.getAttribute('data-tooltip');
        this.appendChild(tip);
      });
      el.addEventListener('mouseleave', function() {
        const tip = this.querySelector('.tooltip-text');
        if (tip) tip.remove();
      });
    }
  });
}

function showToast(message, duration = 3000) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

function checkRateLimit(type, cooldownMs) {
  cooldownMs = cooldownMs || 60000;
  const key = 'ttmebel_ratelimit_' + type;
  const last = parseInt(localStorage.getItem(key) || '0');
  const now = Date.now();
  if (now - last < cooldownMs) {
    const wait = Math.ceil((cooldownMs - (now - last)) / 1000);
    showToast(`Подождите ${wait} сек. перед повторной отправкой`);
    return false;
  }
  localStorage.setItem(key, String(now));
  return true;
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function openCallbackModal() {
  document.getElementById('callbackModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCallbackModal() {
  document.getElementById('callbackModal').classList.remove('open');
  document.body.style.overflow = '';
}

function submitCallback(e) {
  e.preventDefault();
  if (!checkRateLimit('callback', 60000)) return;
  const name = document.getElementById('callbackName').value;
  const phone = document.getElementById('callbackPhone').value;

  if (!name || !phone) return;

  submitForm('callback', { name, phone, type: 'Обратный звонок' })
    .then(() => {
      closeCallbackModal();
      showToast('Заявка отправлена! Мы перезвоним вам в ближайшее время.');
      document.getElementById('callbackName').value = '';
      document.getElementById('callbackPhone').value = '';
    })
    .catch(() => {
      closeCallbackModal();
      showToast('Заявка принята! Мы перезвоним вам.');
    });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCallbackModal();
  }
});

function initPageTransitions() {
  document.body.classList.add('page-transition');
}

function initAdminVisibility() {
  const isAdmin = localStorage.getItem('ttmebel_admin') === 'true';
  const adminBtns = document.querySelectorAll('.btn-admin');
  
  adminBtns.forEach(btn => {
    if (isAdmin) {
      btn.textContent = 'Админ';
      btn.href = 'admin.html';
      btn.classList.add('admin-active');
    } else {
      btn.textContent = 'Вход';
      btn.href = 'login.html';
      btn.classList.remove('admin-active');
    }
  });
}

function initUserHeader() {
  const user = JSON.parse(localStorage.getItem('ttmebel_current_user'));
  const headerRight = document.querySelector('.header-right');
  if (!headerRight) return;

  let userBtn = headerRight.querySelector('.header-user-btn');
  if (!userBtn) {
    userBtn = document.createElement('a');
    userBtn.className = 'header-user-btn';
    headerRight.insertBefore(userBtn, headerRight.firstChild);
  }

  if (user) {
    userBtn.href = 'profile.html';
    userBtn.innerHTML = `<i class="fa-solid fa-user" style="margin-right:6px;"></i>${user.name.split(' ')[0]}`;
    userBtn.className = 'header-user-btn header-user-btn-active';
  } else {
    userBtn.href = 'register.html';
    userBtn.innerHTML = `<i class="fa-solid fa-user-plus" style="margin-right:6px;"></i>Войти`;
    userBtn.className = 'header-user-btn header-user-btn-inactive';
  }
}
