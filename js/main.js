document.addEventListener('DOMContentLoaded', () => {
  initBurger();
  initScrollTop();
  initObserver();
  initPhoneMask();
  initContactForm();
  initFaq();
  initTooltips();
  initSeamlessBg();
  initPageTransitions();
});

function initSeamlessBg() {
  const body = document.body;
  const style = getComputedStyle(body);
  const bgImage = style.backgroundImage;
  if (!bgImage || bgImage === 'none') return;

  const urlMatch = bgImage.match(/url\(["']?(.+?)["']?\)/);
  if (!urlMatch) return;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const w = img.width;
    const h = img.height;

    canvas.width = w;
    canvas.height = h * 2;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0, w, h);

    ctx.save();
    ctx.translate(0, h * 2);
    ctx.scale(1, -1);
    ctx.drawImage(img, 0, 0, w, h);
    ctx.restore();

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    body.style.backgroundImage = `url(${dataUrl})`;
    body.style.backgroundSize = 'auto 200vh';
    body.style.backgroundRepeat = 'repeat-y';
  };
  img.src = urlMatch[1];

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        body.style.backgroundPositionY = `${-scrollY * 0.3}px`;
        ticking = false;
      });
      ticking = true;
    }
  });
}
  });
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

  document.querySelectorAll('.advantage-card, .catalog-card, .review-card, .delivery-card, .section-title, .footer-grid').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
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
    el.style.cursor = 'help';
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

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (href.endsWith('.html') || href.endsWith('/')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const overlay = document.createElement('div');
        overlay.className = 'page-exit';
        document.body.appendChild(overlay);
        requestAnimationFrame(() => {
          overlay.classList.add('active');
          setTimeout(() => {
            window.location.href = href;
          }, 300);
        });
      });
    }
  });
}
