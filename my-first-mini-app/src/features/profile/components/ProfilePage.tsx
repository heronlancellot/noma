'use client';

import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getUserProfile, getUserApprovedExperiences } from '@/lib/contractUtils';
import Image from 'next/image';
import { Search, Pencil, ImageIcon } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NFTItem {
  id: string;
  title: string;
  image: string;
  date: string;
  rarity: 'Rare' | 'Common' | 'Epic';
}

interface ProfileData {
  hostedCount: number;
  attendedCount: number;
  peopleMetCount: number;
  nftGallery: NFTItem[];
  missionProgress: number;
  missionLabel: string;
  missionNext: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const RARITY_CLASS: Record<string, string> = {
  Rare:   'bg-tertiary-container text-on-primary',
  Common: 'bg-surface-container-lowest text-secondary border border-outline-variant',
  Epic:   'bg-primary text-on-primary',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function NFTImagePlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-surface-container-highest">
      <ImageIcon size={32} strokeWidth={1.5} className="text-outline" />
    </div>
  );
}

function NFTCard({ nft }: { nft: NFTItem }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl bg-surface-container-lowest border border-surface-container-highest shadow-sm">
      <div className="relative h-32 w-full">
        {imgError ? (
          <NFTImagePlaceholder />
        ) : (
          <Image
            src={nft.image}
            alt={nft.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 200px"
            onError={() => setImgError(true)}
          />
        )}
        <div className="absolute inset-0 bg-on-surface/[0.08]" />
        <span
          className={`absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full ${RARITY_CLASS[nft.rarity]}`}
        >
          {nft.rarity}
        </span>
      </div>

      <div className="p-3">
        <p className="font-body-sm font-semibold truncate text-on-surface">{nft.title}</p>
        <p className="text-xs mt-0.5 text-secondary">{nft.date}</p>
      </div>
    </div>
  );
}

function NFTEmptyState() {
  return (
    <div className="col-span-2 flex flex-col items-center gap-3 rounded-2xl bg-surface-container-lowest border border-surface-container-highest py-10 px-6 text-center shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center text-3xl">
        🎖️
      </div>
      <p className="font-h3 text-on-surface">
        Ainda sem NFTs
      </p>
      <p className="font-body-sm text-on-surface-variant leading-relaxed">
        Participe de experiências para ganhar badges exclusivos e construir sua coleção.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ProfilePage() {
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState<ProfileData>({
    hostedCount: 0,
    attendedCount: 0,
    peopleMetCount: 0,
    nftGallery: [],
    missionProgress: 75,
    missionLabel: 'Wanderlust Initiate',
    missionNext: 'Attend 3 more experiences to unlock the "Global Nomad" badge.',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) return;
      const userAddress = session.user.walletAddress || session.user.id;
      if (!userAddress) return;
      try {
        const profile = await getUserProfile(userAddress);
        const approved = await getUserApprovedExperiences(userAddress);
        const attended = profile.exists ? profile.attendedCount : approved.length;
        const hosted = profile.exists ? profile.hostedCount : 0;

        const mockNFTs: NFTItem[] = [
          {
            id: '1', title: 'Alpine Sunrise', date: 'Oct 2023', rarity: 'Rare',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
          },
          {
            id: '2', title: 'Nomad Coffee', date: 'Sep 2023', rarity: 'Common',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
          },
          {
            id: '3', title: 'Coastal Bonfire', date: 'Aug 2023', rarity: 'Epic',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',
          },
        ];

        setProfileData({
          hostedCount: hosted,
          attendedCount: attended,
          peopleMetCount: Math.max(attended * 7, 0),
          nftGallery: mockNFTs,
          missionProgress: 75,
          missionLabel: 'Wanderlust Initiate',
          missionNext: 'Attend 3 more experiences to unlock the "Global Nomad" badge.',
        });
      } catch { /* keep defaults */ }
    };
    fetchProfile();
  }, [session]);

  const displayName = session?.user?.username || session?.user?.name || 'Explorer';
  const firstName = displayName.split(' ')[0];
  const avatarUrl = session?.user?.profilePictureUrl;
  const walletAddress = session?.user?.walletAddress || session?.user?.id;

  const r = 40;
  const circumference = 2 * Math.PI * r;
  const ringOffset = circumference - (profileData.missionProgress / 100) * circumference;

  const stats = [
    { value: profileData.attendedCount, label: 'Attended' },
    { value: profileData.hostedCount,   label: 'Hosted' },
    { value: profileData.peopleMetCount, label: 'People Met' },
  ];

  return (
    <div className="min-h-screen bg-surface">

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-5 h-16 sticky top-0 z-40 bg-surface">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-outline-variant"
          />
        ) : (
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-surface-container-highest">
            <span className="font-body-sm font-bold text-primary">{firstName.charAt(0)}</span>
          </div>
        )}

        <span className="font-h3 text-on-surface tracking-widest">NOMA</span>

        <Button variant="ghost" size="icon-sm" aria-label="Search">
          <Search size={20} strokeWidth={2} className="text-primary" />
        </Button>
      </header>

      <main className="pb-32">

        {/* ── Profile hero ── */}
        <section aria-label="Profile" className="pt-8 pb-12 px-5 text-center mb-4 bg-gradient-to-br from-foreground to-tertiary-container rounded-b-3xl">
          <div className="relative inline-block mt-1 mb-4">
            <div className="p-0.5 rounded-full bg-gradient-to-br from-tertiary-container to-tertiary-fixed">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover border-4 border-surface"
                />
              ) : (
                <div className="w-24 h-24 rounded-full flex items-center justify-center bg-foreground border-4 border-surface">
                  <span className="font-h1 text-background">{firstName.charAt(0)}</span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute bottom-0 right-0 bg-surface border border-outline-variant shadow-sm"
              aria-label="Edit profile"
            >
              <Pencil size={13} strokeWidth={2} className="text-secondary" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="font-h1 text-background">{displayName}</h1>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="var(--color-tertiary-fixed-dim)" />
              <polyline points="8 12 11 15 16 9" stroke="var(--color-background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {walletAddress && (
            <p className="text-xs text-background/60 mb-1 font-mono">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
          )}
          <p className="font-body-sm text-background/80">Digital Nomad &amp; Explorer</p>
        </section>

        {/* ── Stats row ── */}
        <section aria-label="Statistics" className="px-5 mb-6">
          <div className="flex justify-between items-center text-center rounded-2xl p-4 bg-surface-container-lowest border border-surface-container-highest shadow-sm">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center flex-1">
                {i > 0 && <div className="h-12 w-px flex-shrink-0 bg-outline-variant/40" />}
                <div className="flex-1">
                  <p className="font-h2 text-primary">{stat.value}</p>
                  <p className="font-label-caps text-secondary">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── NOMA Mission ── */}
        <section aria-label="Mission progress" className="px-5 mb-6">
          <h2 className="font-h3 text-on-surface mb-3">NOMA Mission</h2>
          <div className="flex items-center gap-5 rounded-2xl p-5 bg-surface-container-lowest border border-surface-container-highest shadow-sm">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-surface-container)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r={r} fill="none"
                  stroke="var(--color-tertiary-container)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={ringOffset}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-quicksand-bold text-tertiary-container">
                  {profileData.missionProgress}%
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-h3 text-on-surface mb-1">{profileData.missionLabel}</p>
              <p className="font-body-sm text-secondary leading-relaxed">{profileData.missionNext}</p>
            </div>
          </div>
        </section>

        {/* ── NFT Gallery ── */}
        <section aria-label="NFT Gallery" className="px-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-h3 text-on-surface">My Experience NFTs</h2>
            <Button variant="link" size="xs" className="font-label-caps text-primary">
              VIEW ALL
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {profileData.nftGallery.length === 0 ? (
              <NFTEmptyState />
            ) : (
              profileData.nftGallery.map(nft => <NFTCard key={nft.id} nft={nft} />)
            )}
          </div>
        </section>

      </main>

      <Navigation />
    </div>
  );
}
