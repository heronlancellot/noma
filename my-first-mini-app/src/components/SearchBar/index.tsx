'use client';

import { useState } from 'react';

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
        {/* Input — flex row so icon is always centered with text */}
        <div
          className="flex-grow flex items-center gap-3 focus-within:ring-2 focus-within:ring-[#a7322f] focus-within:ring-offset-2"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #dfbfbc',
            borderRadius: 12,
            boxShadow: '0px 2px 4px rgba(13,31,53,0.06)',
            padding: '0 16px',
          }}
        >
          <svg
            className="flex-shrink-0"
            width="20" height="20" fill="none" stroke="#58413f" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Find your next adventure..."
            className="flex-1 bg-transparent focus:outline-none"
            style={{
              padding: '16px 0',
              fontSize: 14,
              color: '#251918',
              fontFamily: 'Poppins, sans-serif',
            }}
          />
        </div>

        {/* Filter button — same height as input via items-stretch */}
        <button
          type="button"
          onClick={onFilterClick}
          aria-label="Filtros"
          className="flex items-center justify-center"
          style={{
            backgroundColor: '#ffffff',
            padding: '0 16px',
            borderRadius: 12,
            border: '1px solid #dfbfbc',
            boxShadow: '0px 2px 4px rgba(13,31,53,0.06)',
            flexShrink: 0,
            minWidth: 54,
          }}
        >
          <svg width="22" height="22" fill="none" stroke="#58413f" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
        </button>
      </div>

      {/* Category chips — horizontal scroll, no scrollbar */}
      <div
        className="flex gap-3 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CATEGORIES.map((cat) => (
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
              fontFamily: 'Poppins, sans-serif',
              backgroundColor: activeCategory === cat ? '#ffdf92' : '#ffe9e7',
              color: activeCategory === cat ? '#241a00' : '#58413f',
              boxShadow: activeCategory === cat ? '0px 2px 4px rgba(13,31,53,0.06)' : '0px 1px 2px rgba(13,31,53,0.04)',
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
