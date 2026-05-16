# Feature-Based Architecture — NOMA Mini-App

**Date:** 2026-05-10  
**Status:** Approved  
**Scope:** Full `src/` restructure to feature-based layout

---

## Context

The current architecture mixes routing, business logic, and shared UI in a flat structure:

- `src/components/` holds both truly shared UI (Navigation) and feature-specific components (EventCard, Pay)
- `src/app/[route]/_components/` holds route-level components with no clear ownership rule
- `src/hooks/` and `src/lib/` are used by specific features but presented as global
- State logic (e.g., filter state) lives in page files, making pages hard to maintain

The goal is a feature-based structure where each page maps to a feature, and everything used by that feature lives inside it. Code used by 2+ features is promoted one level up to `src/`.

---

## Target Structure

```
src/
├── app/                          ← Next.js routing only (page.tsx, layout.tsx, api/)
│   ├── (protected)/
│   │   ├── layout.tsx
│   │   ├── calendar/page.tsx
│   │   ├── create-experience/page.tsx
│   │   ├── home/page.tsx
│   │   └── profile/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── initiate-payment/route.ts
│   │   ├── transaction-confirmation/route.ts
│   │   └── verify-proof/route.ts
│   ├── experience/[id]/
│   │   ├── confirmation/page.tsx
│   │   ├── manage/page.tsx
│   │   └── page.tsx
│   ├── experiences/page.tsx
│   ├── host/[id]/page.tsx
│   ├── notifications/page.tsx
│   ├── report/page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── page.tsx
│
├── features/
│   ├── experiences/              ← home + listagem + filtros
│   │   ├── components/
│   │   │   ├── EventCard/        (from src/components/EventCard)
│   │   │   ├── EventList/        (from src/components/EventList)
│   │   │   ├── FilterSheet.tsx   (from src/app/_components/FilterSheet.tsx)
│   │   │   ├── HomeHeader.tsx    (from src/app/_components/HomeHeader.tsx)
│   │   │   └── index.ts          ← exporta todos os componentes da feature
│   │   ├── hooks/
│   │   │   ├── useExperiences.ts (from src/hooks/useExperiences.ts)
│   │   │   ├── useFilterSheet.ts (new — extracts filter state from page.tsx)
│   │   │   └── index.ts          ← exporta todos os hooks da feature
│   │   └── index.ts              ← re-exporta components + hooks
│   │
│   ├── experience-detail/        ← detalhe, confirmação e gestão de experiência
│   │   ├── components/
│   │   │   ├── AboutSection.tsx
│   │   │   ├── BookingCard.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── MapPlaceholder.tsx
│   │   │   ├── OrganizerCard.tsx
│   │   │   ├── QuickStats.tsx
│   │   │   ├── TagsSection.tsx
│   │   │   └── index.ts          ← exporta todos os componentes da feature
│   │   │   (all from src/app/experience/[id]/_components/)
│   │   └── index.ts              ← re-exporta components
│   │
│   ├── create-experience/        ← fluxo de criação de experiência
│   │   ├── components/
│   │   │   ├── CreateExperienceStep1.tsx
│   │   │   ├── CreateExperienceStep2.tsx
│   │   │   ├── Step3Review.tsx
│   │   │   ├── NomajinFace.tsx
│   │   │   ├── icons.tsx
│   │   │   └── index.ts          ← exporta todos os componentes da feature
│   │   ├── types/
│   │   │   └── index.ts          ← exporta todos os tipos da feature
│   │   └── index.ts              ← re-exporta components + types
│   │   (all from src/app/(protected)/create-experience/_components/)
│   │
│   ├── auth/                     ← autenticação World ID + next-auth
│   │   ├── components/
│   │   │   ├── AuthButton/       (from src/components/AuthButton)
│   │   │   ├── LoginPage/        (from src/components/LoginPage)
│   │   │   ├── Verify/           (from src/components/Verify)
│   │   │   └── index.ts          ← exporta todos os componentes da feature
│   │   └── index.ts              ← re-exporta components
│   │
│   ├── payments/                 ← pagamentos on-chain
│   │   ├── components/
│   │   │   ├── Pay/              (from src/components/Pay)
│   │   │   ├── Transaction/      (from src/components/Transaction)
│   │   │   ├── TransactionMock/  (from src/components/TransactionMock)
│   │   │   └── index.ts          ← exporta todos os componentes da feature
│   │   └── index.ts              ← re-exporta components
│   │
│   ├── profile/                  ← perfil do usuário e do host
│   │   ├── components/
│   │   │   ├── ContractDebugger/ (from src/components/ContractDebugger)
│   │   │   ├── UserInfo/         (from src/components/UserInfo)
│   │   │   ├── ViewPermissions/  (from src/components/ViewPermissions)
│   │   │   └── index.ts          ← exporta todos os componentes da feature
│   │   └── index.ts              ← re-exporta components
│   │
│   ├── calendar/                 ← agenda (sem componentes locais ainda)
│   │   └── index.ts
│   ├── notifications/            ← notificações (sem componentes locais ainda)
│   │   └── index.ts
│   └── report/                   ← reportes (sem componentes locais ainda)
│       └── index.ts
│
├── components/                   ← UI compartilhada usada em 2+ features
│   ├── Navigation/               (from src/components/Navigation)
│   ├── PageLayout/               (from src/components/PageLayout)
│   ├── SearchBar/                (from src/components/SearchBar)
│   └── TagChip/                  (from src/components/TagChip)
│
├── lib/                          ← utilitários sem UI, usados em 2+ features
│   └── contractUtils.ts          (from src/lib/contractUtils.ts)
│
├── contracts/                    ← constantes e ABIs on-chain (inalterado)
│   └── constants.ts
│
├── auth/                         ← configuração next-auth (nível framework, inalterado)
│   ├── index.ts
│   └── wallet/
│
├── providers/                    ← providers React app-wide (inalterado)
│   ├── index.tsx
│   └── Eruda/
│
└── assets/                       ← arquivos estáticos (inalterado)
```

---

## Regra de localização

| Localização | Critério |
|---|---|
| `features/[f]/components/` | componente usado **somente** nessa feature |
| `features/[f]/hooks/` | hook usado **somente** nessa feature |
| `features/[f]/types/` | tipos usados **somente** nessa feature |
| `src/components/` | componente usado em **2+ features** |
| `src/hooks/` | hook usado em **2+ features** |
| `src/lib/` | utilitário sem UI, usado em **2+ features** |
| `src/auth/` | config de framework (next-auth) — sempre em `src/` |
| `src/providers/` | providers React app-wide — sempre em `src/` |

---

## Barrel Exports (index.ts)

Cada feature expõe uma API pública limpa via `index.ts` em três níveis:

### Nível 1 — `features/[f]/components/index.ts`
Exporta todos os componentes da feature:
```ts
// features/experience-detail/components/index.ts
export { AboutSection } from './AboutSection';
export { BookingCard } from './BookingCard';
export { HeroSection } from './HeroSection';
export { MapPlaceholder } from './MapPlaceholder';
export { OrganizerCard } from './OrganizerCard';
export { QuickStats } from './QuickStats';
export { TagsSection } from './TagsSection';
```

### Nível 2 — `features/[f]/hooks/index.ts` e `features/[f]/types/index.ts`
Exporta todos os hooks e tipos da feature:
```ts
// features/experiences/hooks/index.ts
export { useExperiences } from './useExperiences';
export { useFilterSheet } from './useFilterSheet';
```

### Nível 3 — `features/[f]/index.ts`
Re-exporta tudo da feature — esse é o ponto de entrada público:
```ts
// features/experience-detail/index.ts
export * from './components';

// features/experiences/index.ts
export * from './components';
export * from './hooks';

// features/create-experience/index.ts
export * from './components';
export * from './types';
```

### Resultado: importações limpas nas páginas
```tsx
// app/experience/[id]/page.tsx
import { ExperienceDetailPage } from '@/features/experience-detail';

// app/page.tsx
import { HomePage } from '@/features/experiences';

// app/(protected)/create-experience/page.tsx
import { CreateExperiencePage } from '@/features/create-experience';
```

---

## Pages após migração

Cada `page.tsx` fica fina — importa sempre pelo barrel da feature:

```tsx
// app/page.tsx
import { HomePage } from '@/features/experiences';
export default function Page() { return <HomePage />; }

// app/experience/[id]/page.tsx
import { ExperienceDetailPage } from '@/features/experience-detail';
export default function Page({ params }) { return <ExperienceDetailPage params={params} />; }

// app/(protected)/create-experience/page.tsx
import { CreateExperiencePage } from '@/features/create-experience';
export default function Page() { return <CreateExperiencePage />; }
```

A lógica de estado (ex: filtros) migra para hooks da feature (`useFilterSheet`), não fica no `page.tsx`.

---

## Componentes removidos de `src/components/`

Após a migração, `src/components/` contém **apenas**:

- `Navigation/`
- `PageLayout/`
- `SearchBar/`
- `TagChip/`

Os demais (`EventCard`, `EventList`, `Pay`, `Transaction`, `TransactionMock`, `AuthButton`, `LoginPage`, `Verify`, `UserInfo`, `ContractDebugger`, `ViewPermissions`) migram para suas respectivas features.

---

## Novo hook: `useFilterSheet`

Extraído de `app/page.tsx`. Gerencia os 7 `useState` de filtro:

```ts
// features/experiences/hooks/useFilterSheet.ts
export function useFilterSheet() {
  // isOpen, applied, pending
  // open(), close(), apply(), clear()
  // setPendingCategory(), setPendingPrice(), setPendingRating()
}
```

---

## O que NÃO muda

- `src/app/api/` — rotas de API permanecem onde estão (requisito Next.js)
- `src/app/globals.css` — fonte da verdade de design tokens
- `src/auth/` — config next-auth (nível framework)
- `src/providers/` — providers app-wide
- `src/contracts/` e `src/abi/` — constantes e ABIs on-chain
- `src/assets/` — arquivos estáticos
- Alias `@/` aponta para `src/` (sem mudança no `tsconfig.json`)

---

## Ordem de migração sugerida

1. Criar estrutura de pastas `features/`
2. Migrar `features/experiences/` (feature mais complexa — valida o padrão)
3. Migrar `features/experience-detail/`
4. Migrar `features/create-experience/`
5. Migrar `features/auth/`
6. Migrar `features/payments/`
7. Migrar `features/profile/`
8. Limpar `src/components/` — remover o que foi para features
9. Atualizar `CLAUDE.md` com nova regra de localização
