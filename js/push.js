const PUSH_KEY = 'ttmebel_push_subscribed';
const PUSH_PROMPT_KEY = 'ttmebel_push_prompted';
const PUSH_LAST_VISIT = 'ttmebel_push_last_visit';

function initPushNotifications() {
  if (!('serviceWorker' in navigator) || !('Notification' in window)) return;

  navigator.serviceWorker.ready.then(reg => {
    if (Notification.permission === 'granted') {
      checkReturnVisit();
      return;
    }

    if (Notification.permission === 'denied') return;

    if (!sessionStorage.getItem(PUSH_PROMPT_KEY)) {
      showPushBanner();
    }
  });
}

function showPushBanner() {
  if (document.getElementById('push-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'push-banner';
  banner.innerHTML = `
    <div class="push-banner-inner">
      <div class="push-banner-text">
        <i class="fa-solid fa-bell"></i>
        <span>Уведомлять о скидках и новинках?</span>
      </div>
      <div class="push-banner-actions">
        <button class="push-btn push-btn-yes" onclick="acceptPush()">Да</button>
        <button class="push-btn push-btn-no" onclick="dismissPush()">Позже</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);

  requestAnimationFrame(() => {
    banner.classList.add('show');
  });
}

function acceptPush() {
  sessionStorage.setItem(PUSH_PROMPT_KEY, '1');
  hideBanner();

  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      localStorage.setItem(PUSH_KEY, '1');
      showLocalNotification('ТТмебель', 'Уведомления включены! Вы будете узнавать о скидках и новинках.');
      savePushSubscription();
    }
  });
}

function dismissPush() {
  sessionStorage.setItem(PUSH_PROMPT_KEY, '1');
  hideBanner();
}

function hideBanner() {
  const banner = document.getElementById('push-banner');
  if (banner) {
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 300);
  }
}

function showLocalNotification(title, body, icon) {
  if (Notification.permission !== 'granted') return;

  const notif = new Notification(title, {
    body: body,
    icon: icon || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" rx="20" fill="%238b6faf"/%3E%3Ctext x="50" y="68" font-size="50" font-weight="bold" text-anchor="middle" fill="%231a1a1a"%3EТТ%3C/text%3E%3C/svg%3E',
    badge: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"%3E%3Crect width="96" height="96" rx="20" fill="%238b6faf"/%3E%3C/svg%3E',
    tag: 'ttmebel-local',
    requireInteraction: false
  });

  notif.onclick = () => {
    window.focus();
    notif.close();
  };
}

function checkReturnVisit() {
  const lastVisit = localStorage.getItem(PUSH_LAST_VISIT);
  const now = Date.now();
  const hours = lastVisit ? (now - parseInt(lastVisit)) / (1000 * 60 * 60) : 999;

  localStorage.setItem(PUSH_LAST_VISIT, String(now));

  if (hours >= 24 && Notification.permission === 'granted') {
    const messages = [
      'Скидки до 30% на кухонные гарнитуры!',
      'Новые поступления: спальни и гостиные',
      'Бесплатная доставка от 15 000₽',
      'Мебель под заказ — скидка 10% сегодня',
      'Обновлён каталог — загляните!'
    ];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    showLocalNotification('ТТмебель', msg);
  }
}

function savePushSubscription() {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.ready.then(reg => {
    reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: null
    }).catch(() => {});
  });
}

function requestPushPermission() {
  if (!('Notification' in window)) return Promise.resolve('unavailable');

  if (Notification.permission === 'granted') return Promise.resolve('granted');
  if (Notification.permission === 'denied') return Promise.resolve('denied');

  return Notification.requestPermission();
}

function isPushSupported() {
  return 'serviceWorker' in navigator && 'Notification' in window;
}
