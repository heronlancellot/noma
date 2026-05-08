'use client';

import { CreateFormData, FormErrors, InputChange } from './types';
import { IconClose, IconChevron, IconArrowForward } from './icons';
import NomajinFace from './NomajinFace';

const CATEGORIES = ['Wellness & Health', 'Outdoor Adventure', 'Art & Culture', 'Food & Drink', 'Social', 'Other'];

const Err = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-xs mt-0.5 ml-1 text-error">{msg}</p> : null;

interface Props {
  formData: CreateFormData;
  errors: FormErrors;
  onChange: (e: InputChange) => void;
  onNext: () => void;
  onClose: () => void;
}

export default function Step1Basics({ formData, errors, onChange, onNext, onClose }: Props) {
  const input = `w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 font-body-md text-on-surface placeholder:text-secondary-fixed-dim focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:border-primary transition-shadow outline-none shadow-sm`;

  return (
    <>
      {/* ── Header ── */}
      <header className="px-container-padding pt-12 pb-md bg-surface sticky top-0 z-10">
        <div className="flex items-center justify-between mb-lg">
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container transition-colors text-on-surface"
          >
            <IconClose />
          </button>
          <div className="font-label-caps text-secondary">CREATE</div>
          <div className="w-10" />
        </div>

        <div className="w-full bg-surface-variant rounded-full h-2 mb-md overflow-hidden">
          <div className="bg-primary h-2 rounded-full w-1/3 transition-all duration-500 ease-in-out" />
        </div>

        <h1 className="font-h1 text-on-surface mb-xs">Step 1: The Basics</h1>
        <p className="font-body-md text-on-surface-variant">
          Start by giving your experience a catchy name and a brief description.
        </p>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 px-container-padding pb-32 overflow-y-auto">
        <form className="flex flex-col gap-stack-gap mt-md">
          {/* Title */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-caps text-on-surface ml-1" htmlFor="exp-title">Title</label>
            <div className="relative">
              <input
                id="exp-title"
                name="title"
                type="text"
                value={formData.title}
                onChange={onChange}
                placeholder="e.g., Sunset Yoga on the Beach"
                className={`${input} ${errors.title ? 'border-error' : ''}`}
              />
            </div>
            <Err msg={errors.title} />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-xs mt-sm">
            <label className="font-label-caps text-on-surface ml-1" htmlFor="exp-desc">Description</label>
            <div className="relative">
              <textarea
                id="exp-desc"
                name="description"
                rows={4}
                value={formData.description}
                onChange={onChange}
                placeholder="Describe what makes your experience unique..."
                className={`${input} resize-none ${errors.description ? 'border-error' : ''}`}
              />
            </div>
            <Err msg={errors.description} />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-xs mt-sm">
            <label className="font-label-caps text-on-surface ml-1" htmlFor="exp-cat">Category</label>
            <div className="relative">
              <select
                id="exp-cat"
                name="category"
                value={formData.category}
                onChange={onChange}
                className={`${input} appearance-none pr-10 ${errors.category ? 'border-error' : ''} ${!formData.category ? 'text-secondary-fixed-dim' : ''}`}
              >
                <option value="" disabled>Select a category</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c} className="text-on-surface">{c}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-on-surface-variant">
                <IconChevron />
              </div>
            </div>
            <Err msg={errors.category} />
          </div>

          {/* Nomajin tip card */}
          <div className="mt-lg bg-secondary-container rounded-2xl p-4 flex gap-md items-start shadow-sm relative overflow-hidden">
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

      {/* ── Footer ── */}
      <footer className="fixed bottom-0 w-full max-w-[390px] bg-surface/95 backdrop-blur-md px-container-padding py-6 border-t border-outline-variant/30 z-50">
        <button
          onClick={onNext}
          className="w-full bg-[#db5852] text-[#fafaf8] font-body-md font-bold py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
        >
          Next Step
          <IconArrowForward />
        </button>
      </footer>
    </>
  );
}
