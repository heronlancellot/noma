'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { formatUnits } from 'viem';

import { EventList, Event } from '@/components/EventList';
import { SearchBar } from '@/components/SearchBar';
import { Navigation } from '@/components/Navigation';
import { LoginPage } from '@/components/LoginPage';
import { useExperiences } from '@/hooks/useExperiences';
import { getUserExperienceStatus } from '@/lib/contractUtils';

import { HomeHeader } from './_components/HomeHeader';
import { FilterSheet } from './_components/FilterSheet';

const guessCategory = (title: string, desc: string): string | undefined => {
  const text = (title + ' ' + desc).toLowerCase();
  if (/hik|trek|mount|trail|climb/.test(text)) return 'Hiking';
  if (/surf|wave|beach|ocean|sea/.test(text)) return 'Surf';
  if (/yoga|meditat|wellness|breath/.test(text)) return 'Yoga';
  if (/social|meet|network|tango|dance|party|gather/.test(text)) return 'Social';
  if (/cultur|art|museum|histor|tour/.test(text)) return 'Cultura';
  return undefined;
};

export default function HomePage() {
  const { data: session, status } = useSession();
  const { experiences, loading, error } = useExperiences();

  const [searchQuery, setSearchQuery] = useState('');
  const [eventsWithStatus, setEventsWithStatus] = useState<Event[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPrice, setFilterPrice] = useState('All');
  const [filterRating, setFilterRating] = useState('All');
  const [pendingCategory, setPendingCategory] = useState('All');
  const [pendingPrice, setPendingPrice] = useState('All');
  const [pendingRating, setPendingRating] = useState('All');

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
    const fetchStatuses = async () => {
      if (!session?.user || baseEvents.length === 0) { setEventsWithStatus(baseEvents); return; }
      const userAddress = session.user.walletAddress || session.user.id;
      if (!userAddress) { setEventsWithStatus(baseEvents); return; }
      const updated = await Promise.all(
        baseEvents.map(async (event) => {
          try {
            const s = await getUserExperienceStatus(Number(event.id), userAddress);
            return { ...event, status: s };
          } catch { return event; }
        }),
      );
      setEventsWithStatus(updated);
    };
    fetchStatuses();
  }, [baseEvents, session]);

  const filteredEvents = useMemo(() => {
    const base = eventsWithStatus.length > 0 ? eventsWithStatus : baseEvents;
    return base.filter((e) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!e.title.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q)) return false;
      }
      if (activeCategory !== 'All' && e.category !== activeCategory) return false;
      if (filterCategory !== 'All' && e.category !== filterCategory) return false;
      if (filterPrice !== 'All') {
        const num = e.price === 'Free' ? 0 : parseFloat(e.price.replace('$', ''));
        if (filterPrice === 'Free' && num !== 0) return false;
        if (filterPrice === 'Under $50' && (num === 0 || num >= 50)) return false;
        if (filterPrice === '$50 – $100' && (num < 50 || num > 100)) return false;
        if (filterPrice === 'Over $100' && num <= 100) return false;
      }
      if (filterRating !== 'All') {
        const minRating = parseFloat(filterRating.replace('+', ''));
        if (e.rating < minRating) return false;
      }
      return true;
    });
  }, [eventsWithStatus, baseEvents, searchQuery, activeCategory, filterCategory, filterPrice, filterRating]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

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
          onFilterClick={() => {
            setPendingCategory(filterCategory);
            setPendingPrice(filterPrice);
            setPendingRating(filterRating);
            setFilterOpen(true);
          }}
        />

        <div className="flex-grow">
          {loading && (
            <div className="flex flex-col items-center py-16 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              <p className="text-sm text-on-surface-variant">Loading experiences...</p>
            </div>
          )}

          {error && (
            <div className="rounded-xl p-4 bg-primary-fixed border border-primary-fixed-dim">
              <p className="font-semibold text-sm text-[#410003]">Failed to load experiences</p>
              <p className="text-[13px] text-on-error-container mt-1">{error}</p>
            </div>
          )}

          {!loading && !error && filteredEvents.length === 0 && (
            <div className="flex flex-col items-center py-16 gap-3">
              <span className="text-5xl">🌤️</span>
              <p className="text-[15px] font-medium text-on-surface-variant">No experiences found</p>
              <p className="text-[13px] text-outline">Try a different search or filter</p>
            </div>
          )}

          {!loading && !error && filteredEvents.length > 0 && (
            <EventList events={filteredEvents} onJoinEvent={(id) => console.log('Join:', id)} />
          )}
        </div>
      </main>

      <Navigation />

      {filterOpen && (
        <FilterSheet
          pendingCategory={pendingCategory}
          pendingPrice={pendingPrice}
          pendingRating={pendingRating}
          onCategoryChange={setPendingCategory}
          onPriceChange={setPendingPrice}
          onRatingChange={setPendingRating}
          onClear={() => {
            setPendingCategory('All');
            setPendingPrice('All');
            setPendingRating('All');
          }}
          onApply={() => {
            setFilterCategory(pendingCategory);
            setFilterPrice(pendingPrice);
            setFilterRating(pendingRating);
            setFilterOpen(false);
          }}
          onClose={() => setFilterOpen(false)}
        />
      )}
    </div>
  );
}
