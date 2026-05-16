'use client';

import { twMerge } from 'tailwind-merge';

interface TagChipProps {
  label: string;
  variant?: 'gold' | 'pink' | 'default';
  className?: string;
}

const variantClasses: Record<string, string> = {
  gold: 'bg-tertiary-fixed text-tertiary-container',
  pink: 'bg-surface-container text-secondary',
  default: 'bg-surface-container-lowest text-secondary border border-outline-variant',
};

export const TagChip = ({ label, variant = 'default', className }: TagChipProps) => {
  return (
    <span
      className={twMerge(
        'inline-flex items-center px-4 py-1.5 rounded-full font-label-caps',
        variantClasses[variant],
        className,
      )}
    >
      {label}
    </span>
  );
};
