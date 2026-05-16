'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ImageIcon, Heart, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  Yoga:    'bg-surface-container text-secondary',
  Social:  'bg-surface-container text-secondary',
  Cultura: 'bg-surface-container text-secondary',
  default: 'bg-surface-container-highest text-on-surface-variant',
};

const AVATAR_CLASSES = [
  'bg-primary',
  'bg-secondary',
  'bg-tertiary-container',
  'bg-primary-container',
  'bg-on-surface',
  'bg-noma-btn',
];

const BUTTON_CLASSES: Record<string, string> = {
  approved:  'bg-secondary text-on-primary',
  requested: 'bg-tertiary-fixed text-on-tertiary-fixed',
  none:      'bg-noma-btn text-on-primary',
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
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.20)_0%,transparent_50%)]" />

        {catClass && category && (
          <span className={`absolute top-4 left-4 z-10 text-xs font-semibold tracking-wide px-4 py-1.5 rounded-full ${catClass}`}>
            {category}
          </span>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => { e.stopPropagation(); setHearted(h => !h); }}
          className={`absolute top-4 right-4 backdrop-blur-sm ${hearted ? 'bg-primary' : 'bg-black/20'}`}
          aria-label="Save"
        >
          <Heart
            size={20}
            fill={hearted ? 'currentColor' : 'none'}
            className="text-on-primary"
            strokeWidth={2}
          />
        </Button>
      </div>

      <div className="p-5 flex flex-col gap-4">
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
            <span className="text-xs font-semibold tracking-wide text-on-surface">{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {organizerAvatar ? (
            <Image src={organizerAvatar} alt={organizer} className="w-8 h-8 rounded-full object-cover flex-shrink-0"/>
          ) : (
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${avatarClass(organizer)}`}>
              <span className="text-xs font-bold text-on-primary">{initial}</span>
            </div>
          )}
          <span className="font-body-md text-on-surface-variant">{organizerShort}</span>
        </div>

        {location && (
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <MapPin size={18} className="text-on-surface-variant" strokeWidth={2} />
            <span className="font-body-sm">{location}</span>
          </div>
        )}

        <div className="border-t border-surface-container-highest flex items-center justify-between pt-4">
          <div>
            <span className="font-h2 text-on-surface">{priceFormatted}</span>
            {priceFormatted !== 'Free' && (
              <span className="font-body-md text-on-surface-variant font-normal"> / person</span>
            )}
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onJoin?.(id); }}
            className={btnClass}
          >
            {btnLabel}
          </Button>
        </div>
      </div>
    </article>
  );
};
