function initChatWidget() {
  if (document.getElementById('chatWidget')) return;

  const cfg = JSON.parse(localStorage.getItem('ttmebel_site') || '{}');
  const config = cfg.config || {};
  const waPhone = config.whatsappPhone || '79991234567';
  const tgToken = config.telegramToken || '';
  const tgChatId = config.telegramChatId || '';

  const widget = document.createElement('div');
  widget.id = 'chatWidget';
  widget.innerHTML = `
    <div class="chat-widget-btn" onclick="toggleChatWindow()">
      <i class="fa-solid fa-comments"></i>
      <span class="chat-unread" id="chatUnread" style="display:none;">1</span>
    </div>
    <div class="chat-window" id="chatWindow">
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="chat-avatar">ТТ</div>
          <div>
            <div class="chat-name">ТТмебель</div>
            <div class="chat-status">Онлайн</div>
          </div>
        </div>
        <button class="chat-close" onclick="toggleChatWindow()">✕</button>
      </div>
      <div class="chat-body" id="chatBody">
        <div class="chat-msg chat-bot">
          <div class="chat-msg-text">Здравствуйте! Чем могу помочь? Выберите тему или напишите нам:</div>
          <div class="chat-msg-time">${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <div class="chat-quick-replies">
          <button onclick="sendChatQuickReply('Хочу купить мебель')">🛋 Хочу купить мебель</button>
          <button onclick="sendChatQuickReply('Рассчитать стоимость')">💰 Рассчитать стоимость</button>
          <button onclick="sendChatQuickReply('Условия доставки')">🚚 Доставка</button>
          <button onclick="sendChatQuickReply('Вопрос по заказу')">📦 Вопрос по заказу</button>
        </div>
      </div>
      <div class="chat-channels">
        <div class="chat-channels-label">Или свяжитесь напрямую:</div>
        <div class="chat-channels-btns">
          <a href="https://wa.me/${waPhone}?text=${encodeURIComponent('Здравствуйте! Хочу узнать о мебели.')}" class="chat-channel-btn whatsapp" target="_blank" rel="noopener">
            <i class="fa-brands fa-whatsapp"></i> WhatsApp
          </a>
          ${tgToken && !tgToken.includes('ВСТАВЬ') ? `
          <a href="https://t.me/+${waPhone}" class="chat-channel-btn telegram" target="_blank" rel="noopener">
            <i class="fa-brands fa-telegram"></i> Telegram
          </a>` : ''}
          <a href="tel:+${waPhone}" class="chat-channel-btn phone">
            <i class="fa-solid fa-phone"></i> Позвонить
          </a>
        </div>
      </div>
      <div class="chat-input-area">
        <input type="text" id="chatInput" placeholder="Ваше сообщение..." onkeydown="if(event.key==='Enter')sendChatMessage()">
        <button class="chat-send-btn" onclick="sendChatMessage()"><i class="fa-solid fa-paper-plane"></i></button>
      </div>
    </div>
  `;

  document.body.appendChild(widget);

  setTimeout(() => {
    const btn = document.querySelector('.chat-widget-btn');
    if (btn) btn.classList.add('chat-widget-visible');
  }, 2000);
}

function toggleChatWindow() {
  const win = document.getElementById('chatWindow');
  const btn = document.querySelector('.chat-widget-btn');
  const unread = document.getElementById('chatUnread');

  if (win.classList.contains('open')) {
    win.classList.remove('open');
    btn.classList.remove('chat-active');
  } else {
    win.classList.add('open');
    btn.classList.add('chat-active');
    if (unread) unread.style.display = 'none';
    const input = document.getElementById('chatInput');
    if (input) setTimeout(() => input.focus(), 300);
  }
}

function sendChatQuickReply(text) {
  addChatMessage(text, 'user');
  document.querySelector('.chat-quick-replies')?.remove();

  setTimeout(() => {
    const replies = {
      'Хочу купить мебель': 'Отлично! Загляните в наш каталог — там вы найдёте готовые решения для любой комнаты. А если нужна мебель под заказ — оставьте заявку, и мы рассчитаем стоимость!',
      'Рассчитать стоимость': 'Для расчёта стоимости нам нужно знать: размеры, материал и пожелания. Напишите нам в WhatsApp или оставьте заявку в каталоге — рассчитаем за 5 минут!',
      'Условия доставки': 'Доставляем по Краснодару бесплатно от 15 000 ₽. Стоимость зависит от района. Подробнее — на странице Доставка.',
      'Вопрос по заказу': 'Напишите номер вашего заказа или имя — мы проверим статус и сообщим когда можно ожидать доставку.'
    };
    addChatMessage(replies[text] || 'Спасибо за ваш вопрос! Менеджер свяжется с вами в ближайшее время.', 'bot');
  }, 800);
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  addChatMessage(text, 'user');
  input.value = '';

  setTimeout(() => {
    addChatMessage('Спасибо! Ваше сообщение принято. Наш менеджер ответит вам в ближайшее время. Для быстрого ответа напишите нам в WhatsApp или Telegram.', 'bot');
  }, 1000);

  const cfg = JSON.parse(localStorage.getItem('ttmebel_site') || '{}');
  const config = cfg.config || {};
  if (config.telegramToken && !config.telegramToken.includes('ВСТАВЬ') && config.telegramChatId) {
    const url = `https://api.telegram.org/bot${config.telegramToken}/sendMessage`;
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: config.telegramChatId,
        text: `💬 <b>Чат с сайта ТТмебель</b>\n\nСообщение: ${text}\n\n🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`,
        parse_mode: 'HTML'
      })
    }).catch(() => {});
  }
}

function addChatMessage(text, type) {
  const body = document.getElementById('chatBody');
  if (!body) return;
  const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const msg = document.createElement('div');
  msg.className = `chat-msg chat-${type}`;
  msg.innerHTML = `<div class="chat-msg-text">${escapeHtml(text)}</div><div class="chat-msg-time">${time}</div>`;
  body.appendChild(msg);
  body.scrollTop = body.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('.bottom-nav')) {
    initChatWidget();
  } else {
    initChatWidget();
  }
});