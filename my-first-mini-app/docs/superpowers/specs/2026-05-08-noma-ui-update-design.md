# NOMA UI Update — Design Spec

**Date:** 2026-05-08  
**Scope:** Visual layer only. All blockchain logic, hooks, contract calls, and session handling remain untouched.  
**Goal:** Make all 11 app screens identical to the Figma designs by updating JSX/styles and extracting shared UI components.

---

## 1. Design Tokens

No token file is introduced. Values are used inline consistently across all files.

| Token | Value | Usage |
|---|---|---|
| Background | `#fafaf8` | Page background |
| Dark text | `#0d1f35` | Primary headings, labels |
| Secondary text | `#5a5a6e` | Subtitles, metadata |
| Primary red | `#db5852` | CTA buttons, active nav, left borders (approved) |
| Gold | `#f5c000` | Ratings, active nav dot, timeline node |
| Card background | `#ffffff` | Cards, input fields |
| Border | `#e5e7eb` | Card borders, dividers |
| Pending gray bg | `#f3f0ef` | Pending notification background |

Typography is already configured in `globals.css`:
- Headings: Quicksand Bold (`font-quicksand-bold`)
- Body: Poppins (default sans)

---

## 2. Shared Components to Extract

All live in `src/components/`. Existing components are updated in place; new ones are created.

### 2.1 BottomNav (`src/components/Navigation/index.tsx`) — UPDATE
- 5 tabs: Home (compass), Calendar, Create (+), Profile, Alerts (bell)
- Active tab: icon in `#db5852`, label in `#db5852`, gold dot indicator below label
- Create tab: floating red circle button (`#db5852`) raised above bar, no label
- Inactive: icon + label in `#5a5a6e`
- Fixed bottom, white bg with top shadow

### 2.2 EventCard (`src/components/EventCard/index.tsx`) — UPDATE
- Hero image: `aspect-[4/3]` rounded top corners
- Category chip: top-left over image, gold bg (`#f5c000`) for Hiking, blue for Surf, etc.
- Heart button: top-right over image, white circle
- Below image: title + star rating row, organizer avatar + name row, location row with pin icon, divider, price + Join button row
- Join button: red pill (`#db5852`), "Pendente" in gold, "Aprovado" in blue
- Card: white bg, `rounded-2xl`, subtle shadow

### 2.3 SearchBar (`src/components/SearchBar/index.tsx`) — UPDATE
- Input: white bg, rounded-xl, search icon left, shadow-sm
- Filter button: white square icon button right of input
- Category chips below: horizontal scroll, active chip gold bg `#f5c000` dark text, inactive white with gray border
- Categories: All, Hiking, Surf, Yoga, Social

### 2.4 TagChip — NEW (`src/components/TagChip/index.tsx`)
```tsx
interface TagChipProps { label: string; variant?: 'gold' | 'pink' | 'default' }
```
- `gold`: `#fcedd2` bg, `#b88c3a` text
- `pink`: `#fcebe8` bg, `#5a5a6e` text  
- `default`: white bg, gray border, `#5a5a6e` text
- Shape: `rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide`

### 2.5 OrganizerRow — NEW (`src/components/OrganizerRow/index.tsx`)
```tsx
interface OrganizerRowProps { name: string; subtitle: string; avatar?: string; onMessage?: () => void }
```
- Avatar: 48px circle, fallback initial with deterministic color
- Name: bold dark text, subtitle: secondary small text
- Message button: right side, red border + red text, `rounded-full px-4 py-2 text-sm`

### 2.6 StatRow — NEW (`src/components/StatRow/index.tsx`)
```tsx
interface StatRowProps { stats: Array<{ value: string | number; label: string }> }
```
- White card, `rounded-2xl`, flex row, equal columns, vertical dividers between
- Value: `text-xl font-bold text-[#db5852]`, label: `text-xs text-[#5a5a6e] uppercase`

### 2.7 ProgressRing — NEW (`src/components/ProgressRing/index.tsx`)
```tsx
interface ProgressRingProps { percent: number; size?: number; label?: string }
```
- SVG circle, stroke `#f5c000`, track `#ffe9e7`, radius 40, strokeWidth 8
- Center text: percent value in bold
- Used in Profile for NOMA Mission

### 2.8 NFTCard — NEW (`src/components/NFTCard/index.tsx`)
```tsx
interface NFTCardProps { image: string; title: string; date: string; rarity: 'Rare' | 'Common' | 'Epic' }
```
- 2-col grid card, image top, rarity badge overlay (top-left)
- Rarity colors: Rare=gold, Common=white/gray, Epic=red
- Title + date below image

### 2.9 NotificationItem — NEW (`src/components/NotificationItem/index.tsx`)
```tsx
interface NotificationItemProps {
  type: 'approved' | 'pending';
  avatar?: string; initials?: string;
  title: string; body: string; time: string;
}
```
- Approved: white card, `border-l-4 border-[#db5852]`, red check badge on avatar
- Pending: `#f3f0ef` bg card, no left border, hourglass badge on avatar, gray initials circle fallback
- Status label: uppercase tiny text, red for approved, gold for pending

### 2.10 TimelineEvent — NEW (`src/components/TimelineEvent/index.tsx`)
```tsx
interface TimelineEventProps { time: string; title: string; location: string; category: string; isNext?: boolean }
```
- Node: circle (24px), gold filled for next event, gray outline for others
- Card: white bg, `border-l-4` colored (gold for Wellness, blue for Networking, etc.)
- Category badge: top-right of card, pill shape

### 2.11 HistoryEvent — NEW (`src/components/HistoryEvent/index.tsx`)
```tsx
interface HistoryEventProps { icon: string; title: string; date: string; location: string }
```
- Icon box: `#faf0ef` bg, rounded-xl, material icon inside in `#5a5a6e`
- Title bold, date + location below in secondary color
- `#faf0ef` card bg, no shadow, subtle border

### 2.12 StepHeader — NEW (`src/components/StepHeader/index.tsx`)
```tsx
interface StepHeaderProps { current: number; total: number; onClose: () => void; onBack?: () => void; title?: string }
```
- Top bar: back arrow (optional) + centered "CREATE" or "Create" label + X close button
- Progress bar: full-width red fill, proportional to current/total
- Step label: `STEP X OF Y` small red caps text

---

## 3. Page Updates

### 3.1 Home (`src/app/page.tsx`)
- Header: greeting "Hello, {name} 👋" + avatar right-aligned, `pt-8 pb-4 px-4`
- SearchBar component below header
- Section title "Experiências para você"
- EventList → renders updated EventCards
- BottomNav at bottom
- **Logic unchanged**: `useExperiences`, session check, search filter, status fetch

### 3.2 Experience Detail (`src/app/experience/[id]/page.tsx`)
- Hero: `h-[45vh]`, back + heart + share/settings buttons over image
- Content card: `rounded-t-3xl -mt-5`, white/warm bg
- Stats row: 3 pills (rating count, duration, participants)
- OrganizerRow component
- Description section with "Sobre a experiência" heading
- TagChip row: Adventure, Nature, Outdoor
- Map placeholder: `h-32 rounded-2xl` green gradient + pin
- Sticky bottom bar: price left, Join/Manage button right
- **Logic unchanged**: `handleRequestJoin`, `isCreator`, transaction hooks

### 3.3 Booking Confirmation (`src/app/experience/[id]/confirmation/page.tsx`)
- Full-screen centered layout, warm bg
- NOMAJIN mascot image (sun character) top center
- Heading "Your spot is being reserved! 🎉" in Quicksand bold
- Subtitle body text centered
- Preview card: white bg, gold/yellow `border-2 border-[#f5c000]`, `rounded-2xl`
  - Image 80px square `rounded-xl` left
  - "PENDING APPROVAL" label in gold caps, title, date row
- "Back to Home" primary red button, "View Request Details" ghost text button
- No bottom nav (confirmation is a terminal screen)

### 3.4 Calendar (`src/app/(protected)/calendar/page.tsx`)
- Header: avatar + NOMA centered + search icon
- "Coming Up" section with timeline:
  - Vertical line behind nodes
  - First node: gold filled circle; others: gray outline
  - Cards with `border-l-4` colored by category
  - Category badge pill top-right
- "History" section below:
  - HistoryEvent components, `#faf0ef` bg cards
- BottomNav with Calendar active
- **Logic unchanged**: data source for events

### 3.5 Profile (`src/app/(protected)/profile/page.tsx`)
- Header: fixed top, avatar left + NOMA centered + search right
- Profile hero section: dark-to-gold gradient (`from-[#0d1f35] to-[#f5c000]`)
  - Large avatar with gold ring border
  - Name + verified checkmark
  - Subtitle "Digital Nomad & Explorer"
- StatRow: Attended / Hosted / People Met
- NOMA Mission: white card with ProgressRing SVG + text description
- "My Experience NFTs" section: 2-col NFTCard grid, "VIEW ALL" link
- BottomNav with Profile active
- **Logic unchanged**: session data for user info

### 3.6 Host Profile (`src/app/host/[id]/page.tsx`)
- Top bar: back arrow + "Host Profile" centered + kebab menu
- Gradient header: dark-to-gold, host avatar (large, gold ring), name, location, "Message Host" red button
- StatRow: Experiences Hosted / People Met / Average Rating
- "About" section: white card paragraph
- "Experiences offered by" section: vertical list of experience cards
  - Image left, price badge top-right, category + duration row, title, description snippet
- "What guests are saying" horizontal scroll review cards
- BottomNav at bottom

### 3.7 Notifications (`src/app/notifications/page.tsx`)
- Header: avatar + NOMA + search icon (same as calendar/profile pattern)
- "Activity" h1 + subtitle
- NotificationItem list:
  - Approved items: white card, red left border
  - Pending items: `#f3f0ef` bg, no border, initials avatar
- Divider between approved and pending groups
- BottomNav with Alerts active

### 3.8 Report (`src/app/report/page.tsx`)
- Background: `#ecd5d3` (warm pink)
- Back arrow button top-left
- Sad NOMAJIN mascot image centered
- "Oh no!" heading + subtitle
- White form card `rounded-2xl p-5`:
  - Experience Name select
  - Type of Issue select
  - What Happened textarea
  - Attach Evidence: image preview + dashed add button
  - Contact E-mail input
  - Submit Report red button with send icon
- No bottom nav (task-focused flow)

### 3.9 Create Step 1 (`src/app/(protected)/create-experience/page.tsx`)
- StepHeader: X button + "CREATE" label, progress bar (1/3)
- "Step 1: The Basics" heading + subtitle
- White card form:
  - Title input
  - Description textarea
  - Category select
- Tip card: secondary-blue bg (`#cfe1fe`), NOMAJIN avatar left, "Nomajin says:" heading + tip text
- Sticky footer: "Next Step" red pill button

### 3.10 Create Step 2
- StepHeader: back arrow + "Create" + X, progress bar (2/3)
- "STEP 2 OF 3" label in red caps
- "Details & Logistics" heading + subtitle
- Input cards (each white `rounded-2xl` card):
  - Location: location pin icon prefix
  - Date & Time: calendar icon prefix
  - 2-col row: Duration (select) + Max Guests (number input)
  - Price per Person: payments icon + `$` prefix
- Sticky footer: "Back" ghost text left + "Next Step" red pill right
- **Logic unchanged**: form state

### 3.11 Create Step 3
- StepHeader: back arrow + "Step 3: Review", progress bar (3/3, 100%)
- "Review & Publish" heading + subtitle
- Experience Preview card: image + category badge + title + price + location + duration
- Cover Photo: dashed upload zone with red icon circle
- Celebration card: light blue bg, celebration icon, encouragement text
- Terms checkbox + label with link
- Sticky footer: "Publish Experience! 🚀" red pill button
- **Logic unchanged**: form submission

---

## 4. File Structure After Update

```
src/
  components/
    Navigation/index.tsx        ← UPDATE
    EventCard/index.tsx         ← UPDATE
    SearchBar/index.tsx         ← UPDATE
    TagChip/index.tsx           ← NEW
    OrganizerRow/index.tsx      ← NEW
    StatRow/index.tsx           ← NEW
    ProgressRing/index.tsx      ← NEW
    NFTCard/index.tsx           ← NEW
    NotificationItem/index.tsx  ← NEW
    TimelineEvent/index.tsx     ← NEW
    HistoryEvent/index.tsx      ← NEW
    StepHeader/index.tsx        ← NEW
  app/
    page.tsx                              ← UPDATE (Home)
    experience/[id]/page.tsx              ← UPDATE
    experience/[id]/confirmation/page.tsx ← UPDATE
    (protected)/calendar/page.tsx         ← UPDATE
    (protected)/profile/page.tsx          ← UPDATE
    (protected)/create-experience/page.tsx← UPDATE
    host/[id]/page.tsx                    ← UPDATE
    notifications/page.tsx                ← UPDATE
    report/page.tsx                       ← UPDATE
```

---

## 5. Constraints

- No new dependencies added
- No changes to `hooks/`, `lib/`, `contracts/`, `providers/`, `auth/`
- No changes to `layout.tsx` files
- Image sources: use `next/image` with `fill` or fixed dimensions; placeholder images from Unsplash or existing URLs
- Icons: continue using `iconoir-react`; Material Symbols icons from HTML designs are replaced with nearest iconoir equivalents
- All pages remain `'use client'` components as they are today
