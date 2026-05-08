'use client';

import Image from 'next/image';
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

interface ExperienceData {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  rating: number;
  ratingCount: number;
  recommendation: number;
  images: string[];
  creator: string;
  organizer: {
    name: string;
    avatar?: string;
    experiences: number;
    peopleMet: number;
  };
}

const AVATAR_COLORS = ['#7c3aed', '#0891b2', '#d97706', '#a7322f', '#059669', '#db2777'];
const avatarColor = (str: string) => AVATAR_COLORS[str.charCodeAt(0) % AVATAR_COLORS.length];

// Tag chip color variants (Figma-exact)
const TAG_STYLES = [
  { bg: '#fcedd2', color: '#b88c3a', border: '#fcedd2' }, // gold
  { bg: '#fcebe8', color: '#4f5f78', border: '#fcebe8' }, // pink
  { bg: '#fcebe8', color: '#4f5f78', border: '#fcebe8' }, // pink
];

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

  const experienceId = params.id as string;

  const isCreator = experience && session?.user && (
    (session.user.walletAddress?.toLowerCase() === experience.creator.toLowerCase()) ||
    (session.user.id?.toLowerCase() === experience.creator.toLowerCase())
  );

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
          recommendation: 98,
          images: data.coverImage
            ? [data.coverImage]
            : ['/image-default.png'],
          creator: data.creator,
          organizer: {
            name: data.creator.slice(0, 6) + '...' + data.creator.slice(-4),
            avatar: undefined,
            experiences: 0,
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff8f7' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#a7322f' }} />
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8" style={{ backgroundColor: '#fff8f7' }}>
        <div className="text-center">
          <p style={{ fontWeight: 600, color: '#251918', marginBottom: 8 }}>Experience not found</p>
          <p style={{ fontSize: 14, color: '#58413f' }}>{error || 'Data unavailable'}</p>
        </div>
      </div>
    );
  }

  const bgColor = avatarColor(experience.organizer.name);
  const initial = experience.organizer.name.charAt(0).toUpperCase();
  const tags = ['Adventure', 'Nature', 'Community'];

  return (
    <div style={{ backgroundColor: '#fff8f7', minHeight: '100vh', fontFamily: 'Poppins, sans-serif', paddingBottom: 90 }}>

      {/* ── HERO ── */}
      <section className="relative w-full overflow-hidden md:rounded-2xl md:mx-auto md:max-w-4xl md:mt-8" style={{ height: 530 }}>
        {heroImgError ? (
          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: '#f4dddb' }}>
            <svg width="72" height="72" fill="none" stroke="#8b716e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        ) : (
          <Image src={experience.images[0]} alt={experience.title} fill className="object-cover" priority onError={() => setHeroImgError(true)} />
        )}

        {/* Gradient: heavy at bottom for text readability */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.30) 45%, transparent 100%)' }} />

        {/* Floating action buttons (top) */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center" style={{ paddingTop: 32 }}>
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(255,248,247,0.90)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          >
            <svg width="20" height="20" fill="none" stroke="#251918" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Heart + Share */}
          <div className="flex gap-2">
            <button
              onClick={() => setHearted(h => !h)}
              className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(255,248,247,0.90)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            >
              <svg width="18" height="18" fill={hearted ? '#a7322f' : 'none'} stroke={hearted ? '#a7322f' : '#251918'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            {isCreator ? (
              <button
                onClick={() => router.push(`/experience/${experienceId}/manage`)}
                className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm"
                style={{ backgroundColor: 'rgba(255,248,247,0.90)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
              >
                <svg width="18" height="18" fill="none" stroke="#251918" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
            ) : (
              <button
                className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm"
                style={{ backgroundColor: 'rgba(255,248,247,0.90)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
              >
                <svg width="18" height="18" fill="none" stroke="#251918" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Title + location + rating — anchored to bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2" style={{ color: '#ffffff' }}>
          <h1 style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 40, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
            {experience.title}
          </h1>
          <div className="flex items-center gap-4 mt-1" style={{ color: 'rgba(255,255,255,0.95)' }}>
            <div className="flex items-center gap-1.5">
              <svg width="18" height="18" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              <span style={{ fontSize: 18, lineHeight: 1.6 }}>{experience.location}</span>
            </div>
            {/* Rating badge */}
            <div className="flex items-center gap-1.5 ml-auto rounded-full px-3 py-1 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0,0,0,0.30)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f4bf00" stroke="#f4bf00" strokeWidth="1">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span style={{ fontSize: 16, fontWeight: 600 }}>{experience.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT GRID ── */}
      <div className="md:px-0 md:max-w-4xl md:mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">

        {/* LEFT COLUMN (2/3) */}
        <div className="md:col-span-2 flex flex-col gap-8 px-5 md:px-0">

          {/* Quick stats */}
          <div
            className="flex flex-wrap gap-6 items-center p-5 rounded-2xl"
            style={{ backgroundColor: '#ffffff', boxShadow: '0px 2px 4px rgba(13,31,53,0.06)', border: '1px solid rgba(223,191,188,0.1)' }}
          >
            {/* Rating */}
            <div className="flex items-center gap-2 pr-6" style={{ borderRight: '1px solid rgba(223,191,188,0.3)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#d3a500" stroke="#d3a500" strokeWidth="1">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <div>
                <span style={{ fontFamily: 'Quicksand', fontSize: 20, fontWeight: 600, color: '#251918' }}>{experience.rating.toFixed(1)}</span>
                <span style={{ fontSize: 14, color: '#4f5f78', marginLeft: 4 }}>({experience.ratingCount} reviews)</span>
              </div>
            </div>
            {/* Duration */}
            <div className="flex items-center gap-2 pr-6" style={{ borderRight: '1px solid rgba(223,191,188,0.3)' }}>
              <svg width="20" height="20" fill="none" stroke="#4f5f78" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <span style={{ fontSize: 16, color: '#251918' }}>3 Hours</span>
            </div>
            {/* Group size */}
            <div className="flex items-center gap-2">
              <svg width="20" height="20" fill="none" stroke="#4f5f78" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span style={{ fontSize: 16, color: '#251918' }}>Max 10</span>
            </div>
          </div>

          {/* Organizer */}
          <div
            className="p-6 rounded-2xl flex items-center justify-between"
            style={{ backgroundColor: '#ffffff', boxShadow: '0px 2px 4px rgba(13,31,53,0.06)', border: '1px solid rgba(223,191,188,0.1)' }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: bgColor, border: '2px solid rgba(200,74,69,0.3)', padding: 2 }}
              >
                <span style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{initial}</span>
              </div>
              <div>
                <h3 style={{ fontFamily: 'Quicksand', fontSize: 20, fontWeight: 600, color: '#251918' }}>
                  {experience.organizer.name}
                </h3>
                <p style={{ fontSize: 14, color: '#4f5f78', lineHeight: 1.5 }}>
                  Experience Host<br />
                  <span style={{ color: '#8b716e' }}>({experience.organizer.peopleMet} joined)</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/host/1')}
              style={{
                backgroundColor: 'rgba(167,50,47,0.08)',
                border: '1px solid rgba(200,74,69,0.2)',
                color: '#a7322f',
                borderRadius: 9999,
                padding: '10px 20px',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
            >
              Message
            </button>
          </div>

          {/* Description */}
          <div>
            <h2 style={{ fontFamily: 'Quicksand', fontSize: 24, fontWeight: 700, color: '#251918', marginBottom: 16 }}>
              About this experience
            </h2>
            <p style={{ fontSize: 16, color: '#58413f', lineHeight: 1.5 }}>
              {experience.description}
            </p>
          </div>

          {/* Tags */}
          <div>
            <h3 style={{ fontFamily: 'Quicksand', fontSize: 20, fontWeight: 600, color: '#251918', marginBottom: 16 }}>
              Tags
            </h3>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag, i) => {
                const ts = TAG_STYLES[i % TAG_STYLES.length];
                return (
                  <span
                    key={tag}
                    style={{
                      backgroundColor: ts.bg,
                      color: ts.color,
                      border: `1px solid ${ts.border}`,
                      borderRadius: 9999,
                      padding: '8px 20px',
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Map placeholder */}
          <div
            className="relative w-full rounded-2xl overflow-hidden mt-4"
            style={{ height: 240, border: '1px solid rgba(223,191,188,0.2)', boxShadow: '0px 2px 4px rgba(13,31,53,0.06)' }}
          >
            {/* Stylized map bg */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 40%, #6ee7b7 100%)' }} />
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 40px)' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full p-3.5 shadow-lg" style={{ backgroundColor: '#fff' }}>
                <svg width="32" height="32" fill="#a7322f" stroke="#a7322f" strokeWidth="0" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" fill="#fff" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-3 right-4">
              <span style={{ fontSize: 12, fontWeight: 600, color: '#059669' }}>{experience.location}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (1/3) — sticky on desktop, full-width block on mobile */}
        <div className="md:col-span-1 px-5 md:px-0 pb-4">
          <div
            className="md:sticky md:top-24 p-6 flex flex-col gap-6"
            style={{ backgroundColor: '#ffffff', borderRadius: 24, boxShadow: '0px 2px 4px rgba(13,31,53,0.06)', border: '1px solid rgba(223,191,188,0.1)' }}
          >
            {/* Price */}
            <div>
              <span style={{ fontFamily: 'Quicksand', fontSize: 40, fontWeight: 700, color: '#251918' }}>{experience.price}</span>
              <span style={{ fontSize: 16, color: '#4f5f78' }}> / person</span>
            </div>

            {/* Date selector */}
            <div className="flex flex-col gap-4">
              <div
                className="flex items-center justify-between p-4 rounded-2xl cursor-pointer"
                style={{ border: '1px solid rgba(223,191,188,0.4)', backgroundColor: '#fff8f7' }}
              >
                <div className="flex flex-col">
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', color: '#251918', textTransform: 'uppercase', marginBottom: 4 }}>Date</span>
                  <span style={{ fontSize: 14, color: '#4f5f78' }}>Oct 24, 2023</span>
                </div>
                <svg width="20" height="20" fill="none" stroke="#4f5f78" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              <div
                className="flex items-center justify-between p-4 rounded-2xl cursor-pointer"
                style={{ border: '1px solid rgba(223,191,188,0.4)', backgroundColor: '#fff8f7' }}
              >
                <div className="flex flex-col">
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', color: '#251918', textTransform: 'uppercase', marginBottom: 4 }}>Guests</span>
                  <span style={{ fontSize: 14, color: '#4f5f78' }}>2 adults</span>
                </div>
                <svg width="20" height="20" fill="none" stroke="#4f5f78" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* Join button */}
            {isCreator ? (
              <button
                onClick={() => router.push(`/experience/${experienceId}/manage`)}
                className="w-full rounded-full font-semibold text-white transition-all active:scale-[0.98] hover:shadow-md"
                style={{ backgroundColor: '#2563eb', fontSize: 20, fontWeight: 600, padding: '20px 0' }}
              >
                Manage Experience
              </button>
            ) : (
              <button
                onClick={handleRequestJoin}
                disabled={joinLoading || isConfirming}
                className="w-full rounded-full font-semibold text-white transition-all active:scale-[0.98] hover:shadow-md"
                style={{ backgroundColor: joinLoading || isConfirming ? '#8b716e' : '#db5852', fontSize: 20, fontWeight: 600, padding: '20px 0' }}
              >
                {joinLoading || isConfirming ? 'Processing...' : 'Join Experience'}
              </button>
            )}

            <p className="text-center" style={{ fontSize: 14, color: 'rgba(79,95,120,0.8)', marginTop: -8 }}>
              You won&apos;t be charged yet
            </p>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
