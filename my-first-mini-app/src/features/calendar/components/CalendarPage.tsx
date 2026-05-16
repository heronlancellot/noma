'use client';

import { Navigation } from '@/components/Navigation';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getExperienceDetails, getUserApprovedExperiences, getUserRequestedExperiences } from '@/lib/contractUtils';
import { formatUnits } from 'viem';
import { useSession } from 'next-auth/react';
import { User, Search, MapPin, Check } from 'lucide-react';

interface ExperienceItem {
  id: number;
  title: string;
  location: string;
  price: string;
  image: string;
  status: 'pending' | 'approved';
  startTime?: bigint;
  endTime?: bigint;
  category?: string;
}

const CATEGORY_BADGE: Record<string, { bg: string; color: string }> = {
  Wellness:   { bg: 'rgba(244,191,0,0.15)',  color: '#d3a500' },
  Networking: { bg: 'rgba(212,227,255,0.50)', color: '#4f5f78' },
  Hiking:     { bg: 'rgba(244,191,0,0.15)',  color: '#d3a500' },
  Surf:       { bg: 'rgba(212,227,255,0.50)', color: '#4f5f78' },
  Yoga:       { bg: 'rgba(244,191,0,0.15)',  color: '#d3a500' },
  Social:     { bg: 'rgba(252,231,240,0.60)', color: '#9d174d' },
  default:    { bg: 'rgba(244,221,219,0.50)', color: '#58413f' },
};

const NODE_COLORS = [
  { border: '#f4bf00', dot: '#f4bf00', card: '#f4bf00' },  // first — gold
  { border: '#f4dddb', dot: '#b6c7e4', card: '#b6c7e4' },  // second — blue
];

const HISTORY_ICONS: Record<string, string> = {
  Yoga: '🧘', Hiking: '🥾', Surf: '🏄', Social: '🎉', Wellness: '🌿',
  Networking: '🤝', default: '✨',
};

function formatStartTime(ts?: bigint): { date: string; time: string } {
  if (!ts || ts === BigInt(0)) return { date: 'TBD', time: '' };
  const d = new Date(Number(ts) * 1000);
  const date = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return { date, time };
}

export function CalendarPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [nextExperiences, setNextExperiences] = useState<ExperienceItem[]>([]);
  const [historyExperiences, setHistoryExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserExperiences = async () => {
      if (!session?.user) { setLoading(false); return; }
      try {
        const userAddress = session.user.walletAddress || session.user.id;
        if (!userAddress) { setLoading(false); return; }

        const [approvedIds, requestedIds] = await Promise.all([
          getUserApprovedExperiences(userAddress),
          getUserRequestedExperiences(userAddress),
        ]);

        const allIds = [...new Set([...approvedIds, ...requestedIds])];
        const experiences: ExperienceItem[] = [];

        for (const id of allIds) {
          try {
            const data = await getExperienceDetails(id);
            experiences.push({
              id, title: data.title, location: data.location,
              price: `$${formatUnits(data.price, 18)}`,
              image: data.coverImage || '/image-default.png',
              status: approvedIds.includes(id) ? 'approved' : 'pending',
              startTime: data.startTime, endTime: data.endTime,
            });
          } catch { /* skip */ }
        }

        const now = BigInt(Math.floor(Date.now() / 1000));
        const zero = BigInt(0);
        setNextExperiences(experiences.filter(e => !e.endTime || e.endTime === zero || e.endTime > now));
        setHistoryExperiences(experiences.filter(e => e.endTime && e.endTime > zero && e.endTime <= now));
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    fetchUserExperiences();
  }, [session]);

  if (loading) {
    return (
      <div style={{ backgroundColor: '#fff8f7', minHeight: '100vh' }}>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#a7322f' }} />
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fff8f7', minHeight: '100vh' }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-5 sticky top-0 z-40"
        style={{ backgroundColor: '#fff8f7', height: 64 }}
      >
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#f4dddb' }}
        >
          <User size={18} strokeWidth={2} className="text-primary" />
        </div>

        {/* NOMA wordmark */}
        <h2
          className="font-bold tracking-wide"
          style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 20, color: '#251918', letterSpacing: '0.08em' }}
        >
          NOMA
        </h2>

        {/* Search icon */}
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'transparent' }}
          aria-label="Search"
        >
          <Search size={20} strokeWidth={2} className="text-primary" />
        </button>
      </header>

      <main className="px-5 pt-6 pb-32">
        {/* Coming Up */}
        <section className="mb-8">
          <h2
            className="font-bold mb-5"
            style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 22, color: '#251918' }}
          >
            Coming Up
          </h2>

          {nextExperiences.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: '#f4dddb' }}
              >
                📅
              </div>
              <p className="text-sm font-medium" style={{ color: '#58413f' }}>No upcoming experiences</p>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical timeline line */}
              <div
                className="absolute top-4 bottom-4"
                style={{ left: 15, width: 2, backgroundColor: '#f4dddb', zIndex: 0 }}
              />

              <div className="flex flex-col gap-5">
                {nextExperiences.map((exp, idx) => {
                  const { date, time } = formatStartTime(exp.startTime);
                  const nodeColor = NODE_COLORS[idx] ?? NODE_COLORS[1];
                  const badge = exp.category
                    ? (CATEGORY_BADGE[exp.category] ?? CATEGORY_BADGE.default)
                    : null;

                  return (
                    <div
                      key={exp.id}
                      className="flex gap-4 cursor-pointer"
                      onClick={() => router.push(`/experience/${exp.id}`)}
                    >
                      {/* Timeline node */}
                      <div className="flex-shrink-0 z-10 mt-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: '#fff8f7',
                            border: `2px solid ${nodeColor.border}`,
                          }}
                        >
                          <div
                            className="rounded-full"
                            style={{
                              width: idx === 0 ? 12 : 8,
                              height: idx === 0 ? 12 : 8,
                              backgroundColor: nodeColor.dot,
                            }}
                          />
                        </div>
                      </div>

                      {/* Card */}
                      <div
                        className="flex-1 rounded-2xl p-4 active:scale-[0.99] transition-transform"
                        style={{
                          backgroundColor: '#ffffff',
                          boxShadow: '0px 2px 8px rgba(13,31,53,0.06)',
                          borderLeft: `4px solid ${nodeColor.card}`,
                        }}
                      >
                        {/* Date + badge row */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className="font-semibold uppercase tracking-wide"
                            style={{ fontSize: 11, color: '#58413f' }}
                          >
                            {date}{time ? ` • ${time}` : ''}
                          </span>
                          {badge && exp.category ? (
                            <span
                              className="font-semibold rounded-full flex-shrink-0"
                              style={{
                                fontSize: 11,
                                padding: '3px 10px',
                                backgroundColor: badge.bg,
                                color: badge.color,
                              }}
                            >
                              {exp.category}
                            </span>
                          ) : exp.status === 'pending' ? (
                            <span
                              className="font-semibold rounded-full flex-shrink-0"
                              style={{
                                fontSize: 11,
                                padding: '3px 10px',
                                backgroundColor: 'rgba(244,191,0,0.15)',
                                color: '#d3a500',
                              }}
                            >
                              Pending
                            </span>
                          ) : null}
                        </div>

                        {/* Title */}
                        <h3
                          className="font-bold mb-1.5"
                          style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 17, color: '#251918' }}
                        >
                          {exp.title}
                        </h3>

                        {/* Location */}
                        {exp.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin size={13} strokeWidth={2} className="text-on-surface-variant" />
                            <span style={{ fontSize: 13, color: '#58413f' }}>{exp.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* History */}
        {historyExperiences.length > 0 && (
          <section>
            <h2
              className="font-bold mb-4"
              style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 22, color: '#58413f' }}
            >
              History
            </h2>
            <div className="flex flex-col gap-3">
              {historyExperiences.map(exp => {
                const emoji = exp.category
                  ? (HISTORY_ICONS[exp.category] ?? HISTORY_ICONS.default)
                  : HISTORY_ICONS.default;
                const { date } = formatStartTime(exp.startTime);
                return (
                  <div
                    key={exp.id}
                    className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer active:scale-[0.99] transition-transform"
                    style={{
                      backgroundColor: '#fff0ef',
                      border: '1px solid rgba(223,191,188,0.30)',
                      opacity: 0.85,
                    }}
                    onClick={() => router.push(`/experience/${exp.id}`)}
                  >
                    {/* Icon box */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                      style={{ backgroundColor: '#f4dddb' }}
                    >
                      {emoji}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-bold truncate"
                        style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 15, color: '#251918' }}
                      >
                        {exp.title}
                      </h3>
                      {exp.location && (
                        <p className="mt-0.5 truncate" style={{ fontSize: 13, color: '#58413f' }}>
                          {exp.location}
                        </p>
                      )}
                      {date !== 'TBD' && (
                        <p className="mt-0.5" style={{ fontSize: 11, color: '#8b716e' }}>
                          {date}
                        </p>
                      )}
                    </div>

                    {/* Checkmark */}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#f4dddb' }}
                    >
                      <Check size={14} strokeWidth={2.5} className="text-primary" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Navigation />
    </div>
  );
}
