'use client';

import { useRouter, useParams } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import Image from 'next/image';
import { useState } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';
import { ChevronLeft, MoreVertical, MapPin, Star, ImageIcon, Clock } from 'lucide-react';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_HOST = {
  name: 'Anna Mendez',
  location: 'Buenos Aires, Argentina',
  bio: "Hola! I'm Anna. I've lived in Buenos Aires my whole life and nothing brings me more joy than sharing my culture. My grandmother taught me her secret empanada recipes when I was a little girl, and now I love gathering people around my table to share them. Join me for good food, stories, and the warmth of Argentine hospitality!",
  stats: { experiences: 10, people: '30+', rating: 4.9 },
  experiences: [
    {
      id: '1',
      title: "Abuela's Secret Empanadas",
      price: '$25 / person',
      duration: '2 hours',
      category: 'Culinary',
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop',
      description: 'Learn the art of traditional Argentine empanadas from scratch, followed by a feast.',
    },
    {
      id: '2',
      title: 'Traditional Mate Circle',
      price: '$15 / person',
      duration: '1.5 hours',
      category: 'Culture',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=400&fit=crop',
      description: 'Discover the ritual and etiquette of sharing Mate, Argentina\'s favorite social drink, in a local park.',
    },
  ],
  reviews: [
    {
      id: '1',
      name: 'Sarah J.',
      date: 'October 2023',
      rating: 5,
      text: '"Anna is simply wonderful! Making empanadas with her felt like visiting family. The food was incredible."',
    },
    {
      id: '2',
      name: 'Mark T.',
      date: 'September 2023',
      rating: 4,
      text: '"The mate circle was so relaxing and informative. Anna answered all our questions about local life."',
    },
  ],
};

// ─── Design helpers ───────────────────────────────────────────────────────────

// Static Tailwind classes — must be full strings for the compiler to include them
const AVATAR_BG = [
  'bg-violet-700', 'bg-cyan-600', 'bg-amber-600',
  'bg-[#a7322f]', 'bg-emerald-600', 'bg-pink-600',
];
const avatarBgClass = (name: string) => AVATAR_BG[name.charCodeAt(0) % AVATAR_BG.length];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StarRow = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i}
        size={14}
        fill={i <= rating ? '#d3a500' : '#dfbfbc'}
        stroke={i <= rating ? '#d3a500' : '#dfbfbc'}
        strokeWidth={1}
      />
    ))}
  </div>
);

function ExpImagePlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#f4dddb]">
      <ImageIcon size={40} strokeWidth={1.5} className="text-outline" />
    </div>
  );
}

function ExperienceCard({ exp }: { exp: typeof MOCK_HOST.experiences[0] }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="bg-white rounded-2xl border border-[#dfbfbc]/20 overflow-hidden shadow-sm">
      {/* Image */}
      <div className="relative h-40 w-full">
        {imgError ? (
          <ExpImagePlaceholder />
        ) : (
          <Image
            src={exp.image}
            alt={exp.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
            onError={() => setImgError(true)}
          />
        )}
        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-[#fff8f7]/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
          <span className="text-[11px] font-semibold text-[#251918] tracking-[0.05em]">{exp.price}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Category + Duration */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-semibold tracking-[0.05em] px-2.5 py-1 rounded-full bg-[#f4bf00]/20 text-[#503d00]">
            {exp.category}
          </span>
          <div className="flex items-center gap-1 text-[#4f5f78]">
            {/* Clock icon */}
            <Clock size={13} strokeWidth={2} className="text-secondary" />
            <span className="text-[12px]">{exp.duration}</span>
          </div>
        </div>

        <h4 className="font-quicksand-bold text-[18px] text-[#251918] mb-1 leading-snug">
          {exp.title}
        </h4>
        <p className="text-[13px] text-[#58413f] leading-relaxed line-clamp-2">
          {exp.description}
        </p>
      </div>
    </article>
  );
}

function ReviewCard({ review }: { review: typeof MOCK_HOST.reviews[0] }) {
  const bg = avatarBgClass(review.name);

  return (
    <div className="bg-white rounded-2xl border border-[#dfbfbc]/20 shadow-sm p-4 min-w-[280px] w-[80%] snap-center shrink-0">
      {/* Reviewer row */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${bg}`}>
          <span className="text-[13px] font-bold text-white">{review.name.charAt(0)}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#251918]">{review.name}</p>
          <p className="text-xs text-[#4f5f78]">{review.date}</p>
        </div>
      </div>

      <StarRow rating={review.rating} />

      <p className="mt-2 text-[13px] text-[#58413f] leading-relaxed italic">{review.text}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function HostProfilePage() {
  const router = useRouter();
  const params = useParams();
  // params.id is the wallet address (e.g. 0xA762e2268308FFB52Da5D4A5a10188D8ebA96D07)
  const hostAddress = params.id as string;

  const host = MOCK_HOST;
  const initial = hostAddress
    ? hostAddress.slice(2, 4).toUpperCase()
    : host.name.charAt(0).toUpperCase();

  const handleMessageHost = () => {
    // World App deep link to open a conversation with a wallet address.
    // Inside the World App webview this opens the native chat with that user.
    const deepLink = `worldapp://chat?address=${hostAddress}`;

    if (MiniKit.isInstalled()) {
      // We're inside World App — trigger the deep link
      window.location.href = deepLink;
    } else {
      // Fallback for browser preview
      window.open(deepLink, '_blank');
    }
  };

  const stats = [
    { label: 'Experiences\nHosted', value: host.stats.experiences },
    { label: 'People\nMet',         value: host.stats.people      },
    { label: 'Average\nRating',     value: host.stats.rating, star: true },
  ];

  return (
    <div className="min-h-screen bg-[#fff8f7]">

      {/* ── TopAppBar ───────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex justify-between items-center w-full px-5 h-16 bg-[#fff8f7] shadow-sm">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#fff0ef] transition-colors active:scale-95"
          aria-label="Go back"
        >
          <ChevronLeft size={22} strokeWidth={2.5} className="text-primary" />
        </button>

        <h1 className="font-quicksand-bold text-xl text-[#251918]">Host Profile</h1>

        <button
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#fff0ef] transition-colors active:scale-95"
          aria-label="More options"
        >
          <MoreVertical size={20} className="text-on-surface" />
        </button>
      </header>

      <main className="pb-32">

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-[#0d1f35] to-[#f5c000] pt-8 pb-10 px-5 text-center rounded-b-3xl shadow-md mb-6">
          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div className="p-1 rounded-full bg-gradient-to-br from-[#f4bf00] to-[#ffdf92]">
              <div className={`w-28 h-28 rounded-full flex items-center justify-center border-4 border-[#fff8f7] bg-[#a7322f]`}>
                <span className="font-quicksand-bold text-[36px] text-white">{initial}</span>
              </div>
            </div>
            {/* Verified badge */}
            <div className="absolute bottom-0 right-1 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-md border-2 border-[#fff8f7]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#3b82f6" />
                <polyline points="8 12 11 15 16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Name / Address */}
          <h2 className="font-quicksand-bold text-[28px] tracking-[-0.02em] text-white mb-1 break-all px-2">
            {hostAddress
              ? hostAddress.slice(0, 6) + '...' + hostAddress.slice(-4)
              : host.name}
          </h2>

          {/* Location */}
          <p className="flex items-center justify-center gap-1 text-white/90 text-sm mb-6">
            <MapPin size={14} strokeWidth={2} className="text-white/90" />
            {host.location}
          </p>

          {/* Message button */}
          <button
            onClick={handleMessageHost}
            className="relative z-40 rounded-lg bg-primary !px-4 !py-2 text-sm font-semibold !text-white shadow-sm transition-opacity hover:opacity-90"
          >
            Message Hosts
          </button>
        </section>

        {/* ── Stats ───────────────────────────────────────────────────────── */}
        <section className="px-5 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-[#dfbfbc]/20 p-4 flex justify-around text-center divide-x divide-[#dfbfbc]/30">
            {stats.map((stat, i) => (
              <div key={i} className="flex-1 px-2">
                <div className="flex items-center justify-center gap-1 font-quicksand-bold text-2xl text-[#251918] mb-1">
                  {stat.value}
                  {stat.star && (
                    <Star size={18} fill="#d3a500" stroke="#d3a500" strokeWidth={1} />
                  )}
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#4f5f78] whitespace-pre-line leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── About ───────────────────────────────────────────────────────── */}
        <section className="px-5 mb-6">
          <h3 className="font-quicksand-bold text-xl text-[#251918] mb-3">
            About this host
          </h3>
          <div className="bg-white rounded-2xl shadow-sm border border-[#dfbfbc]/20 p-4">
            <p className="text-sm text-[#58413f] leading-relaxed">{host.bio}</p>
          </div>
        </section>

        {/* ── Experiences ─────────────────────────────────────────────────── */}
        <section className="px-5 mb-6">
          <h3 className="font-quicksand-bold text-xl text-[#251918] mb-4">
            Experiences by this host
          </h3>
          <div className="flex flex-col gap-4">
            {host.experiences.map(exp => (
              <ExperienceCard key={exp.id} exp={exp} />
            ))}
          </div>
        </section>

        {/* ── Reviews ─────────────────────────────────────────────────────── */}
        <section className="px-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-quicksand-bold text-xl text-[#251918]">What guests are saying</h3>
            <button className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#a7322f] hover:opacity-75 transition-opacity">
              See all 24
            </button>
          </div>

          {/* Horizontal scroll */}
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x -mx-5 px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {host.reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>

      </main>

      <Navigation />
    </div>
  );
}
