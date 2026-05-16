# Feature-Based Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate `src/` from a flat route-based structure to a feature-based structure where each page maps to a feature with its own components, hooks, and types.

**Architecture:** Each feature lives in `src/features/[feature]/` with `components/`, `hooks/`, and optional `types/` subfolders. Barrel `index.ts` files at each level expose a clean public API. Shared code (used in 2+ features) stays at `src/components/`, `src/hooks/`, `src/lib/`. Next.js `app/` contains only thin routing wrappers that re-export from features.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript 5, Tailwind CSS v4

**Spec:** `docs/superpowers/specs/2026-05-10-feature-based-architecture-design.md`

---

## File Map

### Created
| New path | Source |
|---|---|
| `src/features/experiences/components/EventCard/index.tsx` | `src/components/EventCard/index.tsx` |
| `src/features/experiences/components/EventList/index.tsx` | `src/components/EventList/index.tsx` |
| `src/features/experiences/components/FilterSheet.tsx` | `src/app/_components/FilterSheet.tsx` (props updated) |
| `src/features/experiences/components/HomeHeader.tsx` | `src/app/_components/HomeHeader.tsx` |
| `src/features/experiences/components/HomePage.tsx` | extracted from `src/app/page.tsx` |
| `src/features/experiences/components/ExperiencesPage.tsx` | extracted from `src/app/experiences/page.tsx` |
| `src/features/experiences/components/CompactCard.tsx` | extracted inline from `src/app/experiences/page.tsx` |
| `src/features/experiences/components/index.ts` | new |
| `src/features/experiences/hooks/useExperiences.ts` | `src/hooks/useExperiences.ts` |
| `src/features/experiences/hooks/useFilterSheet.ts` | new |
| `src/features/experiences/hooks/index.ts` | new |
| `src/features/experiences/utils.ts` | extracted `guessCategory` from pages |
| `src/features/experiences/index.ts` | new |
| `src/features/experience-detail/components/AboutSection.tsx` | `src/app/experience/[id]/_components/AboutSection.tsx` |
| `src/features/experience-detail/components/BookingCard.tsx` | `src/app/experience/[id]/_components/BookingCard.tsx` |
| `src/features/experience-detail/components/HeroSection.tsx` | `src/app/experience/[id]/_components/HeroSection.tsx` |
| `src/features/experience-detail/components/MapPlaceholder.tsx` | `src/app/experience/[id]/_components/MapPlaceholder.tsx` |
| `src/features/experience-detail/components/OrganizerCard.tsx` | `src/app/experience/[id]/_components/OrganizerCard.tsx` |
| `src/features/experience-detail/components/QuickStats.tsx` | `src/app/experience/[id]/_components/QuickStats.tsx` |
| `src/features/experience-detail/components/TagsSection.tsx` | `src/app/experience/[id]/_components/TagsSection.tsx` |
| `src/features/experience-detail/components/ExperienceDetailPage.tsx` | extracted from `src/app/experience/[id]/page.tsx` |
| `src/features/experience-detail/components/ExperienceConfirmationPage.tsx` | extracted from `src/app/experience/[id]/confirmation/page.tsx` |
| `src/features/experience-detail/components/ExperienceManagePage.tsx` | extracted from `src/app/experience/[id]/manage/page.tsx` |
| `src/features/experience-detail/components/index.ts` | new |
| `src/features/experience-detail/index.ts` | new |
| `src/features/create-experience/components/CreateExperienceStep1.tsx` | `src/app/(protected)/create-experience/_components/CreateExperienceStep1.tsx` |
| `src/features/create-experience/components/CreateExperienceStep2.tsx` | `src/app/(protected)/create-experience/_components/CreateExperienceStep2.tsx` |
| `src/features/create-experience/components/Step3Review.tsx` | `src/app/(protected)/create-experience/_components/Step3Review.tsx` |
| `src/features/create-experience/components/NomajinFace.tsx` | `src/app/(protected)/create-experience/_components/NomajinFace.tsx` |
| `src/features/create-experience/components/icons.tsx` | `src/app/(protected)/create-experience/_components/icons.tsx` |
| `src/features/create-experience/components/CreateExperiencePage.tsx` | extracted from `src/app/(protected)/create-experience/page.tsx` |
| `src/features/create-experience/components/index.ts` | new |
| `src/features/create-experience/types/index.ts` | `src/app/(protected)/create-experience/_components/types.ts` |
| `src/features/create-experience/index.ts` | new |
| `src/features/auth/components/AuthButton/index.tsx` | `src/components/AuthButton/index.tsx` |
| `src/features/auth/components/LoginPage/index.tsx` | `src/components/LoginPage/index.tsx` |
| `src/features/auth/components/Verify/index.tsx` | `src/components/Verify/index.tsx` |
| `src/features/auth/components/index.ts` | new |
| `src/features/auth/index.ts` | new |
| `src/features/payments/components/Pay/index.tsx` | `src/components/Pay/index.tsx` |
| `src/features/payments/components/Transaction/index.tsx` | `src/components/Transaction/index.tsx` |
| `src/features/payments/components/TransactionMock/index.tsx` | `src/components/TransactionMock/index.tsx` |
| `src/features/payments/components/index.ts` | new |
| `src/features/payments/index.ts` | new |
| `src/features/profile/components/ProfilePage.tsx` | extracted from `src/app/(protected)/profile/page.tsx` |
| `src/features/profile/components/HostProfilePage.tsx` | extracted from `src/app/host/[id]/page.tsx` |
| `src/features/profile/components/ContractDebugger/index.tsx` | `src/components/ContractDebugger/index.tsx` |
| `src/features/profile/components/UserInfo/index.tsx` | `src/components/UserInfo/index.tsx` |
| `src/features/profile/components/ViewPermissions/index.tsx` | `src/components/ViewPermissions/index.tsx` |
| `src/features/profile/components/index.ts` | new |
| `src/features/profile/index.ts` | new |
| `src/features/calendar/components/CalendarPage.tsx` | extracted from `src/app/(protected)/calendar/page.tsx` |
| `src/features/calendar/components/index.ts` | new |
| `src/features/calendar/index.ts` | new |
| `src/features/notifications/components/NotificationsPage.tsx` | extracted from `src/app/notifications/page.tsx` |
| `src/features/notifications/components/index.ts` | new |
| `src/features/notifications/index.ts` | new |
| `src/features/report/components/ReportPage.tsx` | extracted from `src/app/report/page.tsx` |
| `src/features/report/components/index.ts` | new |
| `src/features/report/index.ts` | new |

### Modified (thinned to wrappers)
| File | Change |
|---|---|
| `src/app/page.tsx` | re-export from `@/features/experiences` |
| `src/app/experiences/page.tsx` | re-export from `@/features/experiences` |
| `src/app/experience/[id]/page.tsx` | re-export from `@/features/experience-detail` |
| `src/app/experience/[id]/confirmation/page.tsx` | re-export from `@/features/experience-detail` |
| `src/app/experience/[id]/manage/page.tsx` | re-export from `@/features/experience-detail` |
| `src/app/(protected)/create-experience/page.tsx` | re-export from `@/features/create-experience` |
| `src/app/(protected)/profile/page.tsx` | re-export from `@/features/profile` |
| `src/app/(protected)/calendar/page.tsx` | re-export from `@/features/calendar` |
| `src/app/host/[id]/page.tsx` | re-export from `@/features/profile` |
| `src/app/notifications/page.tsx` | re-export from `@/features/notifications` |
| `src/app/report/page.tsx` | re-export from `@/features/report` |
| `CLAUDE.md` | update architecture section |

### Deleted
- `src/app/_components/FilterSheet.tsx`
- `src/app/_components/HomeHeader.tsx`
- `src/app/experience/[id]/_components/` (entire folder)
- `src/app/(protected)/create-experience/_components/` (entire folder)
- `src/components/EventCard/`
- `src/components/EventList/`
- `src/components/AuthButton/`
- `src/components/LoginPage/`
- `src/components/Verify/`
- `src/components/Pay/`
- `src/components/Transaction/`
- `src/components/TransactionMock/`
- `src/components/ContractDebugger/`
- `src/components/UserInfo/`
- `src/components/ViewPermissions/`
- `src/hooks/useExperiences.ts`

---

## Task 1: Create `useFilterSheet` hook and shared `guessCategory` util

**Files:**
- Create: `src/features/experiences/hooks/useFilterSheet.ts`
- Create: `src/features/experiences/utils.ts`

- [ ] **Step 1: Create `useFilterSheet.ts`**

```ts
// src/features/experiences/hooks/useFilterSheet.ts
import { useState } from 'react';

interface FilterValues {
  category: string;
  price: string;
  rating: string;
}

export interface UseFilterSheetReturn {
  isOpen: boolean;
  applied: FilterValues;
  pending: FilterValues;
  open: () => void;
  close: () => void;
  setPendingCategory: (v: string) => void;
  setPendingPrice: (v: string) => void;
  setPendingRating: (v: string) => void;
  apply: () => void;
  clear: () => void;
}

const DEFAULT_FILTERS: FilterValues = {
  category: 'All',
  price: 'All',
  rating: 'All',
};

export function useFilterSheet(): UseFilterSheetReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [applied, setApplied] = useState<FilterValues>(DEFAULT_FILTERS);
  const [pending, setPending] = useState<FilterValues>(DEFAULT_FILTERS);

  return {
    isOpen,
    applied,
    pending,
    open: () => {
      setPending(applied);
      setIsOpen(true);
    },
    close: () => setIsOpen(false),
    setPendingCategory: (v) => setPending((prev) => ({ ...prev, category: v })),
    setPendingPrice: (v) => setPending((prev) => ({ ...prev, price: v })),
    setPendingRating: (v) => setPending((prev) => ({ ...prev, rating: v })),
    apply: () => {
      setApplied(pending);
      setIsOpen(false);
    },
    clear: () => setPending(DEFAULT_FILTERS),
  };
}
```

- [ ] **Step 2: Create `utils.ts` with `guessCategory`**

This function is currently duplicated in `app/page.tsx` and `app/experiences/page.tsx`. Centralise it here.

```ts
// src/features/experiences/utils.ts
export function guessCategory(title: string, desc: string): string | undefined {
  const text = (title + ' ' + desc).toLowerCase();
  if (/hik|trek|mount|trail|climb/.test(text)) return 'Hiking';
  if (/surf|wave|beach|ocean|sea/.test(text)) return 'Surf';
  if (/yoga|meditat|wellness|breath/.test(text)) return 'Yoga';
  if (/social|meet|network|tango|dance|party|gather/.test(text)) return 'Social';
  if (/cultur|art|museum|histor|tour/.test(text)) return 'Cultura';
  return undefined;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/features/experiences/hooks/useFilterSheet.ts src/features/experiences/utils.ts
git commit -m "feat: add useFilterSheet hook and guessCategory util"
```

---

## Task 2: Migrate `experiences` feature

**Files:**
- Create: `src/features/experiences/components/EventCard/index.tsx`
- Create: `src/features/experiences/components/EventList/index.tsx`
- Create: `src/features/experiences/components/FilterSheet.tsx`
- Create: `src/features/experiences/components/HomeHeader.tsx`
- Create: `src/features/experiences/components/CompactCard.tsx`
- Create: `src/features/experiences/components/HomePage.tsx`
- Create: `src/features/experiences/components/ExperiencesPage.tsx`
- Create: `src/features/experiences/components/index.ts`
- Create: `src/features/experiences/hooks/useExperiences.ts`
- Create: `src/features/experiences/hooks/index.ts`
- Create: `src/features/experiences/index.ts`
- Modify: `src/app/page.tsx`
- Modify: `src/app/experiences/page.tsx`
- Delete: `src/app/_components/FilterSheet.tsx`
- Delete: `src/app/_components/HomeHeader.tsx`
- Delete: `src/components/EventCard/` (entire folder)
- Delete: `src/components/EventList/` (entire folder)
- Delete: `src/hooks/useExperiences.ts`

- [ ] **Step 1: Copy `EventCard` to feature**

Copy the full content of `src/components/EventCard/index.tsx` to `src/features/experiences/components/EventCard/index.tsx`. No import changes needed — EventCard has no internal imports.

- [ ] **Step 2: Copy `EventList` to feature, update internal import**

Copy the full content of `src/components/EventList/index.tsx` to `src/features/experiences/components/EventList/index.tsx`. Update the one internal import:

```tsx
// Change this line:
import { EventCard } from '@/components/EventCard';
// To:
import { EventCard } from '@/features/experiences/components/EventCard';
```

- [ ] **Step 3: Copy `HomeHeader` to feature**

Copy the full content of `src/app/_components/HomeHeader.tsx` to `src/features/experiences/components/HomeHeader.tsx`. No import changes needed.

- [ ] **Step 4: Create `FilterSheet.tsx` in feature (updated props)**

Copy the full content of `src/app/_components/FilterSheet.tsx` to `src/features/experiences/components/FilterSheet.tsx`. Update the `FilterSheetProps` interface to accept a `pending` object instead of three flat props:

```tsx
// src/features/experiences/components/FilterSheet.tsx
'use client';

const FILTER_CATEGORIES = ['All', 'Hiking', 'Surf', 'Yoga', 'Social', 'Cultura'];
const PRICE_OPTIONS = ['All', 'Free', 'Under $50', '$50 – $100', 'Over $100'];
const RATING_OPTIONS = ['4.5+', '4.0+', '3.5+', 'Any'];

interface FilterSheetProps {
  pending: { category: string; price: string; rating: string };
  onCategoryChange: (v: string) => void;
  onPriceChange: (v: string) => void;
  onRatingChange: (v: string) => void;
  onClear: () => void;
  onApply: () => void;
  onClose: () => void;
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-2xl text-sm font-semibold transition-colors ${
        active
          ? 'bg-noma-btn text-surface'
          : 'bg-surface-container-highest text-on-surface-variant'
      }`}
    >
      {label}
    </button>
  );
}

function FilterGroup({
  title, options, value, onChange,
}: {
  title: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="font-label-caps text-outline mb-2.5">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <FilterChip key={opt} label={opt} active={value === opt} onClick={() => onChange(opt)} />
        ))}
      </div>
    </div>
  );
}

export function FilterSheet({
  pending,
  onCategoryChange, onPriceChange, onRatingChange,
  onClear, onApply, onClose,
}: FilterSheetProps) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col gap-6 p-6 pb-10 bg-surface rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.12)]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-h2 text-on-surface">Filters</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24" className="text-on-surface-variant">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <FilterGroup title="Category" options={FILTER_CATEGORIES} value={pending.category} onChange={onCategoryChange} />
        <FilterGroup title="Price" options={PRICE_OPTIONS} value={pending.price} onChange={onPriceChange} />
        <FilterGroup title="Minimum Rating" options={RATING_OPTIONS} value={pending.rating} onChange={onRatingChange} />

        {/* Actions */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={onClear}
            className="flex-1 rounded-full py-4 font-body-sm font-semibold bg-surface-container text-primary"
          >
            Clear All
          </button>
          <button
            onClick={onApply}
            className="flex-1 rounded-full py-4 font-body-sm font-semibold bg-primary text-surface"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 5: Copy `useExperiences` to feature**

Copy the full content of `src/hooks/useExperiences.ts` to `src/features/experiences/hooks/useExperiences.ts`. Check for any imports pointing to `@/lib/` or `@/contracts/` and keep them as-is (those are shared paths that don't change).

- [ ] **Step 6: Extract `CompactCard` from `experiences/page.tsx`**

Create `src/features/experiences/components/CompactCard.tsx` with the `CompactCard` component currently defined inline in `src/app/experiences/page.tsx` (lines 45–158). Keep all imports and logic unchanged except update any `@/` paths as needed.

```tsx
// src/features/experiences/components/CompactCard.tsx
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CATEGORY_STYLES: Record<string, { bg: string; color: string }> = {
  Hiking:  { bg: '#ffdf92', color: '#241a00' },
  Surf:    { bg: '#cfe1fe', color: '#53647d' },
  Yoga:    { bg: '#e9d5ff', color: '#6b21a8' },
  Social:  { bg: '#fce7f3', color: '#9d174d' },
  Cultura: { bg: '#dbeafe', color: '#1e40af' },
  default: { bg: '#f4dddb', color: '#58413f' },
};

interface CompactCardProps {
  id: string;
  title: string;
  price: string;
  rating: number;
  image: string;
  location?: string;
  category?: string;
}

export function CompactCard({ id, title, price, rating, image, location, category }: CompactCardProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [hearted, setHearted] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`hearted_${id}`) === 'true';
  });

  const catStyle = category ? (CATEGORY_STYLES[category] ?? CATEGORY_STYLES.default) : null;

  const toggleHeart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !hearted;
    setHearted(next);
    localStorage.setItem(`hearted_${id}`, String(next));
  };

  return (
    <article
      className="overflow-hidden cursor-pointer active:scale-[0.98] transition-all duration-200"
      style={{ backgroundColor: '#ffffff', borderRadius: 20, boxShadow: '0px 2px 8px rgba(13,31,53,0.08)' }}
      onClick={() => router.push(`/experience/${id}`)}
    >
      <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
        {imgError ? (
          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: '#f4dddb' }}>
            <svg width="32" height="32" fill="none" stroke="#8b716e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        ) : (
          <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 480px) 50vw, 240px" onError={() => setImgError(true)} />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)' }} />
        <button
          onClick={toggleHeart}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: hearted ? '#a7322f' : 'rgba(0,0,0,0.25)' }}
          aria-label="Save"
        >
          <svg width="14" height="14" fill={hearted ? '#fff' : 'none'} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        {catStyle && category && (
          <span className="absolute top-2.5 left-2.5 font-semibold uppercase" style={{ backgroundColor: catStyle.bg, color: catStyle.color, fontSize: 9, letterSpacing: '0.05em', padding: '4px 10px', borderRadius: 9999 }}>
            {category}
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 flex items-end justify-between">
          <span style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 18, fontWeight: 700, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>{price}</span>
          <div className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#f4bf00" stroke="#f4bf00" strokeWidth="1">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <div className="px-3 py-3 flex flex-col gap-1">
        <h3 className="line-clamp-2 leading-snug" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 14, fontWeight: 700, color: '#251918', lineHeight: 1.3 }}>{title}</h3>
        {location && (
          <div className="flex items-center gap-1" style={{ color: '#8b716e' }}>
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <span className="truncate" style={{ fontSize: 11 }}>{location}</span>
          </div>
        )}
      </div>
    </article>
  );
}
```

- [ ] **Step 7: Create `ExperiencesPage.tsx`**

Create `src/features/experiences/components/ExperiencesPage.tsx` with the `ExperiencesPage` component currently in `src/app/experiences/page.tsx` (lines 162–315). Replace the inline `CompactCard` with an import, replace the inline `guessCategory` with the shared util, and update all `@/` imports:

```tsx
// src/features/experiences/components/ExperiencesPage.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { formatUnits } from 'viem';
import { Navigation } from '@/components/Navigation';
import { useExperiences } from '@/features/experiences/hooks/useExperiences';
import { guessCategory } from '@/features/experiences/utils';
import { CompactCard } from '@/features/experiences/components/CompactCard';

const CATEGORIES = ['All', 'Hiking', 'Surf', 'Yoga', 'Social', 'Cultura'];

export function ExperiencesPage() {
  const router = useRouter();
  const { experiences, loading, error } = useExperiences();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const events = useMemo(() => {
    return experiences
      .map(exp => {
        const num = parseFloat(formatUnits(exp.price, 18));
        return {
          id: exp.id.toString(),
          title: exp.title,
          description: exp.description,
          price: num === 0 || num < 0.01 ? 'Free' : `$${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`,
          rating: 4.5,
          image: exp.coverImage || '/image-default.png',
          location: exp.location,
          category: guessCategory(exp.title, exp.description),
        };
      })
      .filter(e => {
        if (activeCategory !== 'All' && e.category !== activeCategory) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          if (!e.title.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q)) return false;
        }
        return true;
      });
  }, [experiences, search, activeCategory]);

  return (
    <div className="min-h-screen flex flex-col pb-28" style={{ backgroundColor: '#fff8f7', fontFamily: 'Poppins, sans-serif' }}>
      <header className="sticky top-0 z-40 px-5 pt-10 pb-4 flex flex-col gap-4" style={{ backgroundColor: '#fff8f7' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#ffe9e7' }}>
            <svg width="20" height="20" fill="none" stroke="#251918" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1 style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 28, fontWeight: 700, color: '#251918', letterSpacing: '-0.02em' }}>All Experiences</h1>
        </div>
        <div className="flex items-center gap-3" style={{ backgroundColor: '#ffffff', border: '1px solid #dfbfbc', borderRadius: 12, padding: '0 16px', boxShadow: '0px 2px 4px rgba(13,31,53,0.06)' }}>
          <svg width="18" height="18" fill="none" stroke="#58413f" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search experiences..." className="flex-1 bg-transparent focus:outline-none" style={{ padding: '14px 0', fontSize: 14, color: '#251918' }} />
          {search && (
            <button onClick={() => setSearch('')}>
              <svg width="16" height="16" fill="none" stroke="#8b716e" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className="flex-shrink-0" style={{ padding: '8px 18px', borderRadius: 9999, fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', backgroundColor: activeCategory === cat ? '#a7322f' : '#ffe9e7', color: activeCategory === cat ? '#fff' : '#58413f' }}>
              {cat}
            </button>
          ))}
        </div>
      </header>
      <main className="flex-grow px-4">
        {loading && (
          <div className="flex flex-col items-center py-20 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#a7322f' }} />
            <p style={{ fontSize: 14, color: '#58413f' }}>Loading experiences...</p>
          </div>
        )}
        {error && (
          <div className="rounded-xl p-4 mt-4" style={{ backgroundColor: '#ffdad6', border: '1px solid #ffb3ad' }}>
            <p style={{ fontWeight: 600, fontSize: 14, color: '#410003' }}>Failed to load</p>
            <p style={{ fontSize: 13, color: '#93000a', marginTop: 4 }}>{error}</p>
          </div>
        )}
        {!loading && !error && events.length === 0 && (
          <div className="flex flex-col items-center py-20 gap-3">
            <span style={{ fontSize: 48 }}>🌤️</span>
            <p style={{ fontSize: 15, fontWeight: 500, color: '#58413f' }}>No experiences found</p>
            <p style={{ fontSize: 13, color: '#8b716e' }}>Try a different search or category</p>
          </div>
        )}
        {!loading && !error && events.length > 0 && (
          <>
            <p style={{ fontSize: 13, color: '#8b716e', marginBottom: 16, marginTop: 4 }}>{events.length} experience{events.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-2 gap-3">
              {events.map(event => <CompactCard key={event.id} {...event} />)}
            </div>
          </>
        )}
      </main>
      <Navigation />
    </div>
  );
}
```

- [ ] **Step 8: Create `HomePage.tsx`**

Create `src/features/experiences/components/HomePage.tsx` with the content from `src/app/page.tsx`. Replace the 7 filter `useState` calls with `useFilterSheet()`, and update all imports:

```tsx
// src/features/experiences/components/HomePage.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { formatUnits } from 'viem';

import { EventList } from '@/features/experiences/components/EventList';
import type { Event } from '@/features/experiences/components/EventList';
import { SearchBar } from '@/components/SearchBar';
import { Navigation } from '@/components/Navigation';
import { LoginPage } from '@/features/auth/components/LoginPage';
import { useExperiences } from '@/features/experiences/hooks/useExperiences';
import { useFilterSheet } from '@/features/experiences/hooks/useFilterSheet';
import { getUserExperienceStatusRequest } from '@/lib/contractUtils';
import { guessCategory } from '@/features/experiences/utils';

import { HomeHeader } from '@/features/experiences/components/HomeHeader';
import { FilterSheet } from '@/features/experiences/components/FilterSheet';

export function HomePage() {
  const { data: session, status } = useSession();
  const { experiences, loading, error } = useExperiences();
  const filter = useFilterSheet();

  const [searchQuery, setSearchQuery] = useState('');
  const [eventsWithStatus, setEventsWithStatus] = useState<Event[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');

  const baseEvents = useMemo<Event[]>(() => {
    return experiences.map((exp): Event => ({
      id: exp.id.toString(),
      title: exp.title,
      description: exp.description,
      organizer: exp.creator,
      organizerAvatar: undefined,
      price: (() => {
        const num = parseFloat(formatUnits(exp.price, 18));
        if (num === 0 || num < 0.01) return 'Free';
        return `$${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`;
      })(),
      rating: 4.5,
      image: exp.coverImage || '/image-default.png',
      location: exp.location,
      category: guessCategory(exp.title, exp.description),
      status: 'none',
    }));
  }, [experiences]);

  useEffect(() => {
    const fetchStatuses = async () => {
      if (!session?.user || baseEvents.length === 0) { setEventsWithStatus(baseEvents); return; }
      const userAddress = session.user.walletAddress || session.user.id;
      if (!userAddress) { setEventsWithStatus(baseEvents); return; }
      const updated = await Promise.all(
        baseEvents.map(async (event) => {
          try {
            const s = await getUserExperienceStatusRequest(Number(event.id), userAddress);
            return { ...event, status: s };
          } catch { return event; }
        }),
      );
      setEventsWithStatus(updated);
    };
    fetchStatuses();
  }, [baseEvents, session]);

  const filteredEvents = useMemo(() => {
    const base = eventsWithStatus.length > 0 ? eventsWithStatus : baseEvents;
    return base.filter((e) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!e.title.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q)) return false;
      }
      if (activeCategory !== 'All' && e.category !== activeCategory) return false;
      if (filter.applied.category !== 'All' && e.category !== filter.applied.category) return false;
      if (filter.applied.price !== 'All') {
        const num = e.price === 'Free' ? 0 : parseFloat(e.price.replace('$', ''));
        if (filter.applied.price === 'Free' && num !== 0) return false;
        if (filter.applied.price === 'Under $50' && (num === 0 || num >= 50)) return false;
        if (filter.applied.price === '$50 – $100' && (num < 50 || num > 100)) return false;
        if (filter.applied.price === 'Over $100' && num <= 100) return false;
      }
      if (filter.applied.rating !== 'All') {
        const minRating = parseFloat(filter.applied.rating.replace('+', ''));
        if (e.rating < minRating) return false;
      }
      return true;
    });
  }, [eventsWithStatus, baseEvents, searchQuery, activeCategory, filter.applied]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!session) return <LoginPage />;

  const userName = session?.user?.name?.split(' ')[0] ?? 'Explorer';
  const avatarUrl = session?.user?.profilePictureUrl;

  return (
    <div className="min-h-screen flex flex-col pb-24 relative overflow-x-hidden bg-surface">
      <HomeHeader userName={userName} avatarUrl={avatarUrl} />
      <main className="flex-grow flex flex-col px-5 gap-8">
        <SearchBar
          onSearch={setSearchQuery}
          onCategoryChange={setActiveCategory}
          onFilterClick={filter.open}
        />
        <div className="flex-grow">
          {loading && (
            <div className="flex flex-col items-center py-16 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              <p className="text-sm text-on-surface-variant">Loading experiences...</p>
            </div>
          )}
          {error && (
            <div className="rounded-xl p-4 bg-primary-fixed border border-primary-fixed-dim">
              <p className="font-semibold text-sm text-on-error-container">Failed to load experiences</p>
              <p className="text-sm text-on-error-container mt-1">{error}</p>
            </div>
          )}
          {!loading && !error && filteredEvents.length === 0 && (
            <div className="flex flex-col items-center py-16 gap-3">
              <span className="text-5xl">🌤️</span>
              <p className="font-body-sm font-medium text-on-surface-variant">No experiences found</p>
              <p className="text-sm text-outline">Try a different search or filter</p>
            </div>
          )}
          {!loading && !error && filteredEvents.length > 0 && (
            <EventList events={filteredEvents} onJoinEvent={(id) => console.log('Join:', id)} />
          )}
        </div>
      </main>
      <Navigation />
      {filter.isOpen && (
        <FilterSheet
          pending={filter.pending}
          onCategoryChange={filter.setPendingCategory}
          onPriceChange={filter.setPendingPrice}
          onRatingChange={filter.setPendingRating}
          onClear={filter.clear}
          onApply={filter.apply}
          onClose={filter.close}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 9: Create barrel exports**

```ts
// src/features/experiences/components/index.ts
export { EventCard } from './EventCard';
export { EventList } from './EventList';
export type { Event } from './EventList';
export { FilterSheet } from './FilterSheet';
export { HomeHeader } from './HomeHeader';
export { CompactCard } from './CompactCard';
export { HomePage } from './HomePage';
export { ExperiencesPage } from './ExperiencesPage';
```

```ts
// src/features/experiences/hooks/index.ts
export { useExperiences } from './useExperiences';
export { useFilterSheet } from './useFilterSheet';
export type { UseFilterSheetReturn } from './useFilterSheet';
```

```ts
// src/features/experiences/index.ts
export * from './components';
export * from './hooks';
export { guessCategory } from './utils';
```

- [ ] **Step 10: Thin `app/page.tsx`**

Replace the entire content of `src/app/page.tsx` with:

```tsx
import { HomePage } from '@/features/experiences';
export default HomePage;
```

- [ ] **Step 11: Thin `app/experiences/page.tsx`**

Replace the entire content of `src/app/experiences/page.tsx` with:

```tsx
import { ExperiencesPage } from '@/features/experiences';
export default ExperiencesPage;
```

- [ ] **Step 12: Delete old files**

```bash
rm src/app/_components/FilterSheet.tsx
rm src/app/_components/HomeHeader.tsx
rm -r src/components/EventCard
rm -r src/components/EventList
rm src/hooks/useExperiences.ts
```

- [ ] **Step 13: Check IDE diagnostics for TypeScript errors in modified files**

Open `src/features/experiences/components/HomePage.tsx` in the IDE and confirm zero TypeScript errors. Repeat for `src/app/page.tsx` and `src/app/experiences/page.tsx`.

- [ ] **Step 14: Commit**

```bash
git add src/features/experiences/ src/app/page.tsx src/app/experiences/page.tsx
git add -u src/app/_components/ src/components/EventCard/ src/components/EventList/ src/hooks/useExperiences.ts
git commit -m "feat: migrate experiences feature to features/experiences"
```

---

## Task 3: Migrate `experience-detail` feature

**Files:**
- Create: `src/features/experience-detail/components/` (all 7 _component files + 3 page components + index.ts)
- Create: `src/features/experience-detail/index.ts`
- Modify: `src/app/experience/[id]/page.tsx`
- Modify: `src/app/experience/[id]/confirmation/page.tsx`
- Modify: `src/app/experience/[id]/manage/page.tsx`
- Delete: `src/app/experience/[id]/_components/` (entire folder)

- [ ] **Step 1: Copy the 7 sub-components to the feature**

For each file in `src/app/experience/[id]/_components/`, copy it to `src/features/experience-detail/components/` with the same filename. These files have no internal imports to update (they import only from `@/` shared paths or external packages).

Files to copy:
- `AboutSection.tsx`
- `BookingCard.tsx`
- `HeroSection.tsx`
- `MapPlaceholder.tsx`
- `OrganizerCard.tsx`
- `QuickStats.tsx`
- `TagsSection.tsx`

- [ ] **Step 2: Create `ExperienceDetailPage.tsx`**

Copy the full content of `src/app/experience/[id]/page.tsx` to `src/features/experience-detail/components/ExperienceDetailPage.tsx`. Update imports:

```tsx
// Change:
import { Navigation } from '@/components/Navigation';
import { getExperienceDetails } from '@/lib/contractUtils';
import { HeroSection } from './_components/HeroSection';
import { QuickStats } from './_components/QuickStats';
import { OrganizerCard } from './_components/OrganizerCard';
import { AboutSection } from './_components/AboutSection';
import { TagsSection } from './_components/TagsSection';
import { MapPlaceholder } from './_components/MapPlaceholder';
import { BookingCard } from './_components/BookingCard';

// To:
import { Navigation } from '@/components/Navigation';
import { getExperienceDetails } from '@/lib/contractUtils';
import { HeroSection } from '@/features/experience-detail/components/HeroSection';
import { QuickStats } from '@/features/experience-detail/components/QuickStats';
import { OrganizerCard } from '@/features/experience-detail/components/OrganizerCard';
import { AboutSection } from '@/features/experience-detail/components/AboutSection';
import { TagsSection } from '@/features/experience-detail/components/TagsSection';
import { MapPlaceholder } from '@/features/experience-detail/components/MapPlaceholder';
import { BookingCard } from '@/features/experience-detail/components/BookingCard';
```

Also rename the default export to a named export:
```tsx
// Change:
export default function ExperienceDetailPage() {
// To:
export function ExperienceDetailPage() {
```

- [ ] **Step 3: Create `ExperienceConfirmationPage.tsx`**

Copy the full content of `src/app/experience/[id]/confirmation/page.tsx` to `src/features/experience-detail/components/ExperienceConfirmationPage.tsx`. Update the export:

```tsx
// Change:
export default function ExperienceConfirmationPage() {
// To:
export function ExperienceConfirmationPage() {
```

All imports (`@/lib/contractUtils`, Next.js hooks) are already `@/` absolute — no changes needed.

- [ ] **Step 4: Create `ExperienceManagePage.tsx`**

Copy the full content of `src/app/experience/[id]/manage/page.tsx` to `src/features/experience-detail/components/ExperienceManagePage.tsx`. Update imports:

```tsx
// Change:
import { Page } from '@/components/PageLayout';
import { Navigation } from '@/components/Navigation';
// (keep all @/ imports as-is)

// Change:
export default function ExperienceManagePage() {
// To:
export function ExperienceManagePage() {
```

- [ ] **Step 5: Create barrel exports**

```ts
// src/features/experience-detail/components/index.ts
export { AboutSection } from './AboutSection';
export { BookingCard } from './BookingCard';
export { HeroSection } from './HeroSection';
export { MapPlaceholder } from './MapPlaceholder';
export { OrganizerCard } from './OrganizerCard';
export { QuickStats } from './QuickStats';
export { TagsSection } from './TagsSection';
export { ExperienceDetailPage } from './ExperienceDetailPage';
export { ExperienceConfirmationPage } from './ExperienceConfirmationPage';
export { ExperienceManagePage } from './ExperienceManagePage';
```

```ts
// src/features/experience-detail/index.ts
export * from './components';
```

- [ ] **Step 6: Thin the three page files**

```tsx
// src/app/experience/[id]/page.tsx
import { ExperienceDetailPage } from '@/features/experience-detail';
export default ExperienceDetailPage;
```

```tsx
// src/app/experience/[id]/confirmation/page.tsx
import { ExperienceConfirmationPage } from '@/features/experience-detail';
export default ExperienceConfirmationPage;
```

```tsx
// src/app/experience/[id]/manage/page.tsx
import { ExperienceManagePage } from '@/features/experience-detail';
export default ExperienceManagePage;
```

- [ ] **Step 7: Delete old _components folder**

```bash
rm -r src/app/experience/\[id\]/_components
```

- [ ] **Step 8: Check IDE diagnostics**

Verify zero TypeScript errors in `ExperienceDetailPage.tsx`, `ExperienceConfirmationPage.tsx`, `ExperienceManagePage.tsx`.

- [ ] **Step 9: Commit**

```bash
git add src/features/experience-detail/ src/app/experience/
git add -u src/app/experience/
git commit -m "feat: migrate experience-detail feature to features/experience-detail"
```

---

## Task 4: Migrate `create-experience` feature

**Files:**
- Create: `src/features/create-experience/components/` (5 components + CreateExperiencePage + index.ts)
- Create: `src/features/create-experience/types/index.ts`
- Create: `src/features/create-experience/index.ts`
- Modify: `src/app/(protected)/create-experience/page.tsx`
- Delete: `src/app/(protected)/create-experience/_components/` (entire folder)

- [ ] **Step 1: Copy the 5 sub-components to the feature**

Copy each file from `src/app/(protected)/create-experience/_components/` to `src/features/create-experience/components/`:
- `CreateExperienceStep1.tsx`
- `CreateExperienceStep2.tsx`
- `Step3Review.tsx`
- `NomajinFace.tsx`
- `icons.tsx`

For `CreateExperienceStep1.tsx`, `CreateExperienceStep2.tsx`, `Step3Review.tsx`: update their import of `types`:
```tsx
// Change:
import { ... } from './types';
// To:
import { ... } from '@/features/create-experience/types';
```

- [ ] **Step 2: Create `types/index.ts`**

Copy the content of `src/app/(protected)/create-experience/_components/types.ts` to `src/features/create-experience/types/index.ts` unchanged.

- [ ] **Step 3: Create `CreateExperiencePage.tsx`**

Copy the full content of `src/app/(protected)/create-experience/page.tsx` to `src/features/create-experience/components/CreateExperiencePage.tsx`. Update imports:

```tsx
// Change:
import { CreateFormData, ButtonState } from './_components/types';
import CreateExperienceStep1 from './_components/CreateExperienceStep1';
import CreateExperienceStep2 from './_components/CreateExperienceStep2';
import Step3Review from './_components/Step3Review';

// To:
import { CreateFormData, ButtonState } from '@/features/create-experience/types';
import CreateExperienceStep1 from '@/features/create-experience/components/CreateExperienceStep1';
import CreateExperienceStep2 from '@/features/create-experience/components/CreateExperienceStep2';
import Step3Review from '@/features/create-experience/components/Step3Review';
```

Change to named export:
```tsx
// Change:
export default function CreateExperiencePage() {
// To:
export function CreateExperiencePage() {
```

- [ ] **Step 4: Create barrel exports**

```ts
// src/features/create-experience/components/index.ts
export { CreateExperiencePage } from './CreateExperiencePage';
export { default as CreateExperienceStep1 } from './CreateExperienceStep1';
export { default as CreateExperienceStep2 } from './CreateExperienceStep2';
export { default as Step3Review } from './Step3Review';
export { NomajinFace } from './NomajinFace';
```

```ts
// src/features/create-experience/types/index.ts
// (already contains the types — just ensure they are exported)
// Verify that CreateFormData and ButtonState are exported with `export`
```

```ts
// src/features/create-experience/index.ts
export * from './components';
export * from './types';
```

- [ ] **Step 5: Thin the page**

```tsx
// src/app/(protected)/create-experience/page.tsx
import { CreateExperiencePage } from '@/features/create-experience';
export default CreateExperiencePage;
```

- [ ] **Step 6: Delete old _components folder**

```bash
rm -r "src/app/(protected)/create-experience/_components"
```

- [ ] **Step 7: Check IDE diagnostics and commit**

```bash
git add src/features/create-experience/ "src/app/(protected)/create-experience/page.tsx"
git add -u "src/app/(protected)/create-experience/_components/"
git commit -m "feat: migrate create-experience feature to features/create-experience"
```

---

## Task 5: Migrate `auth` feature

**Files:**
- Create: `src/features/auth/components/AuthButton/index.tsx`
- Create: `src/features/auth/components/LoginPage/index.tsx`
- Create: `src/features/auth/components/Verify/index.tsx`
- Create: `src/features/auth/components/index.ts`
- Create: `src/features/auth/index.ts`
- Delete: `src/components/AuthButton/`
- Delete: `src/components/LoginPage/`
- Delete: `src/components/Verify/`

- [ ] **Step 1: Copy auth components to feature**

Copy each component folder's `index.tsx` to the corresponding feature path:
- `src/components/AuthButton/index.tsx` → `src/features/auth/components/AuthButton/index.tsx`
- `src/components/LoginPage/index.tsx` → `src/features/auth/components/LoginPage/index.tsx`
- `src/components/Verify/index.tsx` → `src/features/auth/components/Verify/index.tsx`

For each file: check all imports. Any `@/components/X` that refers to non-auth components must be updated. Keep `@/lib/`, `@/auth/`, and external package imports unchanged.

- [ ] **Step 2: Create barrel exports**

```ts
// src/features/auth/components/index.ts
export { AuthButton } from './AuthButton';
export { LoginPage } from './LoginPage';
export { Verify } from './Verify';
```

```ts
// src/features/auth/index.ts
export * from './components';
```

- [ ] **Step 3: Update `HomePage.tsx` import of `LoginPage`**

In `src/features/experiences/components/HomePage.tsx`, the `LoginPage` import was already set to `@/features/auth/components/LoginPage` in Task 2 Step 8. Verify it is correct.

- [ ] **Step 4: Delete old auth component folders**

```bash
rm -r src/components/AuthButton
rm -r src/components/LoginPage
rm -r src/components/Verify
```

- [ ] **Step 5: Check IDE diagnostics and commit**

```bash
git add src/features/auth/
git add -u src/components/AuthButton/ src/components/LoginPage/ src/components/Verify/
git commit -m "feat: migrate auth feature to features/auth"
```

---

## Task 6: Migrate `payments` feature

**Files:**
- Create: `src/features/payments/components/Pay/index.tsx`
- Create: `src/features/payments/components/Transaction/index.tsx`
- Create: `src/features/payments/components/TransactionMock/index.tsx`
- Create: `src/features/payments/components/index.ts`
- Create: `src/features/payments/index.ts`
- Delete: `src/components/Pay/`
- Delete: `src/components/Transaction/`
- Delete: `src/components/TransactionMock/`

- [ ] **Step 1: Copy payment components to feature**

Copy each component:
- `src/components/Pay/index.tsx` → `src/features/payments/components/Pay/index.tsx`
- `src/components/Transaction/index.tsx` → `src/features/payments/components/Transaction/index.tsx`
- `src/components/TransactionMock/index.tsx` → `src/features/payments/components/TransactionMock/index.tsx`

Update any internal cross-imports between payment components if they reference `@/components/Pay`, `@/components/Transaction`, etc.

- [ ] **Step 2: Create barrel exports**

```ts
// src/features/payments/components/index.ts
export { Pay } from './Pay';
export { Transaction } from './Transaction';
export { TransactionMock } from './TransactionMock';
```

```ts
// src/features/payments/index.ts
export * from './components';
```

- [ ] **Step 3: Delete old payment component folders**

```bash
rm -r src/components/Pay
rm -r src/components/Transaction
rm -r src/components/TransactionMock
```

- [ ] **Step 4: Check IDE diagnostics and commit**

```bash
git add src/features/payments/
git add -u src/components/Pay/ src/components/Transaction/ src/components/TransactionMock/
git commit -m "feat: migrate payments feature to features/payments"
```

---

## Task 7: Migrate `profile` feature

**Files:**
- Create: `src/features/profile/components/ProfilePage.tsx`
- Create: `src/features/profile/components/HostProfilePage.tsx`
- Create: `src/features/profile/components/ContractDebugger/index.tsx`
- Create: `src/features/profile/components/UserInfo/index.tsx`
- Create: `src/features/profile/components/ViewPermissions/index.tsx`
- Create: `src/features/profile/components/index.ts`
- Create: `src/features/profile/index.ts`
- Modify: `src/app/(protected)/profile/page.tsx`
- Modify: `src/app/host/[id]/page.tsx`
- Delete: `src/components/ContractDebugger/`
- Delete: `src/components/UserInfo/`
- Delete: `src/components/ViewPermissions/`

- [ ] **Step 1: Copy utility components to feature**

Copy each component:
- `src/components/ContractDebugger/index.tsx` → `src/features/profile/components/ContractDebugger/index.tsx`
- `src/components/UserInfo/index.tsx` → `src/features/profile/components/UserInfo/index.tsx`
- `src/components/ViewPermissions/index.tsx` → `src/features/profile/components/ViewPermissions/index.tsx`

- [ ] **Step 2: Create `ProfilePage.tsx`**

Copy the full content of `src/app/(protected)/profile/page.tsx` to `src/features/profile/components/ProfilePage.tsx`. Update imports:

```tsx
// Change:
import { Navigation } from '@/components/Navigation';
// (keep as-is, Navigation is shared)

// Change:
export default function ProfilePage() {
// To:
export function ProfilePage() {
```

- [ ] **Step 3: Create `HostProfilePage.tsx`**

Copy the full content of `src/app/host/[id]/page.tsx` to `src/features/profile/components/HostProfilePage.tsx`. Update imports:

```tsx
// Change:
import { Navigation } from '@/components/Navigation';
// (keep as-is)

// Change:
export default function HostProfilePage() {
// To:
export function HostProfilePage() {
```

- [ ] **Step 4: Create barrel exports**

```ts
// src/features/profile/components/index.ts
export { ProfilePage } from './ProfilePage';
export { HostProfilePage } from './HostProfilePage';
export { ContractDebugger } from './ContractDebugger';
export { UserInfo } from './UserInfo';
export { ViewPermissions } from './ViewPermissions';
```

```ts
// src/features/profile/index.ts
export * from './components';
```

- [ ] **Step 5: Thin the two page files**

```tsx
// src/app/(protected)/profile/page.tsx
import { ProfilePage } from '@/features/profile';
export default ProfilePage;
```

```tsx
// src/app/host/[id]/page.tsx
import { HostProfilePage } from '@/features/profile';
export default HostProfilePage;
```

- [ ] **Step 6: Delete old profile component folders**

```bash
rm -r src/components/ContractDebugger
rm -r src/components/UserInfo
rm -r src/components/ViewPermissions
```

- [ ] **Step 7: Check IDE diagnostics and commit**

```bash
git add src/features/profile/ "src/app/(protected)/profile/page.tsx" src/app/host/
git add -u src/components/ContractDebugger/ src/components/UserInfo/ src/components/ViewPermissions/
git commit -m "feat: migrate profile feature to features/profile"
```

---

## Task 8: Migrate `calendar`, `notifications`, and `report` features

**Files:**
- Create: `src/features/calendar/components/CalendarPage.tsx`
- Create: `src/features/calendar/components/index.ts`
- Create: `src/features/calendar/index.ts`
- Create: `src/features/notifications/components/NotificationsPage.tsx`
- Create: `src/features/notifications/components/index.ts`
- Create: `src/features/notifications/index.ts`
- Create: `src/features/report/components/ReportPage.tsx`
- Create: `src/features/report/components/index.ts`
- Create: `src/features/report/index.ts`
- Modify: `src/app/(protected)/calendar/page.tsx`
- Modify: `src/app/notifications/page.tsx`
- Modify: `src/app/report/page.tsx`

- [ ] **Step 1: Create `CalendarPage.tsx`**

Copy the full content of `src/app/(protected)/calendar/page.tsx` to `src/features/calendar/components/CalendarPage.tsx`. Update imports:

```tsx
// Change:
import { Navigation } from '@/components/Navigation';
// (keep as-is)

// Change:
export default function CalendarPage() {
// To:
export function CalendarPage() {
```

- [ ] **Step 2: Create `NotificationsPage.tsx`**

Copy the full content of `src/app/notifications/page.tsx` to `src/features/notifications/components/NotificationsPage.tsx`. Update:

```tsx
// Change:
import { Navigation } from '@/components/Navigation';
// (keep as-is)

// Change:
export default function NotificationsPage() {
// To:
export function NotificationsPage() {
```

- [ ] **Step 3: Create `ReportPage.tsx`**

Copy the full content of `src/app/report/page.tsx` to `src/features/report/components/ReportPage.tsx`. Update:

```tsx
// Change:
export default function ReportPage() {
// To:
export function ReportPage() {
```

- [ ] **Step 4: Create barrel exports**

```ts
// src/features/calendar/components/index.ts
export { CalendarPage } from './CalendarPage';

// src/features/calendar/index.ts
export * from './components';
```

```ts
// src/features/notifications/components/index.ts
export { NotificationsPage } from './NotificationsPage';

// src/features/notifications/index.ts
export * from './components';
```

```ts
// src/features/report/components/index.ts
export { ReportPage } from './ReportPage';

// src/features/report/index.ts
export * from './components';
```

- [ ] **Step 5: Thin the three page files**

```tsx
// src/app/(protected)/calendar/page.tsx
import { CalendarPage } from '@/features/calendar';
export default CalendarPage;
```

```tsx
// src/app/notifications/page.tsx
import { NotificationsPage } from '@/features/notifications';
export default NotificationsPage;
```

```tsx
// src/app/report/page.tsx
import { ReportPage } from '@/features/report';
export default ReportPage;
```

- [ ] **Step 6: Check IDE diagnostics and commit**

```bash
git add src/features/calendar/ src/features/notifications/ src/features/report/
git add "src/app/(protected)/calendar/page.tsx" src/app/notifications/page.tsx src/app/report/page.tsx
git commit -m "feat: migrate calendar, notifications, report features"
```

---

## Task 9: Update `CLAUDE.md` with new architecture rules

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Replace the `Arquitetura de Pastas` section**

Find the `## Arquitetura de Pastas` section in `CLAUDE.md` and replace it with the new structure:

```markdown
## Arquitetura de Pastas

```
src/
├── app/                    ← Next.js routing only (page.tsx, layout.tsx, api/)
├── features/
│   ├── [feature]/
│   │   ├── components/     ← componentes usados somente nessa feature
│   │   │   └── index.ts    ← barrel: exporta todos os componentes
│   │   ├── hooks/          ← hooks usados somente nessa feature
│   │   │   └── index.ts    ← barrel: exporta todos os hooks
│   │   ├── types/          ← tipos usados somente nessa feature (se necessário)
│   │   │   └── index.ts    ← barrel: exporta todos os tipos
│   │   └── index.ts        ← barrel raiz: re-exporta components + hooks + types
│   ├── experiences/        ← home, listagem, filtros
│   ├── experience-detail/  ← detalhe, confirmação, gestão
│   ├── create-experience/  ← criação de experiência
│   ├── auth/               ← World ID, login
│   ├── payments/           ← pagamentos on-chain
│   ├── profile/            ← perfil usuário + host
│   ├── calendar/
│   ├── notifications/
│   └── report/
├── components/             ← UI compartilhada (usada em 2+ features)
│   ├── Navigation/
│   ├── PageLayout/
│   ├── SearchBar/
│   └── TagChip/
├── hooks/                  ← hooks compartilhados (usados em 2+ features)
├── lib/                    ← utilitários sem UI (usados em 2+ features)
├── contracts/              ← constantes e ABIs on-chain
├── auth/                   ← configuração next-auth (nível framework)
├── providers/              ← providers React app-wide
└── assets/
```

**Regra de localização:**
- UI usada em **1 feature** → `src/features/[feature]/components/`
- Hook usado em **1 feature** → `src/features/[feature]/hooks/`
- UI usada em **2+ features** → `src/components/[Nome]/index.tsx`
- Hook usado em **2+ features** → `src/hooks/`

**Regra de importação em páginas — sempre pelo barrel raiz da feature:**
```tsx
// ✅ Correto
import { ExperienceDetailPage } from '@/features/experience-detail';

// ❌ Errado — nunca mais profundo que o barrel raiz
import { ExperienceDetailPage } from '@/features/experience-detail/components/ExperienceDetailPage';
```
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with feature-based architecture rules"
```

---

## Self-Review Checklist

- [x] All features listed in spec have tasks: experiences ✓, experience-detail ✓, create-experience ✓, auth ✓, payments ✓, profile ✓, calendar ✓, notifications ✓, report ✓
- [x] `useFilterSheet` hook fully specified with interface and implementation
- [x] `guessCategory` deduplication covered in Task 1
- [x] Barrel exports at 3 levels shown for every feature
- [x] All thin page.tsx wrappers shown with exact code
- [x] Old file deletion covered for every migrated location
- [x] `FilterSheet` props updated from flat → `pending` object
- [x] `LoginPage` import in `HomePage.tsx` points to `@/features/auth/components/LoginPage`
- [x] `CLAUDE.md` update task included
- [x] No build commands (per project constraint)
