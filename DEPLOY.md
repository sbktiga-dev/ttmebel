# Деплой сайта ttmebel.ru

## Структура

- **master** — исходники (css/, js/, html, build.js)
- **gh-pages** — копия master, из неё строится сайт на GitHub Pages
- **dist/** — минифицированные файлы (генерируются build.js)

## Последовательность деплоя

```bash
# 1. Внести изменения в исходники (css/style.css, js/main.js и т.д.)

# 2. Пересобрать dist
node build.js

# 3. Закоммитить все изменения
git add css/style.css js/main.js dist/css/style.css dist/js/main.js index.html catalog.html about.html delivery.html reviews.html contacts.html admin.html login.html register.html profile.html blog.html sw.js
git commit -m "Описание изменений"

# 4. Запушить master
git push origin master

# 5. Синхронизировать gh-pages с master (ЭТО ОБЯЗАТЕЛЬНО)
git push origin master:gh-pages --force
```

## Важно

- **gh-pages** — это ветка, из которой GitHub Pages собирает сайт. Файлы в корне этой ветки и есть то, что отдаёт ttmebel.ru.
- HTML-файлы ссылаются на `css/style.css` и `js/main.js` (не из dist). Поэтому корень gh-pages должен содержать исходные файлы css/ и js/.
- После `git push origin master:gh-pages --force` GitHub Pages автоматически пересобирает сайт (обычно за 30-60 секунд).
- Если на сайте не отображаются изменения — подождите 1-2 минуты, GitHub Pages кэширует.

## Если что-то пошло не так

- Сайт вернул 404 — скорее всего потерялся CNAME файл. Проверьте: `git show gh-pages:CNAME` должен показать `ttmebel.ru`
- Стили сломаны — убедитесь, что `css/style.css` полный (4000+ строк), а не урезанный
- Декорации/старый фон на месте — gh-pages не обновился. Проверьте `git log origin/gh-pages --oneline -3`
