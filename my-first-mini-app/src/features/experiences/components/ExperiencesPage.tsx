'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { formatUnits } from 'viem';
import { ChevronLeft, Search, X } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { useExperiences } from '@/features/experiences/hooks/useExperiences';
import { guessCategory } from '@/features/experiences/utils';
import { CompactCard } from '@/features/experiences/components/CompactCard';
import { CompactCardSkeleton } from '@/features/experiences/components/CompactCardSkeleton';

const CATEGORIES = ['All', 'Hiking', 'Surf', 'Yoga', 'Social', 'Cultura'];

export function ExperiencesPage() {
  const router = useRouter();
  const { experiences, loading, error } = useExperiences();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const events = useMemo(() => {
    return experiences
      .map(exp => {
        const num = parseFloat(formatUnits(exp.price, 18));
        return {
          id: exp.id.toString(),
          title: exp.title,
          description: exp.description,
          price: num === 0 || num < 0.01 ? 'Free' : `$${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`,
          rating: 4.5,
          image: exp.coverImage || '/image-default.png',
          location: exp.location,
          category: guessCategory(exp.title, exp.description),
        };
      })
      .filter(e => {
        if (activeCategory !== 'All' && e.category !== activeCategory) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          if (!e.title.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q)) return false;
        }
        return true;
      });
  }, [experiences, search, activeCategory]);

  return (
    <div className="min-h-screen flex flex-col pb-28" style={{ backgroundColor: '#fff8f7', fontFamily: 'Poppins, sans-serif' }}>
      <header className="sticky top-0 z-40 px-5 pt-10 pb-4 flex flex-col gap-4" style={{ backgroundColor: '#fff8f7' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#ffe9e7' }}>
            <ChevronLeft size={20} strokeWidth={2.5} className="text-on-surface" />
          </button>
          <h1 style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 28, fontWeight: 700, color: '#251918', letterSpacing: '-0.02em' }}>All Experiences</h1>
        </div>
        <div className="flex items-center gap-3" style={{ backgroundColor: '#ffffff', border: '1px solid #dfbfbc', borderRadius: 12, padding: '0 16px', boxShadow: '0px 2px 4px rgba(13,31,53,0.06)' }}>
          <Search size={18} className="text-on-surface-variant" strokeWidth={2} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search experiences..." className="flex-1 bg-transparent focus:outline-none" style={{ padding: '14px 0', fontSize: 14, color: '#251918' }} />
          {search && (
            <button onClick={() => setSearch('')}>
              <X size={16} strokeWidth={2} className="text-outline" />
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className="flex-shrink-0" style={{ padding: '8px 18px', borderRadius: 9999, fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', backgroundColor: activeCategory === cat ? '#a7322f' : '#ffe9e7', color: activeCategory === cat ? '#fff' : '#58413f' }}>
              {cat}
            </button>
          ))}
        </div>
      </header>
      <main className="flex-grow px-4">
        {loading && (
          <div className="grid grid-cols-2 gap-3">
            <CompactCardSkeleton />
            <CompactCardSkeleton />
            <CompactCardSkeleton />
            <CompactCardSkeleton />
            <CompactCardSkeleton />
            <CompactCardSkeleton />
          </div>
        )}
        {error && (
          <div className="rounded-xl p-4 mt-4" style={{ backgroundColor: '#ffdad6', border: '1px solid #ffb3ad' }}>
            <p style={{ fontWeight: 600, fontSize: 14, color: '#410003' }}>Failed to load</p>
            <p style={{ fontSize: 13, color: '#93000a', marginTop: 4 }}>{error}</p>
          </div>
        )}
        {!loading && !error && events.length === 0 && (
          <div className="flex flex-col items-center py-20 gap-3">
            <span style={{ fontSize: 48 }}>🌤️</span>
            <p style={{ fontSize: 15, fontWeight: 500, color: '#58413f' }}>No experiences found</p>
            <p style={{ fontSize: 13, color: '#8b716e' }}>Try a different search or category</p>
          </div>
        )}
        {!loading && !error && events.length > 0 && (
          <>
            <p style={{ fontSize: 13, color: '#8b716e', marginBottom: 16, marginTop: 4 }}>{events.length} experience{events.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-2 gap-3">
              {events.map(event => <CompactCard key={event.id} {...event} />)}
            </div>
          </>
        )}
      </main>
      <Navigation />
    </div>
  );
}
