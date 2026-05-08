'use client';

import { EventList, Event } from '@/components/EventList';
import { SearchBar } from '@/components/SearchBar';
import { Navigation } from '@/components/Navigation';
import { LoginPage } from '@/components/LoginPage';
import { useState, useMemo, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useExperiences } from '@/hooks/useExperiences';
import { formatUnits } from 'viem';
import { getUserExperienceStatus } from '@/lib/contractUtils';

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

  const baseEvents = useMemo(() => {
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
      const promises = baseEvents.map(async (event) => {
        try {
          const s = await getUserExperienceStatus(Number(event.id), userAddress);
          return { ...event, status: s };
        } catch { return event; }
      });
      setEventsWithStatus(await Promise.all(promises));
    };
    fetchStatuses();
  }, [baseEvents, session]);

  const filteredEvents = useMemo(() => {
    const base = eventsWithStatus.length > 0 ? eventsWithStatus : baseEvents;
    if (!searchQuery.trim()) return base;
    return base.filter(e =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [eventsWithStatus, baseEvents, searchQuery]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff8f7' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#a7322f' }} />
      </div>
    );
  }

  if (!session) return <LoginPage />;

  const userName = session?.user?.name?.split(' ')[0] ?? 'Explorer';
  const avatarUrl = session?.user?.profilePictureUrl;

  return (
    <div className="min-h-screen flex flex-col pb-24 relative overflow-x-hidden" style={{ backgroundColor: '#fff8f7', fontFamily: 'Poppins, sans-serif' }}>

      {/* ── STICKY HEADER ── */}
      <header
        className="px-5 pt-8 pb-6 flex justify-between items-center sticky top-0 z-40"
        style={{ backgroundColor: '#fff8f7' }}
      >
        <div>
          <h1 style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 32, fontWeight: 700, color: '#251918', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Hello, {userName} 👋
          </h1>
        </div>
        <div
          className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2"
          style={{ borderColor: '#ffffff', boxShadow: '0px 2px 4px rgba(13,31,53,0.06)' }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#251918' }}>
              <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>{userName.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="flex-grow flex flex-col px-5 gap-8">

        {/* Search + categories */}
        <SearchBar onSearch={setSearchQuery} onFilterClick={() => {}} />

        {/* Cards */}
        <div className="flex-grow">
          {loading && (
            <div className="flex flex-col items-center py-16 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#a7322f' }} />
              <p style={{ fontSize: 14, color: '#58413f' }}>Loading experiences...</p>
            </div>
          )}

          {error && (
            <div className="rounded-xl p-4" style={{ backgroundColor: '#ffdad6', border: '1px solid #ffb3ad' }}>
              <p style={{ fontWeight: 600, fontSize: 14, color: '#410003' }}>Failed to load experiences</p>
              <p style={{ fontSize: 13, color: '#93000a', marginTop: 4 }}>{error}</p>
            </div>
          )}

          {!loading && !error && filteredEvents.length === 0 && (
            <div className="flex flex-col items-center py-16 gap-3">
              <span style={{ fontSize: 48 }}>🌤️</span>
              <p style={{ fontSize: 15, fontWeight: 500, color: '#58413f' }}>No experiences found</p>
              <p style={{ fontSize: 13, color: '#8b716e' }}>Try a different search or filter</p>
            </div>
          )}

          {!loading && !error && filteredEvents.length > 0 && (
            <EventList events={filteredEvents} onJoinEvent={(id) => console.log('Join:', id)} />
          )}
        </div>
      </main>

      <Navigation />
    </div>
  );
}
