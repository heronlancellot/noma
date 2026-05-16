'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { formatUnits } from 'viem';

import { EventList } from '@/features/experiences/components/EventList';
import type { Event } from '@/features/experiences/components/EventList';
import { EventCardSkeleton } from '@/features/experiences/components/EventCardSkeleton';
import { ExperiencesErrorState } from '@/features/experiences/components/ExperiencesErrorState';
import { ExperiencesEmptyState } from '@/features/experiences/components/ExperiencesEmptyState';
import { SearchBar } from '@/components/SearchBar';
import { Navigation } from '@/components/Navigation';
import { LoginPage } from '@/features/auth/components/LoginPage';
import { useExperiences } from '@/features/experiences/hooks/useExperiences';
import { useFilterSheet } from '@/features/experiences/hooks/useFilterSheet';
import { getUserExperienceStatusRequest } from '@/lib/contractUtils';
import { guessCategory } from '@/features/experiences/utils';
import { HomeHeader } from '@/features/experiences/components/Header/HomeHeader';
import { FilterSheet } from '@/features/experiences/components/FilterSheet';

export function HomePage() {
  const { data: session } = useSession();
  const { experiences, loading, error, refetch } = useExperiences();
  const filter = useFilterSheet();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [eventsWithStatus, setEventsWithStatus] = useState<Event[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');

  const baseEvents = useMemo<Event[]>(() => {
    return experiences.map((exp): Event => ({
      id: exp.id.toString(),
      title: exp.title,
      description: exp.description,
      organizer: exp.creator,
      organizerAvatar: undefined,
      price: (() => {
        const num = parseFloat(formatUnits(exp.price, 18));
        if (num === 0 || num < 0.01) return 'Free';
        return `$${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`;
      })(),
      rating: 4.5,
      image: exp.coverImage || '/image-default.png',
      location: exp.location,
      category: guessCategory(exp.title, exp.description),
      status: 'none',
    }));
  }, [experiences]);

  useEffect(() => {
    const fetchStatusRequested = async () => {
      if (!session?.user || baseEvents.length === 0) { setEventsWithStatus(baseEvents); return; }
      const userAddress = session.user.walletAddress || session.user.id;
      if (!userAddress) { setEventsWithStatus(baseEvents); return; }
      const updated = await Promise.all(
        baseEvents.map(async (event) => {
          try {
            const statusRequested = await getUserExperienceStatusRequest(Number(event.id), userAddress);
            return { ...event, status: statusRequested };
          } catch { return event; }
        }),
      );
      setEventsWithStatus(updated);
    };
    fetchStatusRequested();
  }, [baseEvents, session]);

  const filteredEvents = useMemo(() => {
    const base = eventsWithStatus.length > 0 ? eventsWithStatus : baseEvents;
    return base.filter((e) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!e.title.toLowerCase().includes(q) && !e.description?.toLowerCase().includes(q)) return false;
      }
      if (activeCategory !== 'All' && e.category !== activeCategory) return false;
      if (filter.applied.category !== 'All' && e.category !== filter.applied.category) return false;
      if (filter.applied.price !== 'All') {
        const num = e.price === 'Free' ? 0 : parseFloat(e.price.replace('$', ''));
        if (filter.applied.price === 'Free' && num !== 0) return false;
        if (filter.applied.price === 'Under $50' && (num === 0 || num >= 50)) return false;
        if (filter.applied.price === '$50 – $100' && (num < 50 || num > 100)) return false;
        if (filter.applied.price === 'Over $100' && num <= 100) return false;
      }
      if (filter.applied.rating !== 'All') {
        const minRating = parseFloat(filter.applied.rating.replace('+', ''));
        if (e.rating < minRating) return false;
      }
      return true;
    });
  }, [eventsWithStatus, baseEvents, searchQuery, activeCategory, filter.applied]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    activeCategory !== 'All' ||
    filter.applied.category !== 'All' ||
    filter.applied.price !== 'All' ||
    filter.applied.rating !== 'Any';

  if (!session) return <LoginPage />;

  const userName = session?.user?.name?.split(' ')[0] ?? 'Explorer';
  const avatarUrl = session?.user?.profilePictureUrl;

  return (
    <div className="min-h-screen flex flex-col pb-24 relative overflow-x-hidden bg-surface">
      <HomeHeader userName={userName} avatarUrl={avatarUrl} />
      <main className="flex-grow flex flex-col px-5 gap-8">
        <SearchBar
          onSearch={setSearchQuery}
          onCategoryChange={setActiveCategory}
          onFilterClick={filter.open}
        />
        <div className="flex-grow">
          {loading && (
            <>
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
            </>
          )}
          {!loading && error && (
            <ExperiencesErrorState
              onRetry={refetch}
              onGoBack={() => router.back()}
            />
          )}
          {!loading && !error && filteredEvents.length === 0 && (
            <ExperiencesEmptyState
              hasActiveFilters={hasActiveFilters}
              onClearFilters={() => {
                setSearchQuery('');
                setActiveCategory('All');
                filter.reset();
              }}
            />
          )}
          {!loading && !error && filteredEvents.length > 0 && (
            <EventList events={filteredEvents} onJoinEvent={(id) => console.log('Join:', id)} />
          )}
        </div>
      </main>
      <Navigation />
      {filter.isOpen && (
        <FilterSheet
          pending={filter.pending}
          onCategoryChange={filter.setPendingCategory}
          onPriceChange={filter.setPendingPrice}
          onRatingChange={filter.setPendingRating}
          onClear={filter.clear}
          onApply={filter.apply}
          onClose={filter.close}
        />
      )}
    </div>
  );
}
