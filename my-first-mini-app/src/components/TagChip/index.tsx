'use client';

interface TagChipProps {
  label: string;
  variant?: 'gold' | 'pink' | 'default';
}

export const TagChip = ({ label, variant = 'default' }: TagChipProps) => {
  const styles = {
    gold: { backgroundColor: '#fcedd2', color: '#b88c3a' },
    pink: { backgroundColor: '#fcebe8', color: '#5a5a6e' },
    default: { backgroundColor: '#fff', color: '#5a5a6e', border: '1px solid #e5e7eb' },
  };

  return (
    <span
      className="inline-flex items-center px-4 py-1.5 rounded-full text-[12px] font-semibold uppercase tracking-wide"
      style={styles[variant]}
    >
      {label}
    </span>
  );
};
