# Create Experience — Quality Refactor Design

**Date:** 2026-05-11  
**Branch:** feat/new-ui  
**Scope:** Steps 1–3 of the create-experience flow + shared UI primitives

---

## 1. Goals

- Eliminate all design token violations (inline styles, hardcoded hex colors, arbitrary font sizes)
- Standardize button usage via `Button` variants in `src/components/ui/button.tsx`
- Replace the custom date picker with native `datetime-local` input using existing `Input` component
- Make cover photo upload functional (local preview via FileReader)
- Use real NomajinFace in the Step 3 celebration section
- Improve performance in `CreateExperiencePage` (useMemo, granular watch)
- Share the `FormError` component across steps instead of duplicating it

---

## 2. Components to modify

### 2.1 `src/components/ui/button.tsx`

Add two new variants to `buttonVariants`:

- **`primary`**: Full CTA style — `bg-noma-btn text-white font-bold shadow-lg hover:opacity-90 active:scale-[0.98]`
- **`secondary`**: Update existing secondary variant to align with NOMA secondary action style — `bg-transparent text-secondary font-semibold hover:text-on-surface transition-colors`

`default` variant remains untouched for shadcn compatibility.

Usage in Footer:
- Step 1 Next → `<Button variant="primary" size="xl" className="w-full">`
- Step 2 Next → `<Button variant="primary">`
- Step 2 Back → `<Button variant="ghost">`
- Step 3 Publish → `<Button variant="primary" size="xl" className="w-full" disabled={!agreed}>`

### 2.2 `src/components/ui/input.tsx`

Add styling for `datetime-local` type:
- `[&::-webkit-calendar-picker-indicator]:opacity-60` — tones down native calendar icon to match design
- `[&::-webkit-calendar-picker-indicator]:cursor-pointer`

No structural changes — `Input` already uses correct design tokens.

### 2.3 `src/components/ui/native-select.tsx`

Add `lg` size option:
- `data-[size=lg]:h-12 data-[size=lg]:rounded-xl data-[size=lg]:text-base data-[size=lg]:py-3 data-[size=lg]:pl-4 data-[size=lg]:pr-10`

This aligns `NativeSelect` height with `Input` (`h-12`) so fields on the same row look consistent.

### 2.4 `src/components/ui/form-error.tsx` *(new file)*

Shared error message component used in Step 1 and Step 2 (currently duplicated as local `Err` in both files).

```tsx
export function FormError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-error font-semibold px-1 mt-0.5">{msg}</p>;
}
```

---

## 3. Feature: create-experience

### 3.1 `CreateExperienceStep2.tsx`

**Remove entirely:**
- `InlineSelect` component
- `DatePickerInput` component
- `MONTHS`, `DAYS`, `HOURS`, `MINUTES`, `MONTH_FULL` constants
- `DateParts` interface
- `parseDateParts` function
- `CARD_SHADOW` inline style object
- `LABEL_TEXT = 'text-[13px]...'` (arbitrary font size)
- `INPUT_CLASS` (uses `text-[16px]`, arbitrary font size)

**Replace with:**
- `<Input type="datetime-local">` via RHF `Controller` for Date & Time field
- `<NativeSelect size="lg">` for Duration
- `<Input type="number">` for Max Guests and Price
- `<Input type="text">` for Location
- `FormError` from `@/components/ui/form-error` replacing local `Err`
- `shadow-card` className replacing all `style={CARD_SHADOW}` usages
- `Button` from `@/components/ui/button` in Footer (via `CreateExperienceFooter`)
- Font sizes: `text-sm font-semibold` replacing `text-[13px] font-semibold` on labels

**Card structure stays:** The `CARD` pattern (rounded-2xl, border, bg) is valid and stays as a className constant — only the inline shadow moves to `shadow-card`.

### 3.2 `Step3Review.tsx`

**Token violations to fix:**
- `style={{ boxShadow: '0 4px 20px...' }}` → `shadow-card`
- `text-[17px] font-semibold` → `font-h3`
- `text-[15px] font-semibold` → `font-body-md font-semibold`
- `text-[13px]` → `text-sm`
- `text-[12px]` → `text-xs`
- `text-[18px]` (price) → `text-lg`
- `font-bold text-primary text-[18px]` → `font-h3 text-primary`

**Checkbox:** Replace raw `<input type="checkbox">` + `accent-[#a7322f]` with `<Checkbox>` from `@/components/ui/checkbox`.

**Cover photo upload — functional:**
```
<label htmlFor="cover-upload" className="...cursor-pointer">
  <Input
    id="cover-upload"
    type="file"
    accept="image/jpeg,image/png"
    className="sr-only"
    onChange={handleCoverUpload}
  />
  {/* existing UI */}
</label>
```

`handleCoverUpload` logic:
1. Validate `file.size <= 5 * 1024 * 1024` — if not, set field error
2. `FileReader.readAsDataURL(file)`
3. `onResult: setValue('coverImage', base64string)` — the `<img>` preview in the card above reads `formData.coverImage` and updates automatically
4. `handleCoverUpload` is passed as a prop from `CreateExperiencePage` (keeps Step3Review presentational)

**Nomajin celebration section:** Replace `<Rocket>` icon + generic container with `<NomajinFace size={48}>` (`/nomajin-happy.png`). Keep the card background and text.

### 3.3 `CreateExperiencePage.tsx`

**`useMemo` for `createPublicClient`:**
```tsx
const client = useMemo(() => createPublicClient({
  chain: worldchain,
  transport: http('https://worldchain-mainnet.g.alchemy.com/public'),
}), []);
```

**Granular `watch`:**
```tsx
const [title, coverImage, location, duration, maxGuests, price, category, date] = watch([
  'title', 'coverImage', 'location', 'duration', 'maxGuests', 'price', 'category', 'date'
]);
const formValues = { title, coverImage, location, duration, maxGuests, price, category, date };
```

**`handleCoverUpload`:** Defined in `CreateExperiencePage`, passed as prop to `Step3Review`:
```tsx
const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    setError('coverImage', { message: 'Image must be under 5MB' });
    return;
  }
  const reader = new FileReader();
  reader.onload = () => setValue('coverImage', reader.result as string);
  reader.readAsDataURL(file);
};
```

`setError` and `setValue` are added to the `useForm` destructure.

### 3.4 `CreateExperienceFooter/index.tsx`

Replace all inline button markup with `<Button variant="primary" | "ghost">` from `@/components/ui/button`.

Step 3 publish button states:
- `pending` → `<Button disabled>` with spinner + "Publishing..."
- `success` → button text "🎉 Published!"
- default → "Publish Experience!" + Rocket icon

### 3.5 `CreateExperienceStep1.tsx`

- Replace local `Err` with `<FormError>` from `@/components/ui/form-error`
- No other changes (Step 1 is already clean)

---

## 4. Files changed summary

| File | Action |
|------|--------|
| `src/components/ui/button.tsx` | Add `primary` + update `secondary` variants |
| `src/components/ui/input.tsx` | Add datetime-local picker indicator styles |
| `src/components/ui/native-select.tsx` | Add `lg` size |
| `src/components/ui/form-error.tsx` | New shared error component |
| `src/features/create-experience/components/CreateExperienceStep1.tsx` | Use `FormError` |
| `src/features/create-experience/components/CreateExperienceStep2.tsx` | Full token fix + ui/ components |
| `src/features/create-experience/components/Step3Review.tsx` | Token fix + functional upload + Nomajin + Checkbox |
| `src/features/create-experience/components/Footer/index.tsx` | Use `Button` variants |
| `src/features/create-experience/components/CreateExperiencePage.tsx` | useMemo + granular watch + handleCoverUpload |

---

## 5. Out of scope

- IPFS/remote upload (coverImage stays as base64 in form state, passed as string to contract)
- Step 1 UI redesign (already clean)
- Header component changes
- Navigation or other pages
