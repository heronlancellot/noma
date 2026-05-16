'use client';

import { X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FILTER_CATEGORIES = ['All', 'Hiking', 'Surf', 'Yoga', 'Social', 'Cultura'];
const PRICE_OPTIONS = ['All', 'Free', 'Under $50', '$50 – $100', 'Over $100'];
const RATING_OPTIONS = ['4.5+', '4.0+', '3.5+', 'Any'];

const STAR_RATINGS = new Set(['4.5+', '4.0+', '3.5+']);

interface FilterSheetProps {
  pending: { category: string; price: string; rating: string };
  onCategoryChange: (v: string) => void;
  onPriceChange: (v: string) => void;
  onRatingChange: (v: string) => void;
  onClear: () => void;
  onApply: () => void;
  onClose: () => void;
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-2 rounded-full font-body-sm font-semibold transition-colors ${
        active
          ? 'bg-primary text-on-primary'
          : 'bg-surface-container text-on-surface-variant'
      }`}
    >
      {label}
    </button>
  );
}

function PriceChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-2 rounded-full font-body-sm font-semibold transition-colors border ${
        active
          ? 'bg-primary text-on-primary border-transparent'
          : 'bg-surface-container-lowest text-on-surface border-outline-variant'
      }`}
    >
      {label}
    </button>
  );
}

function RatingSection({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const isStarRating = STAR_RATINGS.has(value);

  return (
    <div>
      <p className="font-label-caps text-outline mb-3">Minimum Rating</p>

      {isStarRating ? (
        <>
          <div className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-primary bg-surface-container-low mb-3">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className="text-tertiary-container"
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span className="font-body-sm font-semibold text-on-surface">
              {value} Rating
            </span>
          </div>

          <div className="flex gap-2 flex-wrap">
            {RATING_OPTIONS.filter((r) => r !== value).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(opt)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-outline-variant bg-surface-container-lowest font-body-sm font-semibold text-on-surface transition-colors"
              >
                {STAR_RATINGS.has(opt) && (
                  <Star size={12} className="text-tertiary-container" strokeWidth={1.5} />
                )}
                {opt}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full font-body-sm font-semibold transition-colors border ${
                value === opt
                  ? 'bg-primary text-on-primary border-transparent'
                  : 'bg-surface-container-lowest text-on-surface border-outline-variant'
              }`}
            >
              {STAR_RATINGS.has(opt) && (
                <Star
                  size={12}
                  className={value === opt ? 'text-on-primary' : 'text-tertiary-container'}
                  strokeWidth={1.5}
                />
              )}
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function FilterSheet({
  pending,
  onCategoryChange,
  onPriceChange,
  onRatingChange,
  onClear,
  onApply,
  onClose,
}: FilterSheetProps) {
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} />

      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col gap-6 p-6 pb-10 bg-surface rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between">
          <h2 className="font-h2 text-on-surface">Filters</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="bg-surface-container hover:bg-surface-container-highest"
          >
            <X size={16} className="text-on-surface-variant" strokeWidth={2.5} />
          </Button>
        </div>

        <div>
          <p className="font-label-caps text-outline mb-3">Category</p>
          <div className="flex flex-wrap gap-2">
            {FILTER_CATEGORIES.map((opt) => (
              <CategoryChip
                key={opt}
                label={opt}
                active={pending.category === opt}
                onClick={() => onCategoryChange(opt)}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="font-label-caps text-outline mb-3">Price</p>
          <div className="flex flex-wrap gap-2">
            {PRICE_OPTIONS.map((opt) => (
              <PriceChip
                key={opt}
                label={opt}
                active={pending.price === opt}
                onClick={() => onPriceChange(opt)}
              />
            ))}
          </div>
        </div>

        <RatingSection value={pending.rating} onChange={onRatingChange} />

        <div className="flex items-center gap-4 pt-2 border-t border-outline-variant/30">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClear}
          >
            Clear All
          </Button>
          <Button
            variant="primary"
            size="xl"
            onClick={onApply}
            className="flex-1"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
}
