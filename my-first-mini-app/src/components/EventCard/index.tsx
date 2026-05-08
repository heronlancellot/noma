'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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

// Figma token mapping
const CATEGORY_STYLES: Record<string, { bg: string; color: string }> = {
  Hiking:  { bg: '#ffdf92', color: '#241a00' }, // tertiary-fixed / on-tertiary-fixed
  Surf:    { bg: '#cfe1fe', color: '#53647d' }, // secondary-container / on-secondary-container
  Yoga:    { bg: '#e9d5ff', color: '#6b21a8' },
  Social:  { bg: '#fce7f3', color: '#9d174d' },
  Cultura: { bg: '#dbeafe', color: '#1e40af' },
  default: { bg: '#f4dddb', color: '#58413f' }, // surface-container-highest / on-surface-variant
};

const AVATAR_COLORS = ['#7c3aed', '#0891b2', '#d97706', '#a7322f', '#059669', '#db2777'];
const avatarColor = (str: string) => AVATAR_COLORS[str.charCodeAt(0) % AVATAR_COLORS.length];

const getButtonConfig = (status: string) => {
  if (status === 'approved') return { text: 'Approved', bg: '#2563eb', color: '#fff' };
  if (status === 'requested') return { text: 'Pending', bg: '#f5c000', color: '#241a00' };
  return { text: 'Join', bg: '#a7322f', color: '#fff' }; // primary from Figma
};

const ImagePlaceholder = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ backgroundColor: '#f4dddb' }}>
    <svg width="56" height="56" fill="none" stroke="#8b716e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
    <span style={{ fontSize: 11, color: '#8b716e', fontWeight: 500 }}>No image</span>
  </div>
);

export const EventCard = ({
  id, title, organizer, organizerAvatar, price, rating, image, location, category, status = 'none', onJoin,
}: EventCardProps) => {
  const router = useRouter();
  const [hearted, setHearted] = useState(false);
  const [imgError, setImgError] = useState(false);

  const btn = getButtonConfig(status);
  const catStyle = category ? (CATEGORY_STYLES[category] ?? CATEGORY_STYLES.default) : null;
  const organizerShort = organizer.length > 20 ? organizer.slice(0, 6) + '...' + organizer.slice(-4) : organizer;
  const priceFormatted = price === 'Free' ? 'Free' : price.startsWith('$') ? price : `$${price}`;
  const bgColor = avatarColor(organizer);
  const initial = organizer.charAt(0).toUpperCase();

  return (
    <article
      className="w-full overflow-hidden mb-8 cursor-pointer active:scale-[0.99] transition-all duration-300 hover:shadow-lg"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 24,
        boxShadow: '0px 2px 4px rgba(13, 31, 53, 0.06)',
      }}
      onClick={() => router.push(`/experience/${id}`)}
    >
      {/* Image */}
      <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
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
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.20) 0%, transparent 50%)' }} />

        {/* Category chip */}
        {catStyle && category && (
          <span
            className="absolute top-4 left-4 font-semibold uppercase z-10"
            style={{
              backgroundColor: catStyle.bg,
              color: catStyle.color,
              fontSize: 12,
              letterSpacing: '0.05em',
              padding: '6px 16px',
              borderRadius: 9999,
            }}
          >
            {category}
          </span>
        )}

        {/* Heart */}
        <button
          onClick={(e) => { e.stopPropagation(); setHearted(h => !h); }}
          className="absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-sm transition-colors"
          style={{ backgroundColor: hearted ? '#a7322f' : 'rgba(0,0,0,0.20)' }}
          aria-label="Save"
        >
          <svg width="20" height="20" fill={hearted ? '#fff' : 'none'} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col gap-4">
        {/* Title + rating */}
        <div className="flex items-start justify-between">
          <h2
            className="leading-snug line-clamp-2 flex-1 mr-3"
            style={{ fontFamily: 'Quicksand', fontSize: 24, fontWeight: 700, color: '#251918', lineHeight: 1.3, maxWidth: '75%' }}
          >
            {title}
          </h2>
          <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#f4bf00" stroke="#f4bf00" strokeWidth="1">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', color: '#251918' }}>{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Organizer */}
        <div className="flex items-center gap-3">
          {organizerAvatar ? (
            <img src={organizerAvatar} alt={organizer} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{ backgroundColor: bgColor }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{initial}</span>
            </div>
          )}
          <span style={{ fontSize: 16, color: '#58413f' }}>{organizerShort}</span>
        </div>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1.5" style={{ color: '#58413f' }}>
            <svg width="18" height="18" fill="none" stroke="#58413f" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <span style={{ fontSize: 14 }}>{location}</span>
          </div>
        )}

        {/* Divider + Price/Join */}
        <div className="border-t flex items-center justify-between pt-4" style={{ borderColor: '#f4dddb' }}>
          <div>
            <span style={{ fontFamily: 'Quicksand', fontSize: 24, fontWeight: 700, color: '#251918' }}>{priceFormatted}</span>
            {priceFormatted !== 'Free' && (
              <span style={{ fontSize: 16, color: '#58413f', fontWeight: 400 }}> / person</span>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onJoin?.(id); }}
            className="transition-opacity active:opacity-80 hover:opacity-90"
            style={{
              backgroundColor: btn.bg,
              color: btn.color,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.05em',
              padding: '12px 32px',
              borderRadius: 9999,
              boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
            }}
          >
            {btn.text}
          </button>
        </div>
      </div>
    </article>
  );
};
