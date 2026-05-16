export function CompactCardSkeleton() {
  return (
    <article className="overflow-hidden animate-pulse bg-surface-container-lowest rounded-2xl shadow-card">
      <div className="w-full bg-surface-container-highest aspect-[4/3]" />
      <div className="px-3 py-3 flex flex-col gap-2">
        <div className="h-3.5 bg-surface-container-highest rounded-full w-4/5" />
        <div className="h-3.5 bg-surface-container-highest rounded-full w-3/5" />
        <div className="h-3 bg-surface-container-highest rounded-full w-2/5 mt-1" />
      </div>
    </article>
  );
}
