'use client';

import Image from 'next/image';
import { ImageIcon, ChevronLeft, Heart, Settings, Check, Share2, MapPin, Star } from 'lucide-react';

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
          <ImageIcon size={72} strokeWidth={1.5} className="text-outline" />
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
          <ChevronLeft size={20} strokeWidth={2.5} className="text-on-surface" />
        </button>

        <div className="flex gap-2">
          <button
            onClick={onToggleHeart}
            className="w-10 h-10 rounded-full bg-surface/90 backdrop-blur flex items-center justify-center text-on-surface shadow-sm"
          >
            <Heart
              size={20}
              fill={hearted ? 'currentColor' : 'none'}
              className={hearted ? 'text-primary' : 'text-on-surface'}
              strokeWidth={2}
            />
          </button>

          {isCreator ? (
            <button
              onClick={onManage}
              className="w-10 h-10 rounded-full bg-surface/90 backdrop-blur flex items-center justify-center text-on-surface shadow-sm"
            >
              <Settings size={20} strokeWidth={2} className="text-on-surface" />
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
                <Check size={18} className="text-white" strokeWidth={2.5} />
              ) : (
                <Share2 size={20} strokeWidth={2} className="text-on-surface" />
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
            <MapPin size={18} className="text-white/90" strokeWidth={2} />
            <span className="text-lg leading-relaxed">{location}</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto rounded-full px-3 py-1 bg-black/30 backdrop-blur-sm">
            <Star size={16} fill="currentColor" stroke="currentColor" className="text-tertiary-fixed-dim" strokeWidth={1} />
            <span className="text-base font-semibold">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
