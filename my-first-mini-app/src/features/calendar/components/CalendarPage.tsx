'use client';

import { Navigation } from '@/components/Navigation';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getExperienceDetails, getUserApprovedExperiences, getUserRequestedExperiences } from '@/lib/contractUtils';
import { formatUnits } from 'viem';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
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

const CATEGORY_BADGE: Record<string, { bg: string; text: string }> = {
  Wellness:   { bg: 'bg-tertiary-fixed-dim/15', text: 'text-tertiary-container' },
  Networking: { bg: 'bg-secondary/10', text: 'text-secondary' },
  Hiking:     { bg: 'bg-tertiary-fixed-dim/15', text: 'text-tertiary-container' },
  Surf:       { bg: 'bg-secondary/10', text: 'text-secondary' },
  Yoga:       { bg: 'bg-tertiary-fixed-dim/15', text: 'text-tertiary-container' },
  Social:     { bg: 'bg-surface-container/60', text: 'text-secondary' },
  default:    { bg: 'bg-surface-container-highest/50', text: 'text-on-surface-variant' },
};

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
      <div className="bg-surface min-h-screen">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-container-padding sticky top-0 z-40 bg-surface h-16">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-surface-container-highest">
          <User size={18} strokeWidth={2} className="text-primary" />
        </div>

        {/* NOMA wordmark */}
        <span className="font-h3 tracking-widest">NOMA</span>

        {/* Search icon */}
        <Button variant="ghost" size="icon-sm" aria-label="Search">
          <Search size={20} strokeWidth={2} className="text-primary" />
        </Button>
      </header>

      <main className="px-container-padding pt-6 pb-32">
        {/* Coming Up */}
        <section className="mb-8" aria-label="Upcoming">
          <h2 className="font-h2 text-on-surface mb-5">Coming Up</h2>

          {nextExperiences.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-surface-container-highest">
                📅
              </div>
              <p className="font-body-sm font-medium text-on-surface-variant">No upcoming experiences</p>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute top-4 bottom-4 left-[15px] w-0.5 bg-surface-container-highest z-0" />

              <div className="flex flex-col gap-5">
                {nextExperiences.map((exp, idx) => {
                  const { date, time } = formatStartTime(exp.startTime);
                  const isFirst = idx === 0;
                  const badge = exp.category
                    ? (CATEGORY_BADGE[exp.category] ?? CATEGORY_BADGE.default)
                    : null;

                  return (
                    <button
                      key={exp.id}
                      type="button"
                      className="flex gap-4 text-left w-full"
                      onClick={() => router.push(`/experience/${exp.id}`)}
                    >
                      {/* Timeline node */}
                      <div className="flex-shrink-0 z-10 mt-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center bg-surface border-2 ${
                            isFirst ? 'border-tertiary-fixed-dim' : 'border-surface-container-highest'
                          }`}
                        >
                          <div
                            className={`rounded-full ${
                              isFirst
                                ? 'w-3 h-3 bg-tertiary-fixed-dim'
                                : 'w-2 h-2 bg-secondary/40'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Card */}
                      <div
                        className={`flex-1 rounded-2xl p-4 active:scale-[0.99] transition-transform bg-surface-container-lowest shadow-sm border-l-4 ${
                          isFirst ? 'border-l-tertiary-fixed-dim' : 'border-l-secondary/40'
                        }`}
                      >
                        {/* Date + badge row */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                            {date}{time ? ` • ${time}` : ''}
                          </span>
                          {badge && exp.category ? (
                            <span
                              className={`text-xs font-semibold rounded-full flex-shrink-0 px-2.5 py-0.5 ${badge.bg} ${badge.text}`}
                            >
                              {exp.category}
                            </span>
                          ) : exp.status === 'pending' ? (
                            <span className="text-xs font-semibold rounded-full flex-shrink-0 px-2.5 py-0.5 bg-tertiary-fixed-dim/15 text-tertiary-container">
                              Pending
                            </span>
                          ) : null}
                        </div>

                        {/* Title */}
                        <h3 className="font-h3 text-on-surface mb-1.5">{exp.title}</h3>

                        {/* Location */}
                        {exp.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin size={13} strokeWidth={2} className="text-on-surface-variant" />
                            <span className="font-body-sm text-on-surface-variant">{exp.location}</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* History */}
        {historyExperiences.length > 0 && (
          <section aria-label="History">
            <h2 className="font-h2 text-on-surface-variant mb-4">History</h2>
            <div className="flex flex-col gap-3">
              {historyExperiences.map(exp => {
                const emoji = exp.category
                  ? (HISTORY_ICONS[exp.category] ?? HISTORY_ICONS.default)
                  : HISTORY_ICONS.default;
                const { date } = formatStartTime(exp.startTime);
                return (
                  <button
                    key={exp.id}
                    type="button"
                    className="flex items-center gap-4 p-4 rounded-2xl active:scale-[0.99] transition-transform bg-surface-container-low border border-outline-variant/30 opacity-85 text-left w-full"
                    onClick={() => router.push(`/experience/${exp.id}`)}
                  >
                    {/* Icon box */}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl bg-surface-container-highest">
                      {emoji}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-body-md font-semibold text-on-surface truncate">{exp.title}</h3>
                      {exp.location && (
                        <p className="mt-0.5 font-body-sm text-on-surface-variant truncate">{exp.location}</p>
                      )}
                      {date !== 'TBD' && (
                        <p className="mt-0.5 text-xs text-outline">{date}</p>
                      )}
                    </div>

                    {/* Checkmark */}
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-surface-container-highest">
                      <Check size={14} strokeWidth={2.5} className="text-primary" />
                    </div>
                  </button>
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
