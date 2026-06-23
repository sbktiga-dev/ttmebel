# ТТмебель — Текущий функционал сайта

## Страницы
- **index.html** — Главная (hero, галерея, преимущества, популярные товары, "как работаем", отзывы, CTA)
- **catalog.html** — Каталог с поиском, фильтрами по категориям, сортировкой, пагинацией
- **about.html** — О компании (история, статистика с анимацией, ценности, команда)
- **delivery.html** — Доставка и оплата (способы доставки, оплаты, FAQ, карта Яндекс)
- **reviews.html** — Отзывы клиентов (загружаются из CMS)
- **contacts.html** — Контакты (телефон, email, адрес, форма обратной связи, карта)
- **admin.html** — Админ-панель (CMS для товаров, контента всех страниц, настроек)
- **login.html** — Вход в админку
- **register.html** — Регистрация/вход пользователей
- **profile.html** — Личный кабинет (заказы, корзина, избранное)

## Корзина и заказы
- Добавление товаров в корзину из карточки товара
- Изменение количества (+/−) в личном кабинете
- Удаление товаров из корзины
- Подсчёт итоговой суммы
- Отправка заявки на расчёт в Telegram (сообщение со списком товаров, ценами, итого)
- Форма с именем и телефоном перед отправкой

## Пользователи
- Регистрация и вход (localStorage)
- Личный кабинет с профилем
- Список заказов со статусами
- Избранное (добавление/удаление)
- Корзина (привязана к пользователю)

## Админ-панель (CMS)
- **Товары**: добавление, редактирование, удаление, поиск, фильтр по категориям
- **Загрузка фото**: главное фото + доп. фото, сжатие изображений, drag-and-drop
- **Главная страница**: редактирование hero-секции, популярных товаров
- **О нас**: текст, статистика, команда с фото
- **Доставка**: способы доставки, оплаты, FAQ
- **Отзывы**: добавление/редактирование отзывов
- **Контакты**: телефон, email, адрес, мессенджеры
- **Настройки**: Telegram бот (токен + Chat ID), WhatsApp номер, футер
- **Экспорт/импорт**: всех данных в JSON, сброс

## Уведомления
- Telegram бот — заявки с формы, обратный звонок, заказы, корзина
- WhatsApp — кнопка для быстрой связи
- Toast-уведомления в интерфейсе

## SEO
- JSON-LD microdata (FurnitureStore, CollectionPage, FAQPage, BreadcrumbList)
- Open Graph и Twitter Cards на всех страницах
- Canonical URLs
- Meta descriptions и keywords
- Хлебные крошки с Schema.org
- robots.txt (запрет на admin/login/register/profile)
- sitemap.xml

## Мобильная адаптация
- viewport-fit=cover для iPhone X+
- Safe area insets для нижней навигации
- 3 брейкпоинта: 1024px, 768px, 380px
- Touch-targets 44-48px
- Шрифт 16px для полей ввода (без зума iOS)
- Нижняя навигация (Главная, Каталог, Связь, О нас)
- Бургер-меню для основной навигации

## PWA
- manifest.json (установка на рабочий стол)
- Service Worker (cache-first для статики, stale-while-revalidate для CDN)
- Apple iOS мета-теги

## Производительность
- build.js — минификация CSS (-24%), JS (-32%), HTML (-13%)
- package.json с командами build/serve
- dist/ папка с оптимизированными файлами

## Аналитика
- Яндекс.Метрика (clickmap, trackLinks, webvisor)
- 8 целей: phone_call, messenger_click, form_submit, callback_request, product_order, product_view, catalog_sort, catalog_filter

## Конкурентные фичи
- Недавно просмотренные товары (карусель на главной)
- Сравнение товаров (до 4, таблица сравнения)

## Безопасность
- XSS-защита через escapeHtml() во всех innerHTML
- noindex на админ/авторизацию
- Service Worker кэширование

## Дизайн
- Тёмная тема с фиолетовым акцентом (#8b6faf)
- Glassmorphism карточки
- Анимации появления (IntersectionObserver)
- Hover-эффекты на карточках
- Кастомный скроллбар
- prefers-reduced-motion для accessibility

---

## История изменений

### 2026-06-23 — Оптимизация и исправление багов
- **Исправлен backtick баг** во всех 7 HTML файлах (`` `n `` перед `<script src="js/chat.js">`)
- **Service Worker**: добавлены `chat.js` и `analytics.js` в `STATIC_ASSETS`, кэш v3→v4
- **Убрано дублирование FAQ**: обработчики из `site-render.js` удалены (уже есть в `main.js:initFaq`)
- **Inline-стили → CSS-классы**: `catalog-rating`, `catalog-card-image-placeholder`, `comparison-table`, `team-card`, `site-rendered-img`, `header-user-btn`
- **Удалена `initSeamlessBg`**: canvas+dataURL не нужны для radial-gradient фонов
- **MutationObserver**: сужен scope с `document.body` на `.catalog-grid, .reviews-grid, .advantages-grid`
- **build.js**: JS минификатор заменён на безопасный (только комментарии + trailing whitespace)
