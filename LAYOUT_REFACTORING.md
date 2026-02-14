# Layout Refactoring Summary

## Overview

Complete refactoring of Peerly's layout foundations while preserving visual identity (colors, typography, existing design tokens).

---

## Key Changes

### 1. **Global Content Container**

- **Unified max-width**: `1200px` across all breakpoints
- **Centered**: `margin: auto`
- **Responsive gutters**:
  - Desktop (≥1200px): `40px` (px-10)
  - Tablet (800-1199px): `24px` (px-6)
  - Mobile (<800px): `24px` (px-6)
- Content no longer stretches edge-to-edge on wide screens

**Location**: `/src/app/components/AppShell.tsx`

---

### 2. **Sidebar Improvements**

#### Fixed "Jumping Divider" Issue

- **Problem**: Divider above "Profile" jumped when sidebar expanded/collapsed
- **Solution**: Stable flex layout with footer section pinned to bottom
  - Header: `shrink-0` with fixed height (64px)
  - Navigation: `flex-1` fills available space
  - Footer section: `shrink-0` stays at bottom

#### Sidebar Widths

- **Desktop (≥1200px)**: 260px expanded, 80px collapsed (toggleable)
- **Tablet (800-1199px)**: 80px collapsed (icons only)
- **Mobile (<800px)**: Drawer overlay (280px, slides over content)

**Location**: `/src/app/components/SideNav.tsx`

---

### 3. **CSS Grid Layout with Right Rail**

#### Desktop Layout (≥1200px)

```css
grid-template-columns: 1fr minmax(360px, 420px);
gap: 2rem; /* 32px */
```

**Features**:

- Main content: `1fr` (flexible)
- Right rail: `360-420px` (fixed width)
- Right rail is **sticky** within viewport (`position: sticky; top: 1.5rem`)
- Use available width threshold (≥1200px) for right rail activation

#### Mobile/Tablet Layout (<1200px)

```css
grid-template-columns: 1fr;
gap: 1rem; /* 16px */
```

**Single column** with all content stacked vertically

**Location**: `/src/styles/task.css`

---

### 4. **Standardized Page Header Structure**

All pages now follow consistent pattern:

1. **Breadcrumbs row** (top)
   - Format: `Курсы → <Course Name> → <Task Name>`
   - **No redundant segments** (removed "Задания")
   - Clickable navigation back to parent pages

2. **H1 heading** (after breadcrumbs)
   - Page title with metadata

3. **Content** (tabs, grid, etc.)

**Examples**:

- TaskPage: `Курсы → Название курса → Задание 1`
- CoursePage: `Курсы → Название курса`
- CoursesListPage: No breadcrumbs (root page)

**Location**: All page components (`TaskPage.tsx`, `CoursePage.tsx`)

---

### 5. **Tabs Style**

✅ **Already using underline style** (no changes needed)

- Active tab: **bold text** + **bottom border** (2px)
- Inactive tab: normal weight, hover effect
- **No capsule/pill background**

**Location**: `/src/app/components/CourseTabs.tsx`

---

### 6. **Courses Grid**

Updated to 4 columns on desktop for optimal space usage:

- **Desktop (≥1200px)**: `repeat(4, 1fr)` — 4 columns, 24px gap
- **Tablet (800-1199px)**: `repeat(2, 1fr)` — 2 columns, 20px gap
- **Mobile (<800px)**: `1fr` — 1 column, 16px gap

**Location**: `/src/styles/courses.css`, `/src/app/CoursesListPage.tsx`

---

### 7. **Layout Debugger**

Updated to show new specifications:

- **Max-width**: 1200px (unified)
- **Gutters**: Desktop 40px, Tablet/Mobile 24px
- **Right Rail Width**: 360-420px (desktop only)
- **Grid Layout**: `1fr + minmax(360px, 420px)` or `1fr (single)`
- **Courses Grid**: 4 cols (desktop), 2 cols (tablet), 1 col (mobile)

**Location**: `/src/app/components/LayoutDebugger.tsx`

---

## Breakpoints Reference

```css
/* Mobile */
@media (max-width: 799px) {
}

/* Tablet */
@media (min-width: 800px) and (max-width: 1199px) {
}

/* Desktop */
@media (min-width: 1200px) {
}
```

**Tailwind Custom Breakpoints** (defined in theme.css):

- `tablet`: `width >= 800px`
- `desktop`: `width >= 1200px`

---

## Files Modified

### Core Layout

- `/src/app/components/AppShell.tsx` — Global container, gutters
- `/src/app/components/SideNav.tsx` — Fixed divider, stable footer
- `/src/styles/task.css` — Grid layout with right rail
- `/src/styles/courses.css` — 4-column grid

### Pages

- `/src/app/TaskPage.tsx` — Breadcrumbs, grid layout
- `/src/app/CoursePage.tsx` — Breadcrumbs, header structure
- `/src/app/CoursesListPage.tsx` — Updated grid comments

### Components

- `/src/app/components/Breadcrumbs.tsx` — No changes (already correct)
- `/src/app/components/CourseTabs.tsx` — No changes (already underline style)
- `/src/app/components/LayoutDebugger.tsx` — Updated metrics

---

## Testing Checklist

✅ Content max-width is 1200px on all screen sizes  
✅ Sidebar divider doesn't jump when expanding/collapsing  
✅ Right rail appears only on desktop (≥1200px)  
✅ Right rail is sticky on scroll  
✅ Breadcrumbs follow standardized pattern  
✅ Gutters are responsive (40px desktop, 24px tablet/mobile)  
✅ Courses grid shows 4 columns on desktop  
✅ All routes still work (no removals)  
✅ Colors and typography unchanged

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    DESKTOP (≥1200px)                │
├───────────┬─────────────────────────────────────────┤
│  SideNav  │           Content Container             │
│   260px   │         max-w-[1200px], px-10           │
│ expanded  │  ┌──────────────────┬────────────────┐  │
│           │  │ Main (1fr)       │ Rail (360-420) │  │
│           │  │                  │   (sticky)     │  │
│           │  └──────────────────┴────────────────┘  │
└───────────┴─────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                 TABLET (800-1199px)                 │
├────┬────────────────────────────────────────────────┤
│Side│           Content Container                    │
│80px│         max-w-[1200px], px-6                   │
│col.│  ┌──────────────────────────────────────────┐  │
│    │  │  Single Column (1fr)                     │  │
│    │  └──────────────────────────────────────────┘  │
└────┴────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   MOBILE (<800px)                   │
├─────────────────────────────────────────────────────┤
│ TopBar                                              │
├─────────────────────────────────────────────────────┤
│           Content Container                         │
│         max-w-[1200px], px-6                        │
│  ┌──────────────────────────────────────────────┐   │
│  │  Single Column (1fr)                         │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## Implementation Notes

1. **No visual identity changes** — Colors, typography, design tokens preserved
2. **All routes preserved** — No functionality removed
3. **Backward compatible** — Existing components work without modification
4. **Responsive-first** — Mobile → Tablet → Desktop progression
5. **Accessibility** — Keyboard navigation, focus states maintained

---

## Future Improvements

- [ ] Add transition animations for sidebar collapse
- [ ] Optimize right rail breakpoint based on content width (not just viewport)
- [ ] Add container queries for more granular responsive control
- [ ] Consider adding "wide" layout variant for ultra-wide displays (≥1600px)

---

**Date**: 2026-01-24  
**Version**: 1.0.0  
**Status**: ✅ Complete
