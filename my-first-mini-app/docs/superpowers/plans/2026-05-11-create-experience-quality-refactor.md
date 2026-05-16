# Create Experience — Quality Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate all design token violations, standardize Button/Input/Select via ui/ components, make cover photo upload functional, and fix performance issues in the create-experience flow.

**Architecture:** Shared UI primitives (`button.tsx`, `input.tsx`, `native-select.tsx`, `form-error.tsx`) are updated first, then feature components consume them. `CreateExperiencePage` owns `handleCoverUpload` and passes it as prop to keep `Step3Review` presentational.

**Tech Stack:** Next.js 15, React 19, TypeScript 5, react-hook-form, Tailwind CSS v4, cva, lucide-react, shadcn/radix-ui

**Spec:** `docs/superpowers/specs/2026-05-11-create-experience-quality-refactor-design.md`

---

## File Map

| File | Action |
|------|--------|
| `src/components/ui/button.tsx` | Add `primary` variant, update `secondary` variant |
| `src/components/ui/input.tsx` | Add datetime-local picker indicator styles |
| `src/components/ui/native-select.tsx` | Add `lg` size |
| `src/components/ui/form-error.tsx` | New — shared inline error component |
| `src/features/create-experience/components/CreateExperienceStep1.tsx` | Use `FormError` instead of local `Err` |
| `src/features/create-experience/components/CreateExperienceStep2.tsx` | Full token fix + replace custom date picker + use ui/ components |
| `src/features/create-experience/components/Step3Review.tsx` | Token fix + functional upload + Nomajin + Checkbox |
| `src/features/create-experience/components/Footer/index.tsx` | Use `Button` variants |
| `src/features/create-experience/components/CreateExperiencePage.tsx` | `useMemo` for client, granular `watch`, add `handleCoverUpload` |

---

## Task 1: Add `primary` and `secondary` variants to Button

**Files:**
- Modify: `src/components/ui/button.tsx`

- [ ] **Step 1: Add variants to `buttonVariants`**

Open `src/components/ui/button.tsx`. In the `variants.variant` object, add `primary` after `default` and replace the `secondary` value:

```tsx
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 [a]:hover:bg-primary/80",
        primary:
          "bg-noma-btn text-white font-bold shadow-lg hover:opacity-90",
        secondary:
          "bg-transparent text-secondary font-semibold hover:text-on-surface transition-colors border-none",
        outline:
          "border-border bg-background text-foreground hover:bg-muted aria-expanded:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-1.5 px-4 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-6 gap-1 rounded-full px-2.5 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-full px-3.5 text-sm has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 px-6 text-base has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xl: "h-14 gap-2 px-8 text-base font-semibold tracking-wide has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6",
        icon: "size-9",
        "icon-xs": "size-6 rounded-full [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-full",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

The `Button` function and exports below remain unchanged.

---

## Task 2: Improve `Input` for `datetime-local`

**Files:**
- Modify: `src/components/ui/input.tsx`

- [ ] **Step 1: Add picker indicator styles**

Replace the entire file content:

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-xl border border-input bg-surface-container-low px-4 py-3 font-body-md transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-on-surface placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
        className
      )}
      {...props}
    />
  )
}

export { Input }
```

---

## Task 3: Add `lg` size to `NativeSelect`

**Files:**
- Modify: `src/components/ui/native-select.tsx`

- [ ] **Step 1: Add `lg` to size type and data attribute styles**

Replace the `NativeSelectProps` type and the `<select>` className:

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default" | "lg"
}

function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        "group/native-select relative w-fit has-[select:disabled]:opacity-50",
        className
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className="h-8 w-full min-w-0 appearance-none rounded-lg border border-input bg-transparent py-1 pr-8 pl-2.5 text-sm transition-colors outline-none select-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-[size=sm]:py-0.5 data-[size=lg]:h-12 data-[size=lg]:rounded-xl data-[size=lg]:text-base data-[size=lg]:py-3 data-[size=lg]:pl-4 data-[size=lg]:pr-10 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
        {...props}
      />
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground select-none" aria-hidden="true" data-slot="native-select-icon" />
    </div>
  )
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
```

---

## Task 4: Create shared `FormError` component

**Files:**
- Create: `src/components/ui/form-error.tsx`

- [ ] **Step 1: Create the file**

```tsx
interface FormErrorProps {
  msg?: string;
}

export function FormError({ msg }: FormErrorProps) {
  if (!msg) return null;
  return <p className="text-xs text-error font-semibold px-1 mt-0.5">{msg}</p>;
}
```

---

## Task 5: Update Step 1 to use shared `FormError`

**Files:**
- Modify: `src/features/create-experience/components/CreateExperienceStep1.tsx`

- [ ] **Step 1: Replace local `Err` with `FormError`**

Replace the entire file:

```tsx
'use client';

import { UseFormRegister, Control, FieldErrors, Controller } from 'react-hook-form';
import { CreateFormData } from '@/features/create-experience/types';
import { ChevronsUpDown } from 'lucide-react';
import NomajinFace from './NomajinFace';
import { CreateExperienceHeader } from '@/features/create-experience/components/Header';
import { CreateExperienceFooter } from '@/features/create-experience/components/Footer';
import { Textarea } from '@/components/ui/textarea';
import { FormError } from '@/components/ui/form-error';

const CATEGORIES = ['Wellness & Health', 'Outdoor Adventure', 'Art & Culture', 'Food & Drink', 'Social', 'Other'];

interface Props {
  register: UseFormRegister<CreateFormData>;
  control: Control<CreateFormData>;
  errors: FieldErrors<CreateFormData>;
  onNext: () => void;
  onClose: () => void;
}

export default function CreateExperienceStep1({ register, control, errors, onNext, onClose }: Props) {
  return (
    <>
      <CreateExperienceHeader step={1} onClose={onClose} />

      <main className="flex-1 px-container-padding pb-32 overflow-y-auto">
        <form className="flex flex-col gap-md mt-md">
          {/* Title */}
          <div className="flex flex-col gap-sm">
            <label className="font-body-md font-bold text-on-surface ml-1" htmlFor="exp-title">Title</label>
            <input
              id="exp-title"
              type="text"
              {...register('title', { required: 'Required' })}
              placeholder="e.g., Sunset Yoga on the Beach"
              className={`w-full bg-surface-container-lowest border border-outline-variant rounded-lg !p-3 font-body-md text-on-surface placeholder:text-secondary-fixed-dim focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${errors.title ? 'border-error' : ''}`}
            />
            <FormError msg={errors.title?.message} />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-sm">
            <label className="font-body-md font-bold text-on-surface ml-1" htmlFor="exp-desc">Description</label>
            <Textarea
              id="exp-desc"
              rows={4}
              {...register('description', { required: 'Required' })}
              placeholder="Describe what makes your experience unique..."
              className={`w-full bg-surface-container-lowest border border-outline-variant rounded-lg !p-3 font-body-md text-on-surface placeholder:text-secondary-fixed-dim focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none ${errors.description ? 'border-error' : ''}`}
            />
            <FormError msg={errors.description?.message} />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-sm">
            <label className="font-body-md font-bold text-on-surface ml-1" htmlFor="exp-cat">Category</label>
            <div className="relative">
              <Controller
                name="category"
                control={control}
                rules={{ required: 'Required' }}
                render={({ field }) => (
                  <select
                    {...field}
                    id="exp-cat"
                    className={`w-full bg-surface-container-lowest border border-outline-variant rounded-lg !p-3 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none pr-10 ${errors.category ? 'border-error' : ''} ${!field.value ? 'text-secondary-fixed-dim' : ''}`}
                  >
                    <option value="" disabled>Select a category</option>
                    {CATEGORIES.map(c => (
                      <option key={c} value={c} className="text-on-surface">{c}</option>
                    ))}
                  </select>
                )}
              />
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-on-surface-variant">
                <ChevronsUpDown size={20} />
              </div>
            </div>
            <FormError msg={errors.category?.message} />
          </div>

          {/* Nomajin tip card */}
          <div className="mt-sm bg-secondary-container rounded-2xl p-4 flex gap-md items-start shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-surface-container-lowest shrink-0 overflow-hidden shadow-sm flex items-center justify-center border-2 border-primary-container z-10">
              <NomajinFace size={34} />
            </div>
            <div className="flex-1 z-10">
              <h3 className="font-h3 text-on-secondary-container mb-1">Nomajin says:</h3>
              <p className="font-body-sm text-on-secondary-container opacity-90">
                Keep your title short and descriptive! People love knowing exactly what they&apos;re signing up for.
              </p>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl z-0" />
          </div>
        </form>
      </main>

      <CreateExperienceFooter onNext={onNext} step={1} />
    </>
  );
}
```

---

## Task 6: Rewrite Step 2 — tokens + native inputs

**Files:**
- Modify: `src/features/create-experience/components/CreateExperienceStep2.tsx`

- [ ] **Step 1: Replace entire file**

```tsx
'use client';

import { UseFormRegister, Control, FieldErrors, Controller } from 'react-hook-form';
import { CreateFormData } from '@/features/create-experience/types';
import { MapPin, Clock, Users, CreditCard, Calendar } from 'lucide-react';
import { CreateExperienceHeader } from '@/features/create-experience/components/Header';
import { CreateExperienceFooter } from '@/features/create-experience/components/Footer';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { FormError } from '@/components/ui/form-error';

const DURATIONS = ['1 hour', '2 hours', '3 hours', '4+ hours'];

const CARD = 'bg-surface-container-lowest rounded-2xl border border-outline-variant/25 overflow-hidden shadow-card';
const LABEL_ROW = 'flex items-center gap-2.5 px-4 pt-4 pb-3';
const DIVIDER = 'h-px bg-outline-variant/20 mx-4';

interface Props {
  register: UseFormRegister<CreateFormData>;
  control: Control<CreateFormData>;
  errors: FieldErrors<CreateFormData>;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
}

export default function CreateExperienceStep2({ register, control, errors, onNext, onBack, onClose }: Props) {
  return (
    <>
      <CreateExperienceHeader step={2} onClose={onClose} onBack={onBack} />

      <main className="flex-grow overflow-y-auto px-4 pt-6 pb-36 flex flex-col gap-4">

        {/* Location */}
        <div className={CARD}>
          <div className={LABEL_ROW}>
            <MapPin size={20} className="text-on-surface-variant" />
            <span className="text-sm font-semibold text-on-surface-variant">Location</span>
          </div>
          <div className={DIVIDER} />
          <Input
            type="text"
            {...register('location', { required: 'Required' })}
            placeholder="Search places..."
            className="rounded-none border-0 shadow-none focus-visible:ring-0 h-12 bg-transparent"
          />
          <FormError msg={errors.location?.message} />
        </div>

        {/* Date & Time */}
        <div className={`${CARD} ${errors.date ? 'border-error' : ''}`}>
          <div className={LABEL_ROW}>
            <Calendar size={20} className="text-on-surface-variant" />
            <span className="text-sm font-semibold text-on-surface-variant">Date &amp; Time</span>
          </div>
          <div className={DIVIDER} />
          <Controller
            name="date"
            control={control}
            rules={{ required: 'Required' }}
            render={({ field }) => (
              <Input
                type="datetime-local"
                value={field.value}
                onChange={field.onChange}
                className="rounded-none border-0 shadow-none focus-visible:ring-0 h-12 bg-transparent"
              />
            )}
          />
          <FormError msg={errors.date?.message} />
        </div>

        {/* Duration + Max Guests */}
        <div className="grid grid-cols-2 gap-3">
          <div className={CARD}>
            <div className={LABEL_ROW}>
              <Clock size={20} className="text-on-surface-variant" />
              <span className="text-sm font-semibold text-on-surface-variant">Duration</span>
            </div>
            <div className={DIVIDER} />
            <Controller
              name="duration"
              control={control}
              rules={{ required: 'Required' }}
              render={({ field }) => (
                <NativeSelect
                  {...field}
                  size="lg"
                  className="w-full rounded-none border-0 shadow-none"
                >
                  <NativeSelectOption value="" disabled>Select...</NativeSelectOption>
                  {DURATIONS.map(d => (
                    <NativeSelectOption key={d} value={d}>{d}</NativeSelectOption>
                  ))}
                </NativeSelect>
              )}
            />
            <FormError msg={errors.duration?.message} />
          </div>

          <div className={CARD}>
            <div className={LABEL_ROW}>
              <Users size={20} className="text-on-surface-variant" />
              <span className="text-sm font-semibold text-on-surface-variant">Max Guests</span>
            </div>
            <div className={DIVIDER} />
            <Input
              type="number"
              {...register('maxGuests', { required: 'Required', min: { value: 1, message: 'Min 1' } })}
              placeholder="e.g. 10"
              min="1"
              className="rounded-none border-0 shadow-none focus-visible:ring-0 h-12 bg-transparent"
            />
            <FormError msg={errors.maxGuests?.message} />
          </div>
        </div>

        {/* Price */}
        <div className={CARD}>
          <div className={LABEL_ROW}>
            <CreditCard size={20} className="text-on-surface-variant" />
            <span className="text-sm font-semibold text-on-surface-variant">Price per Person</span>
          </div>
          <div className={DIVIDER} />
          <div className="flex items-center px-4">
            <span className="font-body-md text-on-surface mr-2">$</span>
            <Input
              type="number"
              {...register('price', { required: 'Required' })}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="flex-1 rounded-none border-0 shadow-none focus-visible:ring-0 h-12 px-0 bg-transparent"
            />
          </div>
          <FormError msg={errors.price?.message} />
        </div>

      </main>

      <CreateExperienceFooter step={2} onNext={onNext} onBack={onBack} />
    </>
  );
}
```

---

## Task 7: Rewrite Step 3 — tokens + functional upload + Nomajin + Checkbox

**Files:**
- Modify: `src/features/create-experience/components/Step3Review.tsx`

- [ ] **Step 1: Replace entire file**

```tsx
'use client';

import { Control, FieldErrors, Controller, useWatch } from 'react-hook-form';
import { CreateFormData, ButtonState } from '@/features/create-experience/types';
import { ImageIcon, MapPin, Clock } from 'lucide-react';
import { CreateExperienceHeader } from '@/features/create-experience/components/Header';
import { CreateExperienceFooter } from '@/features/create-experience/components/Footer';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import NomajinFace from '@/features/create-experience/components/NomajinFace';

interface Props {
  formData: CreateFormData;
  control: Control<CreateFormData>;
  errors: FieldErrors<CreateFormData>;
  onPublish: () => void;
  onBack: () => void;
  onCoverUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  buttonState: ButtonState;
}

export default function Step3Review({ formData, control, errors, onPublish, onBack, onCoverUpload, buttonState }: Props) {
  const agreed = useWatch({ control, name: 'agreed' });

  return (
    <>
      <CreateExperienceHeader step={3} onBack={onBack} />

      <main className="flex-1 overflow-y-auto px-container-padding py-lg pb-32 flex flex-col gap-stack-gap">

        {/* Experience Preview */}
        <div>
          <h3 className="font-h3 text-on-surface mb-3">Experience Preview</h3>
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-card">
            <div className="relative w-full h-44">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formData.coverImage || '/image-default.png'}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              {formData.category && (
                <span className="absolute top-3 left-3 bg-tertiary-fixed text-on-tertiary-container text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  {formData.category}
                </span>
              )}
            </div>

            <div className="px-4 pt-3.5 pb-4 flex flex-col gap-2">
              <div className="flex justify-between items-start gap-2">
                <span className="font-h3 text-on-surface leading-snug flex-1">
                  {formData.title || 'Your Experience Title'}
                </span>
                <span className="font-h3 text-primary shrink-0">
                  {formData.price ? `$${formData.price}` : '—'}
                </span>
              </div>

              {formData.location && (
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <MapPin size={14} />
                  <span className="text-sm">{formData.location}</span>
                </div>
              )}

              {(formData.duration || formData.maxGuests) && (
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <Clock size={14} />
                  <span className="text-sm">
                    {[formData.duration, formData.maxGuests && `Up to ${formData.maxGuests} people`]
                      .filter(Boolean).join(' • ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cover Photo upload */}
        <div>
          <h3 className="font-h3 text-on-surface mb-3">Cover Photo</h3>
          <label
            htmlFor="cover-upload"
            className="block border-2 border-dashed border-primary/25 rounded-2xl py-10 flex flex-col items-center justify-center text-center bg-primary/[0.04] cursor-pointer"
          >
            <Input
              id="cover-upload"
              type="file"
              accept="image/jpeg,image/png"
              className="sr-only"
              onChange={onCoverUpload}
            />
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-3 shadow-sm">
              <ImageIcon size={20} className="text-white" />
            </div>
            <p className="font-body-md font-semibold text-on-surface mb-1">
              {formData.coverImage ? 'Tap to change cover photo' : 'Tap to add cover photo'}
            </p>
            <p className="text-sm text-on-surface-variant">JPEG or PNG, max 5MB</p>
          </label>
          {errors.coverImage && (
            <p className="text-xs text-error font-semibold mt-1 px-1">{errors.coverImage.message}</p>
          )}
        </div>

        {/* Nomajin celebration */}
        <div className="flex flex-col items-center text-center p-6 bg-secondary-container/20 rounded-2xl border border-secondary-container/40">
          <div className="mb-3">
            <NomajinFace size={56} />
          </div>
          <p className="font-body-md text-on-surface leading-relaxed">
            You&apos;re almost there! NOMAJIN is ready to welcome your new adventure.
          </p>
        </div>

        {/* Terms */}
        <Controller
          name="agreed"
          control={control}
          rules={{ required: 'You must agree to the terms to publish' }}
          render={({ field: { onChange, value } }) => (
            <div className="flex flex-col gap-1">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={value}
                  onCheckedChange={onChange}
                  className="mt-0.5 shrink-0"
                />
                <label htmlFor="terms" className="text-sm text-on-surface-variant leading-relaxed cursor-pointer">
                  I agree to the{' '}
                  <span className="text-primary font-semibold underline decoration-primary/30">
                    Terms &amp; Conditions
                  </span>{' '}
                  and confirm that this experience complies with community guidelines.
                </label>
              </div>
              {errors.agreed && (
                <p className="text-xs text-error font-semibold ml-8">{errors.agreed.message}</p>
              )}
            </div>
          )}
        />
      </main>

      <CreateExperienceFooter step={3} onPublish={onPublish} buttonState={buttonState} agreed={agreed} />
    </>
  );
}
```

---

## Task 8: Update Footer to use `Button` variants

**Files:**
- Modify: `src/features/create-experience/components/Footer/index.tsx`

- [ ] **Step 1: Replace entire file**

```tsx
import { ArrowRight, Rocket } from 'lucide-react';
import { ButtonState } from '@/features/create-experience/types';
import { Button } from '@/components/ui/button';

type Props =
  | { step: 1; onNext: () => void }
  | { step: 2; onNext: () => void; onBack: () => void }
  | { step: 3; onPublish: () => void; buttonState: ButtonState; agreed: boolean }

const BASE = 'fixed bottom-0 w-full max-w-[390px] bg-surface/95 backdrop-blur-md px-container-padding py-6 border-t border-outline-variant/30 z-50';

export function CreateExperienceFooter(props: Props) {
  const onNext = 'onNext' in props ? props.onNext : undefined;
  const onBack = 'onBack' in props ? props.onBack : undefined;
  const onPublish = 'onPublish' in props ? props.onPublish : undefined;
  const buttonState = 'buttonState' in props ? props.buttonState : undefined;
  const agreed = 'agreed' in props ? props.agreed : false;

  const Footer: Record<1 | 2 | 3, React.ReactElement> = {
    1: (
      <footer className={BASE}>
        <Button variant="primary" size="xl" className="w-full" onClick={onNext}>
          Next Step
          <ArrowRight size={20} />
        </Button>
      </footer>
    ),
    2: (
      <footer className={BASE}>
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button variant="primary" onClick={onNext}>
            Next Step
            <ArrowRight size={20} />
          </Button>
        </div>
      </footer>
    ),
    3: (
      <footer className={BASE}>
        <Button
          variant="primary"
          size="xl"
          className="w-full"
          onClick={onPublish}
          disabled={!agreed || buttonState === 'pending'}
        >
          {buttonState === 'pending' ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Publishing...
            </>
          ) : buttonState === 'success' ? (
            '🎉 Published!'
          ) : (
            <>
              Publish Experience!
              <Rocket size={20} />
            </>
          )}
        </Button>
      </footer>
    ),
  };

  return Footer[props.step];
}
```

---

## Task 9: Update `CreateExperiencePage` — useMemo + granular watch + handleCoverUpload

**Files:**
- Modify: `src/features/create-experience/components/CreateExperiencePage.tsx`

- [ ] **Step 1: Replace entire file**

```tsx
'use client';

import { NOMAD_EXPERIENCE_ADDRESS, NOMAD_EXPERIENCE_ABI } from '@/contracts/constants';
import { MiniKit } from '@worldcoin/minikit-js';
import { useWaitForTransactionReceipt } from '@worldcoin/minikit-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createPublicClient, http, encodeFunctionData } from 'viem';
import { worldchain } from 'viem/chains';
import { useRouter } from 'next/navigation';

import { CreateFormData, ButtonState } from '@/features/create-experience/types';
import CreateExperienceStep1 from '@/features/create-experience/components/CreateExperienceStep1';
import CreateExperienceStep2 from '@/features/create-experience/components/CreateExperienceStep2';
import Step3Review from '@/features/create-experience/components/Step3Review';

export function CreateExperiencePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [buttonState, setButtonState] = useState<ButtonState>(undefined);
  const [transactionId, setTransactionId] = useState('');

  const { register, control, trigger, watch, getValues, setValue, setError, formState: { errors } } = useForm<CreateFormData>({
    defaultValues: {
      title: '', description: '', category: '', location: '',
      date: '', duration: '', maxGuests: '', price: '', coverImage: '',
      agreed: false,
    },
  });

  const client = useMemo(() => createPublicClient({
    chain: worldchain,
    transport: http('https://worldchain-mainnet.g.alchemy.com/public'),
  }), []);

  const { isLoading: isConfirming, isSuccess: isConfirmed, isError, error } = useWaitForTransactionReceipt({
    client,
    appConfig: { app_id: process.env.NEXT_PUBLIC_WLD_CLIENT_ID as `app_${string}` },
    transactionId,
  });

  useEffect(() => {
    if (transactionId && !isConfirming) {
      if (isConfirmed) {
        setButtonState('success');
        setTimeout(() => router.push('/'), 2000);
      } else if (isError) {
        console.error('Transaction failed:', error);
        setButtonState('failed');
        setTimeout(() => { setButtonState(undefined); setTransactionId(''); }, 3000);
      }
    }
  }, [isConfirmed, isConfirming, isError, error, transactionId, router]);

  const handleNext = async () => {
    if (step === 1) {
      const valid = await trigger(['title', 'description', 'category']);
      if (valid) setStep(2);
    } else if (step === 2) {
      const valid = await trigger(['location', 'date', 'duration', 'maxGuests', 'price']);
      if (valid) setStep(3);
    }
  };

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

  const handlePublish = async () => {
    const valid = await trigger(['agreed']);
    if (!valid) return;

    setButtonState('pending');
    const formData = getValues();

    try {
      const startTimestamp = BigInt(Math.floor(new Date(formData.date).getTime() / 1000));
      const durationHours = parseInt(formData.duration) || 2;
      const endTimestamp = startTimestamp + BigInt(durationHours * 3600);
      const priceInWei = BigInt(Math.floor(Number(formData.price) * 10 ** 18));
      const maxParticipants = BigInt(formData.maxGuests || '10');

      const data = encodeFunctionData({
        abi: NOMAD_EXPERIENCE_ABI,
        functionName: 'createExperience',
        args: [
          formData.title, formData.description,
          formData.coverImage || '/image-default.png',
          startTimestamp, endTimestamp, formData.location,
          priceInWei, maxParticipants,
        ],
      });

      const _txResult = await MiniKit.sendTransaction({
        chainId: 480,
        transactions: [{ to: NOMAD_EXPERIENCE_ADDRESS, data }],
      });
      const finalPayload = _txResult.data;

      if (finalPayload.status === 'success') {
        setTransactionId(finalPayload.userOpHash);
      } else {
        setButtonState('failed');
        setTimeout(() => setButtonState(undefined), 3000);
      }
    } catch (err) {
      console.error('Error:', err);
      setButtonState('failed');
      setTimeout(() => setButtonState(undefined), 3000);
    }
  };

  const [title, coverImage, location, duration, maxGuests, price, category, date, description] = watch([
    'title', 'coverImage', 'location', 'duration', 'maxGuests', 'price', 'category', 'date', 'description',
  ]);
  const formValues: CreateFormData = {
    title, coverImage, location, duration, maxGuests, price, category, date, description,
    agreed: false,
  };

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased flex flex-col max-w-[390px] mx-auto relative overflow-hidden">
      {step === 1 && (
        <CreateExperienceStep1
          register={register}
          control={control}
          errors={errors}
          onNext={handleNext}
          onClose={() => router.push('/')}
        />
      )}
      {step === 2 && (
        <CreateExperienceStep2
          register={register}
          control={control}
          errors={errors}
          onNext={handleNext}
          onBack={() => setStep(1)}
          onClose={() => router.push('/')}
        />
      )}
      {step === 3 && (
        <Step3Review
          formData={formValues}
          control={control}
          errors={errors}
          onPublish={handlePublish}
          onBack={() => setStep(2)}
          onCoverUpload={handleCoverUpload}
          buttonState={buttonState}
        />
      )}
    </div>
  );
}
```

---

## Self-Review

**Spec coverage:**
- ✓ Button `primary` + `secondary` variants — Task 1
- ✓ Input datetime-local styles — Task 2
- ✓ NativeSelect `lg` size — Task 3
- ✓ FormError shared component — Task 4
- ✓ Step1 uses FormError — Task 5
- ✓ Step2 full token fix + native inputs — Task 6
- ✓ Step3 token fix + functional upload + Nomajin + Checkbox — Task 7
- ✓ Footer uses Button variants — Task 8
- ✓ Page useMemo + granular watch + handleCoverUpload — Task 9

**Placeholder scan:** No TBDs, no TODOs, no "similar to task N" shortcuts. Every task has complete code.

**Type consistency:**
- `onCoverUpload: (e: React.ChangeEvent<HTMLInputElement>) => void` — defined in Task 7 Props, implemented in Task 9, matches exactly.
- `formValues: CreateFormData` — all 10 fields of `CreateFormData` present in Task 9.
- `NativeSelect size="lg"` — added in Task 3, used in Task 6.
- `Button variant="primary"` — added in Task 1, used in Tasks 8.
- `FormError` — created in Task 4, imported in Tasks 5 and 6.
