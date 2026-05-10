'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { formatUnits } from 'viem';
import { useExperiences } from '@/hooks/useExperiences';
import { Navigation } from '@/components/Navigation';

// ── helpers ────────────────────────────────────────────────────────────────────

const CATEGORY_STYLES: Record<string, { bg: string; color: string }> = {
  Hiking:  { bg: '#ffdf92', color: '#241a00' },
  Surf:    { bg: '#cfe1fe', color: '#53647d' },
  Yoga:    { bg: '#e9d5ff', color: '#6b21a8' },
  Social:  { bg: '#fce7f3', color: '#9d174d' },
  Cultura: { bg: '#dbeafe', color: '#1e40af' },
  default: { bg: '#f4dddb', color: '#58413f' },
};

const guessCategory = (title: string, desc: string): string | undefined => {
  const t = (title + ' ' + desc).toLowerCase();
  if (/hik|trek|mount|trail|climb/.test(t)) return 'Hiking';
  if (/surf|wave|beach|ocean|sea/.test(t)) return 'Surf';
  if (/yoga|meditat|wellness|breath/.test(t)) return 'Yoga';
  if (/social|meet|network|tango|dance|party|gather/.test(t)) return 'Social';
  if (/cultur|art|museum|histor|tour/.test(t)) return 'Cultura';
  return undefined;
};

const CATEGORIES = ['All', 'Hiking', 'Surf', 'Yoga', 'Social', 'Cultura'];

// ── Compact card ───────────────────────────────────────────────────────────────

interface CompactCardProps {
  id: string;
  title: string;
  price: string;
  rating: number;
  image: string;
  location?: string;
  category?: string;
}

function CompactCard({ id, title, price, rating, image, location, category }: CompactCardProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [hearted, setHearted] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`hearted_${id}`) === 'true';
  });

  const catStyle = category ? (CATEGORY_STYLES[category] ?? CATEGORY_STYLES.default) : null;

  const toggleHeart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !hearted;
    setHearted(next);
    localStorage.setItem(`hearted_${id}`, String(next));
  };

  return (
    <article
      className="overflow-hidden cursor-pointer active:scale-[0.98] transition-all duration-200"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 20,
        boxShadow: '0px 2px 8px rgba(13,31,53,0.08)',
      }}
      onClick={() => router.push(`/experience/${id}`)}
    >
      {/* Image */}
      <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
        {imgError ? (
          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: '#f4dddb' }}>
            <svg width="32" height="32" fill="none" stroke="#8b716e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        ) : (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 480px) 50vw, 240px"
            onError={() => setImgError(true)}
          />
        )}

        {/* Gradient */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)' }} />

        {/* Heart */}
        <button
          onClick={toggleHeart}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: hearted ? '#a7322f' : 'rgba(0,0,0,0.25)' }}
          aria-label="Save"
        >
          <svg width="14" height="14" fill={hearted ? '#fff' : 'none'} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Category chip */}
        {catStyle && category && (
          <span
            className="absolute top-2.5 left-2.5 font-semibold uppercase"
            style={{
              backgroundColor: catStyle.bg,
              color: catStyle.color,
              fontSize: 9,
              letterSpacing: '0.05em',
              padding: '4px 10px',
              borderRadius: 9999,
            }}
          >
            {category}
          </span>
        )}

        {/* Price + rating over image bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 flex items-end justify-between">
          <span style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 18, fontWeight: 700, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
            {price}
          </span>
          <div className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#f4bf00" stroke="#f4bf00" strokeWidth="1">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Title + location */}
      <div className="px-3 py-3 flex flex-col gap-1">
        <h3
          className="line-clamp-2 leading-snug"
          style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 14, fontWeight: 700, color: '#251918', lineHeight: 1.3 }}
        >
          {title}
        </h3>
        {location && (
          <div className="flex items-center gap-1" style={{ color: '#8b716e' }}>
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <span className="truncate" style={{ fontSize: 11 }}>{location}</span>
          </div>
        )}
      </div>
    </article>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ExperiencesPage() {
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
    <div
      className="min-h-screen flex flex-col pb-28"
      style={{ backgroundColor: '#fff8f7', fontFamily: 'Poppins, sans-serif' }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-40 px-5 pt-10 pb-4 flex flex-col gap-4"
        style={{ backgroundColor: '#fff8f7' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#ffe9e7' }}
          >
            <svg width="20" height="20" fill="none" stroke="#251918" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1 style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 28, fontWeight: 700, color: '#251918', letterSpacing: '-0.02em' }}>
            All Experiences
          </h1>
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-3"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #dfbfbc',
            borderRadius: 12,
            padding: '0 16px',
            boxShadow: '0px 2px 4px rgba(13,31,53,0.06)',
          }}
        >
          <svg width="18" height="18" fill="none" stroke="#58413f" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search experiences..."
            className="flex-1 bg-transparent focus:outline-none"
            style={{ padding: '14px 0', fontSize: 14, color: '#251918' }}
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <svg width="16" height="16" fill="none" stroke="#8b716e" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0"
              style={{
                padding: '8px 18px',
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.05em',
                backgroundColor: activeCategory === cat ? '#a7322f' : '#ffe9e7',
                color: activeCategory === cat ? '#fff' : '#58413f',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-grow px-4">

        {loading && (
          <div className="flex flex-col items-center py-20 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#a7322f' }} />
            <p style={{ fontSize: 14, color: '#58413f' }}>Loading experiences...</p>
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
            <p style={{ fontSize: 13, color: '#8b716e', marginBottom: 16, marginTop: 4 }}>
              {events.length} experience{events.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {events.map(event => (
                <CompactCard key={event.id} {...event} />
              ))}
            </div>
          </>
        )}
      </main>

      <Navigation />
    </div>
  );
}
