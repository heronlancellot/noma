'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/features/experience-detail/components/HeroSection';
import { QuickStats } from '@/features/experience-detail/components/QuickStats';
import { OrganizerCard } from '@/features/experience-detail/components/OrganizerCard';
import { AboutSection } from '@/features/experience-detail/components/AboutSection';
import { TagsSection } from '@/features/experience-detail/components/TagsSection';
import { MapPlaceholder } from '@/features/experience-detail/components/MapPlaceholder';
import { BookingCard } from '@/features/experience-detail/components/BookingCard';
import { useExperienceDetail, useJoinExperience } from '@/features/experience-detail/hooks';

const AVATAR_COLORS = ['#7c3aed', '#0891b2', '#d97706', '#a7322f', '#059669', '#db2777'];
const avatarColor = (str: string) => AVATAR_COLORS[str.charCodeAt(0) % AVATAR_COLORS.length];
const TAGS = ['Adventure', 'Nature', 'Community'];

export function ExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const experienceId = params.id as string;

  const { experience, loading, error } = useExperienceDetail(experienceId);
  const { joinLoading, isConfirming, handleRequestJoin } = useJoinExperience(experienceId);

  const [hearted, setHearted] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`hearted_${experienceId}`);
    if (saved === 'true') setHearted(true);
  }, [experienceId]);

  const toggleHearted = () => {
    const next = !hearted;
    setHearted(next);
    localStorage.setItem(`hearted_${experienceId}`, String(next));
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/experience/${experienceId}`;
    const title = experience?.title ?? 'Experience';
    const text = `${title} — ${experience?.location ?? ''}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const isCreator = !!(
    experience &&
    session?.user &&
    (session.user.walletAddress?.toLowerCase() === experience.creator.toLowerCase() ||
      session.user.id?.toLowerCase() === experience.creator.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8 bg-surface">
        <div className="text-center">
          <p className="font-semibold text-on-surface mb-2">Experience not found</p>
          <p className="font-body-sm text-on-surface-variant">{error || 'Data unavailable'}</p>
        </div>
      </div>
    );
  }

  const bgColor = avatarColor(experience.organizer.name);
  const initial = experience.organizer.name.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-surface pb-[90px]">
      <HeroSection
        title={experience.title}
        location={experience.location}
        rating={experience.rating}
        imageSrc={experience.images[0]}
        heroImgError={heroImgError}
        onImgError={() => setHeroImgError(true)}
        hearted={hearted}
        onToggleHeart={toggleHearted}
        isCreator={isCreator}
        onManage={() => router.push(`/experience/${experienceId}/manage`)}
        onShare={handleShare}
        shareCopied={shareCopied}
        onBack={() => router.back()}
      />

      <div className="flex flex-col gap-8 px-5 mt-6 pb-4">
        <QuickStats rating={experience.rating} ratingCount={experience.ratingCount} />

        <OrganizerCard
          name={experience.organizer.name}
          peopleMet={experience.organizer.peopleMet}
          avatarBgColor={bgColor}
          initial={initial}
          onViewProfile={() => router.push(`/host/${experience.creator}`)}
          onMessage={(e) => {
            e.stopPropagation();
            router.push(`/host/${experience.creator}`);
          }}
        />

        <AboutSection description={experience.description} />

        <TagsSection tags={TAGS} />

        <MapPlaceholder location={experience.location} />

        <BookingCard
          price={experience.price}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          isCreator={isCreator}
          joinLoading={joinLoading}
          isConfirming={isConfirming}
          onJoin={() => handleRequestJoin(experience.price)}
          onManage={() => router.push(`/experience/${experienceId}/manage`)}
        />
      </div>

      <Navigation />
    </div>
  );
}
