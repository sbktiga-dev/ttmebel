document.addEventListener('DOMContentLoaded', () => {
  if (typeof ym === 'undefined') return;

  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      ym(0, 'reachGoal', 'phone_call');
    });
  });

  document.querySelectorAll('a[href*="wa.me"], a[href*="t.me"]').forEach(link => {
    link.addEventListener('click', () => {
      ym(0, 'reachGoal', 'messenger_click');
    });
  });

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      ym(0, 'reachGoal', 'form_submit');
    });
  }

  const callbackModal = document.getElementById('callbackModal');
  if (callbackModal) {
    const callbackForm = callbackModal.querySelector('form');
    if (callbackForm) {
      callbackForm.addEventListener('submit', () => {
        ym(0, 'reachGoal', 'callback_request');
      });
    }
  }

  document.querySelectorAll('.pm-order-form').forEach(form => {
    form.addEventListener('submit', () => {
      ym(0, 'reachGoal', 'product_order');
    });
  });

  document.querySelectorAll('.catalog-card').forEach(card => {
    card.addEventListener('click', () => {
      ym(0, 'reachGoal', 'product_view');
    });
  });

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      ym(0, 'reachGoal', 'catalog_sort');
    });
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      ym(0, 'reachGoal', 'catalog_filter');
    });
  });
});