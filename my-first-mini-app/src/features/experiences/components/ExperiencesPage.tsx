'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { formatUnits } from 'viem';
import { ChevronLeft, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    <div className="min-h-screen flex flex-col pb-28 bg-surface font-sans">
      <header className="sticky top-0 z-40 px-5 pt-10 pb-4 flex flex-col gap-4 bg-surface">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="bg-surface-container">
            <ChevronLeft size={20} strokeWidth={2.5} className="text-on-surface" />
          </Button>
          <h1 className="font-h1 text-on-surface tracking-tight">All Experiences</h1>
        </div>
        <div className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant rounded-xl px-4 shadow-sm">
          <Search size={18} className="text-on-surface-variant" strokeWidth={2} />
          <Input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search experiences..."
            className="flex-1 bg-transparent focus:outline-none border-none shadow-none py-3.5 font-body-sm text-on-surface placeholder:text-outline"
          />
          {search && (
            <Button variant="ghost" size="icon-sm" onClick={() => setSearch('')} className="p-0">
              <X size={16} strokeWidth={2} className="text-outline" />
            </Button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-5 py-2 rounded-full font-label-caps transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
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
          <div className="rounded-xl p-4 mt-4 bg-error/10 border border-error/20">
            <p className="font-body-sm font-semibold text-on-error-container">Failed to load</p>
            <p className="font-body-sm text-error mt-1">{error}</p>
          </div>
        )}
        {!loading && !error && events.length === 0 && (
          <div className="flex flex-col items-center py-20 gap-3">
            <span className="text-5xl">🌤️</span>
            <p className="font-body-md font-medium text-on-surface-variant">No experiences found</p>
            <p className="font-body-sm text-outline">Try a different search or category</p>
          </div>
        )}
        {!loading && !error && events.length > 0 && (
          <>
            <p className="font-body-sm text-outline mb-4 mt-1">{events.length} experience{events.length !== 1 ? 's' : ''}</p>
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
