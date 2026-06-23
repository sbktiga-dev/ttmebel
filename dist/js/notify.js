let notifyConfig = null;

function loadNotifyConfig() {
  const adminConfig = localStorage.getItem('ttmebel_site');
  if (adminConfig) {
    try {
      const parsed = JSON.parse(adminConfig);
      if (parsed.config) {
        notifyConfig = {
          whatsapp: {
            enabled: !!parsed.config.whatsappPhone,
            phone: parsed.config.whatsappPhone || ''
          },
          max: {
            enabled: !!parsed.config.maxLink,
            link: parsed.config.maxLink || ''
          },
          emailjs: { enabled: false }
        };
        return Promise.resolve(notifyConfig);
      }
    } catch(e) {}
  }

  return fetch('data/config.json')
    .then(r => r.json())
    .then(data => { notifyConfig = data; return data; })
    .catch(() => {
      notifyConfig = { whatsapp: { enabled: false }, max: { enabled: false }, emailjs: { enabled: false } };
      return notifyConfig;
    });
}

function getNotifyConfig() {
  if (notifyConfig) return Promise.resolve(notifyConfig);
  return loadNotifyConfig();
}

function sendEmailJS(data) {
  return getNotifyConfig().then(cfg => {
    if (!cfg.emailjs || !cfg.emailjs.enabled || !cfg.emailjs.serviceId) {
      console.log('EmailJS not configured, skipping');
      return Promise.resolve();
    }

    if (typeof emailjs === 'undefined') {
      console.error('EmailJS SDK not loaded');
      return Promise.resolve();
    }

    return emailjs.send(cfg.emailjs.serviceId, cfg.emailjs.templateId, data, cfg.emailjs.publicKey);
  });
}

function saveFormToStorage(type, data) {
  const key = 'ttmebel_forms_' + type;
  const forms = JSON.parse(localStorage.getItem(key) || '[]');
  forms.push({ ...data, timestamp: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(forms));
}

function formatFormMessage(data, type) {
  const now = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
  const categoryLabels = {
    living: 'Гостиная', bedroom: 'Спальня', kitchen: 'Кухня',
    hallway: 'Прихожая', kids: 'Детская', budget: 'Бюджетная',
    custom: 'Мебель под заказ', other: 'Другое'
  };

  let msg = '';

  if (type === 'contact') {
    msg = `📬 Новая заявка с сайта ТТмебель\n\n`;
    msg += `👤 Имя: ${data.name || '—'}\n`;
    msg += `📞 Телефон: ${data.phone || '—'}\n`;
    if (data.email) msg += `📧 Email: ${data.email}\n`;
    if (data.interest) msg += `🛋 Интересует: ${categoryLabels[data.interest] || data.interest}\n`;
    msg += `💬 Сообщение:\n${data.message || '—'}\n\n`;
    msg += `🕐 ${now}`;
  } else if (type === 'order') {
    msg = `🛒 Заказ расчёта с сайта ТТмебель\n\n`;
    msg += `👤 Имя: ${data.name || '—'}\n`;
    msg += `📞 Телефон: ${data.phone || '—'}\n`;
    if (data.product) msg += `📦 Товар: ${data.product}\n`;
    if (data.message) msg += `💬 Комментарий: ${data.message}\n\n`;
    msg += `🕐 ${now}`;
  } else if (type === 'callback') {
    msg = `📲 Заказ обратного звонка\n\n`;
    msg += `👤 Имя: ${data.name || '—'}\n`;
    msg += `📞 Телефон: ${data.phone || '—'}\n`;
    if (data.time) msg += `⏰ Удобное время: ${data.time}\n`;
    msg += `\n🕐 ${now}`;
  }

  return msg;
}

function openWhatsApp(text) {
  return getNotifyConfig().then(cfg => {
    if (!cfg.whatsapp || !cfg.whatsapp.enabled || !cfg.whatsapp.phone) return;
    const phone = cfg.whatsapp.phone.replace(/\D/g, '');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  });
}

function openMax() {
  return getNotifyConfig().then(cfg => {
    const link = (cfg.max && cfg.max.link) || 'https://vk.me/max';
    window.open(link, '_blank');
  });
}

function submitForm(type, data, options = {}) {
  const promises = [];

  if (options.saveToStorage !== false) {
    saveFormToStorage(type, data);
  }

  if (options.emailjs) {
    promises.push(sendEmailJS(data));
  }

  if (promises.length === 0) return Promise.resolve({});

  return Promise.all(promises).then(results => ({
    emailjs: results[0] || null
  }));
}