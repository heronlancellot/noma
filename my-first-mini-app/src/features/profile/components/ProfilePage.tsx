'use client';

import { Navigation } from '@/components/Navigation';
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
  Rare:   'bg-[#d3a500] text-white',
  Common: 'bg-white text-[#4f5f78] border border-[#dfbfbc]',
  Epic:   'bg-[#a7322f] text-white',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function NFTImagePlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#f4dddb]">
      <ImageIcon size={32} strokeWidth={1.5} className="text-outline" />
    </div>
  );
}

function NFTCard({ nft }: { nft: NFTItem }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl bg-white border border-[#f4dddb] shadow-sm">
      {/* Image */}
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
        <div className="absolute inset-0 bg-black/[0.08]" />
        <span
          className={`absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-[0.05em] px-[9px] py-[3px] rounded-full ${RARITY_CLASS[nft.rarity]}`}
        >
          {nft.rarity}
        </span>
      </div>

      {/* Body */}
      <div className="p-3">
        <p className="text-sm font-semibold truncate text-[#251918]">{nft.title}</p>
        <p className="text-xs mt-0.5 text-[#4f5f78]">{nft.date}</p>
      </div>
    </div>
  );
}

function NFTEmptyState() {
  return (
    <div className="col-span-2 flex flex-col items-center gap-3 rounded-2xl bg-white border border-[#f4dddb] py-10 px-6 text-center shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-[#f4dddb] flex items-center justify-center text-3xl">
        🎖️
      </div>
      <p className="font-quicksand-bold text-[17px] text-[#251918]">
        Ainda sem NFTs
      </p>
      <p className="text-[13px] text-[#58413f] leading-relaxed">
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

  const displayName = session?.user?.name || 'Explorer';
  const firstName = displayName.split(' ')[0];
  const avatarUrl = session?.user?.profilePictureUrl;

  // Progress ring — r=40, circumference ≈ 251.3
  const r = 40;
  const circumference = 2 * Math.PI * r;
  const ringOffset = circumference - (profileData.missionProgress / 100) * circumference;

  const stats = [
    { value: profileData.attendedCount, label: 'Attended'   },
    { value: profileData.hostedCount,   label: 'Hosted'     },
    { value: profileData.peopleMetCount, label: 'People Met' },
  ];

  return (
    <div className="min-h-screen bg-[#fff8f7]">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-5 h-16 sticky top-0 z-40 bg-[#fff8f7]">
        {/* Avatar thumbnail */}
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-[#dfbfbc]"
          />
        ) : (
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-[#f4dddb]">
            <span className="text-sm font-bold text-[#a7322f]">{firstName.charAt(0)}</span>
          </div>
        )}

        {/* Wordmark */}
        <h2 className="font-quicksand-bold text-xl text-[#251918] tracking-[0.08em]">NOMA</h2>

        {/* Search */}
        <button className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" aria-label="Search">
          <Search size={20} strokeWidth={2} className="text-primary" />
        </button>
      </header>

      <main className="pb-32">

        {/* ── Profile hero ─────────────────────────────────────────────── */}
        <section className="pt-8 pb-12 px-5 text-center mb-4 bg-gradient-to-br from-[#0a1c32] to-[#d3a500] rounded-b-3xl">
          {/* Avatar with gradient ring */}
          <div className="relative inline-block mt-1 mb-4">
            <div className="p-0.5 rounded-full bg-gradient-to-br from-[#d3a500] to-[#ffdf92]">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#fff8f7]"
                />
              ) : (
                <div className="w-24 h-24 rounded-full flex items-center justify-center bg-[#0a1c32] border-4 border-[#fff8f7]">
                  <span className="font-quicksand-bold text-[32px] text-white">{firstName.charAt(0)}</span>
                </div>
              )}
            </div>
            {/* Edit button */}
            <button
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm bg-[#fff8f7] border border-[#dfbfbc]"
              aria-label="Edit profile"
            >
              <Pencil size={13} strokeWidth={2} className="text-secondary" />
            </button>
          </div>

          {/* Name + verified */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="font-quicksand-bold text-[32px] tracking-[-0.02em] text-white">{displayName}</h2>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#f4bf00" />
              <polyline points="8 12 11 15 16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <p className="text-[14px] text-[#fae3e1]">Digital Nomad &amp; Explorer</p>
        </section>

        {/* ── Stats row ────────────────────────────────────────────────── */}
        <section className="px-5 mb-6">
          <div className="flex justify-between items-center text-center rounded-2xl p-4 bg-white border border-[#f4dddb] shadow-sm">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center flex-1">
                {i > 0 && <div className="h-12 w-px flex-shrink-0 bg-[#dfbfbc]/40" />}
                <div className="flex-1">
                  <p className="font-quicksand-bold text-2xl text-[#a7322f]">{stat.value}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#4f5f78]">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── NOMA Mission ─────────────────────────────────────────────── */}
        <section className="px-5 mb-6">
          <h3 className="font-quicksand-bold text-xl text-[#251918] mb-3">NOMA Mission</h3>
          <div className="flex items-center gap-5 rounded-2xl p-5 bg-white border border-[#f4dddb] shadow-sm">
            {/* Progress ring */}
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={r} fill="none" stroke="#ffe9e7" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r={r} fill="none"
                  stroke="#d3a500" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={ringOffset}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-quicksand-bold text-[16px] text-[#d3a500]">
                  {profileData.missionProgress}%
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[17px] font-semibold text-[#251918] mb-1">{profileData.missionLabel}</p>
              <p className="text-[13px] text-[#4f5f78] leading-relaxed">{profileData.missionNext}</p>
            </div>
          </div>
        </section>

        {/* ── NFT Gallery ──────────────────────────────────────────────── */}
        <section className="px-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-quicksand-bold text-xl text-[#251918]">My Experience NFTs</h3>
            <button className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#a7322f]">
              VIEW ALL
            </button>
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
