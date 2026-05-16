'use client';

import { useRouter, useParams } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';
import { ChevronLeft, MoreVertical, MapPin, Star, ImageIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getExperiencesByCreator, getUserProfile } from '@/lib/contractUtils';
import { formatEther } from 'viem';

// ─── Types ───────────────────────────────────────────────────────────────────

interface HostExperience {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  location: string;
  price: bigint;
  maxParticipants: bigint;
  participantCount: bigint;
  startTime: bigint;
  endTime: bigint;
  canceled: boolean;
  creator: string;
}

interface HostData {
  hostedCount: number;
  attendedCount: number;
  experiences: HostExperience[];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ExpImagePlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-surface-container-highest">
      <ImageIcon size={40} strokeWidth={1.5} className="text-outline" />
    </div>
  );
}

function ExperienceCard({ exp, onPress }: { exp: HostExperience; onPress: () => void }) {
  const [imgError, setImgError] = useState(false);
  const priceFormatted = `$${Number(formatEther(exp.price)).toFixed(2)} / person`;
  const durationHours = Number(exp.endTime - exp.startTime) / 3600;
  const durationLabel = durationHours >= 1 ? `${Math.round(durationHours)}h` : `${Math.round(durationHours * 60)}min`;

  return (
    <article
      onClick={onPress}
      className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
    >
      <div className="relative h-40 w-full">
        {imgError || !exp.coverImage ? (
          <ExpImagePlaceholder />
        ) : (
          <Image
            src={exp.coverImage}
            alt={exp.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
            onError={() => setImgError(true)}
          />
        )}
        <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
          <span className="text-xs font-semibold text-on-surface tracking-wide">{priceFormatted}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1 text-secondary">
            <Clock size={13} strokeWidth={2} />
            <span className="text-xs">{durationLabel}</span>
          </div>
          <span className="text-xs text-secondary">·</span>
          <span className="text-xs text-secondary">{Number(exp.participantCount)}/{Number(exp.maxParticipants)} guests</span>
        </div>
        <h4 className="font-h3 text-on-surface mb-1 leading-snug">{exp.title}</h4>
        <p className="font-body-sm text-on-surface-variant leading-relaxed line-clamp-2">{exp.description}</p>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function HostProfilePage() {
  const router = useRouter();
  const params = useParams();
  const hostAddress = params.id as string;
  const [loading, setLoading] = useState(true);
  const [hostData, setHostData] = useState<HostData>({
    hostedCount: 0,
    attendedCount: 0,
    experiences: [],
  });

  const initial = hostAddress
    ? hostAddress.slice(2, 4).toUpperCase()
    : '??';

  useEffect(() => {
    const fetchData = async () => {
      if (!hostAddress) return;
      try {
        const [experiences, profile] = await Promise.all([
          getExperiencesByCreator(hostAddress),
          getUserProfile(hostAddress),
        ]);
        setHostData({
          hostedCount: profile.exists ? profile.hostedCount : experiences.length,
          attendedCount: profile.exists ? profile.attendedCount : 0,
          experiences: experiences as HostExperience[],
        });
      } catch (err) {
        console.error('Error fetching host data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hostAddress]);

  const handleMessageHost = () => {
    const deepLink = `worldapp://chat?address=${hostAddress}`;
    if (MiniKit.isInstalled()) {
      window.location.href = deepLink;
    } else {
      window.open(deepLink, '_blank');
    }
  };

  const totalGuests = hostData.experiences.reduce(
    (sum, exp) => sum + Number(exp.participantCount), 0
  );

  const stats = [
    { label: 'Experiences\nHosted', value: hostData.hostedCount },
    { label: 'People\nMet', value: totalGuests || hostData.attendedCount },
    { label: 'Total\nExperiences', value: hostData.experiences.length },
  ];

  return (
    <div className="min-h-screen bg-surface">

      {/* ── TopAppBar ───────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex justify-between items-center w-full px-5 h-16 bg-surface shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back">
          <ChevronLeft size={22} strokeWidth={2.5} className="text-primary" />
        </Button>

        <h1 className="font-h3 text-on-surface">Host Profile</h1>

        <Button variant="ghost" size="icon" aria-label="More options">
          <MoreVertical size={20} className="text-on-surface" />
        </Button>
      </header>

      <main className="pb-32">

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-foreground to-tertiary-fixed-dim pt-8 pb-10 px-5 text-center rounded-b-3xl shadow-md mb-6">
          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div className="p-1 rounded-full bg-gradient-to-br from-tertiary-fixed-dim to-tertiary-fixed">
              <div className="w-28 h-28 rounded-full flex items-center justify-center border-4 border-surface bg-primary">
                <span className="font-h1 text-on-primary">{initial}</span>
              </div>
            </div>
            {/* Verified badge */}
            <div className="absolute bottom-0 right-1 w-8 h-8 rounded-full flex items-center justify-center bg-surface-container-lowest shadow-md border-2 border-surface">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="var(--color-primary)" />
                <polyline points="8 12 11 15 16 9" stroke="var(--color-on-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Address */}
          <h2 className="font-h2 text-background mb-1 break-all px-2">
            {hostAddress
              ? hostAddress.slice(0, 6) + '...' + hostAddress.slice(-4)
              : 'Unknown'}
          </h2>

          <p className="flex items-center justify-center gap-1 text-background/90 font-body-sm mb-6">
            <MapPin size={14} strokeWidth={2} className="text-background/90" />
            World Chain
          </p>

          {/* Message button */}
          <Button variant="primary" size="sm" onClick={handleMessageHost} className="relative z-40">
            Message Host
          </Button>
        </section>

        {/* ── Stats ───────────────────────────────────────────────────────── */}
        <section className="px-5 mb-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-4 flex justify-around text-center divide-x divide-outline-variant/30">
            {stats.map((stat, i) => (
              <div key={i} className="flex-1 px-2">
                <div className="flex items-center justify-center gap-1 font-h2 text-on-surface mb-1">
                  {stat.value}
                </div>
                <div className="font-label-caps text-secondary whitespace-pre-line leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Experiences ─────────────────────────────────────────────────── */}
        <section className="px-5 mb-6">
          <h3 className="font-h3 text-on-surface mb-4">
            Experiences by this host
          </h3>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : hostData.experiences.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 py-10 px-6 text-center shadow-sm">
              <p className="font-h3 text-on-surface mb-2">No experiences yet</p>
              <p className="font-body-sm text-secondary">This host hasn&apos;t created any experiences.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {hostData.experiences.map(exp => (
                <ExperienceCard
                  key={exp.id}
                  exp={exp}
                  onPress={() => router.push(`/experience/${exp.id}`)}
                />
              ))}
            </div>
          )}
        </section>

      </main>

      <Navigation />
    </div>
  );
}
