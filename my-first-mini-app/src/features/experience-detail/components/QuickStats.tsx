import { Star, Clock, Users } from 'lucide-react';

interface QuickStatsProps {
  rating: number;
  ratingCount: number;
}

export function QuickStats({ rating, ratingCount }: QuickStatsProps) {
  return (
    <div className="flex flex-wrap gap-6 items-center bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/10">
      {/* Rating */}
      <div className="flex items-center gap-2 border-r border-outline-variant/30 pr-6">
        <Star size={20} fill="currentColor" stroke="currentColor" strokeWidth={1} className="text-tertiary-container" />
        <div>
          <span className="font-h3 text-h3 text-on-surface">{rating.toFixed(1)}</span>
          <span className="font-body-sm text-body-sm text-secondary ml-1">({ratingCount} reviews)</span>
        </div>
      </div>

      {/* Duration */}
      <div className="flex items-center gap-2 border-r border-outline-variant/30 pr-6">
        <Clock size={20} strokeWidth={2} className="text-secondary" />
        <span className="font-body-md text-body-md text-on-surface">3 Hours</span>
      </div>

      {/* Group size */}
      <div className="flex items-center gap-2">
        <Users size={20} strokeWidth={2} className="text-secondary" />
        <span className="font-body-md text-body-md text-on-surface">Max 10</span>
      </div>
    </div>
  );
}
