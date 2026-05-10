'use client';

import Image from 'next/image';

interface HeroSectionProps {
  title: string;
  location: string;
  rating: number;
  imageSrc: string;
  heroImgError: boolean;
  onImgError: () => void;
  hearted: boolean;
  onToggleHeart: () => void;
  isCreator: boolean;
  onManage: () => void;
  onShare: () => void;
  shareCopied: boolean;
  onBack: () => void;
}

export function HeroSection({
  title, location, rating, imageSrc, heroImgError, onImgError,
  hearted, onToggleHeart, isCreator, onManage, onShare, shareCopied, onBack,
}: HeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden h-[530px] md:rounded-2xl md:mx-auto md:max-w-4xl md:mt-8">
      {heroImgError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-variant">
          <svg width="72" height="72" fill="none" stroke="#8b716e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
      ) : (
        <Image src={imageSrc} alt={title} fill className="object-cover" priority onError={onImgError} />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Floating action buttons */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center pt-8">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-surface/90 backdrop-blur flex items-center justify-center text-on-surface shadow-sm"
        >
          <svg width="20" height="20" fill="none" stroke="#251918" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="flex gap-2">
          <button
            onClick={onToggleHeart}
            className="w-10 h-10 rounded-full bg-surface/90 backdrop-blur flex items-center justify-center text-on-surface shadow-sm"
          >
            <svg
              width="20" height="20"
              fill={hearted ? '#a7322f' : 'none'}
              stroke={hearted ? '#a7322f' : '#251918'}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {isCreator ? (
            <button
              onClick={onManage}
              className="w-10 h-10 rounded-full bg-surface/90 backdrop-blur flex items-center justify-center text-on-surface shadow-sm"
            >
              <svg width="20" height="20" fill="none" stroke="#251918" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          ) : (
            <button
              onClick={onShare}
              aria-label="Share"
              className={`w-10 h-10 rounded-full backdrop-blur flex items-center justify-center text-on-surface shadow-sm transition-colors ${
                shareCopied ? 'bg-emerald-500/90' : 'bg-surface/90'
              }`}
            >
              {shareCopied ? (
                <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" stroke="#251918" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Title + location + rating — pinned to bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2 text-white">
        <h1 className="font-quicksand-bold text-[40px] leading-tight tracking-tight drop-shadow-sm">
          {title}
        </h1>
        <div className="flex items-center gap-4 mt-1 text-white/95">
          <div className="flex items-center gap-1.5">
            <svg width="18" height="18" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-lg leading-relaxed">{location}</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto rounded-full px-3 py-1 bg-black/30 backdrop-blur-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#f4bf00" stroke="#f4bf00" strokeWidth="1">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="text-base font-semibold">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
