# План улучшений ТТмебель

**Дата:** 2026-06-23
**Статус:** ✅ Выполнено

---

## P0 — Критические баги

| # | Задача | Файл | Статус |
|---|--------|------|--------|
| T1 | Backtick перед `<script src="js/chat.js">` ломает парсинг | Все 7 HTML | ✅ |
| T2 | Service Worker: добавлены chat.js/analytics.js в кэш | `sw.js` | ✅ |
| T3 | Дублирование `initFaq` — убрано из site-render.js | `site-render.js` | ✅ |

## P1 — Качество кода

| # | Задача | Файл | Статус |
|---|--------|------|--------|
| T4 | Inline-стили → CSS-классы | `catalog.js`, `site-render.js`, `main.js`, `style.css` | ✅ |
| T5 | Удалена `initSeamlessBg` — не нужна для radial-gradient | `main.js` | ✅ |

## P2 — Производительность

| # | Задача | Файл | Статус |
|---|--------|------|--------|
| T6 | MutationObserver: сужен scope | `main.js` | ✅ |
| T7 | build.js: безопасный JS минификатор | `build.js` | ✅ |

## P3 — Документация

| # | Задача | Статус |
|---|--------|--------|
| T8 | FUNCTIONALITY.md + ROADMAP.md обновлены | ✅ |

---

## Известные ограничения (без backend не исправить)

- **Telegram-токен в клиентском коде** — любой видит в DevTools. Нужен серверный прокси
- **Админ-панель** — авторизация через localStorage. Любой может `localStorage.setItem('ttmebel_admin','true')`
- **Yandex.Metrika ID = 0** — заглушка, нужен реальный счётчик
- **Пароли хранятся как base64** в localStorage — inherent to static-site архитектуре
