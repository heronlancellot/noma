# Navigation Refactor — Design Spec

**Date:** 2026-05-10
**File:** `src/components/Navigation/index.tsx`
**Branch:** `feat/new-ui`

---

## Goal

Refactor the `Navigation` component to fix 10 identified bugs and violations, align the visual with the approved design reference, and make the component config-driven and maintainable.

---

## Problems Being Fixed

| # | Problem | Category |
|---|---|---|
| 1 | `useState + useEffect` to track active tab — redundant, can cause 1-frame flicker | Bug / Architecture |
| 2 | `setActiveTab` called manually on click — redundant with derived state | Bug |
| 3 | Dead `tabKey` prop in `NavItemProps` — defined but never consumed | Dead code |
| 4 | `style={{ backgroundColor, boxShadow }}` — inline styles (Regra 3 violation) | Token violation |
| 5 | `border-gray-100` — not a design token (Regra 1 violation) | Token violation |
| 6 | `text-[10px]` used twice — arbitrary size (Regra 2 violation) | Token violation |
| 7 | `stroke="white"` on Plus icon — HTML attribute instead of Tailwind | Style inconsistency |
| 8 | Create button duplicates label + indicator dot logic from `NavItem` | DRY violation |
| 9 | Missing `type="button"` on `<button>` elements | Accessibility / correctness |
| 10 | Icon active color logic scattered across all call sites (not encapsulated) | Architecture |

---

## Architecture

### Active Tab Derivation

Remove `useState` + `useEffect`. Replace with a pure function outside the component:

```ts
function getActiveTab(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname.includes('/calendar')) return 'calendar';
  if (pathname.includes('/create-experience')) return 'create';
  if (pathname.includes('/profile')) return 'profile';
  if (pathname.includes('/notifications')) return 'alerts';
  return 'home';
}
```

`activeTab` becomes a derived const inside the component:
```ts
const activeTab = getActiveTab(pathname);
```

Click handlers become just `router.push(href)` — no `setActiveTab` needed.

### NAV_ITEMS Config Array

Single source of truth for all navigation items:

```ts
type NavVariant = 'default' | 'fab';

interface NavItemConfig {
  readonly key: string;
  readonly href: string;
  readonly label: string;
  readonly Icon: LucideIcon;
  readonly variant: NavVariant;
}

const NAV_ITEMS: readonly NavItemConfig[] = [
  { key: 'home',     href: '/',                  label: 'Home',     Icon: Compass,  variant: 'default' },
  { key: 'calendar', href: '/calendar',           label: 'Calendar', Icon: Calendar, variant: 'default' },
  { key: 'create',   href: '/create-experience',  label: 'Create',   Icon: Plus,     variant: 'fab'     },
  { key: 'profile',  href: '/profile',            label: 'Profile',  Icon: User,     variant: 'default' },
  { key: 'alerts',   href: '/notifications',      label: 'Alerts',   Icon: Bell,     variant: 'default' },
] as const;
```

Adding or reordering a tab = 1 line change.

### NavItem Component

`NavItem` receives `Icon` as a component (not `ReactNode`). It applies active/inactive colors internally:

```tsx
interface NavItemProps {
  item: NavItemConfig;
  isActive: boolean;
  onClick: () => void;
  iconOverride?: ReactNode; // optional — used only for Profile with Marble avatar
}
```

Internal icon rendering:
- `isActive=true` → `text-noma-btn` (no fill)
- `isActive=false` → `text-foreground`

The `fab` variant renders the floating circle button with a different layout. The label and active indicator dot are rendered uniformly by `NavItem` for both variants.

**Profile exception:** When the session has `profilePictureUrl`, the `iconOverride` prop passes the `Marble` component. All other items use `Icon` directly.

---

## Visual Design

| Element | Before | After |
|---|---|---|
| Inactive icon color | `text-nav-inactive` (gray) | `text-foreground` (dark navy) |
| Active icon color | `text-noma-btn` + fill | `text-noma-btn`, outline only |
| Inactive label | `text-nav-inactive` | `text-on-surface-variant` |
| Active label | `text-noma-btn` | `text-noma-btn` |
| Label size | `text-[10px]` | `text-xs` |
| Nav background | `style={{ backgroundColor: 'rgba(255,255,255,0.97)' }}` | `bg-surface-container-lowest/95 backdrop-blur-sm` |
| Nav shadow | `style={{ boxShadow: '...' }}` | `shadow-[0_-2px_16px_rgba(13,31,53,0.07)]` |
| Top border | `border-gray-100` | `border-outline-variant/30` |
| FAB Plus icon color | `stroke="white"` (HTML attr) | `className="text-white"` |
| Button type | missing | `type="button"` |
| Active indicator dot | `bg-brand-gold` below label | retained — brand detail |

---

## Constraints

- Component stays in a single file (`src/components/Navigation/index.tsx`) — no split needed for 5 items.
- `pathname.startsWith('/create-experience')` early return is **retained** — hides nav during the creation flow. Kept after hooks (moving before hooks would violate rules of hooks).
- No new design tokens added to `globals.css` — all values use existing tokens or Tailwind arbitrary values where no token equivalent exists (shadow value).
- No changes to the component's public API — it remains a zero-prop component exported as `Navigation`.
