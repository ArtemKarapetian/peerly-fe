# Документация разработки Peerly

> Консолидированная документация для разработчиков

## 🗺️ Навигация и роутинг

### Структура страниц

Приложение использует простой hash-based роутинг:

```
#/courses       → CoursesListPage (список всех курсов)
#/course/1      → CoursePage (детали курса, список заданий)
#/task/1        → TaskPage (детальная страница задания 1)
```

### Компоненты навигации

**Router.tsx** - главный роутер приложения:

```tsx
// Автоматически определяет текущий маршрут из window.location.hash
// Переключается между CoursesListPage, CoursePage и TaskPage
```

**Breadcrumbs** - навигационные хлебные крошки:

```tsx
<Breadcrumbs
  items={["Курсы", "Название курса", "Задания", "Задание 1"]}
  onItemClick={(index) => {
    if (index === 0) {
      window.location.hash = "/courses";
    } else if (index === 1 || index === 2) {
      window.location.hash = "/course/1";
    }
  }}
/>
```

**CourseCard** - клик открывает страницу курса:

```tsx
<CourseCard
  id="1"
  title="Название курса"
  teacher="Преподаватель"
  coverColor="#f2b2d6"
  onClick={() => (window.location.hash = "/course/1")}
/>
```

**TaskListItem** - клик открывает страницу задания:

```tsx
<TaskListItem
  title="Задание 1"
  deadline="Дедлайн: 31 января"
  status="SUBMITTED"
  onClick={() => (window.location.hash = "/task/1")}
/>
```

### Добавление новых страниц

1. Создайте компонент страницы в `/src/app/`
2. Добавьте маршрут в `Router.tsx`:

```tsx
if (hash.startsWith("/new-page/")) {
  setCurrentRoute("new-page");
}
```

3. Добавьте обработчик в switch:

```tsx
case 'new-page':
  return <NewPage />;
```

## 📐 Архитектура Layout

### Структура AppShell

```
AppShell (flex horizontal)
├── SideNav (260px/80px/hidden)
│   ├── Header - Логотип + toggle
│   ├── Navigation - Меню
│   └── Profile - Профиль (внизу)
└── ContentArea (flex-1)
    ├── TopBar (mobile only)
    └── Main Content
        └── Container (max-w-[1280px])
```

### Брейкпоинты

| Брейкпоинт  | Диапазон   | Sidebar        | Layout колонок        | Sticky   | Gutters |
| ----------- | ---------- | -------------- | --------------------- | -------- | ------- |
| **Desktop** | ≥1100px    | 260px expanded | 2 колонки (2fr + 1fr) | Active   | 32px    |
| **Mid**     | 900-1099px | 80px collapsed | 2 колонки (плотнее)   | Active   | 24px    |
| **Tablet**  | 800-899px  | 80px collapsed | 1 колонка             | Disabled | 24px    |
| **Mobile**  | <800px     | Drawer (скрыт) | 1 колонка             | Disabled | 16px    |

**Tailwind брейкпоинты в theme.css:**

```css
@breakpoint mobile (width >= 0px);
@breakpoint tablet (width >= 800px);
@breakpoint mid (width >= 900px);
@breakpoint desktop (width >= 1100px);
```

### Адаптивное поведение

- **Desktop (≥1100px)**: Полный expanded sidebar (260px), двухколоночный контент с sticky StatusCard
- **Mid (900-1099px)**: Collapsed sidebar (80px), двухколоночный контент с sticky StatusCard, меньший gap
- **Tablet (800-899px)**: Collapsed sidebar (80px), одноколоночный layout, StatusCard сверху
- **Mobile (<800px)**: TopBar + Drawer, одна колонка, StatusCard сверху

### Двухколоночный layout

```tsx
<div className="grid grid-cols-1 mid:grid-cols-[2fr,1fr] gap-4 mid:gap-6 desktop:gap-8">
  {/* Левая колонка: основной контент */}
  <div className="w-full min-w-0 space-y-4 desktop:space-y-6">
    <TaskDescription />
    <TaskRequirements />
    <TaskMaterials />
    {/* Комментарии только на узких экранах */}
    <div className="mid:hidden">
      <TaskQuestionsComments />
    </div>
  </div>

  {/* Правая колонка: sidebar */}
  <div className="w-full min-w-0 space-y-4 desktop:space-y-6">
    {/* Sticky карточка на mid+ (≥900px) */}
    <div className="mid:sticky mid:top-6">
      <StatusCard />
    </div>
    {/* Комментарии только на широких экранах */}
    <div className="hidden mid:block">
      <TaskQuestionsComments />
    </div>
  </div>
</div>
```

## 🎯 Ключевые принципы

### 1. Правильные constraints для Flexbox

```tsx
// ❌ Неправильно - приводит к overflow
<div className="flex">
  <div className="w-[260px]">Sidebar</div>
  <div className="flex-1">Content</div>
</div>

// ✅ Правильно - работает корректно
<div className="flex">
  <div className="shrink-0 w-[260px]">Sidebar</div>
  <div className="flex-1 min-w-0">Content</div>
</div>
```

**Почему `min-w-0` важен**:

- По умолчанию flex-items имеют `min-width: auto`
- Это предотвращает уменьшение элемента меньше его контента
- `min-w-0` позволяет элементу сжиматься и включает text wrapping

### 2. Container max-width с gutters

```tsx
// В AppShell
<div className="flex-1 min-w-0 flex flex-col">
  <main className="flex-1 overflow-y-auto">
    <div className="max-w-[1280px] w-full mx-auto px-4 tablet:px-6 desktop:px-8 py-6 desktop:py-8">
      {children}
    </div>
  </main>
</div>
```

**Gutters**:

- Mobile: 16px
- Tablet: 24px
- Desktop: 32px

### 3. Sticky positioning

```tsx
// Sticky карточка (только Desktop)
<div className="desktop:sticky desktop:top-6">
  <StatusCard />
</div>
```

**Правила**:

- Родитель НЕ должен иметь `overflow: hidden`
- Родитель должен иметь достаточную высоту
- На mobile отключаем sticky

## 🧩 Компоненты

### AppShell

Главный layout wrapper всего приложения

**Props**:

```tsx
interface AppShellProps {
  children: React.ReactNode;
  title?: string; // для document.title
}
```

**Состояния**:

- `sidebarMode`: 'fixed' | 'collapsed' | 'hidden'
- `drawerOpen`: boolean (для mobile)

### SideNav

Боковая навигация с 4 вариантами отображения

**Варианты**:

1. **Desktop Fixed** (≥1200px): 260px, всегда виден
2. **Desktop Collapsed** (≥1200px): 80px, можно развернуть
3. **Tablet Collapsed** (800-1199px): 80px, раскрывается overlay
4. **Mobile Drawer** (<800px): скрыт, открывается drawer

### TopBar

Мобильная верхняя панель

**Отображается**: только на <1200px

**Содержит**:

- Hamburger menu (открывает drawer)
- Заголовок страницы
- Иконки действий (опционально)

### StatusCard

Карточка статуса задания с 7 состояниями

**Статусы**:

- `NOT_STARTED` - Не начато
- `SUBMITTED` - Сдана работа
- `PEER_REVIEW` - Взаимная проверка
- `TEACHER_REVIEW` - Проверка преподавателем
- `GRADING` - Выставление оценок
- `GRADED` - Оценки выставлены
- `OVERDUE` - Просрочено

## 🎨 Стилизация

### Цветовая схема

```css
/* Из Figma дизайна */
--color-primary: #21214f; /* Темно-синий */
--color-secondary: #4b4963; /* Серый */
--color-text-light: #767692; /* Светло-серый текст */
--color-border: #c7c7c7; /* Границы */
--color-background: #f9f9f9; /* Светлый фон */

/* Акцентные цвета */
--color-accent-blue: #b7bdff; /* Светло-голубой */
--color-accent-cyan: #b0e9fb; /* Голубой */
--color-accent-green: #9cf38d; /* Зеленый */
--color-accent-red: #ffb8b8; /* Красный */
```

### 8pt Grid система

```css
/* Все отступы кратны 8px */
gap-2     /* 8px */
gap-3     /* 12px */
gap-4     /* 16px */
gap-6     /* 24px */
gap-8     /* 32px */
```

### Радиусы скругления

```css
rounded-[8px]   /* Мелкие элементы */
rounded-[12px]  /* Карточки, кнопки */
rounded-[16px]  /* Крупные секции */
```

## 🧪 Тестирование

### Чеклист Desktop (≥1200px)

- [ ] Sidebar фиксированный 260px
- [ ] Контент справа от sidebar
- [ ] Две колонки для task page (2fr + 1fr)
- [ ] StatusCard sticky при скролле
- [ ] Нет горизонтального скролла
- [ ] Max-width контейнер с gutters

### Чеклист Tablet (800-1199px)

- [ ] Sidebar collapsed 80px
- [ ] Hover раскрывает sidebar overlay
- [ ] Контент адаптируется
- [ ] Две колонки (если применимо)

### Чеклист Mobile (<800px)

- [ ] Sidebar полностью скрыт
- [ ] TopBar виден вверху
- [ ] Hamburger открывает drawer
- [ ] Одна колонка layout
- [ ] StatusCard внизу контента (не sticky)

### Проверка конкретных размеров

```
Desktop:
✓ 1920px (Full HD)
✓ 1440px (MacBook Pro)
✓ 1366px (Laptop)
✓ 1280px (минимальный Desktop)
✓ 1200px (брейкпоинт)

Tablet:
✓ 1024px (iPad Pro)
✓ 834px (iPad)
✓ 800px (брейкпоинт)

Mobile:
✓ 768px (большие телефоны)
✓ 414px (iPhone Pro Max)
✓ 390px (iPhone 12/13/14)
✓ 375px (iPhone SE)
✓ 360px (Android)
```

## 🐛 Типичные проблемы и решения

### Проблема: Горизонтальный скролл

**Причина**: Flex-элементы без `min-w-0`

**Решение**:

```tsx
<div className="flex-1 min-w-0"> {/* добавьте min-w-0 */}
```

### Проблема: Sidebar перекрывает контент

**Причина**: Отсутствует `shrink-0` на sidebar

**Решение**:

```tsx
<SideNav className="shrink-0" />
```

### Проблема: Sticky не работает

**Причины**:

1. Родитель имеет `overflow: hidden/auto`
2. Нет достаточной высоты для scroll
3. Неправильный брейкпоинт

**Решение**:

```tsx
// Проверьте родителя
<main className="flex-1 overflow-y-auto"> {/* НЕ overflow-hidden */}

// Sticky только на desktop
<div className="desktop:sticky desktop:top-6">
```

### Проблема: Layout не меняется на мобильном

**Причина**: Использование обычных классов вместо responsive

**Решение**:

```tsx
// ❌ Неправильно
<div className="grid-cols-2">

// ✅ Правильно
<div className="grid-cols-1 desktop:grid-cols-2">
```

## 📦 Структура файлов

```
src/
├── app/
│   ├── App.tsx                          # Главная страница
│   └── components/
│       ├── AppShell.tsx                 # Главный layout
│       ├── SideNav.tsx                  # Боковая навигация
│       ├── TopBar.tsx                   # Мобильная панель
│       ├── Breadcrumbs.tsx              # Хлебные крошки
│       ├── TaskHeader.tsx               # Заголовок задания
│       ├── TaskDescription.tsx          # Описание
│       ├── TaskRequirements.tsx         # Требования
│       ├── TaskMaterials.tsx            # Материалы
│       ├── TaskQuestionsComments.tsx    # Комментарии
│       ├── StatusCard.tsx               # Статус и действия
│       ├── LayoutDebugger.tsx           # Отладчик (dev only)
│       └── ui/                          # UI компоненты
└── styles/
    ├── index.css                        # Главный CSS
    ├── tailwind.css                     # Tailwind imports
    ├── theme.css                        # Брейкпоинты и токены
    └── fonts.css                        # Work Sans font
```

## 🚀 Команды разработки

```bash
# Установка
npm install

# Разработка
npm run dev

# Билд
npm run build

# Preview билда
npm run preview
```

## 🎯 Best Practices

### 1. Используйте готовые компоненты

```tsx
// ✅ Правильно
import { AppShell, StatusCard } from "@/app/components";

// ❌ Неправильно - создавать свои варианты
```

### 2. Следуйте responsive паттернам

```tsx
// ✅ Правильно - mobile-first
className = "p-4 tablet:p-6 desktop:p-8";

// ❌ Неправильно
className = "desktop:p-8 tablet:p-6 p-4";
```

### 3. Всегда тестируйте на 3 брейкпоинтах

- Desktop (1920px)
- Tablet (834px)
- Mobile (390px)

### 4. Используйте LayoutDebugger при разработке

```tsx
import { LayoutDebugger } from "@/app/components";

<AppShell>
  {/* контент */}
  <LayoutDebugger /> {/* показывает текущий брейкпоинт */}
</AppShell>;
```

## 📚 Дополнительные ресурсы

- **README.md** - Основная документация
- **guidelines/Guidelines.md** - Дизайн гайдлайны
- **package.json** - Зависимости проекта

---

**Версия**: 1.0  
**Дата**: 19 января 2026  
**Статус**: Production Ready
