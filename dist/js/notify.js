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