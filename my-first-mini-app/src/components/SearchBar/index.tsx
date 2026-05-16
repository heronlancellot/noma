'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { twMerge } from 'tailwind-merge';

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
        <div className="flex-grow flex items-center gap-3 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 bg-surface-container-lowest border border-outline-variant rounded-xl px-4 shadow-card">
          <Search size={20} className="flex-shrink-0 text-on-surface-variant" />
          <Input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Find your next adventure..."
            className="flex-1 bg-transparent focus:outline-none border-none shadow-none text-on-surface font-body-sm py-3.5"
          />
        </div>

        {/* Filter button */}
        <Button
          variant="outline"
          size="icon"
          onClick={onFilterClick}
          aria-label="Filtros"
          className="bg-surface-container-lowest border-outline-variant rounded-xl text-on-surface-variant shadow-card h-auto w-14"
        >
          <SlidersHorizontal size={22} />
        </Button>
      </div>

      {/* Category chips */}
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={twMerge(
                'flex-shrink-0 transition-colors px-5 py-2.5 rounded-full font-label-caps',
                isActive
                  ? 'bg-tertiary-fixed text-on-tertiary-fixed shadow-card'
                  : 'bg-surface-container text-on-surface-variant shadow-card-sm',
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
