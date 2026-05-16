'use client';

import Image from 'next/image';
import { ImageIcon, ChevronLeft, Heart, Settings, Check, Share2, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <section aria-label="Experience hero" className="relative w-full overflow-hidden h-[530px] md:rounded-2xl md:mx-auto md:max-w-4xl md:mt-8">
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
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          aria-label="Go back"
          className="bg-surface/90 backdrop-blur shadow-sm text-on-surface"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </Button>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleHeart}
            aria-label={hearted ? 'Remove from favorites' : 'Add to favorites'}
            className="bg-surface/90 backdrop-blur shadow-sm text-on-surface"
          >
            <Heart
              size={20}
              fill={hearted ? 'currentColor' : 'none'}
              className={hearted ? 'text-primary' : 'text-on-surface'}
              strokeWidth={2}
            />
          </Button>

          {isCreator ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onManage}
              aria-label="Manage experience"
              className="bg-surface/90 backdrop-blur shadow-sm text-on-surface"
            >
              <Settings size={20} strokeWidth={2} />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={onShare}
              aria-label="Share"
              className={`backdrop-blur shadow-sm transition-colors ${
                shareCopied ? 'bg-primary/90 text-on-primary' : 'bg-surface/90 text-on-surface'
              }`}
            >
              {shareCopied ? (
                <Check size={18} strokeWidth={2.5} />
              ) : (
                <Share2 size={20} strokeWidth={2} />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Title + location + rating — pinned to bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2 text-background">
        <h1 className="text-4xl font-quicksand-bold leading-tight tracking-tight drop-shadow-sm">
          {title}
        </h1>
        <div className="flex items-center gap-4 mt-1 text-background/95">
          <div className="flex items-center gap-1.5">
            <MapPin size={18} className="text-background/90" strokeWidth={2} />
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
