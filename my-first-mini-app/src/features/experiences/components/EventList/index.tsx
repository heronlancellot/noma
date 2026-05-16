'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { EventCard } from '@/features/experiences/components/EventCard';

export interface Event {
  id: string;
  title: string;
  description: string;
  organizer: string;
  organizerAvatar?: string;
  price: string;
  rating: number;
  image: string;
  location?: string;
  category?: string;
  status?: 'none' | 'requested' | 'approved';
}

interface EventListProps {
  events: Event[];
  onJoinEvent?: (eventId: string) => void;
  currentPage?: number;
  totalPages?: number;
}

export const EventList = ({ events, onJoinEvent }: EventListProps) => {
  const router = useRouter();
  return (
    <div className="w-full">
      {events.map((event) => (
        <EventCard
          key={event.id}
          {...event}
          onJoin={onJoinEvent}
        />
      ))}

      {/* Pagination Dots and See More */}
      {events.length > 0 && (
        <div className="flex items-center justify-end gap-2 mt-4 mb-2">

          {/* See More Button */}
          <button
            onClick={() => router.push('/experiences')}
            className="text-noma-btn font-semibold text-sm hover:text-primary transition-colors flex items-center gap-1 active:opacity-70"
          >
            See More
            <ChevronRight size={16} className="text-noma-btn" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
};
