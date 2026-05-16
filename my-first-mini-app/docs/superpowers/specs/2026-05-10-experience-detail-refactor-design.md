# Experience Detail Feature — Refactor Design

**Date:** 2026-05-10
**Scope:** `src/features/experience-detail/` — full refactor of ExperienceDetailPage, ExperienceManagePage, ExperienceConfirmationPage plus BookingCard token fixes.

---

## Problem

The three page components in `experience-detail` share the following issues:

1. **No `hooks/` or `types/` directories** — all logic is inline, unlike the `create-experience` feature which already has both.
2. **Duplicate type declarations** — `ExperienceData` (or similar) is declared independently in each of the three page files.
3. **`createPublicClient` instantiated inside the render** — recreated on every render in both `ExperienceDetailPage` and `ExperienceManagePage`.
4. **Transaction logic duplicated** — `useWaitForTransactionReceipt` setup + side-effects are copy-pasted between `ExperienceDetailPage` and `ExperienceManagePage`.
5. **Design token violations** — `BookingCard`, `ExperienceManagePage`, and `ExperienceConfirmationPage` use hardcoded hex colors (`bg-[#c0544e]`, `style={{ color: '#0d1f35' }}`, `text-[#1f1f1f]`, etc.) instead of the tokens defined in `globals.css`.
6. **Pages are 200–250 line orchestrators** — mixing data fetching, transaction handling, UI interaction state, and presentation.

---

## Goal

- Align `experience-detail` with the established `create-experience` pattern: `components/`, `hooks/`, `types/`, `index.ts`.
- Extract reusable types to eliminate duplication.
- Extract non-trivial stateful logic into focused hooks.
- Move `createPublicClient` to `src/lib/contractUtils.ts` as a shared singleton.
- Fix all design token violations across the three pages and `BookingCard`.
- Page components become thin orchestrators: read from hooks, pass props to presentational subcomponents.

---

## Architecture

### New directory structure

```
src/features/experience-detail/
├── components/
│   ├── ExperienceDetailPage.tsx       ← thin orchestrator (was 250 lines → ~80)
│   ├── ExperienceManagePage.tsx       ← thin orchestrator + token fixes
│   ├── ExperienceConfirmationPage.tsx ← token fixes + inline style removal
│   ├── BookingCard.tsx                ← token fixes
│   ├── HeroSection.tsx                (no changes)
│   ├── QuickStats.tsx                 (no changes)
│   ├── OrganizerCard.tsx              (no changes)
│   ├── AboutSection.tsx               (no changes)
│   ├── TagsSection.tsx                (no changes)
│   ├── MapPlaceholder.tsx             (no changes)
│   └── index.ts
├── hooks/
│   ├── useExperienceDetail.ts
│   ├── useJoinExperience.ts
│   └── index.ts
├── types/
│   └── index.ts
└── index.ts
```

### `src/lib/contractUtils.ts` addition

Export a singleton `publicClient`:

```ts
export const publicClient = createPublicClient({
  chain: worldchain,
  transport: http('https://worldchain-mainnet.g.alchemy.com/public'),
});
```

Both `ExperienceDetailPage` and `ExperienceManagePage` currently instantiate this inside the component body, recreating it on every render.

---

## Types (`src/features/experience-detail/types/index.ts`)

```ts
export interface ExperienceDetailData {
  id: string;
  title: string;
  description: string;
  price: string;         // pre-formatted: "$1.5"
  location: string;
  rating: number;
  ratingCount: number;
  images: string[];
  creator: string;
  organizer: {
    name: string;
    peopleMet: number;
  };
}

export interface ExperienceConfirmationData {
  id: string;
  title: string;
  location: string;
  startTime?: bigint;
  image: string;
}

export interface JoinRequest {
  address: string;
  status: 'pending' | 'approved';
}
```

Replaces three separate inline `ExperienceData` / `JoinRequest` declarations.

---

## Hooks

### `useExperienceDetail(experienceId: string)`

**Responsibility:** fetch experience from contract, map to `ExperienceDetailData`, manage loading/error state.

**Returns:** `{ experience, loading, error }`

**Used by:** `ExperienceDetailPage`, `ExperienceManagePage`, `ExperienceConfirmationPage` (each calls `getExperienceDetails` today — all three can use this hook).

### `useJoinExperience(experienceId: string)`

**Responsibility:** build and send the `requestJoin` transaction via MiniKit, watch receipt via `useWaitForTransactionReceipt`, expose loading/confirming state, and navigate to confirmation on success.

**Returns:** `{ joinLoading, isConfirming, handleRequestJoin }`

**Used by:** `ExperienceDetailPage` only (Manage uses approve/reject, not requestJoin).

### What stays inline (intentionally not extracted)

| Logic | Reason |
|---|---|
| `hearted` + `toggleHearted` | 4 lines, localStorage only, no side-effects worth isolating |
| `handleShare` | 8 lines, no external dependencies |
| `selectedDate` | simple controlled input state |
| `isCreator` derived value | one-liner derived from session + experience |

---

## Design Token Fixes

### `BookingCard.tsx`
| Current | Fix |
|---|---|
| `bg-[#c0544e]` | `bg-noma-btn` |
| `style={{ backgroundColor: '#fdf6f4' }}` | `bg-surface-container-low` |
| `text-[38px] font-extrabold` | `font-h1 font-extrabold` (or `text-4xl font-extrabold`) |
| `text-[16px]` | `font-body-md` |
| `text-[11px] uppercase tracking-widest font-bold` | `font-label-caps font-bold` |
| `text-[15px]` | `font-body-sm` |
| `text-[17px] font-bold` | `text-lg font-bold` |
| `style={{ boxShadow: ... }}` | keep as-is (no token for shadows) |

### `ExperienceConfirmationPage.tsx`
| Current | Fix |
|---|---|
| `style={{ backgroundColor: '#fafaf8' }}` | `bg-background` className |
| `style={{ color: '#0d1f35' }}` | `text-foreground` |
| `style={{ color: '#5a5a6e', maxWidth: 280 }}` | `text-secondary max-w-[280px]` |
| `style={{ backgroundColor: '#db5852' }}` | `bg-noma-btn` |
| `style={{ color: '#5a5a6e' }}` | `text-secondary` |
| `style={{ backgroundColor: '#fff', border: ... }}` | `bg-surface border border-tertiary-fixed-dim/40` |
| `style={{ backgroundColor: 'rgba(245,192,0,0.18)', color: '#b38d00' }}` | `bg-tertiary-fixed/20 text-tertiary-container` |
| `style={{ color: '#0d1f35' }}` on h3 | `text-foreground` |
| `style={{ color: '#5a5a6e' }}` on spans | `text-secondary` |
| `text-[24px] font-bold` | `font-h2 font-bold` |
| `text-[14px]` | `font-body-sm` |
| `text-[10px] font-bold uppercase tracking-wide` | `font-label-caps font-bold` |
| `text-[16px] font-bold` | `font-body-md font-bold` |

### `ExperienceManagePage.tsx`
| Current | Fix |
|---|---|
| `text-[#1f1f1f]` | `text-on-surface` |
| `text-[#757683]` | `text-on-surface-variant` |
| `text-[#fccd09]` (star) | `text-tertiary-fixed-dim` |
| `border-gray-200`, `bg-gray-50`, `bg-gray-100` | `border-outline-variant`, `bg-surface-container`, `bg-surface-container-low` |
| `text-gray-600` | `text-on-surface-variant` |
| `border-[#db5852]` (spinner) | `border-primary` |

---

## Component Shape After Refactor

### `ExperienceDetailPage` (after)

```tsx
export function ExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const experienceId = params.id as string;

  const { experience, loading, error } = useExperienceDetail(experienceId);
  const { joinLoading, isConfirming, handleRequestJoin } = useJoinExperience(experienceId);

  const [hearted, setHearted] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2023-10-24');
  const [shareCopied, setShareCopied] = useState(false);

  // ... toggleHearted, handleShare (inline, simple)

  const isCreator = !!(experience && session?.user && (
    session.user.walletAddress?.toLowerCase() === experience.creator.toLowerCase()
  ));

  if (loading) return <LoadingSpinner />;
  if (error || !experience) return <ErrorState error={error} />;

  return ( /* JSX using extracted subcomponents — unchanged */ );
}
```

---

## What Does NOT Change

- Presentational subcomponents: `HeroSection`, `QuickStats`, `OrganizerCard`, `AboutSection`, `TagsSection`, `MapPlaceholder` — no logic, just prop-driven UI.
- Barrel exports in `components/index.ts` and `index.ts`.
- App router thin wrappers (`app/experience/[id]/page.tsx` etc.).
- `src/auth/`, `src/contracts/`, `src/providers/`.

---

## Success Criteria

1. `experience-detail/hooks/` and `experience-detail/types/` directories exist with content.
2. `ExperienceDetailPage`, `ExperienceManagePage`, `ExperienceConfirmationPage` import types from `@/features/experience-detail/types`.
3. No inline `ExperienceData` interface declarations in any page file.
4. `createPublicClient` appears only in `src/lib/contractUtils.ts`, not in any component.
5. Zero hardcoded hex colors (`#xxxxxx`) and zero `style={{ color/background }}` in all modified files.
6. TypeScript compiles without errors (no `any`, no `@ts-ignore`).
7. Barrel exports updated to include new hooks and types.
