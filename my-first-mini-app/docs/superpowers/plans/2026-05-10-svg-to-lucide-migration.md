# SVG → lucide-react Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all SVG icon markup across the project with lucide-react components, rename mascot PNG assets to semantic names, and swap NomajinFace/SadMascot SVG drawings for the real PNG characters.

**Architecture:** Direct import approach — every component imports exactly what it needs from `lucide-react`. No wrapper files or barrel re-exports. The custom `icons.tsx` file is deleted after migrating all its consumers. Two mascot SVG drawings are replaced by Next.js `<Image>` components pointing to renamed public PNGs.

**Tech Stack:** `lucide-react ^1.14.0` (already installed), `next/image`, Tailwind CSS design tokens.

---

## Exceptions (not migrated — intentional)

- `src/app/globals.css`, `src/assets/*.svg` — static files, not icons
- `ProfilePage.tsx` progress ring SVG (line 270) — custom UI element, not an icon
- `ProfilePage.tsx` gold verified badge SVG (line 240) — custom brand badge with `fill="#f4bf00"`
- `HostProfilePage.tsx` blue verified badge SVG (line 244) — custom brand badge with `fill="#3b82f6"`
- `LoginPage/index.tsx` wavy underline SVG — decorative text decoration, not an icon

---

## File Map

| File | Action |
|---|---|
| `public/*.png` (8 UUID files) | Rename to semantic names |
| `src/features/create-experience/components/NomajinFace.tsx` | Replace SVG with `<Image>` |
| `src/features/create-experience/components/icons.tsx` | Delete |
| `src/features/create-experience/components/CreateExperienceStep1.tsx` | Replace icons.tsx imports → lucide |
| `src/features/create-experience/components/CreateExperienceStep2.tsx` | Replace icons.tsx imports + inline SVGs → lucide |
| `src/features/create-experience/components/Step3Review.tsx` | Replace icons.tsx imports + inline SVGs → lucide |
| `src/components/Navigation/index.tsx` | Replace 5 inline SVG components → lucide |
| `src/components/SearchBar/index.tsx` | Replace 2 inline SVGs → lucide |
| `src/features/experiences/components/EventCard/index.tsx` | Replace 4 inline SVGs → lucide |
| `src/features/experiences/components/CompactCard.tsx` | Replace 4 inline SVGs → lucide |
| `src/features/experiences/components/EventList/index.tsx` | Replace 1 inline SVG → lucide |
| `src/features/experiences/components/FilterSheet.tsx` | Replace 1 inline SVG → lucide |
| `src/features/experiences/components/ExperiencesPage.tsx` | Replace 3 inline SVGs → lucide |
| `src/features/experience-detail/components/HeroSection.tsx` | Replace 7 inline SVGs → lucide |
| `src/features/experience-detail/components/BookingCard.tsx` | Replace 2 inline SVGs → lucide |
| `src/features/experience-detail/components/QuickStats.tsx` | Replace 3 inline SVGs → lucide |
| `src/features/experience-detail/components/MapPlaceholder.tsx` | Replace 1 inline SVG → lucide |
| `src/features/experience-detail/components/ExperienceConfirmationPage.tsx` | Replace 2 inline SVGs → lucide |
| `src/features/report/components/ReportPage.tsx` | Replace SadMascot with Image + 4 SVGs → lucide |
| `src/features/calendar/components/CalendarPage.tsx` | Replace 4 inline SVGs → lucide |
| `src/features/notifications/components/NotificationsPage.tsx` | Replace 4 inline SVGs → lucide |
| `src/features/profile/components/ProfilePage.tsx` | Replace 2 inline SVGs → lucide (keep 2 exceptions) |
| `src/features/profile/components/HostProfilePage.tsx` | Replace 5 inline SVGs → lucide (keep 1 exception) |
| `src/features/experience-detail/components/ExperienceManagePage.tsx` | Replace iconoir-react → lucide |
| `src/features/profile/components/UserInfo/index.tsx` | Replace iconoir-react → lucide |
| `package.json` | Remove `iconoir-react` dependency |
| `CLAUDE.md` | Update Regra 7: iconoir-react → lucide-react |

---

## Task 1: Rename public PNG files

**Files:**
- Modify: `public/` (8 files renamed)

- [ ] **Step 1: Rename files**

```bash
cd /path/to/project/public
mv "1CF2B597-8A92-40E8-B0CB-A8F98BBE03DD Background Removed.png" "nomajin-pointing.png"
mv "407ED243-B26E-4067-B535-72CF5D602A2D Background Removed.png" "nomajin-happy.png"
mv "47440F14-3E2D-4BFB-A257-C28574178AC4 Background Removed.png" "nomajin-blush.png"
mv "6621C68D-348A-4261-9899-BD28771FDB85 Background Removed.png" "nomajin-distressed.png"
mv "B3353F28-86B0-4CDE-AF05-9587FDCDC034 Background Removed.png" "nomajin-sad.png"
mv "C7B05520-7E0C-4789-93A7-C829125BE226 Background Removed.png" "nomajin-thinking.png"
mv "F0135B4C-4DF9-48C5-91DB-D798E591FBB9 Background Removed.png" "nomajin-wink.png"
mv "IMG_7513 Background Removed.png" "nomajin-thumbsup.png"
```

- [ ] **Step 2: Commit**

```bash
git add public/
git commit -m "chore: rename NOMAJIN PNG assets to semantic names"
```

---

## Task 2: Replace NomajinFace SVG with Image

**Files:**
- Modify: `src/features/create-experience/components/NomajinFace.tsx`

- [ ] **Step 1: Replace file content**

```tsx
'use client';

import Image from 'next/image';

interface Props {
  size?: number;
}

export default function NomajinFace({ size = 36 }: Props) {
  return (
    <Image
      src="/nomajin-happy.png"
      width={size}
      height={size}
      alt="NOMAJIN"
      style={{ objectFit: 'contain' }}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/create-experience/components/NomajinFace.tsx
git commit -m "feat: replace NomajinFace SVG with real PNG mascot"
```

---

## Task 3: Migrate create-experience icons.tsx consumers, then delete icons.tsx

**Files:**
- Modify: `src/features/create-experience/components/CreateExperienceStep1.tsx`
- Modify: `src/features/create-experience/components/CreateExperienceStep2.tsx`
- Modify: `src/features/create-experience/components/Step3Review.tsx`
- Delete: `src/features/create-experience/components/icons.tsx`
- Modify: `src/features/create-experience/components/index.ts` (remove icons export)

### CreateExperienceStep1.tsx

- [ ] **Step 1: Replace icons import + usage**

Replace the import line:
```tsx
// OLD
import { IconClose, IconChevron, IconArrowForward } from './icons';

// NEW
import { X, ChevronDown, ArrowRight } from 'lucide-react';
```

Replace usages in JSX:
```tsx
// OLD → NEW
<IconClose />        →  <X size={20} />
<IconChevron />      →  <ChevronDown size={20} />
<IconArrowForward /> →  <ArrowRight size={20} />
```

The full updated import block at the top of the file:
```tsx
import { UseFormRegister, Control, FieldErrors, Controller } from 'react-hook-form';
import { CreateFormData } from '@/features/create-experience/types';
import { X, ChevronDown, ArrowRight } from 'lucide-react';
import NomajinFace from './NomajinFace';
```

In the close button (line 34 area): `<X size={20} />`
In the category select chevron (line 105 area): `<ChevronDown size={20} />`
In the footer Next Step button (line 134 area): `<ArrowRight size={20} />`

### CreateExperienceStep2.tsx

- [ ] **Step 2: Replace icons import + inline SVGs**

Replace the import line:
```tsx
// OLD
import { IconBack, IconClose, IconLocation, IconClock, IconGroup, IconPayments } from './icons';

// NEW
import { ChevronLeft, X, MapPin, Clock, Users, CreditCard, Calendar, ChevronDown } from 'lucide-react';
```

Replace the `CalendarIcon` local component (lines 75-86) entirely — delete it and use lucide `Calendar` directly.

Replace `DatePickerInput`'s inline calendar SVG (lines 143-150) with:
```tsx
<Calendar size={16} className="text-secondary" />
```

Replace the duration select's inline chevron-down SVG (lines 261-265) with:
```tsx
<ChevronDown size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-secondary" />
```

Replace usages:
```tsx
// OLD → NEW
<IconBack />      →  <ChevronLeft size={20} />
<IconClose />     →  <X size={20} />
<IconLocation />  →  <MapPin size={24} />
<IconClock />     →  <Clock size={24} />
<IconGroup />     →  <Users size={24} />
<IconPayments />  →  <CreditCard size={24} />
```

Replace `CalendarIcon` usage in `DatePickerInput`'s LABEL_ROW:
```tsx
// OLD
<CalendarIcon filled={Boolean(dateReady)} />

// NEW
<Calendar
  size={17}
  stroke={dateReady ? 'var(--color-primary)' : 'var(--color-on-surface-variant)'}
/>
```

### Step3Review.tsx

- [ ] **Step 3: Replace icons import + inline SVGs**

Replace the import line:
```tsx
// OLD
import { IconBack, IconPhoto, IconRocket } from './icons';

// NEW
import { ChevronLeft, ImageIcon, Rocket, MapPin, Clock } from 'lucide-react';
```

Replace usages:
```tsx
// OLD → NEW
<IconBack />                          →  <ChevronLeft size={20} />
<IconPhoto className="text-white" />  →  <ImageIcon size={20} className="text-white" />
<IconRocket className="text-secondary" />  →  <Rocket size={20} className="text-secondary" />
<IconRocket />                        →  <Rocket size={20} />
```

Replace the inline MapPin SVG (lines 87-90) with:
```tsx
<MapPin size={14} className="text-on-surface-variant" />
```

Replace the inline Clock SVG (lines 97-100) with:
```tsx
<Clock size={14} className="text-on-surface-variant" />
```

### Delete icons.tsx

- [ ] **Step 4: Delete icons.tsx and remove from barrel**

Delete `src/features/create-experience/components/icons.tsx`.

In `src/features/create-experience/components/index.ts`, remove any line that exports from `icons`:
```tsx
// Remove this line if it exists:
export * from './icons';
```

- [ ] **Step 5: Commit**

```bash
git add src/features/create-experience/components/
git commit -m "feat: migrate create-experience icons to lucide-react, delete icons.tsx"
```

---

## Task 4: Migrate Navigation component

**Files:**
- Modify: `src/components/Navigation/index.tsx`

- [ ] **Step 1: Replace file content**

Replace all 5 inline SVG components with lucide imports. The full new file:

```tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Marble } from '@worldcoin/mini-apps-ui-kit-react';
import { Compass, Calendar, Plus, Bell, User } from 'lucide-react';

interface NavItemProps {
  tabKey: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, isActive, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors"
      aria-label={label}
    >
      {icon}
      <span className={`text-[10px] font-semibold ${isActive ? 'text-noma-btn' : 'text-nav-inactive'}`}>
        {label}
      </span>
      {isActive && (
        <span className="w-1 h-1 rounded-full bg-brand-gold" />
      )}
    </button>
  );
}

export const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    if (pathname === '/') setActiveTab('home');
    else if (pathname.includes('/calendar')) setActiveTab('calendar');
    else if (pathname.includes('/create-experience')) setActiveTab('create');
    else if (pathname.includes('/profile')) setActiveTab('profile');
    else if (pathname.includes('/notifications')) setActiveTab('alerts');
  }, [pathname]);

  if (pathname.startsWith('/create-experience')) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100"
      style={{ backgroundColor: 'rgba(255,255,255,0.97)', boxShadow: '0 -2px 16px rgba(13,31,53,0.07)' }}
    >
      <div className="flex items-end justify-around px-2 pt-2 pb-3 max-w-md mx-auto">
        <NavItem
          tabKey="home"
          label="Home"
          isActive={activeTab === 'home'}
          onClick={() => { setActiveTab('home'); router.push('/'); }}
          icon={
            <Compass
              size={22}
              className={activeTab === 'home' ? 'text-noma-btn' : 'text-nav-inactive'}
              fill={activeTab === 'home' ? 'currentColor' : 'none'}
            />
          }
        />
        <NavItem
          tabKey="calendar"
          label="Calendar"
          isActive={activeTab === 'calendar'}
          onClick={() => { setActiveTab('calendar'); router.push('/calendar'); }}
          icon={
            <Calendar
              size={22}
              className={activeTab === 'calendar' ? 'text-noma-btn' : 'text-nav-inactive'}
            />
          }
        />

        {/* Create — floating circle */}
        <div className="flex flex-col items-center gap-0.5 flex-1">
          <button
            onClick={() => { setActiveTab('create'); router.push('/create-experience'); }}
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg -mt-5 bg-noma-btn"
            aria-label="Create"
          >
            <Plus size={26} stroke="white" strokeWidth={2.5} />
          </button>
          <span className={`text-[10px] font-semibold ${activeTab === 'create' ? 'text-noma-btn' : 'text-nav-inactive'}`}>
            Create
          </span>
          {activeTab === 'create' && (
            <span className="w-1 h-1 rounded-full bg-brand-gold" />
          )}
        </div>

        <NavItem
          tabKey="profile"
          label="Profile"
          isActive={activeTab === 'profile'}
          onClick={() => { setActiveTab('profile'); router.push('/profile'); }}
          icon={
            session?.user?.profilePictureUrl ? (
              <Marble
                src={session.user.profilePictureUrl}
                className={`w-6 h-6 rounded-full ${activeTab === 'profile' ? 'ring-2 ring-noma-btn' : ''}`}
              />
            ) : (
              <User
                size={22}
                className={activeTab === 'profile' ? 'text-noma-btn' : 'text-nav-inactive'}
              />
            )
          }
        />
        <NavItem
          tabKey="alerts"
          label="Alerts"
          isActive={activeTab === 'alerts'}
          onClick={() => { setActiveTab('alerts'); router.push('/notifications'); }}
          icon={
            <Bell
              size={22}
              className={activeTab === 'alerts' ? 'text-noma-btn' : 'text-nav-inactive'}
            />
          }
        />
      </div>
      <div className="h-safe-area-inset-bottom" />
    </nav>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Navigation/index.tsx
git commit -m "feat: migrate Navigation SVG icons to lucide-react"
```

---

## Task 5: Migrate SearchBar component

**Files:**
- Modify: `src/components/SearchBar/index.tsx`

- [ ] **Step 1: Add lucide import and replace SVGs**

Add at top of file after existing imports:
```tsx
import { Search, SlidersHorizontal } from 'lucide-react';
```

Replace the search `<svg>` (lines 37-43) with:
```tsx
<Search size={20} className="flex-shrink-0 text-on-surface-variant" />
```

Replace the filter button `<svg>` (lines 62-67) with:
```tsx
<SlidersHorizontal size={22} className="text-on-surface-variant" />
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SearchBar/index.tsx
git commit -m "feat: migrate SearchBar SVG icons to lucide-react"
```

---

## Task 6: Migrate experiences feature components

**Files:**
- Modify: `src/features/experiences/components/EventCard/index.tsx`
- Modify: `src/features/experiences/components/CompactCard.tsx`
- Modify: `src/features/experiences/components/EventList/index.tsx`
- Modify: `src/features/experiences/components/FilterSheet.tsx`
- Modify: `src/features/experiences/components/ExperiencesPage.tsx`

### EventCard/index.tsx

- [ ] **Step 1: Add lucide import**

```tsx
import { ImageIcon, Heart, Star, MapPin } from 'lucide-react';
```

Replace `ImagePlaceholder` component (lines 54-63):
```tsx
const ImagePlaceholder = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-container-highest">
    <ImageIcon size={56} className="text-outline" strokeWidth={1.5} />
    <span className="text-xs font-medium text-on-surface-variant">No image</span>
  </div>
);
```

Replace heart SVG (lines 114-117):
```tsx
<Heart
  size={20}
  fill={hearted ? 'currentColor' : 'none'}
  className="text-white"
  strokeWidth={2}
/>
```

Replace star SVG (lines 128-131):
```tsx
<Star
  size={16}
  fill="currentColor"
  stroke="currentColor"
  strokeWidth={1}
  className="text-tertiary-fixed-dim"
/>
```

Replace location SVG (lines 150-153):
```tsx
<MapPin size={18} className="text-on-surface-variant" strokeWidth={2} />
```

### CompactCard.tsx

- [ ] **Step 2: Add lucide import**

```tsx
import { ImageIcon, Heart, Star, MapPin } from 'lucide-react';
```

Replace image placeholder `<svg>` inside the `imgError` block (lines 52-56):
```tsx
<div className="absolute inset-0 flex items-center justify-center bg-surface-container-highest">
  <ImageIcon size={32} strokeWidth={1.5} className="text-outline" />
</div>
```

Replace heart SVG (lines 68-70):
```tsx
<Heart
  size={14}
  fill={hearted ? 'currentColor' : 'none'}
  className="text-white"
  strokeWidth={2}
/>
```

Replace star SVG (lines 80-82):
```tsx
<Star size={12} fill="#f4bf00" stroke="#f4bf00" strokeWidth={1} />
```

Replace location SVG (lines 91-93):
```tsx
<MapPin size={11} strokeWidth={2} />
```

### EventList/index.tsx

- [ ] **Step 3: Add lucide import and replace SVG**

```tsx
import { ChevronRight } from 'lucide-react';
```

Replace the SVG in the "See More" button (lines 49-51):
```tsx
<ChevronRight size={16} className="text-noma-btn" strokeWidth={2} />
```

### FilterSheet.tsx

- [ ] **Step 4: Add lucide import and replace SVG**

```tsx
import { X } from 'lucide-react';
```

Replace the close button SVG (lines 67-69):
```tsx
<X size={16} className="text-on-surface-variant" strokeWidth={2.5} />
```

### ExperiencesPage.tsx

- [ ] **Step 5: Add lucide import and replace SVGs**

```tsx
import { ChevronLeft, Search, X } from 'lucide-react';
```

Replace back button SVG (lines 49-51):
```tsx
<ChevronLeft size={20} strokeWidth={2.5} className="text-on-surface" />
```

Replace search SVG (lines 56-58):
```tsx
<Search size={18} className="text-on-surface-variant" strokeWidth={2} />
```

Replace clear (X) SVG (lines 62-64):
```tsx
<X size={16} strokeWidth={2} className="text-outline" />
```

- [ ] **Step 6: Commit**

```bash
git add src/features/experiences/
git commit -m "feat: migrate experiences feature SVG icons to lucide-react"
```

---

## Task 7: Migrate experience-detail feature components

**Files:**
- Modify: `src/features/experience-detail/components/HeroSection.tsx`
- Modify: `src/features/experience-detail/components/BookingCard.tsx`
- Modify: `src/features/experience-detail/components/QuickStats.tsx`
- Modify: `src/features/experience-detail/components/MapPlaceholder.tsx`
- Modify: `src/features/experience-detail/components/ExperienceConfirmationPage.tsx`

### HeroSection.tsx

- [ ] **Step 1: Add lucide import**

```tsx
import { ImageIcon, ChevronLeft, Heart, Settings, Check, Share2, MapPin, Star } from 'lucide-react';
```

Replace image placeholder SVG (lines 29-33):
```tsx
<ImageIcon size={72} strokeWidth={1.5} className="text-outline" />
```

Replace back button SVG (lines 48-50):
```tsx
<ChevronLeft size={20} strokeWidth={2.5} className="text-on-surface" />
```

Replace heart SVG (lines 58-66):
```tsx
<Heart
  size={20}
  fill={hearted ? 'currentColor' : 'none'}
  stroke={hearted ? '#a7322f' : '#251918'}
  className={hearted ? 'text-primary' : 'text-on-surface'}
  strokeWidth={2}
/>
```

Replace settings/manage SVG (lines 74-77):
```tsx
<Settings size={20} strokeWidth={2} className="text-on-surface" />
```

Replace check (share copied) SVG (lines 88-90):
```tsx
<Check size={18} stroke="white" strokeWidth={2.5} />
```

Replace share SVG (lines 92-95):
```tsx
<Share2 size={20} strokeWidth={2} className="text-on-surface" />
```

Replace location SVG (lines 109-111):
```tsx
<MapPin size={18} stroke="rgba(255,255,255,0.9)" strokeWidth={2} />
```

Replace star SVG (lines 115-117):
```tsx
<Star size={16} fill="#f4bf00" stroke="#f4bf00" strokeWidth={1} />
```

### BookingCard.tsx

- [ ] **Step 2: Add lucide import and replace SVGs**

```tsx
import { ChevronDown } from 'lucide-react';
```

Replace both `<svg>` chevron-down elements (lines 42-44 and 59-61). Each is:
```tsx
<ChevronDown size={20} strokeWidth={2} className="text-secondary" />
```

### QuickStats.tsx

- [ ] **Step 3: Add lucide import and replace SVGs**

```tsx
import { Star, Clock, Users } from 'lucide-react';
```

Replace star SVG (lines 11-13):
```tsx
<Star size={20} fill="currentColor" stroke="currentColor" strokeWidth={1} className="text-tertiary-container" />
```

Replace clock SVG (lines 22-24):
```tsx
<Clock size={20} strokeWidth={2} className="text-secondary" />
```

Replace users SVG (lines 30-33):
```tsx
<Users size={20} strokeWidth={2} className="text-secondary" />
```

### MapPlaceholder.tsx

- [ ] **Step 4: Add lucide import and replace SVG**

```tsx
import { MapPin } from 'lucide-react';
```

Replace the map pin SVG (lines 22-26):
```tsx
<MapPin size={32} className="text-primary" strokeWidth={2} />
```

### ExperienceConfirmationPage.tsx

- [ ] **Step 5: Add lucide import and replace SVGs**

```tsx
import { Calendar, MapPin } from 'lucide-react';
```

Replace calendar SVG (lines 94-96):
```tsx
<Calendar size={11} strokeWidth={2} className="text-secondary" />
```

Replace location SVG (lines 102-104):
```tsx
<MapPin size={11} strokeWidth={2} className="text-secondary" />
```

- [ ] **Step 6: Commit**

```bash
git add src/features/experience-detail/
git commit -m "feat: migrate experience-detail SVG icons to lucide-react"
```

---

## Task 8: Migrate ReportPage — SadMascot Image + icons

**Files:**
- Modify: `src/features/report/components/ReportPage.tsx`

- [ ] **Step 1: Add lucide import and next/image import**

```tsx
import Image from 'next/image';
import { ChevronLeft, ChevronDown, Send, Plus } from 'lucide-react';
```

Replace `SadMascot` component (lines 16-31) with:
```tsx
const SadMascot = () => (
  <Image src="/nomajin-sad.png" width={80} height={80} alt="NOMAJIN triste" style={{ objectFit: 'contain' }} />
);
```

Replace `ChevronDown` component (lines 33-37) — delete it. Where it is used (`<ChevronDown />`), replace with:
```tsx
<ChevronDown size={16} strokeWidth={2} className="text-secondary" />
```

Replace `SendIcon` component (lines 39-44) — delete it. Where it is used, replace with:
```tsx
<Send size={16} strokeWidth={2} className="text-white" />
```

Replace back button SVG (lines 126-129):
```tsx
<ChevronLeft size={20} strokeWidth={2.5} className="text-foreground" />
```

Replace add button SVG in "Attach Evidence" section (lines 223-225):
```tsx
<Plus size={20} strokeWidth={2} className="text-outline" />
```

- [ ] **Step 2: Commit**

```bash
git add src/features/report/components/ReportPage.tsx
git commit -m "feat: replace SadMascot SVG with PNG and migrate report page icons to lucide-react"
```

---

## Task 9: Migrate CalendarPage and NotificationsPage

**Files:**
- Modify: `src/features/calendar/components/CalendarPage.tsx`
- Modify: `src/features/notifications/components/NotificationsPage.tsx`

### CalendarPage.tsx

- [ ] **Step 1: Add lucide import and replace SVGs**

```tsx
import { User, Search, MapPin, Check } from 'lucide-react';
```

Replace user avatar SVG (lines 119-122):
```tsx
<User size={18} strokeWidth={2} className="text-primary" />
```

Replace search SVG (lines 139-142):
```tsx
<Search size={20} strokeWidth={2} className="text-primary" />
```

Replace location SVG (lines 263-266):
```tsx
<MapPin size={13} strokeWidth={2} className="text-on-surface-variant" />
```

Replace checkmark SVG (lines 338-340):
```tsx
<Check size={14} strokeWidth={2.5} className="text-primary" />
```

### NotificationsPage.tsx

- [ ] **Step 2: Add lucide import and replace SVGs**

```tsx
import { User, Search, Check, Hourglass } from 'lucide-react';
```

Replace user SVG in top-left (lines 59-62):
```tsx
<User size={18} strokeWidth={2} className="text-on-surface-variant" />
```

Replace search SVG in top-right (lines 66-68):
```tsx
<Search size={18} strokeWidth={2} className="text-primary" />
```

Replace check badge SVG (lines 100-102):
```tsx
<Check size={9} stroke="white" strokeWidth={2.5} />
```

Replace hourglass badge SVG (lines 139-141):
```tsx
<Hourglass size={9} strokeWidth={2} className="text-on-tertiary-container" />
```

- [ ] **Step 3: Commit**

```bash
git add src/features/calendar/ src/features/notifications/
git commit -m "feat: migrate calendar and notifications SVG icons to lucide-react"
```

---

## Task 10: Migrate ProfilePage and HostProfilePage

**Files:**
- Modify: `src/features/profile/components/ProfilePage.tsx`
- Modify: `src/features/profile/components/HostProfilePage.tsx`

### ProfilePage.tsx

Keep as-is (exceptions):
- Progress ring SVG (line 270) — custom UI, not an icon
- Gold verified badge SVG (line 240) — custom brand badge

- [ ] **Step 1: Add lucide import and replace migratable SVGs**

```tsx
import { Search, Pencil, ImageIcon } from 'lucide-react';
```

Replace search SVG in header (lines 199-202):
```tsx
<Search size={20} strokeWidth={2} className="text-primary" />
```

Replace edit button SVG (lines 230-233):
```tsx
<Pencil size={13} strokeWidth={2} className="text-secondary" />
```

Replace NFT `NFTImagePlaceholder` component SVG (lines 41-52):
```tsx
function NFTImagePlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#f4dddb]">
      <ImageIcon size={32} strokeWidth={1.5} className="text-outline" />
    </div>
  );
}
```

### HostProfilePage.tsx

Keep as-is (exceptions):
- Blue verified badge SVG (line 244) — custom brand badge

- [ ] **Step 2: Add lucide import and replace SVGs**

```tsx
import { ChevronLeft, MoreVertical, MapPin, Star, ImageIcon, Clock } from 'lucide-react';
```

Replace back button SVG (lines 212-214):
```tsx
<ChevronLeft size={22} strokeWidth={2.5} className="text-primary" />
```

Replace more-options SVG (lines 223-228):
```tsx
<MoreVertical size={20} className="text-on-surface" />
```

Replace location SVG (lines 260-262):
```tsx
<MapPin size={14} strokeWidth={2} className="text-white/90" />
```

Replace `StarRow` component stars (lines 65-76) — replace each `<svg>` in the map with:
```tsx
const StarRow = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i}
        size={14}
        fill={i <= rating ? '#d3a500' : '#dfbfbc'}
        stroke={i <= rating ? '#d3a500' : '#dfbfbc'}
        strokeWidth={1}
      />
    ))}
  </div>
);
```

Replace `ExpImagePlaceholder` component SVG (lines 80-90):
```tsx
function ExpImagePlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#f4dddb]">
      <ImageIcon size={40} strokeWidth={1.5} className="text-outline" />
    </div>
  );
}
```

Replace clock SVG inside `ExperienceCard` (lines 127-130):
```tsx
<Clock size={13} strokeWidth={2} className="text-secondary" />
```

Replace stat star SVG (lines 284-286):
```tsx
<Star size={18} fill="#d3a500" stroke="#d3a500" strokeWidth={1} />
```

- [ ] **Step 3: Commit**

```bash
git add src/features/profile/
git commit -m "feat: migrate profile page SVG icons to lucide-react"
```

---

## Task 11: Migrate iconoir-react usages

**Files:**
- Modify: `src/features/experience-detail/components/ExperienceManagePage.tsx`
- Modify: `src/features/profile/components/UserInfo/index.tsx`

### ExperienceManagePage.tsx

- [ ] **Step 1: Replace iconoir-react import**

```tsx
// OLD
import { Pin, QrCode, Check, Xmark } from 'iconoir-react';

// NEW
import { MapPin, QrCode, Check, X } from 'lucide-react';
```

Replace usages:
```tsx
// OLD → NEW
<Pin className="w-4 h-4 text-[#1f1f1f]" strokeWidth={2} />
→ <MapPin size={16} className="text-on-surface" strokeWidth={2} />

<QrCode className="w-6 h-6 text-[#1f1f1f]" strokeWidth={2} />
→ <QrCode size={24} className="text-on-surface" strokeWidth={2} />

<Check className="w-5 h-5" strokeWidth={2.5} />
→ <Check size={20} strokeWidth={2.5} />

<Xmark className="w-5 h-5" strokeWidth={2.5} />
→ <X size={20} strokeWidth={2.5} />
```

### UserInfo/index.tsx

- [ ] **Step 2: Replace iconoir-react import**

```tsx
// OLD
import { CheckCircleSolid } from 'iconoir-react';

// NEW
import { CheckCircle2 } from 'lucide-react';
```

Replace usage:
```tsx
// OLD
<CheckCircleSolid className="text-blue-600" />

// NEW
<CheckCircle2 size={16} className="text-blue-600" fill="currentColor" />
```

- [ ] **Step 3: Commit**

```bash
git add src/features/experience-detail/components/ExperienceManagePage.tsx
git add src/features/profile/components/UserInfo/index.tsx
git commit -m "feat: migrate iconoir-react icons to lucide-react"
```

---

## Task 12: Remove iconoir-react dependency + update CLAUDE.md

**Files:**
- Modify: `package.json`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Remove iconoir-react from package.json**

In `package.json`, find and delete the line:
```json
"iconoir-react": "^7.11.0",
```

Run to update lockfile:
```bash
pnpm install
```

- [ ] **Step 2: Update CLAUDE.md Regra 7**

In `CLAUDE.md`, replace:
```
- Para ícones, usar `iconoir-react`
```
with:
```
- Para ícones, usar `lucide-react`
```

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml CLAUDE.md
git commit -m "chore: remove iconoir-react dependency, update icon library reference to lucide-react in CLAUDE.md"
```
