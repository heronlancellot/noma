'use client';

const FILTER_CATEGORIES = ['All', 'Hiking', 'Surf', 'Yoga', 'Social', 'Cultura'];
const PRICE_OPTIONS = ['All', 'Free', 'Under $50', '$50 – $100', 'Over $100'];
const RATING_OPTIONS = ['All', '4.5+', '4.0+', '3.5+'];

interface FilterSheetProps {
  pendingCategory: string;
  pendingPrice: string;
  pendingRating: string;
  onCategoryChange: (v: string) => void;
  onPriceChange: (v: string) => void;
  onRatingChange: (v: string) => void;
  onClear: () => void;
  onApply: () => void;
  onClose: () => void;
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-[18px] py-2 rounded-full text-[13px] font-semibold transition-colors ${
        active
          ? 'bg-primary text-white'
          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
      }`}
    >
      {label}
    </button>
  );
}

function FilterGroup({
  title, options, value, onChange,
}: {
  title: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="font-label-caps text-outline mb-2.5">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <FilterChip key={opt} label={opt} active={value === opt} onClick={() => onChange(opt)} />
        ))}
      </div>
    </div>
  );
}

export function FilterSheet({
  pendingCategory, pendingPrice, pendingRating,
  onCategoryChange, onPriceChange, onRatingChange,
  onClear, onApply, onClose,
}: FilterSheetProps) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col gap-6 p-6 pb-10 bg-surface rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.12)]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-h2 text-on-surface">Filters</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container"
          >
            <svg width="16" height="16" fill="none" stroke="#58413f" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <FilterGroup title="Category" options={FILTER_CATEGORIES} value={pendingCategory} onChange={onCategoryChange} />
        <FilterGroup title="Price" options={PRICE_OPTIONS} value={pendingPrice} onChange={onPriceChange} />
        <FilterGroup title="Minimum Rating" options={RATING_OPTIONS} value={pendingRating} onChange={onRatingChange} />

        {/* Actions */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={onClear}
            className="flex-1 rounded-full py-4 text-[15px] font-semibold bg-surface-container text-primary"
          >
            Clear
          </button>
          <button
            onClick={onApply}
            className="flex-1 rounded-full py-4 text-[15px] font-semibold bg-primary text-white"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
}
