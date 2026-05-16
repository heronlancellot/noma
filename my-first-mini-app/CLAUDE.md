# NOMA Mini-App — Guia para Claude

## Identidade do Projeto

NOMA é um marketplace descentralizado de experiências rodando dentro do **World App** (Web3/MiniKit). O mascote é o NOMAJIN — um sol com rosto alegre. A marca é: warm, adventurous, trustworthy, joyful.

- **Viewport:** 390×844px (mobile-first, sem necessidade de desktop)
- **Contexto:** Mini App do WorldCoin, autenticação via World ID (next-auth + WorldMiniKit)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, TypeScript 5
- **Styling:** Tailwind CSS v4 (tokens definidos em `src/app/globals.css`)
- **Web3:** `@worldcoin/minikit-js`, `@worldcoin/minikit-react`, `viem` (leitura on-chain)
- **UI Kit:** `@worldcoin/mini-apps-ui-kit-react`
- **Auth:** next-auth v5
- **Forms:** react-hook-form
- **Utils:** tailwind-merge, clsx, iconoir-react

## Arquitetura de Pastas

```
src/
├── app/                          # Next.js routing APENAS (page.tsx, layout.tsx, api/)
│   ├── (protected)/
│   │   ├── layout.tsx
│   │   ├── calendar/page.tsx     # thin wrapper → @/features/calendar
│   │   ├── create-experience/page.tsx  # thin wrapper → @/features/create-experience
│   │   ├── home/page.tsx
│   │   └── profile/page.tsx     # thin wrapper → @/features/profile
│   ├── api/                     # Rotas de API (inalterado)
│   ├── experience/[id]/
│   │   ├── confirmation/page.tsx  # thin wrapper → @/features/experience-detail
│   │   ├── manage/page.tsx        # thin wrapper → @/features/experience-detail
│   │   └── page.tsx               # thin wrapper → @/features/experience-detail
│   ├── experiences/page.tsx       # thin wrapper → @/features/experiences
│   ├── host/[id]/page.tsx         # thin wrapper → @/features/profile
│   ├── notifications/page.tsx     # thin wrapper → @/features/notifications
│   ├── report/page.tsx            # thin wrapper → @/features/report
│   ├── layout.tsx
│   ├── globals.css               # FONTE DA VERDADE para tokens de design
│   └── page.tsx                  # thin wrapper → @/features/experiences
│
├── features/                     # TODA a lógica de produto vive aqui
│   ├── experiences/              # Home + listagem + filtros
│   │   ├── components/           # EventCard, EventList, FilterSheet, HomeHeader, HomePage, ExperiencesPage
│   │   ├── hooks/                # useExperiences, useFilterSheet
│   │   ├── utils.ts              # guessCategory
│   │   └── index.ts              # barrel público da feature
│   ├── experience-detail/        # Detalhe, confirmação e gestão
│   │   ├── components/           # AboutSection, BookingCard, HeroSection, etc.
│   │   └── index.ts
│   ├── create-experience/        # Fluxo de criação
│   │   ├── components/           # Step1-3, NomajinFace, icons, CreateExperiencePage
│   │   ├── types/                # Tipos do formulário
│   │   └── index.ts
│   ├── auth/                     # Autenticação World ID
│   │   ├── components/           # AuthButton, LoginPage, Verify
│   │   └── index.ts
│   ├── payments/                 # Pagamentos on-chain
│   │   ├── components/           # Pay, Transaction, TransactionMock
│   │   └── index.ts
│   ├── profile/                  # Perfil do usuário e do host
│   │   ├── components/           # ProfilePage, HostProfilePage, ContractDebugger, UserInfo, ViewPermissions
│   │   └── index.ts
│   ├── calendar/
│   │   ├── components/           # CalendarPage
│   │   └── index.ts
│   ├── notifications/
│   │   ├── components/           # NotificationsPage
│   │   └── index.ts
│   └── report/
│       ├── components/           # ReportPage
│       └── index.ts
│
├── components/                   # UI compartilhada usada em 2+ features
│   ├── Navigation/
│   ├── PageLayout/
│   ├── SearchBar/
│   └── TagChip/
│
├── lib/                          # Utilitários sem UI, usados em 2+ features
├── providers/                    # Providers React app-wide (inalterado)
├── auth/                         # Configuração next-auth (inalterado)
├── contracts/                    # Constantes e ABIs on-chain (inalterado)
└── assets/                       # Arquivos estáticos (inalterado)
```

**Regra de localização:**

| Localização | Critério |
|---|---|
| `features/[f]/components/` | componente usado **somente** nessa feature |
| `features/[f]/hooks/` | hook usado **somente** nessa feature |
| `features/[f]/types/` | tipos usados **somente** nessa feature |
| `src/components/` | componente usado em **2+ features** |
| `src/hooks/` | hook usado em **2+ features** |
| `src/lib/` | utilitário sem UI, usado em **2+ features** |

**Padrão de barrel exports (3 níveis):**
```ts
// Nível 1 — features/[f]/components/index.ts
export { ComponenteA } from './ComponenteA';
export { ComponenteB } from './ComponenteB';

// Nível 2 — features/[f]/hooks/index.ts  (se houver hooks)
export { useAlgo } from './useAlgo';

// Nível 3 — features/[f]/index.ts  (ponto de entrada público)
export * from './components';
export * from './hooks';   // se houver
export * from './types';   // se houver
```

**Padrão de página thin (app/):
```tsx
// src/app/experience/[id]/page.tsx
import { ExperienceDetailPage } from '@/features/experience-detail';
export default ExperienceDetailPage;
```

---

## REGRAS OBRIGATÓRIAS

### Regra 1 — Design Tokens (CRÍTICO)

**NUNCA** usar valores arbitrários de cor no Tailwind. **SEMPRE** usar as classes mapeadas dos tokens de `globals.css`.

#### Mapeamento de Cores

| ❌ Errado (arbitrário) | ✅ Correto (token) |
|---|---|
| `text-[#db5852]` | `text-noma-btn` |
| `bg-[#db5852]` | `bg-noma-btn` |
| `text-[#a7322f]` | `text-primary` |
| `bg-[#a7322f]` | `bg-primary` |
| `text-[#c84a45]` | `text-primary-container` |
| `text-[#4f5f78]` | `text-secondary` |
| `bg-[#4f5f78]` | `bg-secondary` |
| `text-[#251918]` | `text-on-surface` |
| `text-[#58413f]` | `text-on-surface-variant` |
| `bg-[#fff8f7]` | `bg-surface` |
| `text-[#fff8f7]` | `text-surface` |
| `bg-[#ffe9e7]` | `bg-surface-container` |
| `bg-[#f4dddb]` | `bg-surface-container-highest` |
| `border-[#f4dddb]` | `border-surface-container-highest` |
| `bg-[#fff0ef]` | `bg-surface-container-low` |
| `text-[#dfbfbc]` | `text-outline-variant` |
| `border-[#dfbfbc]` | `border-outline-variant` |
| `text-[#8b716e]` | `text-outline` |
| `bg-[#d3a500]` | `bg-tertiary-container` |
| `text-[#d3a500]` | `text-tertiary-container` |
| `bg-[#f4bf00]` | `bg-tertiary-fixed-dim` |
| `text-[#f4bf00]` | `text-tertiary-fixed-dim` |
| `bg-[#ffdf92]` | `bg-tertiary-fixed` |
| `text-[#0d1f35]` | `text-foreground` |
| `text-[#fafaf8]` | `text-background` |
| `bg-[#fafaf8]` | `bg-background` |
| `text-[#ba1a1a]` | `text-error` |
| `text-[#410003]` | `text-on-error-container` |
| `text-[#fccd09]` / `text-[#fcdd09]` | `text-tertiary-fixed-dim` |
| `text-[#1f1f1f]` | `text-on-surface` |
| `text-[#757683]` | `text-on-surface-variant` |

#### Tokens de Gradiente (usar variáveis CSS diretamente)
```tsx
// ❌ Errado
<div className="bg-gradient-to-br from-[#0d1f35] to-[#f5c000]">

// ✅ Correto
<div className="bg-gradient-to-br from-foreground to-tertiary-fixed-dim">
```

---

### Regra 2 — Tipografia

Usar as **utilities** definidas em `globals.css`. Nunca `text-[Npx]` para tamanhos do design system.

| ❌ Errado | ✅ Correto | Uso |
|---|---|---|
| `text-[32px] font-bold` (Quicksand) | `font-h1` | Headlines principais |
| `text-[24px] font-bold` (Quicksand) | `font-h2` | Subtítulos de seção |
| `text-[20px] font-semibold` (Quicksand) | `font-h3` | Títulos de card |
| `text-[16px]` + Inter | `font-body-md` | Corpo de texto padrão |
| `text-[14px]` + Inter | `font-body-sm` | Texto secundário |
| `text-[12px] uppercase tracking-wide` | `font-label-caps` | Labels, badges, chips |
| `text-[10px]` ou `text-[11px]` | `text-xs` (Tailwind padrão) | Micro texto |
| `text-[13px]` | `text-sm` (Tailwind padrão) | Texto pequeno |
| `text-[15px]` | `text-sm` ou `font-body-sm` | Texto médio-pequeno |
| `text-[17px]` / `text-[18px]` | `font-h3` ou `text-lg` | Títulos menores |

**Classes de fonte de família:**
```tsx
// ❌ Evitar font-family manual inline
// ✅ Usar classes utilitárias
<h1 className="font-h1">Título</h1>
<p className="font-body-sm text-on-surface-variant">Texto</p>
<span className="font-label-caps text-secondary">LABEL</span>
<span className="font-quicksand-bold text-on-surface">Quicksand bold</span>
```

---

### Regra 3 — Sem Inline Styles

**NUNCA** usar `style={{ }}` com valores hardcoded.

```tsx
// ❌ Errado
<h1 style={{ color: '#0d1f35' }}>Título</h1>
<p style={{ color: '#5a5a6e', maxWidth: 280 }}>Texto</p>

// ✅ Correto
<h1 className="text-foreground">Título</h1>
<p className="text-secondary max-w-[280px]">Texto</p>
```

**Exceção:** `maxWidth` / `width` com valores únicos (não tokens) podem usar Tailwind arbitrário `max-w-[280px]` pois não há equivalente no design system de cores/tipografia.

---

### Regra 4 — Componentização

**Sempre componentizar** UI reutilizável. Threshold: se uma UI aparece ou aparecerá em 2+ lugares, extrair para componente.

```tsx
// ❌ Errado — botão primário inline em múltiplos lugares
<button className="w-full bg-noma-btn text-on-primary py-4 rounded-full font-body-md font-bold ...">
  Confirmar
</button>

// ✅ Correto — componente compartilhado
// src/components/PrimaryButton/index.tsx
export function PrimaryButton({ children, ...props }) { ... }
```

**Componentes compartilhados que devem existir em `src/components/` (se não existirem, criar):**
- `src/components/PrimaryButton/` — botão CTA vermelho padrão
- `src/components/SecondaryButton/` — botão outlined
- `src/components/Navigation/` — bottom nav (já existe)
- `src/components/TagChip/` — chip de categoria (já existe)
- `src/components/SearchBar/` — barra de busca (já existe)

---

### Regra 5 — Imports Absolutos

**SEMPRE** usar o alias `@/`. **NUNCA** imports relativos.

```tsx
// ❌ Errado
import { Navigation } from '../../components/Navigation';
import { useExperiences } from '../hooks/useExperiences';

// ✅ Correto
import { Navigation } from '@/components/Navigation';
import { useExperiences } from '@/hooks/useExperiences';
```

---

### Regra 6 — Espaçamento

Preferir tokens de espaçamento do design system quando disponíveis:

| Token CSS | Classe Tailwind | Valor |
|---|---|---|
| `--spacing-container-padding` | `px-container-padding` | 20px |
| `--spacing-xl` | `p-xl`, `px-xl`, `py-xl` | 32px |
| `--spacing-lg` | `p-lg`, `px-lg`, `py-lg` | 24px |
| `--spacing-md` | `p-md`, `px-md`, `py-md` | 16px |
| `--spacing-sm` | `p-sm`, `px-sm`, `py-sm` | 12px |
| `--spacing-base` | `p-base` | 8px |
| `--spacing-xs` | `p-xs` | 4px |

---

### Regra 7 — Componentes de UI

- Usar `@worldcoin/mini-apps-ui-kit-react` para componentes de UI base quando disponível
- Não criar implementações customizadas de primitivos que o UI Kit já oferece
- Para ícones, usar `lucide-react`

---

### Regra 8 — Sem Build Commands

Não executar `next build`, `pnpm dev`, `pnpm build`, `pnpm lint` ou qualquer comando de build/teste. Foco em análise e edição de código.

---

## Padrões de Componente

### Estrutura padrão de componente compartilhado

```tsx
// src/components/ExampleCard/index.tsx
'use client';  // somente se necessário

interface ExampleCardProps {
  title: string;
  description: string;
}

export function ExampleCard({ title, description }: ExampleCardProps) {
  return (
    <article className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-4">
      <h3 className="font-h3 text-on-surface mb-1">{title}</h3>
      <p className="font-body-sm text-on-surface-variant">{description}</p>
    </article>
  );
}
```

### Estrutura padrão de página autenticada (thin wrapper)

```tsx
// src/app/(protected)/example/page.tsx
import { ExamplePage } from '@/features/example';
export default ExamplePage;
```

### Estrutura padrão de componente de página (dentro da feature)

```tsx
// src/features/example/components/ExamplePage.tsx
'use client';

import { Navigation } from '@/components/Navigation';

export function ExamplePage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col pb-24">
      <main className="flex-grow flex flex-col px-container-padding gap-md">
        {/* conteúdo */}
      </main>
      <Navigation />
    </div>
  );
}
```

---

## Anti-patterns a Evitar

```tsx
// ❌ Cor arbitrária
<div className="bg-[#db5852]">

// ❌ Cor hardcoded em inline style
<div style={{ background: '#db5852' }}>

// ❌ Tamanho de fonte arbitrário do design system
<p className="text-[14px]">

// ❌ Import relativo
import { X } from '../components/X';

// ❌ Lógica de UI duplicada sem componentizar
// (mesmo botão com as mesmas classes em 3 arquivos)

// ❌ TODO / FIXME / placeholders
// TODO: implementar isso depois

// ❌ TypeScript any ou @ts-ignore
const x: any = ...;
// @ts-ignore
```
