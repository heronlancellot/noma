# Design: Migração SVG → lucide-react

**Data:** 2026-05-10  
**Status:** Aprovado

---

## Objetivo

Substituir todos os ícones SVG inline, o arquivo `icons.tsx` e as importações de `iconoir-react` por componentes do `lucide-react`. Substituir as ilustrações SVG manuais (`NomajinFace`, `SadMascot`) por imagens PNG da pasta `public/`, com renomeação semântica dos arquivos.

---

## Abordagem

**Substituição direta (Abordagem B):** cada componente importa do `lucide-react` sem camadas intermediárias. Sem re-exports, sem wrappers.

---

## Escopo

### O que será migrado

| Item | Ação |
|---|---|
| `src/features/create-experience/components/icons.tsx` | Deletar; consumidores importam do `lucide-react` |
| `<svg>` inline em 25 arquivos | Substituir por componentes `lucide-react` |
| `iconoir-react` (2 arquivos) | Substituir por `lucide-react`; remover dep. |
| `NomajinFace.tsx` (SVG manual do mascote) | Substituir por `<Image>` usando `nomajin-happy.png` |
| `SadMascot` em `ReportPage.tsx` | Substituir por `<Image>` usando `nomajin-sad.png` |
| `CLAUDE.md` Regra 7 | Atualizar referência de `iconoir-react` → `lucide-react` |

### O que NÃO será tocado

- SVG de progress ring circular em `ProfilePage.tsx` — UI customizada, não ícone
- `src/assets/NOMADLOGIN.svg`, `NOMADBAD.svg`, `image.svg` — assets estáticos
- `package.json` — `lucide-react@^1.14.0` já está instalado

---

## Renomeação das imagens públicas

Todos os 8 arquivos UUID serão renomeados para nomes semânticos:

| Arquivo atual | Novo nome | Contexto |
|---|---|---|
| `407ED243-B26E-4067-B535-72CF5D602A2D Background Removed.png` | `nomajin-happy.png` | Braços abertos, animado |
| `47440F14-3E2D-4BFB-A257-C28574178AC4 Background Removed.png` | `nomajin-blush.png` | Mãos no rosto, feliz |
| `1CF2B597-8A92-40E8-B0CB-A8F98BBE03DD Background Removed.png` | `nomajin-pointing.png` | Apontando |
| `IMG_7513 Background Removed.png` | `nomajin-thumbsup.png` | Polegar para cima, caminhando |
| `F0135B4C-4DF9-48C5-91DB-D798E591FBB9 Background Removed.png` | `nomajin-wink.png` | Piscando, polegar para cima |
| `C7B05520-7E0C-4789-93A7-C829125BE226 Background Removed.png` | `nomajin-thinking.png` | Pensativo, cético |
| `B3353F28-86B0-4CDE-AF05-9587FDCDC034 Background Removed.png` | `nomajin-sad.png` | Triste, cabeça baixa |
| `6621C68D-348A-4261-9899-BD28771FDB85 Background Removed.png` | `nomajin-distressed.png` | Olhos de X, angustiado |

---

## Mapeamento de ícones: `icons.tsx` → `lucide-react`

| Export atual | Lucide icon |
|---|---|
| `IconClose` | `X` |
| `IconBack` | `ChevronLeft` |
| `IconChevron` | `ChevronDown` |
| `IconArrowForward` | `ArrowRight` |
| `IconLocation` | `MapPin` |
| `IconCalendar` | `Calendar` |
| `IconClock` | `Clock` |
| `IconGroup` | `Users` |
| `IconPayments` | `CreditCard` |
| `IconPhoto` | `ImageIcon` |
| `IconRocket` | `Rocket` |

## Mapeamento de ícones: `iconoir-react` → `lucide-react`

| iconoir | lucide |
|---|---|
| `Pin` | `MapPin` |
| `QrCode` | `QrCode` |
| `Check` | `Check` |
| `Xmark` | `X` |
| `CheckCircleSolid` | `CheckCircle2` |

## Mapeamento de SVGs inline (por arquivo)

### `src/components/Navigation/index.tsx`
| SVG | lucide |
|---|---|
| Casa (home) | `Home` |
| Bússola (explore) | `Compass` |
| Plus (create) | `Plus` |
| Calendário | `Calendar` |
| Usuário (profile) | `User` |

### `src/components/SearchBar/index.tsx`
| SVG | lucide |
|---|---|
| Lupa | `Search` |
| X (limpar) | `X` |

### `src/features/notifications/components/NotificationsPage.tsx`
| SVG | lucide |
|---|---|
| Sino | `Bell` |
| Calendário | `Calendar` |
| Check (pequeno) | `Check` |
| X (pequeno) | `X` |

### `src/features/experience-detail/components/QuickStats.tsx`
| SVG | lucide |
|---|---|
| Estrela (filled `#d3a500`) | `Star` com `fill="currentColor"` + `className="text-tertiary-container"` |
| Relógio | `Clock` |
| Usuários | `Users` |

### `src/features/experience-detail/components/ExperienceConfirmationPage.tsx`
| SVG | lucide |
|---|---|
| Relógio | `Clock` |
| MapPin | `MapPin` |

### `src/features/experience-detail/components/HeroSection.tsx`
| SVG | lucide |
|---|---|
| Placeholder imagem (grande) | `ImageIcon` |
| Chevron/seta voltar | `ChevronLeft` |
| Compartilhar | `Share2` |
| Coração (vazio/cheio) | `Heart` |
| MapPin | `MapPin` |
| Estrela | `Star` |
| Check (pequeno) | `Check` |

### `src/features/experience-detail/components/MapPlaceholder.tsx`
| SVG | lucide |
|---|---|
| MapPin (filled) | `MapPin` com `fill="currentColor"` |

### `src/features/experience-detail/components/BookingCard.tsx`
| SVG | lucide |
|---|---|
| Relógio | `Clock` |
| Usuários | `Users` |

### `src/features/experiences/components/EventCard/index.tsx`
| SVG | lucide |
|---|---|
| Placeholder imagem | `ImageIcon` |
| Coração | `Heart` |
| Estrela | `Star` |
| Relógio | `Clock` |

### `src/features/experiences/components/CompactCard.tsx`
| SVG | lucide |
|---|---|
| Placeholder imagem | `ImageIcon` |
| Coração | `Heart` |
| Estrela | `Star` |
| Relógio | `Clock` |

### `src/features/experiences/components/ExperiencesPage.tsx`
| SVG | lucide |
|---|---|
| Chevron/voltar | `ChevronLeft` |
| Filtros | `SlidersHorizontal` |
| Lupa | `Search` |

### `src/features/experiences/components/FilterSheet.tsx`
| SVG | lucide |
|---|---|
| X (fechar sheet) | `X` |

### `src/features/experiences/components/EventList/index.tsx`
| SVG | lucide |
|---|---|
| Refresh | `RefreshCw` |

### `src/features/calendar/components/CalendarPage.tsx`
| SVG | lucide |
|---|---|
| Chevron/voltar | `ChevronLeft` |
| Calendário | `Calendar` |
| MapPin | `MapPin` |
| Relógio | `Clock` |

### `src/features/profile/components/ProfilePage.tsx`
| SVG | lucide |
|---|---|
| Globo/mundo | `Globe` |
| Editar | `Pencil` |
| Chevron | `ChevronRight` |
| **Progress ring (linha 270)** | **Manter como SVG** |

### `src/features/profile/components/HostProfilePage.tsx`
| SVG | lucide |
|---|---|
| Estrela (rating) | `Star` |
| Placeholder imagem | `ImageIcon` |
| Voltar | `ChevronLeft` |
| MapPin | `MapPin` |
| Calendário | `Calendar` |
| Chevron | `ChevronRight` |

### `src/features/report/components/ReportPage.tsx`
| Item | Ação |
|---|---|
| `SadMascot` (SVG customizado) | `<Image src="/nomajin-sad.png">` |
| `ChevronDown` | `ChevronDown` do lucide |
| `Send` | `Send` do lucide |
| Chevron/voltar | `ChevronLeft` |
| Lupa / upload | `Search` / `Upload` |

### `src/features/create-experience/components/CreateExperienceStep2.tsx`
| SVG | lucide |
|---|---|
| Calendário | `Calendar` |
| Relógio | `Clock` |
| ChevronDown (select) | `ChevronDown` |

### `src/features/create-experience/components/Step3Review.tsx`
| SVG | lucide |
|---|---|
| Check | `Check` |
| Relógio | `Clock` |

### `src/features/auth/components/LoginPage/index.tsx`
| SVG | lucide |
|---|---|
| Globo / ícone World | `Globe` |

---

## Ilustrações: substituição por `<Image>`

### `NomajinFace.tsx`
- Manter a prop `size?: number` (default 36)
- Usar `<Image src="/nomajin-happy.png" width={size} height={size} alt="NOMAJIN" />`
- Adicionar `style={{ objectFit: 'contain' }}`

### `SadMascot` (ReportPage.tsx)
- Inline component local, sem props
- Substituir SVG por `<Image src="/nomajin-sad.png" width={80} height={80} alt="NOMAJIN triste" />`

---

## Remoção de dependência

Após a migração, remover `iconoir-react` do `package.json` e `pnpm-lock.yaml`.

---

## Atualização de documentação

`CLAUDE.md` Regra 7: substituir referência de `iconoir-react` por `lucide-react`.
