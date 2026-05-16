'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = ['All', 'Hiking', 'Surf', 'Yoga', 'Social', 'Cultura'];

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onFilterClick?: () => void;
  onCategoryChange?: (category: string) => void;
}

export const SearchBar = ({ onSearch, onFilterClick, onCategoryChange }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    onCategoryChange?.(cat);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Search row */}
      <div className="flex items-stretch gap-4">
        {/* Input container */}
        <div
          className="flex-grow flex items-center gap-3 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 bg-surface-container-lowest border border-outline-variant rounded-xl px-4"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <Search size={20} className="flex-shrink-0 text-on-surface-variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Find your next adventure..."
            className="flex-1 bg-transparent focus:outline-none text-on-surface"
            style={{ padding: '16px 0', fontSize: 14 }}
          />
        </div>

        {/* Filter button */}
        <button
          type="button"
          onClick={onFilterClick}
          aria-label="Filtros"
          className="flex items-center justify-center bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface-variant shrink-0"
          style={{ padding: '0 16px', boxShadow: 'var(--shadow-card)', minWidth: 54 }}
        >
          <SlidersHorizontal size={22} className="text-on-surface-variant" />
        </button>
      </div>

      {/* Category chips — horizontal scroll, no scrollbar */}
      <div
        className="flex gap-3 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="flex-shrink-0 transition-colors"
              style={{
                padding: '10px 20px',
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.05em',
                backgroundColor: isActive ? 'var(--color-tertiary-fixed)' : 'var(--color-surface-container)',
                color: isActive ? 'var(--color-on-tertiary-fixed)' : 'var(--color-on-surface-variant)',
                boxShadow: isActive ? 'var(--shadow-card)' : 'var(--shadow-card-sm)',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
