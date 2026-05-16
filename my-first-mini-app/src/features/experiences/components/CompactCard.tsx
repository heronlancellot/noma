'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ImageIcon, Heart, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CATEGORY_STYLES: Record<string, string> = {
  Hiking:  'bg-tertiary-fixed text-on-tertiary-container',
  Surf:    'bg-surface-container text-secondary',
  Yoga:    'bg-surface-container text-secondary',
  Social:  'bg-surface-container text-secondary',
  Cultura: 'bg-surface-container text-secondary',
  default: 'bg-surface-container-highest text-on-surface-variant',
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

  const catClass = category ? (CATEGORY_STYLES[category] ?? CATEGORY_STYLES.default) : null;

  const toggleHeart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !hearted;
    setHearted(next);
    localStorage.setItem(`hearted_${id}`, String(next));
  };

  return (
    <article
      className="overflow-hidden cursor-pointer active:scale-[0.98] transition-all duration-200 bg-surface-container-lowest rounded-2xl shadow-card"
      onClick={() => router.push(`/experience/${id}`)}
    >
      <div className="relative w-full aspect-[4/3]">
        {imgError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-container-highest">
            <ImageIcon size={32} strokeWidth={1.5} className="text-outline" />
          </div>
        ) : (
          <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 480px) 50vw, 240px" onError={() => setImgError(true)} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleHeart}
          className={`absolute top-2.5 right-2.5 backdrop-blur-sm ${hearted ? 'bg-primary' : 'bg-black/25'}`}
          aria-label="Save"
        >
          <Heart
            size={14}
            fill={hearted ? 'currentColor' : 'none'}
            className="text-on-primary"
            strokeWidth={2}
          />
        </Button>
        {catClass && category && (
          <span className={`absolute top-2.5 left-2.5 text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${catClass}`}>
            {category}
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 flex items-end justify-between">
          <span className="font-quicksand-bold font-h3 text-on-primary drop-shadow-md">{price}</span>
          <div className="flex items-center gap-1">
            <Star size={12} fill="currentColor" stroke="currentColor" strokeWidth={1} className="text-tertiary-fixed-dim" />
            <span className="text-xs font-semibold text-on-primary drop-shadow-md">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <div className="px-3 py-3 flex flex-col gap-1">
        <h3 className="line-clamp-2 leading-snug font-quicksand-bold text-sm text-on-surface">{title}</h3>
        {location && (
          <div className="flex items-center gap-1 text-outline">
            <MapPin size={11} strokeWidth={2} />
            <span className="truncate text-xs">{location}</span>
          </div>
        )}
      </div>
    </article>
  );
}
