'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ImageIcon, Heart, Star, MapPin } from 'lucide-react';

const CATEGORY_STYLES: Record<string, { bg: string; color: string }> = {
  Hiking:  { bg: '#ffdf92', color: '#241a00' },
  Surf:    { bg: '#cfe1fe', color: '#53647d' },
  Yoga:    { bg: '#e9d5ff', color: '#6b21a8' },
  Social:  { bg: '#fce7f3', color: '#9d174d' },
  Cultura: { bg: '#dbeafe', color: '#1e40af' },
  default: { bg: '#f4dddb', color: '#58413f' },
};

interface CompactCardProps {
  id: string;
  title: string;
  price: string;
  rating: number;
  image: string;
  location?: string;
  category?: string;
}

export function CompactCard({ id, title, price, rating, image, location, category }: CompactCardProps) {
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
      style={{ backgroundColor: '#ffffff', borderRadius: 20, boxShadow: '0px 2px 8px rgba(13,31,53,0.08)' }}
      onClick={() => router.push(`/experience/${id}`)}
    >
      <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
        {imgError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-container-highest">
            <ImageIcon size={32} strokeWidth={1.5} className="text-outline" />
          </div>
        ) : (
          <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 480px) 50vw, 240px" onError={() => setImgError(true)} />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)' }} />
        <button
          onClick={toggleHeart}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: hearted ? '#a7322f' : 'rgba(0,0,0,0.25)' }}
          aria-label="Save"
        >
          <Heart
            size={14}
            fill={hearted ? 'currentColor' : 'none'}
            className="text-white"
            strokeWidth={2}
          />
        </button>
        {catStyle && category && (
          <span className="absolute top-2.5 left-2.5 font-semibold uppercase" style={{ backgroundColor: catStyle.bg, color: catStyle.color, fontSize: 9, letterSpacing: '0.05em', padding: '4px 10px', borderRadius: 9999 }}>
            {category}
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 flex items-end justify-between">
          <span style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 18, fontWeight: 700, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>{price}</span>
          <div className="flex items-center gap-1">
            <Star size={12} fill="#f4bf00" stroke="#f4bf00" strokeWidth={1} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <div className="px-3 py-3 flex flex-col gap-1">
        <h3 className="line-clamp-2 leading-snug" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 14, fontWeight: 700, color: '#251918', lineHeight: 1.3 }}>{title}</h3>
        {location && (
          <div className="flex items-center gap-1" style={{ color: '#8b716e' }}>
            <MapPin size={11} strokeWidth={2} />
            <span className="truncate" style={{ fontSize: 11 }}>{location}</span>
          </div>
        )}
      </div>
    </article>
  );
}
