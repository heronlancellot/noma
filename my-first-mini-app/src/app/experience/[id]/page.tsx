'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { getExperienceDetails } from '@/lib/contractUtils';
import { formatUnits } from 'viem';
import { MiniKit } from '@worldcoin/minikit-js';
import { useWaitForTransactionReceipt } from '@worldcoin/minikit-react';
import { createPublicClient, http } from 'viem';
import { worldchain } from 'viem/chains';
import { NOMAD_EXPERIENCE_ADDRESS, NOMAD_EXPERIENCE_ABI } from '@/contracts/constants';
import { useSession } from 'next-auth/react';

import { HeroSection } from './_components/HeroSection';
import { QuickStats } from './_components/QuickStats';
import { OrganizerCard } from './_components/OrganizerCard';
import { AboutSection } from './_components/AboutSection';
import { TagsSection } from './_components/TagsSection';
import { MapPlaceholder } from './_components/MapPlaceholder';
import { BookingCard } from './_components/BookingCard';

interface ExperienceData {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  rating: number;
  ratingCount: number;
  images: string[];
  creator: string;
  organizer: {
    name: string;
    peopleMet: number;
  };
}

const AVATAR_COLORS = ['#7c3aed', '#0891b2', '#d97706', '#a7322f', '#059669', '#db2777'];
const avatarColor = (str: string) => AVATAR_COLORS[str.charCodeAt(0) % AVATAR_COLORS.length];

const TAGS = ['Adventure', 'Nature', 'Community'];

export default function ExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [experience, setExperience] = useState<ExperienceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinLoading, setJoinLoading] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [hearted, setHearted] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2023-10-24');
  const [shareCopied, setShareCopied] = useState(false);

  const experienceId = params.id as string;

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
      try { await navigator.share({ title, text, url }); } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const isCreator = !!(experience && session?.user && (
    session.user.walletAddress?.toLowerCase() === experience.creator.toLowerCase() ||
    session.user.id?.toLowerCase() === experience.creator.toLowerCase()
  ));

  const client = createPublicClient({
    chain: worldchain,
    transport: http('https://worldchain-mainnet.g.alchemy.com/public'),
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed, isError, error: transactionError } =
    useWaitForTransactionReceipt({
      client,
      appConfig: { app_id: process.env.NEXT_PUBLIC_WLD_CLIENT_ID as `app_${string}` },
      transactionId,
    });

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        setError(null);
        const id = parseInt(experienceId, 10);
        if (isNaN(id)) { setError('Invalid experience ID'); setLoading(false); return; }
        const data = await getExperienceDetails(id);
        setExperience({
          id: data.id.toString(),
          title: data.title,
          description: data.description,
          price: `$${formatUnits(data.price, 18)}`,
          location: data.location,
          rating: 4.8,
          ratingCount: Number(data.participantCount),
          images: data.coverImage ? [data.coverImage] : ['/image-default.png'],
          creator: data.creator,
          organizer: {
            name: data.creator.slice(0, 6) + '...' + data.creator.slice(-4),
            peopleMet: Number(data.participantCount),
          },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load experience');
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, [experienceId]);

  useEffect(() => {
    if (transactionId && !isConfirming) {
      if (isConfirmed) {
        setJoinLoading(false);
        router.push(`/experience/${experienceId}/confirmation`);
      } else if (isError) {
        console.error('Transaction failed:', transactionError);
        setJoinLoading(false);
        setTransactionId('');
      }
    }
  }, [isConfirmed, isConfirming, isError, transactionError, transactionId, router, experienceId]);

  const handleRequestJoin = async () => {
    if (!experience) return;
    try {
      setJoinLoading(true);
      setTransactionId('');
      const priceInUSD = parseFloat(experience.price.replace('$', ''));
      const priceInWei = BigInt(Math.floor(priceInUSD * 1e18));
      const priceInHex = '0x' + priceInWei.toString(16);
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [{
          address: NOMAD_EXPERIENCE_ADDRESS,
          abi: NOMAD_EXPERIENCE_ABI,
          functionName: 'requestJoin',
          args: [Number(experienceId)],
          value: priceInHex,
        }],
      });
      if (finalPayload.status === 'success') {
        setTransactionId(finalPayload.transaction_id);
      } else {
        setJoinLoading(false);
      }
    } catch {
      setJoinLoading(false);
    }
  };

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
          <p className="text-sm text-on-surface-variant">{error || 'Data unavailable'}</p>
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
          onMessage={(e) => { e.stopPropagation(); router.push(`/host/${experience.creator}`); }}
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
          onJoin={handleRequestJoin}
          onManage={() => router.push(`/experience/${experienceId}/manage`)}
        />
      </div>

      <Navigation />
    </div>
  );
}
