# Peerly Frontend

Клиентская часть системы взаимного рецензирования Peerly. React 18, TypeScript, Vite, Tailwind CSS v4.

## Запуск

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
npm run typecheck   # проверка типов
npm run lint        # линтинг
```

## Архитектура

Проект построен по Feature-Sliced Design:

```
src/
  app/        — маршрутизация, провайдеры, AppShell
  pages/      — страницы (student/, teacher/, admin/, public/, shared/)
  widgets/    — составные UI-блоки (навигация, дашборд-виджеты)
  features/   — доменная логика (assignment, auth, course, review, appeal)
  entities/   — модели данных (user, course, assignment, review, appeal)
  shared/     — api, config, ui-компоненты, утилиты, стили
```

Зависимости строго направлены: app > pages > widgets > features > entities > shared. ESLint проверяет это автоматически.

## Роутинг

Hash-based роутер (`#/path`). Маршруты определены в `shared/config/routes.ts`, guards в `app/routing/`. Три ролевые зоны: Student (`/courses`, `/reviews`, ...), Teacher (`/teacher/...`), Admin (`/admin/...`).

## Layout

Три брейкпоинта:

| Режим   | Ширина     | Sidebar         |
| ------- | ---------- | --------------- |
| Desktop | >= 1200px  | Expanded, 240px |
| Tablet  | 800-1199px | Collapsed, 72px |
| Mobile  | < 800px    | Drawer          |

Контент ограничен 1200px с центрированием. Все страницы обёрнуты в `AppShell`.

## Feature Flags

Система флагов с localStorage-персистенцией (`shared/lib/feature-flags.ts`). Управление через админ-панель (`/admin/flags`). Флаги контролируют видимость enterprise-фич (плагины, интеграции, аналитика и др.) в навигации и роутере.

## Стек

- React 18, TypeScript
- Vite (сборка)
- Tailwind CSS v4 (стилизация)
- Lucide React (иконки)
- Prettier + ESLint (форматирование и линтинг)
