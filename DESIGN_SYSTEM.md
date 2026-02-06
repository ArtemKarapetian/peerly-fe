# Peerly Design System

Современная минималистичная дизайн-система для платформы взаимного рецензирования Peerly.

## Design Tokens

### Border Radius
```css
--radius-sm: 8px    /* Small elements: chips, tags */
--radius-md: 12px   /* Medium: buttons, inputs */
--radius-lg: 16px   /* Large: cards, tables */
--radius-xl: 20px   /* Extra large: modals, panels */
```

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)     /* Subtle elevation */
--shadow-md: 0 2px 8px 0 rgb(0 0 0 / 0.06)     /* Medium elevation */
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.08) /* High elevation */
```

### Spacing (8pt grid)
```css
--spacing-1: 8px
--spacing-2: 16px
--spacing-3: 24px
--spacing-4: 32px
--spacing-5: 40px
--spacing-6: 48px
```

### Colors

#### Brand
```css
--brand-primary: #5b8def        /* Primary blue */
--brand-primary-hover: #4a7de0  /* Hover state */
--brand-primary-light: #a0c4f5  /* Light variant */
--brand-primary-lighter: #d2e1f8 /* Very light background */
--brand-dark: #21214f           /* Dark brand color */
```

#### Surfaces
```css
--surface: #ffffff              /* Cards, panels */
--surface-hover: #f9fafb        /* Hover states */
--surface-border: #e5e7eb       /* Borders */
```

#### Text
```css
--text-primary: #1f2937         /* Primary text */
--text-secondary: #6b7280       /* Secondary text */
--text-tertiary: #9ca3af        /* Tertiary text */
```

#### Status
```css
--success: #10b981
--warning: #f59e0b
--error: #ef4444
--info: #3b82f6
```

## Typography

### Type Scale
```css
--text-xs: 12px     /* Captions, labels */
--text-sm: 14px     /* Small text */
--text-base: 16px   /* Body text */
--text-lg: 18px     /* Card titles */
--text-xl: 20px     /* Section titles */
--text-2xl: 24px    /* Page titles */
```

### Font Weights
```css
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
```

### Usage
- **Page Title**: 24px (--text-2xl), Semibold (600)
- **Section Title**: 20px (--text-xl), Semibold (600)
- **Card Title**: 18px (--text-lg), Medium (500)
- **Body**: 16px (--text-base), Normal (400)
- **Caption**: 12px (--text-xs), Medium (500)

## Components

### Card
Основной контейнер для группировки контента.

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

**Specs:**
- Border radius: 16px (--radius-lg)
- Border: 1px solid --surface-border
- Shadow: --shadow-sm
- Padding: 24px (--spacing-3)
- Hover: Adds --shadow-md

### Badge
Маленькие индикаторы статуса или категорий.

```tsx
import { Badge } from '@/app/components/ui';

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
```

**Variants:**
- `success`: Green background
- `warning`: Yellow background
- `error`: Red background
- `info`: Blue background
- `neutral`: Gray background
- `primary`: Brand blue background

**Specs:**
- Border radius: 12px (--radius-md)
- Padding: 4px 12px
- Font size: 12px (--text-xs)
- Font weight: 500 (Medium)

### Button
Стандартные кнопки действий.

```tsx
import { Button } from '@/app/components/ui';

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
```

**Variants:**
- `primary`: Brand blue background, white text
- `secondary`: White background, border, dark text
- `ghost`: Transparent background
- `danger`: Red background, white text

**Sizes:**
- `sm`: Small (12px radius, 6px/12px padding)
- `md`: Medium (12px radius, 10px/16px padding)
- `lg`: Large (16px radius, 12px/24px padding)

### Input
Текстовые поля ввода.

```tsx
import { Input } from '@/app/components/ui';

<Input 
  label="Email"
  placeholder="Enter email"
  error="Invalid email"
/>
```

**Specs:**
- Border radius: 12px (--radius-md)
- Border: 1px solid --surface-border
- Padding: 10px 16px
- Focus: 2px ring --brand-primary/30

### Table
Унифицированные таблицы данных.

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/app/components/ui';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead align="center">Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow hover>
      <TableCell>John</TableCell>
      <TableCell align="center">Active</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**Specs:**
- Container: 16px border radius, border
- Header: --surface-hover background
- Rows: Border bottom, hover effect
- Padding: 24px horizontal, 16px vertical

### Modal
Модальные окна для диалогов и форм.

```tsx
import { Modal, ModalFooter } from '@/app/components/ui';

<Modal 
  isOpen={isOpen} 
  onClose={handleClose}
  title="Modal Title"
  size="md"
>
  <p>Modal content</p>
  <ModalFooter>
    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
    <Button variant="primary" onClick={handleSubmit}>Submit</Button>
  </ModalFooter>
</Modal>
```

**Sizes:**
- `sm`: max-width 448px
- `md`: max-width 512px
- `lg`: max-width 672px
- `xl`: max-width 896px

**Specs:**
- Border radius: 20px (--radius-xl)
- Backdrop: Black 50% opacity with blur
- Shadow: --shadow-lg

## Principles

### 1. Modern Minimal
- Prefer white/neutral backgrounds over colored blocks
- Use subtle accent colors (15% opacity of brand colors)
- Avoid saturated, "bootstrap-like" backgrounds

### 2. Consistent Rounded Corners
- All interactive elements have rounded corners
- Cards: 16px
- Buttons/Inputs: 12px
- Badges: 12px
- Modals: 20px
- NO square tiles or sharp corners

### 3. Subtle Elevation
- Use shadows sparingly, only for elevated elements
- Default cards: --shadow-sm
- Hover cards: --shadow-md
- Modals: --shadow-lg

### 4. 8pt Grid System
- All spacing should be multiples of 8px
- Avoid random paddings like 13px or 27px
- Use spacing tokens: 8/16/24/32/40/48

### 5. Typography Hierarchy
- Clear distinction between page/section/card titles
- Consistent font sizes across all pages
- Proper letter-spacing for readability (especially breadcrumbs)

## Dark Mode

The design system includes full dark mode support:

```css
.dark {
  --background: #0f172a;
  --surface: #1e293b;
  --surface-hover: #334155;
  --text-primary: #f1f5f9;
  /* ... etc */
}
```

All components automatically adapt to dark mode when the `.dark` class is applied to the root element.

## Usage Guidelines

### DO ✅
- Use design tokens from theme.css
- Apply consistent border radius to all components
- Use subtle shadows for elevation
- Follow 8pt grid for spacing
- Use Badge components for status indicators
- Prefer Card component over custom divs

### DON'T ❌
- Use inline colors (use CSS variables)
- Create square corners (border-radius: 0)
- Use bright, saturated background colors
- Add heavy shadows everywhere
- Use random spacing values
- Mix design systems (e.g., Bootstrap + custom)

## Migration Guide

When updating existing components:

1. **Replace colored backgrounds** with neutral surfaces:
   ```tsx
   // Before
   <div className="bg-[#e3f2fd]">
   
   // After
   <div className="bg-[--surface]" style={{ backgroundColor: `${color}15` }}>
   ```

2. **Update border radius**:
   ```tsx
   // Before
   <div className="rounded-[12px]">
   
   // After
   <div className="rounded-[--radius-lg]">
   ```

3. **Use design tokens**:
   ```tsx
   // Before
   <div className="text-[#767692]">
   
   // After
   <div className="text-[--text-secondary]">
   ```

4. **Replace custom components** with UI library:
   ```tsx
   // Before
   <div className="px-2 py-1 bg-green-100 text-green-800 rounded">Active</div>
   
   // After
   <Badge variant="success">Active</Badge>
   ```
