# Experience Detail — Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `src/features/experience-detail` to align with the project's architectural standards — creating `hooks/` and `types/` directories, extracting two focused hooks, exporting the existing `publicClient` singleton, and fixing all design token violations across three page components and `BookingCard`.

**Architecture:** Two focused hooks extract non-trivial stateful logic: `useExperienceDetail` (fetch + contract→UI mapping, used by all three pages) and `useJoinExperience` (transaction + receipt watching + navigation, used by `ExperienceDetailPage` only). Simple state (hearted, share, date picker) stays inline. `publicClient` already exists in `contractUtils.ts` as a singleton — just needs `export`. All hardcoded hex colors and `style={{}}` color/background props replaced with tokens from `globals.css`.

**Tech Stack:** Next.js 15, React 19, TypeScript 5, Tailwind CSS v4, viem, `@worldcoin/minikit-js`, `@worldcoin/minikit-react`, next-auth v5.

> **Note:** No test infrastructure in this project. Verification is TypeScript correctness (no `any`, no missing imports, no red squiggles) and code review per step. Do NOT run `pnpm build`, `pnpm dev`, or any build command per project rules.

---

## Files Overview

| Action | Path |
|---|---|
| Create | `src/features/experience-detail/types/index.ts` |
| Create | `src/features/experience-detail/hooks/useExperienceDetail.ts` |
| Create | `src/features/experience-detail/hooks/useJoinExperience.ts` |
| Create | `src/features/experience-detail/hooks/index.ts` |
| Modify | `src/lib/contractUtils.ts` — add `export` to existing `publicClient` |
| Modify | `src/features/experience-detail/components/ExperienceDetailPage.tsx` |
| Modify | `src/features/experience-detail/components/BookingCard.tsx` |
| Modify | `src/features/experience-detail/components/ExperienceManagePage.tsx` |
| Modify | `src/features/experience-detail/components/ExperienceConfirmationPage.tsx` |
| Modify | `src/features/experience-detail/index.ts` |

---

### Task 1: Create shared types

**Files:**
- Create: `src/features/experience-detail/types/index.ts`

- [ ] **Step 1: Create the types file**

```ts
// src/features/experience-detail/types/index.ts

export interface ExperienceDetailData {
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

export interface ExperienceConfirmationData {
  id: string;
  title: string;
  location: string;
  startTime?: bigint;
  image: string;
}

export interface JoinRequest {
  address: string;
  status: 'pending' | 'approved';
}
```

---

### Task 2: Export publicClient from contractUtils

**Files:**
- Modify: `src/lib/contractUtils.ts`

`publicClient` already exists as a private `const` on line 6. It just needs `export`.

- [ ] **Step 1: Add `export` to the existing publicClient declaration**

Find this line in `src/lib/contractUtils.ts`:
```ts
const publicClient = createPublicClient({
```

Replace with:
```ts
export const publicClient = createPublicClient({
```

That is the only change to this file.

---

### Task 3: Create useExperienceDetail hook

**Files:**
- Create: `src/features/experience-detail/hooks/useExperienceDetail.ts`

- [ ] **Step 1: Create the file**

```ts
// src/features/experience-detail/hooks/useExperienceDetail.ts
'use client';

import { useState, useEffect } from 'react';
import { formatUnits } from 'viem';
import { getExperienceDetails } from '@/lib/contractUtils';
import type { ExperienceDetailData } from '../types';

export function useExperienceDetail(experienceId: string) {
  const [experience, setExperience] = useState<ExperienceDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        setError(null);
        const id = parseInt(experienceId, 10);
        if (isNaN(id)) {
          setError('Invalid experience ID');
          setLoading(false);
          return;
        }
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

  return { experience, loading, error };
}
```

---

### Task 4: Create useJoinExperience hook

**Files:**
- Create: `src/features/experience-detail/hooks/useJoinExperience.ts`

- [ ] **Step 1: Create the file**

```ts
// src/features/experience-detail/hooks/useJoinExperience.ts
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { encodeFunctionData } from 'viem';
import { MiniKit } from '@worldcoin/minikit-js';
import { useWaitForTransactionReceipt } from '@worldcoin/minikit-react';
import { publicClient } from '@/lib/contractUtils';
import { NOMAD_EXPERIENCE_ADDRESS, NOMAD_EXPERIENCE_ABI } from '@/contracts/constants';

export function useJoinExperience(experienceId: string) {
  const router = useRouter();
  const [joinLoading, setJoinLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError,
    error: transactionError,
  } = useWaitForTransactionReceipt({
    client: publicClient,
    appConfig: { app_id: process.env.NEXT_PUBLIC_WLD_CLIENT_ID as `app_${string}` },
    transactionId,
  });

  useEffect(() => {
    if (!transactionId || isConfirming) return;
    if (isConfirmed) {
      setJoinLoading(false);
      router.push(`/experience/${experienceId}/confirmation`);
    } else if (isError) {
      console.error('Transaction failed:', transactionError);
      setJoinLoading(false);
      setTransactionId('');
    }
  }, [isConfirmed, isConfirming, isError, transactionError, transactionId, router, experienceId]);

  const handleRequestJoin = async (price: string) => {
    try {
      setJoinLoading(true);
      setTransactionId('');
      const priceInUSD = parseFloat(price.replace('$', ''));
      const priceInWei = BigInt(Math.floor(priceInUSD * 1e18));
      const priceInHex = '0x' + priceInWei.toString(16);
      const data = encodeFunctionData({
        abi: NOMAD_EXPERIENCE_ABI,
        functionName: 'requestJoin',
        args: [Number(experienceId)],
      });
      const txResult = await MiniKit.sendTransaction({
        chainId: 480,
        transactions: [{ to: NOMAD_EXPERIENCE_ADDRESS, data, value: priceInHex }],
      });
      const finalPayload = txResult.data;
      if (finalPayload.status === 'success') {
        setTransactionId(finalPayload.userOpHash);
      } else {
        setJoinLoading(false);
      }
    } catch {
      setJoinLoading(false);
    }
  };

  return { joinLoading, isConfirming, handleRequestJoin };
}
```

---

### Task 5: Create hooks barrel export

**Files:**
- Create: `src/features/experience-detail/hooks/index.ts`

- [ ] **Step 1: Create the barrel**

```ts
// src/features/experience-detail/hooks/index.ts
export { useExperienceDetail } from './useExperienceDetail';
export { useJoinExperience } from './useJoinExperience';
```

---

### Task 6: Refactor ExperienceDetailPage

**Files:**
- Modify: `src/features/experience-detail/components/ExperienceDetailPage.tsx`

The page drops from ~250 lines to ~90. The `createPublicClient` block, `useWaitForTransactionReceipt`, and the fetch `useEffect` are all removed — now handled by hooks.

- [ ] **Step 1: Replace the entire file contents**

```tsx
// src/features/experience-detail/components/ExperienceDetailPage.tsx
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
import { useExperienceDetail } from '@/features/experience-detail/hooks';
import { useJoinExperience } from '@/features/experience-detail/hooks';

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
  const [selectedDate, setSelectedDate] = useState('2023-10-24');
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
```

---

### Task 7: Fix BookingCard design tokens

**Files:**
- Modify: `src/features/experience-detail/components/BookingCard.tsx`

- [ ] **Step 1: Replace the entire file contents**

Token changes: `text-[38px]`→`text-4xl`, `text-[16px]`→`font-body-md`, `text-[11px] uppercase tracking-widest`→`font-label-caps`, `text-[15px]`→`font-body-sm`, `style={{ backgroundColor: '#fdf6f4' }}`→`bg-surface-container-low`, `bg-[#c0544e]`→`bg-noma-btn`, `text-[17px]`→`text-lg`, `text-[14px]`→`font-body-sm`.

```tsx
// src/features/experience-detail/components/BookingCard.tsx
'use client';

import { ChevronDown } from 'lucide-react';

interface BookingCardProps {
  price: string;
  selectedDate: string;
  onDateChange: (date: string) => void;
  isCreator: boolean;
  joinLoading: boolean;
  isConfirming: boolean;
  onJoin: () => void;
  onManage: () => void;
}

export function BookingCard({
  price, selectedDate, onDateChange,
  isCreator, joinLoading, isConfirming, onJoin, onManage,
}: BookingCardProps) {
  const isProcessing = joinLoading || isConfirming;

  return (
    <div
      className="bg-surface-container-lowest p-6 rounded-3xl flex flex-col gap-5"
      style={{ boxShadow: '0 4px 24px rgba(37,25,24,0.10)' }}
    >
      {/* Price */}
      <div className="flex flex-col gap-0.5">
        <span className="text-4xl font-extrabold text-on-surface leading-tight tracking-tight">{price}</span>
        <span className="font-body-md text-secondary font-medium">/ person</span>
      </div>

      {/* Date + Guests selectors */}
      <div className="flex flex-col gap-3">
        <label className="border border-outline-variant/30 rounded-2xl p-4 flex justify-between items-center cursor-pointer active:opacity-80 transition-opacity bg-surface-container-low">
          <div className="flex flex-col gap-0.5">
            <span className="font-label-caps text-on-surface font-bold">Date</span>
            <span className="font-body-sm text-secondary font-medium">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              })}
            </span>
          </div>
          <ChevronDown size={20} strokeWidth={2} className="text-secondary" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="sr-only"
          />
        </label>

        <div className="border border-outline-variant/30 rounded-2xl p-4 flex justify-between items-center cursor-pointer active:opacity-80 transition-opacity bg-surface-container-low">
          <div className="flex flex-col gap-0.5">
            <span className="font-label-caps text-on-surface font-bold">Guests</span>
            <span className="font-body-sm text-secondary font-medium">2 adults</span>
          </div>
          <ChevronDown size={20} strokeWidth={2} className="text-secondary" />
        </div>
      </div>

      {/* CTA button */}
      {isCreator ? (
        <button
          onClick={onManage}
          className="w-full bg-secondary text-on-secondary py-4 rounded-full text-lg font-bold shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
        >
          Manage Experience
        </button>
      ) : (
        <button
          onClick={onJoin}
          disabled={isProcessing}
          className={`w-full py-4 rounded-full text-lg font-bold text-white shadow-md transition-all active:scale-[0.98] ${
            isProcessing ? 'bg-outline cursor-not-allowed' : 'bg-noma-btn'
          }`}
          style={!isProcessing ? { boxShadow: '0 4px 16px rgba(167,50,47,0.35)' } : undefined}
        >
          {isProcessing ? 'Processing...' : 'Join Experience'}
        </button>
      )}

      <p className="text-center font-body-sm text-secondary/70">
        You won&apos;t be charged yet
      </p>
    </div>
  );
}
```

---

### Task 8: Refactor ExperienceManagePage

**Files:**
- Modify: `src/features/experience-detail/components/ExperienceManagePage.tsx`

Changes: use `useExperienceDetail` for base fetch, import `publicClient` from `@/lib/contractUtils` instead of creating it inline, use `JoinRequest` type from feature types, fix all design token violations, use a `fetchCount` pattern (established in `useExperiences.ts`) to trigger join request refreshes.

- [ ] **Step 1: Replace the entire file contents**

```tsx
// src/features/experience-detail/components/ExperienceManagePage.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { encodeFunctionData } from 'viem';
import { MiniKit } from '@worldcoin/minikit-js';
import { useWaitForTransactionReceipt } from '@worldcoin/minikit-react';
import Image from 'next/image';
import { MapPin, QrCode, Check, X } from 'lucide-react';
import { Page } from '@/components/PageLayout';
import { TopBar } from '@worldcoin/mini-apps-ui-kit-react';
import { Navigation } from '@/components/Navigation';
import { publicClient, getJoinRequests, getParticipants } from '@/lib/contractUtils';
import { NOMAD_EXPERIENCE_ADDRESS, NOMAD_EXPERIENCE_ABI } from '@/contracts/constants';
import { useExperienceDetail } from '@/features/experience-detail/hooks';
import type { JoinRequest } from '@/features/experience-detail/types';

export function ExperienceManagePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const experienceId = params.id as string;

  const { experience, loading, error } = useExperienceDetail(experienceId);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [processingAddress, setProcessingAddress] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [fetchCount, setFetchCount] = useState(0);

  const isCreator = !!(
    experience &&
    session?.user &&
    ((session.user.walletAddress || session.user.id)?.toLowerCase() ===
      experience.creator.toLowerCase())
  );

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError,
    error: transactionError,
  } = useWaitForTransactionReceipt({
    client: publicClient,
    appConfig: { app_id: process.env.NEXT_PUBLIC_WLD_CLIENT_ID as `app_${string}` },
    transactionId,
  });

  useEffect(() => {
    if (!experience || !isCreator) return;
    const id = parseInt(experienceId, 10);
    if (isNaN(id)) return;
    setRequestsLoading(true);
    Promise.all([getJoinRequests(id), getParticipants(id)])
      .then(([requests, participants]) => {
        setJoinRequests(
          requests.map((addr) => ({
            address: addr,
            status: (participants.includes(addr) ? 'approved' : 'pending') as JoinRequest['status'],
          }))
        );
      })
      .catch(() => { /* ignore */ })
      .finally(() => setRequestsLoading(false));
  }, [experience, isCreator, experienceId, fetchCount]);

  useEffect(() => {
    if (!transactionId || isConfirming) return;
    if (isConfirmed) {
      setProcessingAddress(null);
      setTransactionId('');
      setFetchCount((c) => c + 1);
    } else if (isError) {
      console.error('Transaction failed:', transactionError);
      setProcessingAddress(null);
      setTransactionId('');
    }
  }, [isConfirmed, isConfirming, isError, transactionError, transactionId]);

  const handleApprove = async (userAddress: string) => {
    try {
      setProcessingAddress(userAddress);
      setTransactionId('');
      const data = encodeFunctionData({
        abi: NOMAD_EXPERIENCE_ABI,
        functionName: 'approveJoin',
        args: [Number(experienceId), userAddress as `0x${string}`],
      });
      const txResult = await MiniKit.sendTransaction({
        chainId: 480,
        transactions: [{ to: NOMAD_EXPERIENCE_ADDRESS, data }],
      });
      const finalPayload = txResult.data;
      if (finalPayload.status === 'success') {
        setTransactionId(finalPayload.userOpHash);
      } else {
        setProcessingAddress(null);
      }
    } catch {
      setProcessingAddress(null);
    }
  };

  const handleReject = async (userAddress: string) => {
    try {
      setProcessingAddress(userAddress);
      setTransactionId('');
      const data = encodeFunctionData({
        abi: NOMAD_EXPERIENCE_ABI,
        functionName: 'rejectJoin',
        args: [Number(experienceId), userAddress as `0x${string}`],
      });
      const txResult = await MiniKit.sendTransaction({
        chainId: 480,
        transactions: [{ to: NOMAD_EXPERIENCE_ADDRESS, data }],
      });
      const rejectPayload = txResult.data;
      if (rejectPayload.status === 'success') {
        setTransactionId(rejectPayload.userOpHash);
      } else {
        setProcessingAddress(null);
      }
    } catch {
      setProcessingAddress(null);
    }
  };

  if (loading) {
    return (
      <Page>
        <Page.Main className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
            <p className="font-body-sm text-on-surface-variant">Loading...</p>
          </div>
        </Page.Main>
      </Page>
    );
  }

  if (error || !experience) {
    return (
      <Page>
        <Page.Header className="p-0">
          <TopBar title="Manage Experience" />
        </Page.Header>
        <Page.Main className="flex items-center justify-center">
          <div className="text-center">
            <p className="font-body-sm text-on-surface-variant font-semibold mb-2">Error</p>
            <p className="font-body-sm text-on-surface-variant">{error || 'Unable to load data'}</p>
          </div>
        </Page.Main>
      </Page>
    );
  }

  if (!isCreator) {
    return (
      <Page>
        <Page.Header className="p-0">
          <TopBar title="Manage Experience" />
        </Page.Header>
        <Page.Main className="flex items-center justify-center">
          <p className="font-body-sm text-on-surface-variant">You are not the creator of this experience</p>
        </Page.Main>
      </Page>
    );
  }

  const pendingRequests = joinRequests.filter((r) => r.status === 'pending');
  const approvedRequests = joinRequests.filter((r) => r.status === 'approved');

  return (
    <Page className="bg-surface">
      <Page.Header className="p-0">
        <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-outline-variant">
          <h1 className="font-h3 text-on-surface">Schedule</h1>
          <button
            onClick={() => router.push(`/experience/${experienceId}`)}
            className="p-2 hover:bg-surface-container rounded-lg transition-colors"
            aria-label="View QR Code"
          >
            <QrCode size={24} className="text-on-surface" strokeWidth={2} />
          </button>
        </div>
      </Page.Header>

      <Page.Main className="pb-28 bg-surface-container">
        {requestsLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        )}

        {!requestsLoading && pendingRequests.length > 0 && (
          <div className="px-4 py-6">
            <h2 className="font-h3 text-on-surface mb-4">Next Experiences</h2>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.address} className="bg-surface rounded-2xl shadow-sm overflow-hidden">
                  <div className="relative w-full h-48">
                    <Image src={experience.images[0]} alt={experience.title} fill className="object-cover" />
                    <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1">
                      <span className="text-tertiary-fixed-dim text-sm">★</span>
                      <span className="text-on-surface text-sm font-semibold">{experience.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-h3 text-on-surface mb-2">{experience.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-surface-container-highest" />
                      <span className="font-body-sm text-on-surface-variant">
                        Requested by {request.address.slice(0, 6)}...{request.address.slice(-4)}
                      </span>
                    </div>
                    <p className="font-body-sm text-on-surface-variant mb-4 line-clamp-2">{experience.description}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin size={16} className="text-on-surface" strokeWidth={2} />
                      <span className="font-body-sm text-on-surface">{experience.location}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(request.address)}
                        disabled={processingAddress === request.address}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-outline disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg font-body-sm font-semibold transition-colors"
                      >
                        {processingAddress === request.address ? (
                          <span>Processing...</span>
                        ) : (
                          <>
                            <Check size={20} strokeWidth={2.5} />
                            <span>Approve</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(request.address)}
                        disabled={processingAddress === request.address}
                        className="flex-1 flex items-center justify-center gap-2 bg-error hover:bg-error/90 active:bg-error/80 disabled:bg-outline disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg font-body-sm font-semibold transition-colors"
                      >
                        {processingAddress === request.address ? (
                          <span>Processing...</span>
                        ) : (
                          <>
                            <X size={20} strokeWidth={2.5} />
                            <span>Reject</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!requestsLoading && approvedRequests.length > 0 && (
          <div className="px-4 py-6">
            <h2 className="font-h3 text-on-surface mb-4">Approved Participants</h2>
            <div className="space-y-4">
              {approvedRequests.map((request) => (
                <div key={request.address} className="bg-surface rounded-2xl shadow-sm overflow-hidden">
                  <div className="relative w-full h-48">
                    <Image src={experience.images[0]} alt={experience.title} fill className="object-cover" />
                    <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1">
                      <span className="text-tertiary-fixed-dim text-sm">★</span>
                      <span className="text-on-surface text-sm font-semibold">{experience.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-h3 text-on-surface mb-2">{experience.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-surface-container-highest" />
                      <span className="font-body-sm text-on-surface-variant">
                        Approved: {request.address.slice(0, 6)}...{request.address.slice(-4)}
                      </span>
                    </div>
                    <p className="font-body-sm text-on-surface-variant mb-4 line-clamp-2">{experience.description}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin size={16} className="text-on-surface" strokeWidth={2} />
                      <span className="font-body-sm text-on-surface">{experience.location}</span>
                    </div>
                    <button
                      disabled
                      className="w-full bg-secondary text-on-secondary px-4 py-2.5 rounded-lg font-body-sm font-semibold cursor-not-allowed"
                    >
                      Approved
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!requestsLoading && pendingRequests.length === 0 && approvedRequests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <p className="font-body-md text-on-surface-variant text-center">No join requests yet</p>
          </div>
        )}
      </Page.Main>

      <Navigation />
    </Page>
  );
}
```

Token changes made:
- `text-[#1f1f1f]` → `text-on-surface`
- `text-[#757683]` → `text-on-surface-variant`
- `text-[#fccd09]` (star) → `text-tertiary-fixed-dim`
- `border-gray-200` → `border-outline-variant`
- `bg-gray-50` → `bg-surface-container`
- `hover:bg-gray-100` → `hover:bg-surface-container`
- `text-gray-600` → `text-on-surface-variant`
- `bg-gray-300` (avatar placeholder) → `bg-surface-container-highest`
- `border-[#db5852]` (spinner) → `border-primary`
- `bg-red-600 hover:bg-red-700 active:bg-red-800` (reject) → `bg-error hover:bg-error/90 active:bg-error/80`
- `bg-blue-600` (approved button) → `bg-secondary`

---

### Task 9: Refactor ExperienceConfirmationPage

**Files:**
- Modify: `src/features/experience-detail/components/ExperienceConfirmationPage.tsx`

Changes: all `style={{ color/backgroundColor }}` removed, replaced with token classes; `<img>` replaced with Next.js `<Image>`; uses `ExperienceConfirmationData` from feature types; mascot section replaced with actual `nomajin-happy.png` (already in `public/`).

- [ ] **Step 1: Replace the entire file contents**

```tsx
// src/features/experience-detail/components/ExperienceConfirmationPage.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import { getExperienceDetails } from '@/lib/contractUtils';
import type { ExperienceConfirmationData } from '@/features/experience-detail/types';

export function ExperienceConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const [experience, setExperience] = useState<ExperienceConfirmationData | null>(null);
  const [loading, setLoading] = useState(true);
  const experienceId = params.id as string;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = parseInt(experienceId, 10);
        if (isNaN(id)) return;
        const data = await getExperienceDetails(id);
        setExperience({
          id: data.id.toString(),
          title: data.title,
          location: data.location,
          startTime: data.startTime,
          image: data.coverImage || '/image-default.png',
        });
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [experienceId]);

  const formatDate = (ts?: bigint) => {
    if (!ts || ts === BigInt(0)) return 'TBD';
    return new Date(Number(ts) * 1000).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen flex flex-col items-center px-5 pt-16 pb-12">
      {/* Mascot */}
      <div className="mb-5">
        <Image src="/nomajin-happy.png" alt="NOMAJIN" width={96} height={96} />
      </div>

      <h1 className="font-h2 text-foreground text-center mb-3 leading-tight">
        Your spot is being<br />reserved! 🎉
      </h1>
      <p className="font-body-sm text-secondary text-center mb-8 leading-relaxed max-w-[280px]">
        The organizer will review your request shortly. Get ready for adventure!
      </p>

      {experience && (
        <div
          className="w-full rounded-2xl overflow-hidden mb-6 bg-surface border border-tertiary-fixed-dim/40"
          style={{ boxShadow: '0 2px 12px rgba(13,31,53,0.08)' }}
        >
          <div className="flex items-center gap-3 p-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={experience.image}
                alt={experience.title}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-block font-label-caps font-bold px-2 py-0.5 rounded-full mb-1 bg-tertiary-fixed/20 text-tertiary-container">
                Pending Approval
              </span>
              <h3 className="font-body-md font-bold text-foreground leading-tight truncate">{experience.title}</h3>
              {experience.startTime && experience.startTime > BigInt(0) && (
                <div className="flex items-center gap-1 mt-1">
                  <Calendar size={11} strokeWidth={2} className="text-secondary" />
                  <span className="text-xs text-secondary">{formatDate(experience.startTime)}</span>
                </div>
              )}
              {experience.location && (
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={11} strokeWidth={2} className="text-secondary" />
                  <span className="text-xs text-secondary truncate">{experience.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => router.push('/')}
        className="w-full py-4 rounded-2xl font-body-md font-bold text-white mb-4 transition-opacity active:opacity-80 bg-noma-btn"
      >
        Back to Home
      </button>

      <button
        onClick={() => router.push(`/experience/${experienceId}`)}
        className="font-body-sm font-semibold text-secondary"
      >
        View Request Details
      </button>
    </div>
  );
}
```

Token changes made:
- `style={{ backgroundColor: '#fafaf8' }}` → `bg-background` className
- `style={{ color: '#0d1f35' }}` on h1 → `text-foreground`
- `style={{ color: '#5a5a6e', maxWidth: 280 }}` → `text-secondary max-w-[280px]`
- `style={{ backgroundColor: '#db5852' }}` on button → `bg-noma-btn`
- `style={{ color: '#5a5a6e' }}` on button → `text-secondary`
- `style={{ backgroundColor: '#fff', border: ... }}` → `bg-surface border border-tertiary-fixed-dim/40`
- `style={{ backgroundColor: 'rgba(245,192,0,0.18)', color: '#b38d00' }}` → `bg-tertiary-fixed/20 text-tertiary-container`
- `style={{ color: '#0d1f35' }}` on h3 → `text-foreground`
- `style={{ color: '#5a5a6e' }}` on spans → `text-secondary`
- `text-[24px] font-bold` → `font-h2`
- `text-[14px]` → `font-body-sm`
- `text-[10px] font-bold uppercase tracking-wide` → `font-label-caps font-bold`
- `text-[16px] font-bold` → `font-body-md font-bold`
- `text-[11px]` → `text-xs`
- `eslint-disable @next/next/no-img-element` + `<img>` → `<Image>` from next/image

---

### Task 10: Update feature barrel exports

**Files:**
- Modify: `src/features/experience-detail/index.ts`

- [ ] **Step 1: Replace the file contents**

```ts
// src/features/experience-detail/index.ts
export * from './components';
export * from './hooks';
export * from './types';
```

- [ ] **Step 2: Verify `src/features/experience-detail/components/index.ts` is complete**

Read the file and confirm it has all 10 exports. It should already be:

```ts
export { AboutSection } from './AboutSection';
export { BookingCard } from './BookingCard';
export { HeroSection } from './HeroSection';
export { MapPlaceholder } from './MapPlaceholder';
export { OrganizerCard } from './OrganizerCard';
export { QuickStats } from './QuickStats';
export { TagsSection } from './TagsSection';
export { ExperienceDetailPage } from './ExperienceDetailPage';
export { ExperienceConfirmationPage } from './ExperienceConfirmationPage';
export { ExperienceManagePage } from './ExperienceManagePage';
```

No changes needed to this file.

---

## Success Criteria

1. `src/features/experience-detail/types/index.ts` exists with `ExperienceDetailData`, `ExperienceConfirmationData`, `JoinRequest`.
2. `src/features/experience-detail/hooks/` exists with `useExperienceDetail.ts`, `useJoinExperience.ts`, `index.ts`.
3. `publicClient` is exported from `src/lib/contractUtils.ts`.
4. `ExperienceDetailPage`, `ExperienceManagePage`, `ExperienceConfirmationPage` have zero inline `interface ExperienceData` declarations.
5. `createPublicClient` appears in zero component files (only in `contractUtils.ts`).
6. Zero `#xxxxxx` hex colors and zero `style={{ color/background/backgroundColor }}` in all modified files.
7. `src/features/experience-detail/index.ts` re-exports from `./components`, `./hooks`, `./types`.
