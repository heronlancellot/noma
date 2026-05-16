import Image from 'next/image';

interface ExperiencesEmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function ExperiencesEmptyState({ hasActiveFilters, onClearFilters }: ExperiencesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-container-padding gap-6 text-center">
      <Image
        src="/nomajin-sad.png"
        alt="NOMAJIN sad"
        width={150}
        height={150}
        className="object-contain"
      />

      <div className="flex flex-col gap-2">
        <h2 className="font-h2 text-on-surface">No experiences found</h2>
        <p className="font-body-sm text-on-surface-variant max-w-[260px]">
          We couldn&apos;t find exactly what you&apos;re looking for. Try adjusting your filters or searching for something else.
        </p>
      </div>

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="px-10 py-4 rounded-full font-body-md font-bold bg-noma-btn text-on-primary active:opacity-80 transition-opacity"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
