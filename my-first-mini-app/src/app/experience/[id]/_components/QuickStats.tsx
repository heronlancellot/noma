interface QuickStatsProps {
  rating: number;
  ratingCount: number;
}

export function QuickStats({ rating, ratingCount }: QuickStatsProps) {
  return (
    <div className="flex flex-wrap gap-6 items-center bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/10">
      {/* Rating */}
      <div className="flex items-center gap-2 border-r border-outline-variant/30 pr-6">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#d3a500" stroke="#d3a500" strokeWidth="1">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <div>
          <span className="font-h3 text-h3 text-on-surface">{rating.toFixed(1)}</span>
          <span className="font-body-sm text-body-sm text-secondary ml-1">({ratingCount} reviews)</span>
        </div>
      </div>

      {/* Duration */}
      <div className="flex items-center gap-2 border-r border-outline-variant/30 pr-6">
        <svg width="20" height="20" fill="none" stroke="#4f5f78" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="font-body-md text-body-md text-on-surface">3 Hours</span>
      </div>

      {/* Group size */}
      <div className="flex items-center gap-2">
        <svg width="20" height="20" fill="none" stroke="#4f5f78" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <span className="font-body-md text-body-md text-on-surface">Max 10</span>
      </div>
    </div>
  );
}
