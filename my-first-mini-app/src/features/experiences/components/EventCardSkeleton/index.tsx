export function EventCardSkeleton() {
  return (
    <article className="w-full overflow-hidden mb-8 bg-surface-container-lowest rounded-3xl shadow-card animate-pulse">
      {/* Image */}
      <div className="w-full aspect-[4/3] bg-surface-container-highest rounded-t-3xl" />

      {/* Card body */}
      <div className="p-5 flex flex-col gap-4">
        {/* Title + rating */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-5 bg-surface-container-highest rounded-full w-3/4" />
            <div className="h-5 bg-surface-container-highest rounded-full w-1/2" />
          </div>
          <div className="h-4 w-8 bg-surface-container-highest rounded-full mt-1 flex-shrink-0" />
        </div>

        {/* Organizer */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest flex-shrink-0" />
          <div className="h-4 bg-surface-container-highest rounded-full w-2/5" />
        </div>

        {/* Location */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-surface-container-highest flex-shrink-0" />
          <div className="h-4 bg-surface-container-highest rounded-full w-1/3" />
        </div>

        {/* Price + button */}
        <div className="border-t border-surface-container-highest flex items-center justify-between pt-4">
          <div className="h-6 bg-surface-container-highest rounded-full w-16" />
          <div className="h-10 bg-surface-container-highest rounded-full w-24" />
        </div>
      </div>
    </article>
  );
}
