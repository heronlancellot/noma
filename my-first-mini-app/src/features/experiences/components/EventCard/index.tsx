'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ImageIcon, Heart, Star, MapPin } from 'lucide-react';

interface EventCardProps {
  id: string;
  title: string;
  description?: string;
  organizer: string;
  organizerAvatar?: string;
  price: string;
  rating: number;
  image: string;
  location?: string;
  category?: string;
  status?: 'none' | 'requested' | 'approved';
  onJoin?: (id: string) => void;
}

const CATEGORY_CLASSES: Record<string, string> = {
  Hiking:  'bg-tertiary-fixed text-on-tertiary-fixed',
  Surf:    'bg-secondary-container text-on-secondary-container',
  Yoga:    'bg-purple-100 text-purple-800',
  Social:  'bg-pink-100 text-pink-800',
  Cultura: 'bg-blue-100 text-blue-800',
  default: 'bg-surface-container-highest text-on-surface-variant',
};

const AVATAR_CLASSES = [
  'bg-violet-600',
  'bg-cyan-600',
  'bg-amber-600',
  'bg-primary',
  'bg-emerald-600',
  'bg-pink-600',
];

const BUTTON_CLASSES: Record<string, string> = {
  approved:  'bg-blue-600 text-white',
  requested: 'bg-brand-gold text-on-tertiary-fixed',
  none:      'bg-noma-btn !text-white',
};

const BUTTON_LABELS: Record<string, string> = {
  approved:  'Approved',
  requested: 'Pending',
  none:      'Join',
};

const avatarClass = (str: string) => AVATAR_CLASSES[str.charCodeAt(0) % AVATAR_CLASSES.length];

const ImagePlaceholder = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-container-highest">
    <ImageIcon size={56} className="text-outline" strokeWidth={1.5} />
    <span className="text-xs font-medium text-on-surface-variant">No image</span>
  </div>
);

export const EventCard = ({
  id, title, organizer, organizerAvatar, price, rating, image, location, category, status = 'none', onJoin,
}: EventCardProps) => {
  const router = useRouter();
  const [hearted, setHearted] = useState(false);
  const [imgError, setImgError] = useState(false);

  const catClass = category ? (CATEGORY_CLASSES[category] ?? CATEGORY_CLASSES.default) : null;
  const btnClass = BUTTON_CLASSES[status] ?? BUTTON_CLASSES.none;
  const btnLabel = BUTTON_LABELS[status] ?? BUTTON_LABELS.none;
  const organizerShort = organizer.length > 20 ? organizer.slice(0, 6) + '...' + organizer.slice(-4) : organizer;
  const priceFormatted = price === 'Free' ? 'Free' : price.startsWith('$') ? price : `$${price}`;
  const initial = organizer.charAt(0).toUpperCase();

  return (
    <article
      className="w-full overflow-hidden mb-8 cursor-pointer active:scale-[0.99] transition-all duration-300 hover:shadow-lg bg-surface-container-lowest rounded-3xl shadow-card"
      onClick={() => router.push(`/experience/${id}`)}
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3]">
        {imgError ? (
          <ImagePlaceholder />
        ) : (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            onError={() => setImgError(true)}
          />
        )}
        {/* Bottom gradient scrim */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.20)_0%,transparent_50%)]" />

        {/* Category chip */}
        {catClass && category && (
          <span className={`absolute top-4 left-4 z-10 text-xs font-semibold tracking-[0.05em] px-4 py-1.5 rounded-full ${catClass}`}>
            {category}
          </span>
        )}

        {/* Heart */}
        <button
          onClick={(e) => { e.stopPropagation(); setHearted(h => !h); }}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-sm transition-colors ${hearted ? 'bg-primary' : 'bg-black/20'}`}
          aria-label="Save"
        >
          <Heart
            size={20}
            fill={hearted ? 'currentColor' : 'none'}
            className="text-white"
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col gap-4">
        {/* Title + rating */}
        <div className="flex items-start justify-between">
          <h2 className="font-h2 text-on-surface leading-snug line-clamp-2 flex-1 mr-3 max-w-[75%]">
            {title}
          </h2>
          <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
            <Star
              size={16}
              fill="currentColor"
              stroke="currentColor"
              strokeWidth={1}
              className="text-tertiary-fixed-dim"
            />
            <span className="text-xs font-semibold tracking-[0.05em] text-on-surface">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Organizer */}
        <div className="flex items-center gap-3">
          {organizerAvatar ? (
            <Image src={organizerAvatar} alt={organizer} className="w-8 h-8 rounded-full object-cover flex-shrink-0"/>
          ) : (
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${avatarClass(organizer)}`}>
              <span className="text-[11px] font-bold text-white">{initial}</span>
            </div>
          )}
          <span className="font-body-md text-on-surface-variant">{organizerShort}</span>
        </div>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <MapPin size={18} className="text-on-surface-variant" strokeWidth={2} />
            <span className="font-body-sm">{location}</span>
          </div>
        )}

        {/* Divider + Price/Join */}
        <div className="border-t border-surface-container-highest flex items-center justify-between pt-4">
          <div>
            <span className="font-h2 text-on-surface">{priceFormatted}</span>
            {priceFormatted !== 'Free' && (
              <span className="font-body-md text-on-surface-variant font-normal"> / person</span>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onJoin?.(id); }}
            className={`text-xs font-semibold tracking-[0.05em] !px-8 !py-3 rounded-full shadow-sm transition-opacity active:opacity-80 hover:opacity-90 ${btnClass}`}
          >
            {btnLabel}
          </button>
        </div>
      </div>
    </article>
  );
};
