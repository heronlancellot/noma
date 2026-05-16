'use client';

import { useState } from 'react';

interface FilterValues {
  category: string;
  price: string;
  rating: string;
}

export interface UseFilterSheetReturn {
  isOpen: boolean;
  applied: FilterValues;
  pending: FilterValues;
  open: () => void;
  close: () => void;
  setPendingCategory: (v: string) => void;
  setPendingPrice: (v: string) => void;
  setPendingRating: (v: string) => void;
  apply: () => void;
  clear: () => void;
  reset: () => void;
}

const DEFAULT_FILTERS: FilterValues = {
  category: 'All',
  price: 'All',
  rating: 'Any',
};

export function useFilterSheet(): UseFilterSheetReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [applied, setApplied] = useState<FilterValues>(DEFAULT_FILTERS);
  const [pending, setPending] = useState<FilterValues>(DEFAULT_FILTERS);

  return {
    isOpen,
    applied,
    pending,
    open: () => {
      setPending(applied);
      setIsOpen(true);
    },
    close: () => setIsOpen(false),
    setPendingCategory: (v) => setPending((prev) => ({ ...prev, category: v })),
    setPendingPrice: (v) => setPending((prev) => ({ ...prev, price: v })),
    setPendingRating: (v) => setPending((prev) => ({ ...prev, rating: v })),
    apply: () => {
      setApplied(pending);
      setIsOpen(false);
    },
    clear: () => setPending(DEFAULT_FILTERS),
    reset: () => {
      setPending(DEFAULT_FILTERS);
      setApplied(DEFAULT_FILTERS);
    },
  };
}
