# Peerly - Система Взаимного Рецензирования

Приложение для peer-review с responsive-дизайном и управлением заданиями.

## 📄 Страницы

### 0. Landing - Главная страница (`#/` или без хеша)

- Hero-секция с заголовком "Peer-review без хаоса" и иллюстрацией
- Описание сервиса и преимуществ
- Три основных feature-блока (платформа, снижение нагрузки, гибкость)
- Деление на роли (студенты, преподаватели, администратор)
- CTA-секция и footer
- **Публичная страница**: без sidebar, только навигация сверху

### 0.1. Login - Вход в аккаунт (`#/login`)

- Форма входа с полями логин/пароль
- Кнопка "Вход"
- Ссылка на регистрацию
- **Публичная страница**: без sidebar, только навигация сверху

### 0.2. Register - Регистрация (`#/register`)

- Форма регистрации с полями логин/пароль/повтор пароля
- Кнопка "Зарегистрироваться"
- Ссылка на вход
- **Публичная страница**: без sidebar, только навигация сверху

### 1. Курсы - Список всех курсов (`#/courses`)

- Заголовок "Курсы"
- Адаптивная grid-сетка карточек (class: `.courses-grid`):
  - **Desktop (≥1200px)**: 3 колонки, gap 24px, max-width 1200px
  - **Tablet (800-1199px)**: 2 колонки, gap 20px, max-width 960px
  - **Mobile (<800px)**: 1 колонка, gap 16px
- Каждая карточка (~280-360px):
  - Цветной баннер/обложка (120px)
  - Название курса (1-2 строки с обрезкой, semibold, 15px)
  - Преподаватель (вторичный текст, 13px)
  - Меню иконка в кружке (появляется при hover)
- Мягкий стиль:
  - Скругления 20px
  - Тонкая рамка 1px #e6e8ee
  - Мягкая тень с hover эффектом

### 2. Курс - Список заданий (`#/course/:id`)

- Header курса с названием и преподавателем
- Tabs: "Задания (5)" / "Участники (24)" - классический underline стиль
- **Вкладка "Задания"**:
  - Поиск заданий
  - Фильтры: "Все / Истекает срок сдачи / Завершенные"
  - Список заданий с дедлайнами и цветными статусами
- **Вкладка "Участники"**:
  - Поиск участников по ФИО
  - Список участников:
    - Аватар с инициалами (40px, цветной круг)
    - ФИО (semibold, 15px)
    - Роль (Студент/Преподаватель/Ассистент)
    - Статус (Активен/Неактивен, скрыт на mobile)
    - Меню иконка при hover
  - Чистые строки с разделителями

### 3. Задание - Детальная страница (`#/task/:id`)

- Breadcrumbs для навигации: `Курсы → Название курса → Задание 1`
- Header задания с метаданными
- Двухколоночный layout (Desktop ≥1200px):
  - **Левая колонка (2fr)**: Описание, Требования, Материалы
  - **Правая колонка (1fr)**: Статус (sticky), Комментарии
  - Gap: 32px между колонками
- Responsive:
  - **Desktop (≥1200px)**: 2 колонки, StatusCard sticky справа
  - **Tablet/Mobile (<1200px)**: 1 колонка, StatusCard вверху

## 🎯 Layout System v1.1

Проект использует современную адаптивную архитектуру с тремя брейкпоинтами:

| Брейкпоинт  | Диапазон   | Sidebar        | Layout колонок        |
| ----------- | ---------- | -------------- | --------------------- |
| **Desktop** | ≥1200px    | Expanded 260px | 2 колонки (2fr + 1fr) |
| **Tablet**  | 800-1199px | Collapsed 80px | 1 колонка             |
| **Mobile**  | <800px     | Drawer         | 1 колонка             |

## 🚀 Быстрый старт

### Базовое использование

```tsx
import { AppShell } from "@/app/components";

export default function Page() {
  return (
    <AppShell title="Название страницы">
      <h1>Ваш контент</h1>
    </AppShell>
  );
}
```

### Двухколоночный layout

```tsx
<AppShell title="Задание">
  <div className="grid grid-cols-1 desktop:grid-cols-[2fr,1fr] gap-6 desktop:gap-8">
    <div className="w-full min-w-0">{/* Основной контент */}</div>
    <div className="w-full min-w-0">{/* Боковая панель */}</div>
  </div>
</AppShell>
```

## 📚 Документация

Подробная документация для разработчиков доступна в **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)**

- Архитектура layout системы
- Руководство по компонентам
- Тестирование и отладка
- Решение типичных проблем

## 🏗️ Архитектура

```
AppShell (flex horizontal)
├── SideNav (260px fixed)
│   ├── Header (64px fixed) - Логотип + toggle
│   ├── Navigation (flex-1) - Меню
│   └── Profile (72px fixed) - Профиль (внизу)
└── ContentArea (fill)
    ├── TopBar (mobile only)
    └── Main Content (max-w-1280px)
```

**Фиксированные высоты в SideNav**:

- Header: 64px (логотип + toggle)
- Profile: 72px (профиль внизу)
- Navigation: flex-1 (заполняет пространство)
- Разделители остаются на одной высоте при переключении expanded/collapsed

## 🎨 Компоненты

### Layout компоненты

- **AppShell** - Главный каркас приложения
- **SideNav** - Навигация с 4 вариантами
- **TopBar** - Мобильная верхняя панель

### Task компоненты

- **Breadcrumbs** - Хлебные крошки
- **TaskHeader** - Заголовок задания
- **TaskDescription** - Описание
- **TaskMaterials** - Материалы
- **TaskCriteria** - Критерии оценки
- **TaskComments** - Комментарии
- **StatusCard** - Статус и действия

### Вспомогательные

- **LayoutDebugger** - Отладчик layout (для разработки)

## 📦 Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Билд для продакшена
npm run build
```

## 🎯 Ключевые принципы

### 1. Desktop ≠ Mobile

- ✅ Фиксированный sidebar всегда виден на Desktop
- ✅ НЕТ hamburger как основная навигация на Desktop
- ✅ Двухколоночный layout для оптимального использования пространства

### 2. Правильные Constraints

```tsx
// SideNav
className = "shrink-0 w-[260px]";

// ContentArea
className = "flex-1 min-w-0";

// Container
className = "max-w-[1280px] mx-auto";
```

### 3. Mobile-first подход

```tsx
// Базовые стили для mobile
className = "p-4";

// Tablet и выше
className = "p-4 tablet:p-6";

// Desktop
className = "p-4 tablet:p-6 desktop:p-8";
```

## 🧪 Тестирование

### Включить отладчик

```tsx
import { LayoutDebugger } from "@/app/components";

<AppShell>
  {/* контент */}
  <LayoutDebugger />
</AppShell>;
```

### Проверка брейкпоинтов

1. Откройте приложение
2. Измените размер окна
3. Проверьте:
   - Desktop (≥1200px): Sidebar виден, 2 колонки
   - Tablet (800-1199px): Sidebar 80px, можно развернуть
   - Mobile (<800px): TopBar + Drawer, 1 колонка

## 📱 Поддерживаемые устройства

- ✅ Desktop (1920px, 1440px, 1366px)
- ✅ Laptop (1280px, 1024px)
- ✅ Tablet (768px, 834px, 1024px)
- ✅ Mobile (360px, 375px, 390px, 414px)

## 🔧 Технологии

- **React** - UI библиотека
- **TypeScript** - Типизация
- **Tailwind CSS v4** - Стилизация
- **Vite** - Сборщик
- **Lucide React** - Иконки

## 📖 Брейкпоинты

Определены в `src/styles/theme.css`:

```css
@breakpoint tablet (width >= 800px);
@breakpoint desktop (width >= 1200px);
```

Использование:

```tsx
className = "text-[14px] tablet:text-[15px] desktop:text-[16px]";
className = "grid-cols-1 desktop:grid-cols-2";
className = "hidden desktop:block";
```

## 🎨 Цветовая схема

```css
/* Основные цвета */
--primary: #21214f /* Темно-синий */ --secondary: #4b4963 /* Серый */ --accent-blue: #b7bdff
  /* Светло-голубой */ --accent-cyan: #b0e9fb /* Голубой */ --success: #9cf38d /* Зеленый */
  --error: #ffb8b8 /* Красный */ --border: #c7c7c7 /* Серая граница */ --background: #f9f9f9
  /* Светлый фон */;
```

## ♿ Доступность

- ✅ Keyboard navigation
- ✅ ARIA labels на кнопках
- ✅ Focus states
- ✅ Escape закрывает drawer
- ✅ Логичный tab order

## 🚀 Производительность

- ✅ Нет layout shifts
- ✅ Плавные transitions (300ms)
- ✅ Эффективный рендеринг
- ✅ Правильный cleanup listeners

## 🐛 Troubleshooting

### Sidebar не раскрывается

```tsx
// Убедитесь что есть shrink-0 и min-w-0
<SideNav className="shrink-0" />
<div className="flex-1 min-w-0">
```

### Desktop выглядит как Mobile

```tsx
// Проверьте брейкпоинты
className = "desktop:grid-cols-2"; // не cols-2
```

### Горизонтальный скролл

```tsx
// Добавьте min-w-0 к flex/grid элементам
<div className="w-full min-w-0">
```

## 📞 Поддержка

Если у вас вопросы, смотрите подробную документацию в **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)**

## 🎯 Roadmap

Планируемые улучшения:

- [ ] Dark mode
- [ ] Дополнительные варианты TopBar
- [ ] Больше примеров компонентов
- [ ] Сохранение состояния sidebar в localStorage
- [ ] Анимации переходов между страницами

## 📄 Лицензия

См. файл LICENSE в корне проекта.

## 👥 Команда

**Layout System**: v1.0 - Январь 2026

---

## 🎉 Начните прямо сейчас!

```bash
npm run dev
```

Откройте браузер на `http://localhost:5173` и измените размер окна для проверки адаптивности!

---

**Версия**: 1.0.0  
**Последнее обновление**: 19 января 2026  
**Статус**: ✅ Production Ready
