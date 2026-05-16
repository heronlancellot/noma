export function CompactCardSkeleton() {
  return (
    <article
      className="overflow-hidden animate-pulse"
      style={{ backgroundColor: '#ffffff', borderRadius: 20, boxShadow: '0px 2px 8px rgba(13,31,53,0.08)' }}
    >
      {/* Image area */}
      <div className="w-full bg-surface-container-highest" style={{ aspectRatio: '4/3' }} />

      {/* Body */}
      <div className="px-3 py-3 flex flex-col gap-2">
        <div className="h-3.5 bg-surface-container-highest rounded-full w-4/5" />
        <div className="h-3.5 bg-surface-container-highest rounded-full w-3/5" />
        <div className="h-3 bg-surface-container-highest rounded-full w-2/5 mt-1" />
      </div>
    </article>
  );
}
